import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { Button, Form, Input, Typography, Divider, Flex, message } from 'antd';

import styles from './FormRegister.module.scss';
import { registerUser } from '~/redux/apiRequest';

const { Title } = Typography;
const cx = classNames.bind(styles);

function FormRegister({ handleTransfer }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async () => {
        const newUser = {
            email: email,
            username: username,
            password: password,
            name: name,
        };
        try {
            await registerUser(newUser, dispatch, navigate);
            message.success('Đăng kí thành công');
            setEmail('');
            setUsername('');
            setPassword('');
            setName('');
            handleTransfer();
        } catch (error) {
            const status = error.response?.status;
            if (status === 400) {
                message.error(error.response.data);
            } else if (status === 500) {
                message.error(error.response.data);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Title className={cx('text-center mb-3')} level={3}>
                Đăng ký
            </Title>
            <Form
                name="basic"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={handleRegister}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'E-mail không hợp lệ, vui lòng nhập lại!',
                        },
                        {
                            required: true,
                            message: 'Hãy nhập E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="Điền email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập tên tài khoản!',
                        },
                    ]}
                >
                    <Input
                        placeholder="Điền tên tài khoản"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập họ tên của bạn!',
                        },
                    ]}
                >
                    <Input
                        placeholder="Điền họ tên của bạn"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập mật khẩu!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Điền mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label={null}>
                    <Button className={cx('w-100')} type="primary" danger htmlType="submit">
                        Đăng ký
                    </Button>
                </Form.Item>
                <Divider>Hoặc</Divider>
                <Flex className={cx('mb-4')} justify="center" gap="small" align="center">
                    Nếu đã có tài khoản thì
                    <Button
                        onClick={handleTransfer}
                        type="primary"
                        color="danger"
                        variant="outlined"
                    >
                        Đăng nhập
                    </Button>
                    tại đây
                </Flex>
            </Form>
        </div>
    );
}

export default FormRegister;
