import classNames from 'classnames/bind';
import styles from './TableForm.module.scss';
import { Table } from 'antd';

const cx = classNames.bind(styles);

function TableForm({ dataSource, columns, pagination }) {
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={pagination}
            scroll={{ y: '100vh' }}
        />
    );
}

export default TableForm;
