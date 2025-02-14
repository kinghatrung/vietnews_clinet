import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './UploadImage.module.scss';

const cx = classNames.bind(styles);

function UploadImage({ onUpload }) {
    const handleUpload = async ({ file }) => {
        if (file.size > 2 * 1024 * 1024) {
            message.error('Ảnh quá lớn! Chọn ảnh nhỏ hơn 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            onUpload(reader.result);
            message.success('Ảnh đã được tải lên thành công');
        };
        reader.onerror = () => {
            message.error('Lỗi khi đọc ảnh');
        };
    };

    return (
        <Upload customRequest={handleUpload} listType="picture" accept=".png,.jpg,.jpeg">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
    );
}

export default UploadImage;
