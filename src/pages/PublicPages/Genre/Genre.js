import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useParams } from 'react-router-dom';
import {
    Breadcrumb,
    Divider,
    Flex,
    Image,
    List,
    Button,
    Avatar,
    Empty,
    Pagination,
    Row,
    Col,
} from 'antd';
import {
    HomeOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    DoubleRightOutlined,
    DoubleLeftOutlined,
} from '@ant-design/icons';

import styles from './Genre.module.scss';
import { startLoading, stopLoading } from '~/redux/loadingSlice';
import Loading from '~/components/Loading';
import config from '~/config';

const cx = classNames.bind(styles);

function Genre() {
    const [genre, setGenre] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();
    const { id } = useParams();
    const isLoading = useSelector((state) => state.loading.isLoading);

    const articlesPerPage = 6;
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = genre.articles?.slice(indexOfFirstArticle, indexOfLastArticle);

    useEffect(() => {
        const fetchGenre = async () => {
            dispatch(startLoading());
            try {
                const res = await axios.get(`http://localhost:8080/api/genre/${id}`);
                setCurrentPage(1);
                setGenre(res.data);
            } catch (error) {
                console.error('There was an error fetching the genres!', error);
            }
            dispatch(stopLoading());
        };

        fetchGenre();
    }, [id]);

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch(startLoading());
            try {
                const data = JSON.parse(localStorage.getItem('persist:root'));
                const auth = JSON.parse(data.auth);
                const accessToken = auth.login.currentUser.accessToken;
                const res = await axios.get('http://localhost:8080/api/user/publicusers', {
                    headers: {
                        token: `Bearer ${accessToken}`,
                    },
                });
                setUserList(res.data);
            } catch (error) {
                console.error('Error fetching users:', error.response?.data || error.message);
            }
            dispatch(stopLoading());
        };

        fetchUsers();
    }, []);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <section className={cx('container', 'mb-4')}>
                    <Breadcrumb
                        className={cx('bread')}
                        items={[
                            {
                                title: (
                                    <NavLink
                                        style={{ textDecoration: 'none' }}
                                        to={config.routes.home}
                                    >
                                        <HomeOutlined /> Home
                                    </NavLink>
                                ),
                            },
                            {
                                title: `${genre.name}`,
                            },
                        ]}
                    />
                    <h1 className={cx('fw-semibold')}>{genre.name}</h1>
                    <Divider className={cx('my-3')} />
                    <Row gutter={(16, 24)} style={{ marginBottom: '20px' }} justify="space-between">
                        <Col lg={18} xs={24}>
                            {currentArticles?.map((article) => (
                                <Row gutter={(16, 16)} key={article._id} className={cx('mb-4')}>
                                    <Col lg={12} md={24} xs={24}>
                                        <Link
                                            className={cx('img-link')}
                                            to={`/article_detail/${article._id}`}
                                        >
                                            <Image
                                                preview={false}
                                                width={'100%'}
                                                height={'300px'}
                                                className={cx('img')}
                                                src={article.image}
                                            />
                                        </Link>
                                    </Col>
                                    <Col lg={12} md={24} xs={24}>
                                        <Flex className={cx('mb-2')} justify={'space-between'}>
                                            <p className={cx('m-0', 'writer')}>
                                                Bởi {article.author?.name}
                                            </p>
                                            <p className={cx('fw-semibold m-0', 'date')}>
                                                {new Date(article.createdAt).toLocaleDateString(
                                                    'en-GB',
                                                )}
                                            </p>
                                        </Flex>
                                        <Link
                                            to={`/article_detail/${article._id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <h3 className={cx('text-header')}>{article.name}</h3>
                                        </Link>
                                        <p className={cx('sub-text')}>{article.subDescription}</p>
                                    </Col>
                                </Row>
                            ))}
                            {currentArticles?.length === 0 && (
                                <Empty description={'Chưa có dữ liệu'} />
                            )}
                        </Col>
                        {userList?.filter((user) => user.articles.length > 0).length > 0 && (
                            <Col lg={6} xs={24}>
                                <div className={cx('writer-box')}>
                                    <h3 className={cx('fw-semibold')}>Tác giả bạn có thể biết</h3>
                                    <List
                                        dataSource={userList
                                            .filter((user) => user.articles.length > 0)
                                            .slice(0, showAll ? userList.length : 5)}
                                        renderItem={(user) => (
                                            <List.Item className={cx('writer-list-item')}>
                                                <div className={cx('writer-name')}>
                                                    <Avatar
                                                        src={user.avatar}
                                                        className={cx('me-2')}
                                                    />
                                                    {user.name}
                                                </div>
                                            </List.Item>
                                        )}
                                        split={false}
                                    />

                                    {userList?.filter((user) => user.articles.length > 0).length >
                                        5 && (
                                        <div className={cx('show-more-container')}>
                                            <Button
                                                onClick={() => setShowAll(!showAll)}
                                                variant="link"
                                                icon={
                                                    showAll ? (
                                                        <CaretUpOutlined />
                                                    ) : (
                                                        <CaretDownOutlined />
                                                    )
                                                }
                                                className={cx('show-more-button')}
                                            >
                                                {showAll ? 'Thu gọn' : 'Xem thêm'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row>
                    {currentArticles?.length > 0 && (
                        <Pagination
                            className={cx('custom-pagination')}
                            current={currentPage}
                            pageSize={articlesPerPage}
                            total={genre.articles?.length}
                            onChange={(page) => {
                                dispatch(startLoading());
                                setCurrentPage(page);
                                setTimeout(() => {
                                    dispatch(stopLoading());
                                }, 500);
                            }}
                            align="center"
                            prevIcon={
                                <DoubleLeftOutlined style={{ color: '#000', fontSize: '18px' }} />
                            }
                            nextIcon={
                                <DoubleRightOutlined style={{ color: '#000', fontSize: '18px' }} />
                            }
                        />
                    )}
                </section>
            )}
        </>
    );
}

export default Genre;
