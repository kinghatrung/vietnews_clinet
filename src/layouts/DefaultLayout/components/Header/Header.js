import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Flex, Row, Col } from 'antd';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import styles from './Header.module.scss';
import config from '~/config';

const { Search } = Input;
const cx = classNames.bind(styles);

function Header() {
    const [searchResult, setSearchResult] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setSearchResult([1, 2, 3, 4, 5]);
        }, 0);
    });

    const headleSearch = (value, _e, info) => console.log(info?.source, value);

    return (
        <Row className={cx('container', 'header')}>
            <Col lg={12} md={12}>
                <NavLink
                    to={config.routes.home}
                    className={cx('fs-2 fw-bold text-dark text-decoration-none')}
                >
                    <span className={cx('logo')}>VIET</span>NEWS
                </NavLink>
            </Col>

            {/* <HeadlessTippy
                interactive
                placement="bottom"
                visible={searchResult.length > 0}
                render={(attrs) => (
                    <div tabIndex="-1" {...attrs}>
                        Kết quả
                    </div>
                )}
            > */}
            <Col lg={12} md={12} className={cx('search')}>
                <Search
                    ref={searchRef}
                    placeholder="Tìm kiếm"
                    size="large"
                    onSearch={headleSearch}
                    enterButton={
                        <Button type="primary" danger>
                            <SearchOutlined />
                        </Button>
                    }
                    allowClear
                />
            </Col>
            {/* </HeadlessTippy> */}
        </Row>
    );
}

export default Header;
