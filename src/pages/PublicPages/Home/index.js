import axios from 'axios';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Divider, Button, Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Home.module.scss';
import Article from '~/components/Article';
import { startLoading, stopLoading } from '~/redux/loadingSlice';
import Loading from '~/components/Loading';
import { NavLink } from 'react-router-dom';
import SectionCarousel from '~/components/SectionCarousel';
import Popular from '~/components/Popular';

const cx = classNames.bind(styles);

function Home() {
    const [dataGenres, setDataGenres] = useState([]);
    const [articles, setArticles] = useState([]);

    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loading.isLoading);

    useEffect(() => {
        const fetchGenres = async () => {
            dispatch(startLoading());
            try {
                const res = await axios.get('http://localhost:8080/api/genre/');
                setDataGenres(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            dispatch(stopLoading());
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            dispatch(startLoading());
            try {
                const res = await axios.get('http://localhost:8080/api/article/');
                setArticles(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            dispatch(stopLoading());
        };

        fetchGenres();
    }, []);

    return (
        <div className="mb-4">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <SectionCarousel articles={articles} />
                    <Popular dataGenres={dataGenres} articles={articles} />
                    {dataGenres.map(
                        (genre) =>
                            genre.articles.length > 0 && (
                                <div key={genre._id} className={cx('container mt-4')}>
                                    <h2 className={cx('name')}>{genre.name}</h2>
                                    <Divider className={cx('my-3')} />

                                    <Row
                                        wrap
                                        gutter={[16, { xs: 24, md: 24, lg: 32 }]}
                                        justify={'center'}
                                    >
                                        {genre.articles.slice(0, 8).map((article) => (
                                            <Col xs={24} md={12} lg={6} key={article._id}>
                                                <Article {...article} />
                                            </Col>
                                        ))}
                                    </Row>

                                    {genre.articles.length >= 8 && (
                                        <NavLink className={cx('link')} to={`/genre/${genre._id}`}>
                                            <Button
                                                className={cx('see-more')}
                                                color="danger"
                                                variant="outlined"
                                            >
                                                Xem thêm
                                            </Button>
                                        </NavLink>
                                    )}
                                </div>
                            ),
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
