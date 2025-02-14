import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Divider, message } from 'antd';

import styles from './FormLogin.module.scss';
import { loginUser } from '~/redux/apiRequest';
import { loginFailed } from '~/redux/authSlice';

const { Title } = Typography;
const cx = classNames.bind(styles);

function FormLogin({ handleTransfer }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const newUser = {
            username: username,
            password: password,
        };
        try {
            await loginUser(newUser, dispatch, navigate);
            message.success('Đăng nhập thành công!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!';
            message.error(errorMessage);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Title className={cx('text-center mb-3')} level={3}>
                Đăng nhập
            </Title>
            <Form
                name="login"
                initialValues={{
                    remember: true,
                }}
                style={{
                    maxWidth: 800,
                }}
                className={cx('w-100 px-5')}
                onFinish={handleLogin}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy điền tên tài khoản!',
                        },
                    ]}
                >
                    <Input
                        onChange={(e) => setUsername(e.target.value)}
                        prefix={<UserOutlined />}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy điền mật khẩu!',
                        },
                    ]}
                >
                    <Input
                        onChange={(e) => setPassword(e.target.value)}
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button block danger type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                    <Divider>Hoặc</Divider>
                    <Button onClick={handleTransfer} color="danger" variant="outlined">
                        Đăng ký tại đây
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default FormLogin;
