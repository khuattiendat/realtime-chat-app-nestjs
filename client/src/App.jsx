// App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import './App.css'
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/customs.scss'
import Home from './page/Home/Home.jsx';
import NotFound from './page/NotFound/NotFound.jsx';
import Login from './page/Login/Login.jsx';
import UserLayout from './layout/UserLayout.jsx';
import Message from "./page/Message/Message.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/message/user/:userId" element={<Message/>}/>
                    <Route path="/message/group/:groupId" element={<Message/>}/>
                </Route>
                <Route path="login" element={<Login/>}/>

                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    );
}

export default App;
