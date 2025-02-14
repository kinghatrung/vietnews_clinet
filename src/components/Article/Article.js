import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Image, Flex } from 'antd';

import styles from './Article.module.scss';

const cx = classNames.bind(styles);

function Article({ _id, image, name, createdAt, author }) {
    return (
        <div style={{ width: '19rem' }}>
            <Link to={`/article_detail/${_id}`}>
                <Image
                    preview={false}
                    src={image}
                    width={'100%'}
                    style={{ height: '182px', objectFit: 'cover' }}
                    className={cx('img')}
                />
            </Link>
            <Flex className={cx('mt-2')} gap={'10px'} justify="flex-start">
                <p className={cx('writer', 'm-0')}>Bởi {author.name}</p>
                <p className={cx('fw-semibold m-0', 'date')}>
                    {new Date(createdAt).toLocaleDateString('en-GB')}
                </p>
            </Flex>
            <Link style={{ textDecoration: 'none' }} to={`/article_detail/${_id}`}>
                <h2 className={cx('name')}>{name}</h2>
            </Link>
        </div>
    );
}

export default Article;
