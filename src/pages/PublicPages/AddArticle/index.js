import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Input, Select, Flex, Button, Form, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import styles from './AddArticle.module.scss';
import { startLoading, stopLoading } from '~/redux/loadingSlice';
import Loading from '~/components/Loading';
import UploadImage from '~/components/UploadImage';

const { TextArea } = Input;
const cx = classNames.bind(styles);

function AddArticle() {
    const [dataGenres, setDataGenres] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [subDescription, setSubDescription] = useState('');
    const [description, setDescription] = useState('');

    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loading.isLoading);
    const user = useSelector((state) => state.auth.login?.currentUser);

    useEffect(() => {
        const fetchDataGenres = async () => {
            dispatch(startLoading());

            try {
                const res = await axios.get('http://localhost:8080/api/genre/');
                setDataGenres(res.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
            dispatch(stopLoading());
        };

        fetchDataGenres();
    }, []);

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
                author: selectedAuthor,
                genres: selectedGenres,
                image,
            };
            await axios.post('http://localhost:8080/api/article', newArticle);

            setName('');
            setSubDescription('');
            setDescription('');
            setSelectedAuthor([]);
            setSelectedGenres([]);
            setImage(null);
            message.success('Bài báo đã được đăng thành công!');
        } catch (error) {
            console.error('Error adding article:', error);
            message.error('Đã xảy ra lỗi khi đăng bài báo!');
        }

        dispatch(stopLoading());
    };

    return (
        <Row justify="center" align="center" vertical className={cx('container mt-5 mb-4')}>
            {isLoading ? (
                <Loading />
            ) : (
                <Col lg={18} md={18} xs={24}>
                    <h2 className={cx('mb-3')}>Đăng bài báo</h2>
                    <Form layout="vertical">
                        <Form.Item
                            label="Tên tiêu đề"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên tiêu đề!' }]}
                        >
                            <Input
                                style={{ padding: '10px' }}
                                placeholder="Viết tên tiêu đề"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Item>
                        <Row gutter={(0, { lg: 16, md: 16, xs: 0 })} justify={'space-between'}>
                            <Col lg={12} md={12} xs={24}>
                                <Form.Item
                                    className={cx('')}
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
                                        className={cx('custom-select')}
                                        placeholder="Chọn người viết"
                                        value={selectedAuthor}
                                        onChange={setSelectedAuthor}
                                        maxCount={1}
                                    >
                                        <Select.Option key={user._id} value={user._id}>
                                            {user.name}
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} xs={24}>
                                <Form.Item
                                    className={cx('')}
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
                                            <Select.Option
                                                style={{ padding: '10px' }}
                                                key={genre._id}
                                                value={genre._id}
                                            >
                                                {genre.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
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
                        <Button
                            onClick={handleAddArticle}
                            style={{ width: '100%' }}
                            className={cx('submit')}
                            type="submit"
                            variant="solid"
                        >
                            Đăng bài
                        </Button>
                    </Form>
                </Col>
            )}
        </Row>
    );
}

export default AddArticle;
