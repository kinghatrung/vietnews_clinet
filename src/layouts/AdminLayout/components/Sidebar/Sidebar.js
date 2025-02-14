import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    CopyOutlined,
    UserOutlined,
    UnorderedListOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import styles from './Sidebar.module.scss';
import { logoutUser } from '~/redux/apiRequest';
import { logOutSuccess } from '~/redux/authSlice';
import { createAxios } from '~/createInstance';

const cx = classNames.bind(styles);
const { Sider } = Layout;

function Sidebar() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const id = user?._id;
    const dispatch = useDispatch();
    const accessToken = user?.accessToken;
    const navigate = useNavigate();
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);

    const handleMenuClick = (e) => {
        navigate(e.key);
    };

    const handleLogout = () => {
        logoutUser(dispatch, id, navigate, accessToken, axiosJWT);
    };

    return (
        <Sider className={cx('sidebar')}>
            <div className={cx('navbar-brand fs-3 fw-bold text-white text-center mt-2')}>
                VietNews
            </div>
            <Menu
                onClick={handleMenuClick}
                theme="dark"
                mode="inline"
                items={[
                    { label: 'Người dùng', key: '/', icon: <UserOutlined /> },
                    { label: 'Bài báo', key: '/articles', icon: <CopyOutlined /> },
                    { label: 'Thể loại', key: '/genres', icon: <UnorderedListOutlined /> },
                    {
                        label: 'Đăng xuất',
                        key: '/logout',
                        icon: <LogoutOutlined />,
                        onClick: handleLogout,
                    },
                ]}
            />
        </Sider>
    );
}

export default Sidebar;
