import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Button, Modal, Dropdown, Space, Avatar, message, Row, Col } from 'antd';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

import styles from './TopBar.module.scss';
import FormLogin from '~/components/FormLogin';
import FormRegister from '~/components/FormRegister';
import { createAxios } from '~/createInstance';
import { logOutSuccess } from '~/redux/authSlice';
import { logoutUser } from '~/redux/apiRequest';
import config from '~/config';

const cx = classNames.bind(styles);

function TopBar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transfer, setTransfer] = useState(false);

    const user = useSelector((state) => state.auth.login.currentUser);
    const accessToken = user?.accessToken;
    const id = user?._id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000 * 60 * 60 * 24);

        return () => clearInterval(timer);
    }, []);

    const handleShowModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCancel = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleTransfer = () => {
        setTransfer(!transfer);
    };

    const handleLogout = () => {
        logoutUser(dispatch, id, navigate, accessToken, axiosJWT);
        setIsModalOpen(false);
        message.success('Đăng xuất thành công!');
    };

    const items = [
        {
            key: '1',
            label: 'Tài khoản của tôi',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: (
                <Link style={{ textDecoration: 'none' }} to={config.routes.profile}>
                    Thông tin cá nhân
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link style={{ textDecoration: 'none' }} to={config.routes.add_article}>
                    Thêm bài báo
                </Link>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '4',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <nav className={cx('w-100')} style={{ background: '#000' }}>
            <Flex
                justify="space-between"
                className={cx('container')}
                align="center"
                style={{ height: 50 }}
            >
                <p className={cx('text-white fw-semibold m-0')}>
                    {currentDate.toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </p>
                {!user ? (
                    <>
                        <Button
                            onClick={handleShowModal}
                            type="link"
                            className={cx('button-custom')}
                        >
                            Đăng ký/Đăng nhập
                        </Button>
                        <Modal
                            title="VietNews"
                            open={isModalOpen}
                            onCancel={handleCancel}
                            footer={null}
                        >
                            {transfer ? (
                                <FormRegister handleTransfer={handleTransfer} />
                            ) : (
                                <FormLogin handleTransfer={handleTransfer} />
                            )}
                        </Modal>
                    </>
                ) : (
                    <Dropdown menu={{ items }}>
                        <Link className={cx('custom')}>
                            <Space>
                                {user.avatar ? (
                                    <Avatar src={user.avatar} />
                                ) : (
                                    <Avatar icon={<UserOutlined />} />
                                )}
                                {user.username}
                                <DownOutlined />
                            </Space>
                        </Link>
                    </Dropdown>
                )}
            </Flex>
        </nav>
    );
}

export default TopBar;
