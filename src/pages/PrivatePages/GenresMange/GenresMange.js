import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, Input, message, Drawer, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './GenresMange.module.scss';
import TableForm from '~/components/TableForm';
import Loading from '~/components/Loading';
import { startLoading, stopLoading } from '~/redux/loadingSlice';

const cx = classNames.bind(styles);

function GenresMange() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [genres, setGenres] = useState([]);
    const [nameGenre, setNameGenre] = useState('');

    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loading.isLoading);

    useEffect(() => {
        const fetchGenres = async () => {
            dispatch(startLoading());
            try {
                const res = await axios.get('http://localhost:8080/api/genre');
                setGenres(res.data);
            } catch (error) {
                console.error('Failed to fetch genres:', error);
            }
            dispatch(stopLoading());
        };

        fetchGenres();
    }, [dispatch]);

    const handleAddGenre = async () => {
        dispatch(startLoading());
        try {
            const res = await axios.post('http://localhost:8080/api/genre', { name: nameGenre });
            setGenres([...genres, res.data]);
            setIsModalOpen(false);
            message.success('Thể loại đã được thêm thành công!');
        } catch (error) {
            console.error('Error:', error);
        }
        dispatch(stopLoading());
    };

    const handleDeleteGenre = async (id) => {
        dispatch(startLoading());
        try {
            const res = await axios.delete(`http://localhost:8080/api/genre/${id}`);
            if (res.status === 200) {
                setGenres(genres.filter((genre) => genre._id !== id));
                message.success('Thể loại đã được xóa thành công!');
            } else {
                console.error('Failed to delete genre');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        dispatch(stopLoading());
    };

    const handleUpdateGenre = async (id) => {
        dispatch(startLoading());
        try {
            const updateGenres = {
                name: nameGenre,
            };
            const res = await axios.put(`http://localhost:8080/api/genre/${id}`, updateGenres);
            if (res.status === 200) {
                const updatedGenres = await axios.get('http://localhost:8080/api/genre');
                setGenres(updatedGenres.data);
                setIsModalEditOpen(false);
                setNameGenre('');
                message.success('Thể loại đã được cập nhật thành công!');
            } else {
                message.error('Thể loại cập nhập không thành công!');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Đã xảy ra lỗi khi sửa thể loại!');
        }
        dispatch(stopLoading());
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
                            Thêm thể loại
                        </Button>
                        <Modal
                            title="Thêm thể loại"
                            open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            onOk={handleAddGenre}
                        >
                            <Form
                                name="basic"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Genre"
                                    name="genre"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên thể loại' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Điền tên thể loại"
                                        onChange={(e) => setNameGenre(e.target.value)}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                    <TableForm
                        columns={[
                            { title: 'ID', dataIndex: '_id', key: '_id' },
                            { title: 'Name', dataIndex: 'name', key: 'name' },
                            {
                                title: 'Articles',
                                dataIndex: 'articles',
                                key: 'articles',
                                render: (articles) => articles?.length,
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
                                                setNameGenre(record.name);
                                                setSelectedGenreId(record._id);
                                            }}
                                        />
                                        <DeleteOutlined
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            onClick={() => handleDeleteGenre(record._id)}
                                        />
                                    </>
                                ),
                            },
                        ]}
                        dataSource={genres.map((genre) => ({ ...genre, key: genre._id }))}
                    />
                    <Drawer
                        title="Chỉnh sửa thể loại"
                        onClose={() => setIsModalEditOpen(false)}
                        open={isModalEditOpen}
                        extra={
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => handleUpdateGenre(selectedGenreId)}
                                >
                                    OK
                                </Button>
                            </Space>
                        }
                    >
                        <Form
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Genre"
                                name="genre"
                                rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
                                initialValue={nameGenre}
                            >
                                <Input
                                    placeholder="Điền tên thể loại"
                                    value={nameGenre}
                                    onChange={(e) => {
                                        setNameGenre(e.target.value);
                                    }}
                                />
                            </Form.Item>
                        </Form>
                    </Drawer>
                </>
            )}
        </>
    );
}

export default GenresMange;
