import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Avatar,
    Button,
    Flex,
    Divider,
    Empty,
    Tabs,
    Image,
    Pagination,
    Drawer,
    Form,
    Input,
    Space,
    Row,
    Col,
} from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';

import styles from './Profile.module.scss';
import { startLoading, stopLoading } from '~/redux/loadingSlice';
import Loading from '~/components/Loading';
import config from '~/config';
import UploadImage from '~/components/UploadImage';

const cx = classNames.bind(styles);

function Profile() {
    const [userList, setUserList] = useState([]);
    const [articles, setArticles] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [userForm, setUserForm] = useState({
        email: '',
        username: '',
        password: '',
        avatar: '',
        address: '',
        name: '',
        nickname: '',
        articles: [],
    });

    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loading.isLoading);
    const user = useSelector((state) => state.auth.login?.currentUser);

    const articlesPerPage = 12;
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

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

    useEffect(() => {
        const fetchArticles = async () => {
            dispatch(startLoading());
            try {
                const response = await axios.get('http://localhost:8080/api/article');
                const allArticles = response.data;

                if (user?.articles?.length) {
                    const filteredArticles = allArticles.filter((article) =>
                        user.articles.includes(article._id),
                    );
                    setArticles(filteredArticles);
                }
            } catch (error) {
                console.error('Lỗi khi lấy bài viết:', error);
            }
            dispatch(stopLoading());
        };

        fetchArticles();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    const items = [
        {
            key: '1',
            label: <span className={cx('label')}>Các bài viết đã đăng</span>,
            children: isLoading ? (
                <Loading />
            ) : currentArticles.length > 0 ? (
                <Row
                    wrap
                    gutter={[16, { xs: 24, md: 24, lg: 32 }]}
                    justify={'center'}
                    className={cx('my-2')}
                >
                    {currentArticles.map((article) => (
                        <Col xs={24} md={12} lg={6} style={{ width: '19rem' }} key={article._id}>
                            <Link to={`/article_detail/${article._id}`}>
                                <Image
                                    className={cx('img')}
                                    preview={false}
                                    width={'100%'}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    src={article.image}
                                />
                            </Link>
                            <Flex className={cx('mt-2')} gap={'10px'} justify="flex-start">
                                <p className={cx('writer', 'm-0')}>Bởi {article.author.name}</p>
                                <p className={cx('fw-semibold m-0', 'date')}>
                                    {new Date(article.createdAt).toLocaleDateString('en-GB')}
                                </p>
                            </Flex>
                            <Link
                                style={{ textDecoration: 'none' }}
                                to={`/article_detail/${article._id}`}
                            >
                                <h3 className={cx('name-article')}>{article.name}</h3>
                            </Link>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="Chưa có bài báo nào" />
            ),
        },
    ];

    return (
        <div className={cx('container mt-4')}>
            <Row
                gutter={({ lg: 16, md: 16, sm: 0, xs: 0 }, { lg: 42, md: 42, sm: 0, xs: 0 })}
                justify={{ xs: 'center', sm: 'center', md: 'start' }}
                className={cx('mb-3')}
            >
                <Col>
                    <Avatar
                        src={user?.avatar}
                        size={{
                            xs: 210,
                            sm: 220,
                            md: 230,
                            lg: 240,
                            xl: 240,
                            xxl: 240,
                        }}
                    />
                </Col>
                <Col>
                    <Flex className={cx('mb-2')} align="center">
                        <p className={cx('name')}>{user?.name}</p>
                        <Divider type="vertical" />
                        <p className={cx('nickname')}>{user?.nickname}</p>
                    </Flex>
                    <Row gap={8} gutter={(16, 16)} className={cx('mb-2')}>
                        <Col lg={12} sm={12} xs={24}>
                            <Button
                                onClick={() => setOpenModal(!openModal)}
                                color="danger"
                                className={cx('custom-btn')}
                                variant="solid"
                            >
                                Sửa hồ sơ
                            </Button>
                        </Col>

                        <Col lg={12} sm={12} xs={24}>
                            <Link style={{ textDecoration: 'none' }} to={config.routes.add_article}>
                                <Button variant="solid" color="danger" className={cx('custom-btn')}>
                                    Thêm bài báo
                                </Button>
                            </Link>
                        </Col>

                        <Drawer
                            title="Sửa hồ sơ"
                            onClose={() => setOpenModal(!openModal)}
                            open={openModal}
                            extra={
                                <Space>
                                    <Button type="primary">OK</Button>
                                </Space>
                            }
                        >
                            <Form
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    initialValue={user?.email}
                                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                >
                                    <Input
                                        name="email"
                                        value={user?.email}
                                        placeholder="Điền email"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    initialValue={user?.username}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên người dùng!',
                                        },
                                    ]}
                                >
                                    <Input
                                        name="username"
                                        value={user?.username}
                                        placeholder="Điền tên tài khoản"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    initialValue={user?.password}
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                >
                                    <Input.Password
                                        name="password"
                                        placeholder="Điền mật khẩu"
                                        value={user?.password}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                    initialValue={user?.address}
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input
                                        name="address"
                                        placeholder="Điền địa chỉ"
                                        value={user?.address}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    initialValue={user?.name}
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                >
                                    <Input
                                        name="name"
                                        placeholder="Điền họ và tên"
                                        value={user?.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nickname"
                                    name="nickname"
                                    initialValue={user?.nickname}
                                    rules={[{ required: true, message: 'Vui lòng nhập Nickname' }]}
                                >
                                    <Input
                                        name="nickname"
                                        placeholder="Điền Nickname"
                                        value={user?.nickname}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item initialValue={user?.avatar} label="Ảnh" name="avatar">
                                    <UploadImage
                                        onUpload={(url) =>
                                            setUserForm((prev) => ({ ...prev, avatar: url }))
                                        }
                                    />
                                </Form.Item>
                            </Form>
                        </Drawer>
                    </Row>
                    <p className={cx('address', 'mb-2')}>Địa chỉ: {user?.address}</p>
                    <p className={cx('articles')}>Số bài báo đã đăng: {user?.articles.length}</p>
                    <p className={cx('bio')}>{user?.bio ? user?.bio : "'Chưa có tiểu sử'"}</p>
                </Col>
            </Row>
            <Tabs className={cx('tabs')} defaultActiveKey="1" items={items} />
            {currentArticles?.length > 0 && (
                <Pagination
                    className={cx('my-4')}
                    current={currentPage}
                    pageSize={articlesPerPage}
                    total={articles.length}
                    onChange={(page) => {
                        dispatch(startLoading());
                        setCurrentPage(page);
                        setTimeout(() => {
                            dispatch(stopLoading());
                        }, 500);
                    }}
                    align="center"
                    prevIcon={<DoubleLeftOutlined style={{ color: '#000', fontSize: '18px' }} />}
                    nextIcon={<DoubleRightOutlined style={{ color: '#000', fontSize: '18px' }} />}
                />
            )}
        </div>
    );
}

export default Profile;
