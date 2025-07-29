import {Modal, Input, Select, Button, Form, message} from "antd";
import {createRoom} from "../../apis/room.js";
import {toast} from "react-toastify";

const {Option} = Select;

// eslint-disable-next-line react/prop-types
const ModalCreateGroup = ({visible, onClose, allUsers = []}) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();
            if (!values.name) {
                form.setFields([
                    {
                        name: 'name',
                        errors: ['Vui lòng nhập tên nhóm'],
                    },
                ]);
                return;
            }
            if (!values.members || values.members.length === 0) {
                form.setFields([
                    {
                        name: 'members',
                        errors: ['Vui lòng chọn ít nhất 1 thành viên'],
                    },
                ]);
                return;
            }
            await createRoom(values);
            message.success('Tạo nhóm thành công');
            form.resetFields();
            onClose();

        } catch (error) {
            console.error('Error submitting form:', error);
        }

    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            title="Tạo nhóm mới"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên nhóm"
                    name="name"
                    rules={[{required: true, message: 'Vui lòng nhập tên nhóm'}]}
                >
                    <Input placeholder="Nhập tên nhóm"/>
                </Form.Item>

                <Form.Item
                    label="Chọn thành viên"
                    name="members"
                    rules={[{required: true, message: 'Vui lòng chọn ít nhất 1 thành viên'}]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn thành viên"
                        optionFilterProp="children"
                        showSearch
                    >
                        {allUsers.map(user => (
                            <Option key={user.id} value={user.id}>
                                {user.username}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <div className="d-flex justify-content-end">
                    <Button onClick={onClose} style={{marginRight: 8}}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Tạo nhóm
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalCreateGroup;
