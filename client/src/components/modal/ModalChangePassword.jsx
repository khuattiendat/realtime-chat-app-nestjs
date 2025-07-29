import {Modal, Form, Input, Button, message} from 'antd';
import {changePassword} from "../../apis/auth.js";
import {useSelector} from "react-redux";

// eslint-disable-next-line react/prop-types
const ModalChangePassword = ({visible, onCancel}) => {
    const [form] = Form.useForm();
    const userLoginTed = useSelector(state => state.user.user);

    const handleFinish = async (values) => {
        try {
            const {oldPassword, newPassword, confirmPassword} = values;
            console.log('handleFinish', values);

            if (newPassword !== confirmPassword) {
                return message.error('Mật khẩu xác nhận không khớp');
            }
            const payload = {
                oldPassword,
                newPassword
            }
            await changePassword(userLoginTed.id, payload)
            message.success('Đổi mật khẩu thành công');
            form.resetFields();
            onCancel();
        } catch (error) {
            console.error('Error changing password:', error);
            message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        }

    };

    return (
        <Modal
            open={visible}
            title="Đổi mật khẩu"
            onCancel={onCancel}
            footer={null}
            centered
            width={400}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="oldPassword"
                    rules={[{required: true, message: 'Vui lòng nhập mật khẩu hiện tại'}]}
                >
                    <Input.Password placeholder="Nhập mật khẩu hiện tại"/>
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        {required: true, message: 'Vui lòng nhập mật khẩu mới'},
                        {min: 6, message: 'Mật khẩu ít nhất 6 ký tự'}
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới"/>
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        {required: true, message: 'Vui lòng xác nhận mật khẩu mới'},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Xác nhận mật khẩu mới"/>
                </Form.Item>

                <Form.Item className="text-center">
                    <Button type="primary" htmlType="submit" block>
                        Xác nhận
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalChangePassword;
