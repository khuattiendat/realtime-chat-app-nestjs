import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Card, Input, Button, Typography, Avatar, message, Spin, Skeleton} from "antd";
import {UserOutlined, SendOutlined} from "@ant-design/icons";
import "./messge.scss";
import {createOrGetPrivateRoom, getMessagesByRoomId} from "../../apis/room.js";
import moment from "moment";

const {Title} = Typography;

const Message = () => {
    const params = useParams();
    const {userId, groupId,} = params;

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const userLoginTed = useSelector((state) => state.user.user);
    const sender = userLoginTed?.id;
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [userReceiver, setUserReceiver] = useState({});
    const [room, setRoom] = useState({});
    const [loading, setLoading] = useState({
        getMessages: false,
        sendMessage: false,
    });
    const socket = useSelector((state) => state.user.socketConnection);


    useEffect(() => {
        if (socket && room) {
            socket.on('receiveMessage', (newMessage) => {
                if (newMessage.room.id?.toString() === room.id?.toString()) {
                    setMessages((prev) => [...prev, newMessage]);
                }
                setLoading((prev) => ({
                    ...prev,
                    sendMessage: false,
                }));
            });
            return () => {
                socket.off('receiveMessage');
            };
        }

    }, [socket, room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        if (socket) {
            setLoading((prev) => ({
                ...prev,
                sendMessage: true,
            }));
            socket.emit('sendMessage', {
                sender: userLoginTed.id,
                content,
                roomId: room.id,
            });
        }


        setContent('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };
    const getMessageByRoom = async () => {
        try {
            let roomId = null;
            let roomInfo = null;
            setLoading(prev => ({
                ...prev,
                getMessages: true,
            }));

            if (userId) {
                const payload = {
                    sender: userLoginTed?.id || localStorage.getItem("userId"),
                    receiver: userId,
                };

                const res = await createOrGetPrivateRoom(payload);
                roomInfo = res.data;
                setUserReceiver(roomInfo.userReceiver);
                setRoom(roomInfo.room);
                roomId = roomInfo.room.id;
            }

            if (groupId) {
                roomId = groupId;
            }

            if (roomId) {
                const messagesRes = await getMessagesByRoomId(roomId);
                setRoom({
                    id: messagesRes.data.id,
                    name: messagesRes.data.name,
                    isGroup: messagesRes.data.isGroup,
                });
                setMessages(messagesRes.data.messages);
            }
            setLoading(prev => ({
                ...prev,
                getMessages: false,
            }));
        } catch (error) {
            setLoading(prev => ({
                ...prev,
                getMessages: false,
            }));
            const errMsg = error?.response?.data?.message || "Lỗi khi lấy tin nhắn";
            message.error(errMsg);
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        getMessageByRoom()
    }, [userId, groupId])

    return (
        <div className="chat-container">
            <Card className="chat-card">
                <div className="chat-header">
                    <Title level={4} className="chat-header__title">
                        <Skeleton loading={loading.getMessages} active paragraph={false} style={{width: 200}}>
                            {room.isGroup ? room.name : userReceiver.username || 'Chat Room'}
                        </Skeleton>

                    </Title>
                    <div className="chat-header__info">
                        <Skeleton loading={loading.getMessages} active paragraph={false} style={{width: 160}}>
                            {messages.length} tin nhắn
                        </Skeleton>

                    </div>
                </div>

                <div
                    ref={chatContainerRef}
                    className="messages-container"
                >
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state__emoji">🎉</div>
                            <div className="empty-state__title">Chào mừng đến với chat room!</div>
                            <div className="empty-state__subtitle">Hãy bắt đầu cuộc trò chuyện...</div>
                        </div>
                    ) : (
                        <>
                            <Spin spinning={loading.getMessages} tip="Đang tải tin nhắn...">
                                {messages.map((msg, index) => {
                                    const isOwnMessage = msg.sender.id === sender;
                                    return (
                                        <div
                                            key={index}
                                            className={`message-item ${isOwnMessage ? 'message-item--own' : 'message-item--other'}`}
                                        >
                                            {!isOwnMessage && (
                                                <Avatar
                                                    icon={<UserOutlined/>}
                                                    className="message-avatar message-avatar--other"
                                                    size="small"
                                                />
                                            )}

                                            <div className="message-content">
                                                {!isOwnMessage && (
                                                    <div className="message-content__sender">
                                                        {msg.sender.username}
                                                    </div>
                                                )}

                                                <div
                                                    className={`message-content__bubble ${isOwnMessage ? 'message-content__bubble--own' : 'message-content__bubble--other'}`}>
                                                    <div className="message-content__text">
                                                        {msg.content}
                                                    </div>
                                                    <div
                                                        className={`message-content__time ${isOwnMessage ? 'message-content__time--own' : 'message-content__time--other'}`}>
                                                        {moment(msg.createdAt).format('HH:mm - DD/MM/YYYY')}
                                                    </div>
                                                </div>
                                            </div>

                                            {isOwnMessage && (
                                                <Avatar
                                                    icon={<UserOutlined/>}
                                                    className="message-avatar message-avatar--own"
                                                    size="small"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </Spin>

                        </>
                    )}
                    <div ref={messagesEndRef}/>
                </div>

                <div className="input-area">
                    <form onSubmit={sendMessage}>
                        <div className="input-area__container">
                            <Input.TextArea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn của bạn..."
                                autoSize={{minRows: 1, maxRows: 4}}
                                className="input-area__textarea"
                            />
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined/>}
                                disabled={!content.trim() || loading.getMessages || loading.sendMessage}
                                className={`input-area__send-btn ${
                                    content.trim() || loading.getMessages || loading.sendMessage
                                        ? 'input-area__send-btn--active'
                                        : 'input-area__send-btn--disabled'
                                }`}
                            />
                        </div>
                    </form>

                    <div className="input-area__hint">
                        Nhấn Enter để gửi, Shift + Enter để xuống dòng
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Message;