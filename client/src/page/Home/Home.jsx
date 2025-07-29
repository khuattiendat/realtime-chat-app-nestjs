import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const Home = () => {
    return (
        <div className="home-container d-flex justify-content-center align-items-center h-100 bg-light">
            <div className="text-center p-5 shadow-lg rounded bg-white">
                <h1 className="display-4 fw-bold mb-3 text-primary">
                    💬 ChatConnect
                </h1>
                <p className="lead text-muted mb-4">
                    Kết nối bạn bè, trò chuyện mọi lúc, mọi nơi.
                </p>
                <Button
                    type="primary"
                    size="large"
                    icon={<MessageOutlined />}
                >
                    Bắt đầu chat
                </Button>
            </div>
        </div>
    );
};

export default Home;
