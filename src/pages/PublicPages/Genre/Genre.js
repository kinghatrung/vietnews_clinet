import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Breadcrumb, Divider, Flex, Image, List, Button, Avatar, Empty, Pagination } from 'antd';
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
                    <Flex style={{ marginBottom: '20px' }} justify="space-between">
                        <div className={cx('col-9')}>
                            {currentArticles?.map((article) => (
                                <Flex key={article._id} className={cx('mb-4')} gap={'12px'}>
                                    <Link
                                        to={`/article_detail/${article._id}`}
                                        style={{ width: '100%' }}
                                    >
                                        <Image
                                            preview={false}
                                            width={'500px'}
                                            height={'300px'}
                                            className={cx('img')}
                                            src={article.image}
                                        />
                                    </Link>
                                    <div>
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
                                            to={`/article_detail/${article._id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <h3 className={cx('text-header')}>{article.name}</h3>
                                        </Link>
                                        <p className={cx('sub-text')}>{article.subDescription}</p>
                                    </div>
                                </Flex>
                            ))}
                            {currentArticles?.length === 0 && (
                                <Empty description={'Chưa có dữ liệu'} />
                            )}
                        </div>
                        {userList?.filter((user) => user.articles.length > 0).length > 0 && (
                            <div className={cx('col-2')}>
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
                            </div>
                        )}
                    </Flex>
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
