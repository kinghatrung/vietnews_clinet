import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, Input, Select, message, Drawer, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import axios from 'axios';

import TableForm from '~/components/TableForm';
import styles from './ArticlesMange.module.scss';
import Loading from '~/components/Loading';
import { startLoading, stopLoading } from '~/redux/loadingSlice';
import UploadImage from '~/components/UploadImage';

const { TextArea } = Input;
const cx = classNames.bind(styles);

function ArticlesMange() {
    const [articles, setArticles] = useState([]);
    const [dataGenres, setDataGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [subDescription, setSubDescription] = useState('');
    const [description, setDescription] = useState('');

    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loading.isLoading);
    const userList = useSelector((state) => state.users.users?.allUsers);

    useEffect(() => {
        const fetchData = async (url, setData) => {
            dispatch(startLoading());
            try {
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.error(`Failed to fetch data from ${url}:`, error);
            }
            dispatch(stopLoading());
        };

        fetchData('http://localhost:8080/api/article', setArticles);
        fetchData('http://localhost:8080/api/genre/', setDataGenres);
    }, [dispatch]);

    const handleAddArticle = async () => {
        if (!image) {
            message.error('Vui lòng chọn ảnh trước khi đăng bài!');
            return;
        }
        dispatch(startLoading());
        try {
            const newArticle = {
                name,
                subDescription,
                description,
                genres: selectedGenres,
                author: selectedAuthor,
                image,
            };
            const res = await axios.post('http://localhost:8080/api/article', newArticle);
            if (res.status === 200) {
                const updatedArticles = await axios.get('http://localhost:8080/api/article');
                setArticles(updatedArticles.data);
                resetForm();
                message.success('Bài báo đã được đăng thành công!');
            } else {
                message.error('Đăng bài báo thất bại!');
            }
        } catch (error) {
            console.error('Error adding article:', error);
            message.error('Đã xảy ra lỗi khi đăng bài báo!');
        }
        dispatch(stopLoading());
    };

    const handleDeleteArticle = async (articleId) => {
        dispatch(startLoading());
        try {
            const res = await axios.delete(`http://localhost:8080/api/article/${articleId}`);
            if (res.status === 200) {
                setArticles(articles.filter((article) => article._id !== articleId));
                message.success('Bài báo đã được xóa thành công!');
            } else {
                message.error('Xóa bài báo thất bại!');
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            message.error('Đã xảy ra lỗi khi xóa bài báo!');
        }
        dispatch(stopLoading());
    };

    const handleUpdateArticle = async (articleId) => {
        dispatch(startLoading());
        try {
            const updatedArticle = {
                name,
                subDescription,
                description,
                genres: selectedGenres,
                author: selectedAuthor,
                image,
            };
            const res = await axios.put(
                `http://localhost:8080/api/article/${articleId}`,
                updatedArticle,
            );
            if (res.status === 200) {
                const updatedArticles = await axios.get('http://localhost:8080/api/article');
                setArticles(updatedArticles.data);
                resetForm();
                message.success('Bài báo đã được sửa thành công!');
            } else {
                message.error('Sửa bài báo thất bại!');
            }
        } catch (error) {
            console.error('Error updating article:', error);
            message.error('Đã xảy ra lỗi khi sửa bài báo!');
        }
        dispatch(stopLoading());
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setIsModalEditOpen(false);
        setName('');
        setSubDescription('');
        setDescription('');
        setSelectedGenres([]);
        setSelectedAuthor([]);
        setImage(null);
    };

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className={cx('text-start')}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            className={cx('mb-3')}
                        >
                            Thêm bài báo
                        </Button>
                        <Modal
                            title="Thêm bài báo"
                            open={isModalOpen}
                            onCancel={resetForm}
                            onOk={handleAddArticle}
                        >
                            <Form
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Người viết"
                                    name="author"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên người viết!',
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn người viết"
                                        value={selectedAuthor}
                                        onChange={setSelectedAuthor}
                                        maxCount={1}
                                    >
                                        {userList?.map((user) => (
                                            <Select.Option key={user._id} value={user._id}>
                                                {user.name || 'Vô danh'}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Tên tiêu đề"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên tiêu đề!' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Viết tên tiêu đề"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Tên thể loại"
                                    name="genres"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên thể loại!' },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn thể loại"
                                        value={selectedGenres}
                                        onChange={setSelectedGenres}
                                    >
                                        {dataGenres.map((genre) => (
                                            <Select.Option key={genre._id} value={genre._id}>
                                                {genre.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Tên tiêu đề phụ"
                                    name="subDescription"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên tiêu đề phụ!',
                                        },
                                    ]}
                                >
                                    <TextArea
                                        rows={3}
                                        placeholder="Viết tên tiêu đề phụ"
                                        value={subDescription}
                                        onChange={(e) => setSubDescription(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nội dung"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng viết nội dung bài báo!',
                                        },
                                    ]}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Viết nội dung bài báo"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Ảnh" name="image">
                                    <UploadImage onUpload={setImage}>
                                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                    </UploadImage>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                    <TableForm
                        columns={[
                            { title: 'ID', dataIndex: '_id', key: '_id' },
                            { title: 'Name', dataIndex: 'name', key: 'name' },
                            {
                                title: 'Sub Description',
                                dataIndex: 'subDescription',
                                key: 'subDescription',
                            },
                            {
                                title: 'Genres',
                                dataIndex: 'genres',
                                key: 'genres',
                                render: (genres) =>
                                    genres?.map((genre) => (
                                        <p className={cx('m-0')} key={genre._id}>
                                            {genre.name}
                                        </p>
                                    )),
                            },
                            {
                                title: 'Author',
                                dataIndex: 'author',
                                key: 'author',
                                render: (author) => author?.name,
                            },
                            {
                                title: 'Action',
                                render: (record) => (
                                    <>
                                        <EditOutlined
                                            style={{
                                                marginRight: '12px',
                                                cursor: 'pointer',
                                                color: '#1677ff',
                                            }}
                                            onClick={() => {
                                                setIsModalEditOpen(true);
                                                setSelectedArticleId(record._id);
                                                setName(record.name);
                                                setSubDescription(record.subDescription);
                                                setDescription(record.description);
                                                setSelectedGenres(
                                                    record.genres.map((genre) => genre._id),
                                                );
                                                setSelectedAuthor(record.author._id);
                                                setImage(record.image);
                                            }}
                                        />
                                        <DeleteOutlined
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            onClick={() => handleDeleteArticle(record._id)}
                                        />
                                    </>
                                ),
                            },
                        ]}
                        dataSource={articles.map((article) => ({ ...article, key: article._id }))}
                        pagination={{ pageSize: 5 }}
                    />
                    <Drawer
                        title="Chỉnh sửa bài báo"
                        onClose={resetForm}
                        open={isModalEditOpen}
                        size="large"
                        extra={
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => handleUpdateArticle(selectedArticleId)}
                                >
                                    OK
                                </Button>
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
                                label="Người viết"
                                name="author"
                                initialValue={selectedAuthor}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên người viết!' },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn người viết"
                                    value={selectedAuthor}
                                    onChange={setSelectedAuthor}
                                    maxCount={1}
                                >
                                    {userList?.map((user) => (
                                        <Select.Option key={user._id} value={user._id}>
                                            {user.name || 'Vô danh'}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Tên tiêu đề"
                                name="name"
                                initialValue={name}
                                rules={[{ required: true, message: 'Vui lòng nhập tên tiêu đề!' }]}
                            >
                                <Input
                                    placeholder="Viết tên tiêu đề"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tên thể loại"
                                name="genres"
                                initialValue={selectedGenres}
                                rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn thể loại"
                                    value={selectedGenres}
                                    onChange={setSelectedGenres}
                                >
                                    {dataGenres.map((genre) => (
                                        <Select.Option key={genre._id} value={genre._id}>
                                            {genre.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Tên tiêu đề phụ"
                                name="subDescription"
                                initialValue={subDescription}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên tiêu đề phụ!' },
                                ]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Viết tên tiêu đề phụ"
                                    value={subDescription}
                                    onChange={(e) => setSubDescription(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nội dung"
                                name="description"
                                initialValue={description}
                                rules={[
                                    { required: true, message: 'Vui lòng viết nội dung bài báo!' },
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Viết nội dung bài báo"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item initialValue={image} label="Ảnh" name="image">
                                <UploadImage onUpload={setImage}>
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </UploadImage>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </>
            )}
        </>
    );
}

export default ArticlesMange;
