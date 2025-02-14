import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, message, Drawer, Space } from 'antd';

import styles from './UserMange.module.scss';
import TableForm from '~/components/TableForm';
import { deleteUser, getAllUsers, putUser, registerUser } from '~/redux/apiRequest';
import { createAxios } from '~/createInstance';
import { loginSuccess } from '~/redux/authSlice';
import Loading from '~/components/Loading';
import { stopLoading, startLoading } from '~/redux/loadingSlice';
import UploadImage from '~/components/UploadImage';

const cx = classNames.bind(styles);

function UserMange() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
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

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userList = useSelector((state) => state.users.users?.allUsers);
    const isLoading = useSelector((state) => state.loading.isLoading);
    const accessToken = user?.accessToken;
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        if (accessToken) {
            dispatch(startLoading());
            getAllUsers(accessToken, dispatch, axiosJWT).finally(() => {
                dispatch(stopLoading());
            });
        }
    }, [accessToken, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async () => {
        dispatch(startLoading());
        try {
            await registerUser(userForm, dispatch, navigate);
            await getAllUsers(accessToken, dispatch, axiosJWT);
            setIsModalOpen(false);
            message.success('Thêm người dùng thành công!');
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleDelete = async (id) => {
        dispatch(startLoading());
        try {
            await deleteUser(accessToken, dispatch, id);
            await getAllUsers(accessToken, dispatch, axiosJWT);
            message.success('Xóa người dùng thành công!');
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleUpdateUser = async (id) => {
        dispatch(startLoading());
        try {
            await putUser(accessToken, dispatch, id, userForm);
            await getAllUsers(accessToken, dispatch, axiosJWT);
            setIsModalEditOpen(false);
            message.success('Cập nhật người dùng thành công!');
        } finally {
            dispatch(stopLoading());
        }
    };

    const openEditModal = (record) => {
        setIsModalEditOpen(true);
        setSelectedUserId(record._id);
        setUserForm({
            email: record.email,
            username: record.username,
            password: '',
            avatar: record.avatar,
            address: record.address,
            name: record.name,
            nickname: record.nickname,
            articles: record.articles,
        });
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
                            Thêm người dùng
                        </Button>
                        <Modal
                            title="Thêm người dùng"
                            open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            onOk={handleAddUser}
                        >
                            <Form
                                name="basic"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                onFinish={handleAddUser}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                >
                                    <Input
                                        name="email"
                                        placeholder="Điền email"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên người dùng!',
                                        },
                                    ]}
                                >
                                    <Input
                                        name="username"
                                        placeholder="Điền tên tài khoản"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                >
                                    <Input.Password
                                        name="password"
                                        placeholder="Điền mật khẩu"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input
                                        name="address"
                                        placeholder="Điền địa chỉ"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                >
                                    <Input
                                        name="name"
                                        placeholder="Điền họ và tên"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nickname"
                                    name="nickname"
                                    rules={[{ required: true, message: 'Vui lòng nhập Nickname' }]}
                                >
                                    <Input
                                        name="nickname"
                                        placeholder="Điền Nickname"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Ảnh" name="avatar">
                                    <UploadImage
                                        onUpload={(url) =>
                                            setUserForm((prev) => ({ ...prev, avatar: url }))
                                        }
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                    <TableForm
                        columns={[
                            { title: 'ID', dataIndex: '_id', key: 'id' },
                            { title: 'Username', dataIndex: 'username', key: 'username' },
                            { title: 'Email', dataIndex: 'email', key: 'email' },
                            { title: 'Name', dataIndex: 'name', key: 'name' },
                            { title: 'Nickname', dataIndex: 'nickname', key: 'nickname' },
                            { title: 'Address', dataIndex: 'address', key: 'address' },
                            {
                                title: 'Articles',
                                dataIndex: 'articles',
                                key: 'articles',
                                render: (articles) => articles.length,
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
                                            onClick={() => openEditModal(record)}
                                        />
                                        <DeleteOutlined
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            onClick={() => handleDelete(record._id)}
                                        />
                                    </>
                                ),
                            },
                        ]}
                        dataSource={userList?.map((user) => ({ ...user, key: user._id }))}
                    />
                    <Drawer
                        title="Chỉnh sửa thể loại"
                        onClose={() => setIsModalEditOpen(false)}
                        open={isModalEditOpen}
                        extra={
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => handleUpdateUser(selectedUserId)}
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
                                label="Email"
                                name="email"
                                initialValue={userForm.email}
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            >
                                <Input
                                    name="email"
                                    value={userForm.email}
                                    placeholder="Điền email"
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Username"
                                name="username"
                                initialValue={userForm.username}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên người dùng!' },
                                ]}
                            >
                                <Input
                                    name="username"
                                    value={userForm.username}
                                    placeholder="Điền tên tài khoản"
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                initialValue={userForm.password}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password
                                    name="password"
                                    placeholder="Điền mật khẩu"
                                    value={userForm.password}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Address"
                                name="address"
                                initialValue={userForm.address}
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input
                                    name="address"
                                    placeholder="Điền địa chỉ"
                                    value={userForm.address}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Name"
                                name="name"
                                initialValue={userForm.name}
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            >
                                <Input
                                    name="name"
                                    placeholder="Điền họ và tên"
                                    value={userForm.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nickname"
                                name="nickname"
                                initialValue={userForm.nickname}
                                rules={[{ required: true, message: 'Vui lòng nhập Nickname' }]}
                            >
                                <Input
                                    name="nickname"
                                    placeholder="Điền Nickname"
                                    value={userForm.nickname}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item initialValue={userForm.avatar} label="Ảnh" name="avatar">
                                <UploadImage
                                    onUpload={(url) =>
                                        setUserForm((prev) => ({ ...prev, avatar: url }))
                                    }
                                />
                            </Form.Item>
                        </Form>
                    </Drawer>
                </>
            )}
        </>
    );
}

export default UserMange;
