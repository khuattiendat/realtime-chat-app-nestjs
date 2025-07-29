import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {redis} from "../utils/redis.provider";
import {RoomsService} from "../rooms/rooms.service";
import {payloadSendMessage} from "../utils/type";
import {MessagesService} from "../messages/messages.service";

@WebSocketGateway({cors: true})
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    constructor(private roomService: RoomsService, private messageService: MessagesService) {
    }

    private logger: Logger = new Logger('EventsGateway');

    afterInit(_server: Server) {
        this.logger.log('WebSocket Initialized');
    }

    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);

        const userId = client.handshake.query.userId as string;
        const socketId = client.id;

        await redis.sadd(`user:${userId}:sockets`, socketId);
        await redis.set(`socket:${socketId}`, userId);

        const keys = await redis.keys('user:*:sockets'); // tất cả users đang online

        const onlineUserIds = keys.map((key) => {
            const match = key.match(/^user:(\d+):sockets$/);
            return match ? Number(match[1]) : null;
        }).filter(Boolean);

        this.server.emit('userOnline', {
            onlineUserIds,
        });
    }


    async handleDisconnect(client: Socket) {
        const socketId = client.id;
        this.logger.log(`Client disconnected: ${socketId}`);

        const userId = await redis.get(`socket:${socketId}`);
        if (!userId) return;

        await redis.srem(`user:${userId}:sockets`, socketId);
        await redis.del(`socket:${socketId}`);

        const remaining = await redis.scard(`user:${userId}:sockets`);
        if (remaining === 0) {
            this.logger.log(`User ${userId} is now offline`);
            this.server.emit('userOffline', {userId});
        }
    }


    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() data: payloadSendMessage,
        @ConnectedSocket() client: Socket,
    ) {

        const newMessage = await this.messageService.create({
            content: data.content,
            senderId: data.sender,
            roomId: data.roomId
        })

        const members = await this.roomService.getMembersInRoom(data.roomId);

        const onlineMembers = await this.roomService.getOnlineUsersInRoom(members);

        for (const userId of onlineMembers) {
            const sockets = await redis.smembers(`user:${userId}:sockets`);
            for (const socketId of sockets) {
                this.server.to(socketId).emit('receiveMessage', newMessage);
            }
        }

    }
}
