import classNames from 'classnames/bind';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function Loading() {
    return (
        <Flex align="center" justify="center" style={{ height: '100vh', background: '#fff' }}>
            <Spin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 100,
                        }}
                        spin
                    />
                }
            />
        </Flex>
    );
}

export default Loading;
