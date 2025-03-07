import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Flex, Image, Divider, Avatar, Row, Col } from 'antd';
import styles from './DetailArticle.module.scss';
import ListArticle from '~/components/ListArticle';
import { startLoading, stopLoading } from '~/redux/loadingSlice';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function DetailArticle() {
    const [detailArticle, setDetailArticle] = useState([]);

    const dispatch = useDispatch();
    const { id } = useParams();
    const isLoading = useSelector((state) => state.loading.isLoading);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(startLoading());
            try {
                const res = await axios.get(`http://localhost:8080/api/article/${id}`);
                setDetailArticle(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            dispatch(stopLoading());
        };

        fetchData();
    }, [id]);

    return (
        <div className={cx('container')}>
            {isLoading ? (
                <Loading />
            ) : (
                <Row gutter={(16, { lg: 24 })} justify="space-between">
                    <Col lg={16} md={24} xs={24}>
                        <Flex className={cx('mt-4')} justify="space-between">
                            {detailArticle.genres?.map((genre) => (
                                <Link
                                    style={{ textDecoration: 'none' }}
                                    key={genre._id}
                                    to={`/genre/${genre._id}`}
                                >
                                    <p className={cx('genre')}>
                                        <span key={genre.id}>{genre.name}</span>
                                    </p>
                                </Link>
                            ))}
                            <p className={cx('date')}>
                                {new Date(detailArticle.createdAt).toLocaleString('vi-VN', {
                                    weekday: 'long',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                                {', '}
                                {new Date(detailArticle.createdAt).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </Flex>
                        <h2 className={cx('mb-2', 'name')}>{detailArticle.name}</h2>
                        <p className={cx('sub-text')}>{detailArticle.subDescription}</p>
                        <Divider className={cx('my-3')} orientation="left" orientationMargin="0" />
                        <Flex gap={16} align="center" className={cx('mb-3')}>
                            <Avatar size={42} src={detailArticle.author?.avatar} />
                            <div className={cx('author')}>
                                Bởi{' '}
                                <span style={{ color: '#c00' }}>{detailArticle.author?.name}</span>{' '}
                                với nickname là{' '}
                                <span style={{ color: '#c00' }}>
                                    {detailArticle.author?.nickname}
                                </span>
                            </div>
                        </Flex>
                        <Image width={'100%'} src={detailArticle.image} alt={detailArticle.name} />
                        <p className={cx('text', 'mt-4')}>{detailArticle.description}</p>
                        <Divider className={cx('my-3')} />
                        <div></div>
                    </Col>
                    <Col lg={8} md={24} xs={24} className={cx('mt-4')}>
                        <ListArticle articles={detailArticle} id={id} />
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default DetailArticle;
