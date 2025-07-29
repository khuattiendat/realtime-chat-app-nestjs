import {Link, Outlet, useNavigate, useParams} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined, PlusOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Avatar, Badge, Button, Divider, Dropdown, Layout, Menu, message, Spin, theme, Typography} from 'antd';
import {getProfileUser} from "../apis/auth.js";
import {useDispatch, useSelector} from "react-redux";
import {setSocketConnection, setUser} from "../redux/userSlice.js";
import ModalProfile from "../components/modal/ModalProfile.jsx";
import ModalChangePassword from "../components/modal/ModalChangePassword.jsx";
import {getAllUsers} from "../apis/user.js";
import {io} from "socket.io-client";
import {VITE_BASE_SERVER_URL} from "../utils/const.js";
import ModalCreateGroup from "../components/modal/ModalCreateGroup.jsx";
import {getAllRooms} from "../apis/room.js";

const {Title} = Typography;

const {Header, Sider, Content} = Layout;

const UserLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showModalProfile, setShowModalProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsRooms, setItemsRooms] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [onlineUserIds, setOnlineUserIds] = useState([]);

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {msgId} = params;
    const userLoginTed = useSelector(state => state.user.user);
    const socketConnection = useSelector(state => state.user.socketConnection);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(setUser({}));
        dispatch(setSocketConnection(null));
        if (socketConnection) {
            socketConnection.disconnect();
            socketConnection.close();
        }
        navigate('/login');
    };

    const buildItems = (users = [], onlineUsers = onlineUserIds) => {
        return users.map(user => {
            const isOnline = onlineUsers.includes(user.id);
            return {
                key: user.id,
                isOnline,
                label: (
                    <Link to={`/message/user/${user.id}`}>
                        <div className="d-flex align-items-center gap-2">
                            <Badge status={isOnline ? 'success' : 'default'} dot offset={[0, 10]}>
                                <Avatar style={{backgroundColor: '#1677ff'}} icon={<UserOutlined/>}/>
                            </Badge>
                            <span>{user.email}</span>
                        </div>
                    </Link>
                )
            };
        });
    };
    const buildRoomItems = (rooms = []) => {
        return rooms.map(room => {
            return {
                key: room.id,
                label: (
                    <Link to={`/message/group/${room.id}`}>
                        <div className="d-flex align-items-center gap-2">
                            <Avatar style={{backgroundColor: '#1677ff'}} icon={<UserOutlined/>}/>
                            <span>{room.name}</span>
                        </div>
                    </Link>
                )
            };
        });
    }

    const getProfile = async () => {
        try {
            setLoading(true);
            const [user, allUserRes, allRooms] = await Promise.all([getProfileUser(), getAllUsers(), getAllRooms()]);
            dispatch(setUser(user.data));
            localStorage.setItem('userId', user.data.id);
            setAllUsers(allUserRes.data);
            setAllRooms(allRooms.data);
            setItems(buildItems(allUserRes.data));
            setItemsRooms(buildRoomItems(allRooms.data));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching profile:', error);
            message.error(error.response?.data?.message || 'Lỗi không xác định');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
        }
        getProfile();
    }, []);

    useEffect(() => {
        if (userLoginTed?.id) {
            const socket = io(VITE_BASE_SERVER_URL, {
                transports: ['websocket'],
                query: {
                    userId: userLoginTed.id,
                },
            });

            dispatch(setSocketConnection(socket));
        }
    }, [userLoginTed]);

    useEffect(() => {
        if (!socketConnection) return;

        socketConnection.on('userOnline', ({onlineUserIds}) => {
            console.log('Online users:', onlineUserIds);
            setOnlineUserIds(onlineUserIds);
            setItems(buildItems(allUsers, onlineUserIds));
        });

        socketConnection.on('userOffline', ({userId}) => {
            setOnlineUserIds(prev => {
                const updated = prev.filter(id => id !== userId);
                setItems(buildItems(allUsers));
                return updated;
            });
        });

        return () => {
            socketConnection.off('userOnline');
            socketConnection.off('userOffline');
        };
    }, [socketConnection, allUsers]);

    const onCloseModalProfile = () => setShowModalProfile(false);
    const onCloseModalChangePassword = () => setShowChangePassword(false);
    const onCloseModalCreateRoom = () => setShowModalCreateRoom(false);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider style={{minWidth: '300px', width: '300px'}} trigger={null} collapsible collapsed={collapsed}
                   theme="light">
                <div className="demo-logo-vertical"
                     style={{
                         fontSize: '24px',
                         color: '#000',
                         textAlign: 'center',
                         padding: '16px',
                         fontWeight: 'bold'
                     }}>
                    <Link to="/">LOGO</Link>
                </div>
                <div className='flex-grow-1 overflow-auto'>
                    <Spin spinning={loading}>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={[msgId]}
                            items={items}
                        />
                        <Divider/>
                        <Title level={3} className='text-center'>
                            Nhóm
                        </Title>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={[msgId]}
                            items={itemsRooms}
                        />
                    </Spin>
                </div>

                <div className='m-3'>
                    <Button type="primary" block onClick={() => setShowModalCreateRoom(true)}>
                        <PlusOutlined/>
                        Tạo nhóm chat
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <div className="w-100 d-flex justify-content-between px-3 align-items-center">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{fontSize: '16px', width: 64, height: 64}}
                        />

                        <div className="d-flex align-items-center gap-3">
                            <Dropdown
                                trigger={['click']}
                                placement="bottomRight"
                                overlay={
                                    <Menu>
                                        <Menu.Item key="name" disabled style={{fontWeight: 'bold'}}>
                                            <span>{userLoginTed.username}</span>
                                        </Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="profile">
                                            <div onClick={() => setShowModalProfile(true)}>Trang cá nhân</div>
                                        </Menu.Item>
                                        <Menu.Item key="password">
                                            <div onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</div>
                                        </Menu.Item>
                                        <Menu.Item key="logout">
                                            <div onClick={handleLogout}>Đăng xuất</div>
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <Avatar style={{backgroundColor: '#1677ff', cursor: 'pointer'}} icon={<UserOutlined/>}/>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Content
                    style={{
                        padding: 24,
                        backgroundImage: "url('/images/background.png')",
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet/>
                </Content>
                <ModalProfile visible={showModalProfile} onClose={onCloseModalProfile}/>
                <ModalChangePassword visible={showChangePassword} onCancel={onCloseModalChangePassword}/>
                <ModalCreateGroup visible={showModalCreateRoom} onClose={onCloseModalCreateRoom} allUsers={allUsers}/>
            </Layout>
        </Layout>
    );
};

export default UserLayout;
