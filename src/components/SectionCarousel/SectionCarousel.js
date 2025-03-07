import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { Carousel, Flex, Image, Row, Col } from 'antd';

import styles from './SectionCarousel.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SectionCarousel({ articles }) {
    // Sử dụng useCallback để tránh việc re-ren useEffect không cần thiết
    const getArticlesToShow = useCallback(() => {
        if (window.innerWidth >= 1025) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }, []);

    const [articlesToShow, setArticlesToShow] = useState(getArticlesToShow());

    let isDragging = false;

    useEffect(() => {
        const handleResize = () => {
            const newArticlesToShow = getArticlesToShow();
            if (newArticlesToShow !== articlesToShow) {
                setArticlesToShow(newArticlesToShow);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [articlesToShow]);

    return (
        <div className={cx('carousel')}>
            <Carousel
                dots={false}
                autoplay
                autoplaySpeed={2800}
                pauseOnHover={true}
                draggable
                className={cx('container', '')}
                style={{ padding: '28px 0' }}
            >
                {Array.from({ length: Math.ceil(articles.length / articlesToShow) }).map(
                    (_, index) => (
                        <div key={index}>
                            <Row gap={'30px'} justify="space-between">
                                {articles
                                    .sort(() => 0.5 - Math.random())
                                    .slice(
                                        index * articlesToShow,
                                        index * articlesToShow + articlesToShow,
                                    )
                                    .map((article) => (
                                        <Col key={article._id} className={cx('box')}>
                                            <Flex gap={'10px'}>
                                                <Link
                                                    onClick={(e) => {
                                                        if (isDragging) {
                                                            e.preventDefault();
                                                            isDragging = false;
                                                        }
                                                    }}
                                                    onPointerDown={() => (isDragging = false)}
                                                    onPointerMove={() => (isDragging = true)}
                                                    to={`/article_detail/${article._id}`}
                                                >
                                                    <Image
                                                        preview={false}
                                                        style={{
                                                            width: '160px',
                                                            height: '96px',
                                                            objectFit: 'cover',
                                                        }}
                                                        className={cx('img')}
                                                        src={article.image}
                                                    />
                                                </Link>
                                                <div className={cx('w-100')}>
                                                    <Flex justify={'space-between'}>
                                                        <p className={cx('writer')}>
                                                            Bởi {article.author?.nickname}
                                                        </p>
                                                        <p
                                                            className={cx(
                                                                'd-none d-lg-block',
                                                                'date',
                                                            )}
                                                        >
                                                            {new Date(
                                                                article.createdAt,
                                                            ).toLocaleDateString('en-GB')}
                                                        </p>
                                                    </Flex>
                                                    <Link
                                                        onClick={(e) => {
                                                            if (isDragging) {
                                                                e.preventDefault();
                                                                isDragging = false;
                                                            }
                                                        }}
                                                        onPointerDown={() => (isDragging = false)}
                                                        onPointerMove={() => (isDragging = true)}
                                                        to={`/article_detail/${article._id}`}
                                                        style={{ textDecoration: 'none' }}
                                                        className={cx('text-header')}
                                                    >
                                                        {article.name}
                                                    </Link>
                                                </div>
                                            </Flex>
                                        </Col>
                                    ))}
                            </Row>
                        </div>
                    ),
                )}
            </Carousel>
        </div>
    );
}

export default SectionCarousel;
