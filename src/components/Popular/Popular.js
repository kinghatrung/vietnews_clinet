import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Carousel, Flex, Image, Row, Col } from 'antd';

import styles from './Popular.module.scss';

const cx = classNames.bind(styles);

function Popular({ articles, dataGenres }) {
    let isDragging;

    const getRandomGenres = (genres, count) => {
        const filteredGenres = genres.filter((genre) => genre.articles.length > 0);
        const shuffled = filteredGenres.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    return (
        <Row justify={'center'} className={cx('container mt-4', 'box')}>
            <Col xs={24} md={24} lg={16}>
                <Carousel dots={false} autoplay autoplaySpeed={2800} draggable>
                    {articles.slice(0, 3).map((article) => (
                        <div key={article._id} className={cx('carousel-item')}>
                            <Link
                                onClick={(e) => {
                                    if (isDragging) {
                                        e.preventDefault();
                                        isDragging = false;
                                    }
                                }}
                                onPointerDown={() => (isDragging = false)}
                                onPointerMove={() => (isDragging = true)}
                                className={cx('article-link')}
                                to={`/article_detail/${article._id}`}
                            >
                                <Image
                                    width={'100%'}
                                    preview={false}
                                    style={{
                                        height: '500px',
                                        objectFit: 'cover',
                                    }}
                                    src={article.image}
                                />
                            </Link>
                            <div className={cx('sub-image')}>
                                <span className={cx('new')}>Mới</span>
                                <Link
                                    style={{ textDecoration: 'none' }}
                                    to={`/article_detail/${article._id}`}
                                >
                                    <h2 className={cx('text')}>{article.name}</h2>
                                </Link>
                                <Flex gap={'18px'}>
                                    <p className={cx('writer')}>Bởi {article.author?.name}</p>
                                    <p className={cx('date')}>
                                        {new Date(article.createdAt).toLocaleDateString('en-GB')}
                                    </p>
                                </Flex>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </Col>
            <Col xs={24} md={24} lg={8}>
                {getRandomGenres(dataGenres, 2).map((genre) =>
                    genre.articles.slice(0, 1).map((article) => (
                        <div key={article._id} className={cx('article')}>
                            <div className={cx('random-article')}>
                                <Link className={cx('link')} to={`/article_detail/${article._id}`}>
                                    <Image
                                        preview={false}
                                        width="100%"
                                        style={{
                                            height: '250px',
                                            objectFit: 'cover',
                                        }}
                                        className={cx('article-image')}
                                        src={article.image}
                                    />
                                </Link>
                                <div className={cx('right')}>
                                    <span className={cx('new-right')}>{genre.name}</span>
                                    <Link
                                        to={`/article_detail/${article._id}`}
                                        className={cx('text-link')}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <h2 className={cx('text-right')}>{article.name}</h2>
                                    </Link>
                                    <Flex justify="space-between" gap="18px">
                                        <p className={cx('writer-right')}>
                                            Bởi {article.author?.name}
                                        </p>
                                        <p className={cx('date-right')}>
                                            {new Date(article.createdAt).toLocaleDateString(
                                                'en-GB',
                                            )}
                                        </p>
                                    </Flex>
                                </div>
                            </div>
                        </div>
                    )),
                )}
            </Col>
        </Row>
    );
}

export default Popular;
