import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Flex } from 'antd';
import React from 'react';

import styles from './Header.module.scss';
import config from '~/config';

const { Search } = Input;
const cx = classNames.bind(styles);

function Header() {
    const onSearch = (value, _e, info) => console.log(info?.source, value);

    return (
        <header className={cx('header')}>
            <div className={cx('container')}>
                <Flex align="center" justify="space-between">
                    <NavLink
                        to={config.routes.home}
                        className={cx('fs-2 fw-bold text-dark text-decoration-none')}
                    >
                        <span className={cx('logo')}>VIET</span>NEWS
                    </NavLink>
                    <Search
                        className={cx('w-50')}
                        placeholder="Tìm kiếm"
                        size="large"
                        onSearch={onSearch}
                        enterButton={
                            <Button type="primary" danger>
                                <SearchOutlined />
                            </Button>
                        }
                        allowClear
                    />
                </Flex>
            </div>
        </header>
    );
}

export default Header;
