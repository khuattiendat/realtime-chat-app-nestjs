import {Button, Form, Input, Tabs, Typography, message} from 'antd';
import {LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';
import {useState} from 'react';
import {login, register} from "../../apis/auth.js";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState({
        login: false,
        register: false,
    });
    const navigate = useNavigate();

    const onLoginFinish = async (values) => {
        try {
            setLoading({
                ...loading,
                login: true,
            });
            const loginData = await login(values);
            localStorage.setItem('accessToken', loginData.data.accessToken);
            localStorage.setItem('refreshToken', loginData.data.refreshToken);
            message.success('Đăng nhập thành công!');
            navigate('/');
            setLoading({
                ...loading,
                login: false,
            });
        } catch (error) {
            setLoading({
                ...loading,
                login: false,
            });
            message.error(error.response.data.message);
        }
    };

    const onRegisterFinish = async (values) => {
        try {
            setLoading({
                ...loading,
                register: true,
            });
            await register(values);
            message.success('Đăng ký thành công!');
            setActiveTab('login');
            setLoading({
                ...loading,
                register: false,
            });
        } catch (error) {
            setLoading({
                ...loading,
                register: false,
            });
            message.error(error.response.data.message);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f0f2f5',
            }}
        >
            <div
                style={{
                    width: 400,
                    padding: 24,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 8,
                }}
            >
                <Title level={3} style={{textAlign: 'center'}}>
                    {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </Title>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    centered
                    items={[
                        {
                            key: 'login',
                            label: 'Đăng nhập',
                            children: (
                                <Form layout="vertical" onFinish={onLoginFinish}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {required: true, message: 'Vui lòng nhập email!'},
                                            {type: 'email', message: 'Email không hợp lệ!'},
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined/>} placeholder="Email"/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{required: true, message: 'Vui lòng nhập mật khẩu!'}]}
                                    >
                                        <Input.Password prefix={<LockOutlined/>} placeholder="Mật khẩu"/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button loading={loading.login} disabled={loading.login} type="primary"
                                                htmlType="submit" block>
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'register',
                            label: 'Đăng ký',
                            children: (
                                <Form layout="vertical" onFinish={onRegisterFinish}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="username"
                                        rules={[{required: true, message: 'Vui lòng nhập email!'}]}
                                    >
                                        <Input prefix={<UserOutlined/>} placeholder="email"/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {required: true, message: 'Vui lòng nhập email!'},
                                            {type: 'email', message: 'Email không hợp lệ!'},
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined/>} placeholder="Email"/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{required: true, message: 'Vui lòng nhập mật khẩu!'}]}
                                    >
                                        <Input.Password prefix={<LockOutlined/>} placeholder="Mật khẩu"/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button loading={loading.register} disabled={loading.register} type="primary" htmlType="submit" block>
                                            Đăng ký
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}
