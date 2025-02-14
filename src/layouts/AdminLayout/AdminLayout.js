import React from 'react';
import classNames from 'classnames/bind';
import { Layout } from 'antd';

import styles from './AdminLayout.module.scss';
import Sidebar from '~/layouts/AdminLayout/components/Sidebar';

const { Content } = Layout;

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Layout hasSider>
                <Sidebar />
                <Layout>
                    <Content className={cx('content')}>
                        <div
                            className={cx(
                                'my-3 mx-2 overflow-visible p-3 text-center bg-light rounded',
                            )}
                        >
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default AdminLayout;
