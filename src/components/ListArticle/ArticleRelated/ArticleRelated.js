import classNames from 'classnames/bind';
import { Flex, Image, Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './ArticleRelated.module.scss';

const cx = classNames.bind(styles);

function ArticleRelated({ _id, id }) {
    const [genre, setGenre] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/genre/${_id}`);
                setGenre(res.data);
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Flex vertical>
            {genre.articles
                ?.filter((article) => article._id !== id)
                .slice(0, 5)
                .map((article) => (
                    <Flex gap={12} className={cx('mb-3')} key={article._id}>
                        <Link to={`/article_detail/${article._id}`}>
                            <Image
                                preview={false}
                                style={{ width: '160px', height: '86px', objectFit: 'cover' }}
                                src={article.image}
                                className={cx('img')}
                            />
                        </Link>
                        <Link to={`/article_detail/${article._id}`} className={cx('title')}>
                            {article.name}
                        </Link>
                    </Flex>
                ))}
            {genre.articles?.filter((article) => article._id !== id).length > 0 && (
                <Link to={`/genre/${_id}`}>
                    <Button className={cx('btn-more')}>Xem thêm</Button>
                </Link>
            )}
            {genre.articles?.filter((article) => article._id !== id).length === 0 && (
                <Empty description="Không có bài viết liên quan" />
            )}
        </Flex>
    );
}

export default ArticleRelated;
