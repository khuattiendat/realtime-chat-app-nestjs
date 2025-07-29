import {Modal, Avatar, Input, Form, Button, message} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../apis/user.js";
import {setUser} from "../../redux/userSlice.js";

const ModalProfile = (props) => {
    // eslint-disable-next-line react/prop-types
    const {visible, onClose} = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const userLoginTed = useSelector(state => state.user.user);
    useEffect(() => {
        if (userLoginTed) {
            form.setFieldsValue({
                username: userLoginTed.username || '',
                email: userLoginTed.email || ''
            });
        }
    }, [userLoginTed])


    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                username: values.username,
                email: values.email
            }
            const dataUpdate = await updateUser(userLoginTed.id, payload);
            dispatch(setUser(dataUpdate.data));
            message.success('Cập nhật thông tin thành công');
            onClose();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error updating profile:', error);
            message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại');
        }
    };

    return (
        <Modal
            open={visible}
            footer={null}
            title="Thông tin tài khoản"
            centered
            width={400}
            onCancel={onClose}
        >
            <div className="d-flex flex-column align-items-center mb-3">
                <Avatar
                    size={64}
                    style={{backgroundColor: '#1677ff', marginBottom: '16px'}}
                    icon={<UserOutlined/>}
                />
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên người dùng"
                    name="username"
                    rules={[{required: true, message: 'Vui lòng nhập tên người dùng'}]}
                >
                    <Input placeholder="Nhập tên mới"/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {required: true, message: 'Vui lòng nhập email'},
                        {type: 'email', message: 'Email không hợp lệ'},
                    ]}
                >
                    <Input placeholder="example@gmail.com"/>
                </Form.Item>

                <Form.Item className="text-center">
                    <Button loading={loading} disabled={loading} type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalProfile;
