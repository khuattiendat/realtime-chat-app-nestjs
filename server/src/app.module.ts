import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {EventsGateway} from './events/events.gateway';
import {DatabaseModule} from "./database/database.module";
import {UsersModule} from './users/users.module';
import {RoomsModule} from './rooms/rooms.module';
import {MessagesModule} from './messages/messages.module';
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [DatabaseModule, UsersModule, RoomsModule, MessagesModule, AuthModule],
    controllers: [AppController],
    providers: [EventsGateway],
})
export class AppModule {
}
