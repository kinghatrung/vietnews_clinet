import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Carousel, Flex, Image } from 'antd';

import styles from './SectionCarousel.module.scss';
import { Link, NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function SectionCarousel({ articles }) {
    let isDragging = false;
    return (
        <div className={cx('carousel')}>
            <Carousel
                dots={false}
                autoplay
                autoplaySpeed={2800}
                draggable
                className={cx('container')}
                style={{ padding: '28px 0' }}
            >
                {[0, 1].map((_, index) => (
                    <div key={index}>
                        <Flex gap={'30px'} justify="space-between">
                            {articles
                                .sort(() => 0.5 - Math.random())
                                .slice(index * 3, index * 3 + 3)
                                .map((article) => (
                                    <Flex className={cx('box')} gap={'10px'} key={article._id}>
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
                                        <div className={cx('d-none d-lg-block')}>
                                            <Flex justify={'space-between'}>
                                                <p className={cx('writer')}>
                                                    Bởi {article.author?.name}
                                                </p>
                                                <p className={cx('fw-semibold', 'date')}>
                                                    {new Date(article.createdAt).toLocaleDateString(
                                                        'en-GB',
                                                    )}
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
                                ))}
                        </Flex>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default SectionCarousel;
