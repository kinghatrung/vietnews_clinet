import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FloatButton } from 'antd';

import styles from './DefaultLayout.module.scss';
import Header from '~/layouts/DefaultLayout/components/Header';
import Footer from '~/layouts/DefaultLayout/components/Footer';
import TopBar from '~/layouts/DefaultLayout/components/Header/TopBar';
import SubHeader from '~/layouts/DefaultLayout/components/Header/SubHeader';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <TopBar />
            <Header />
            <SubHeader />
            <section className={cx('mb-4')}>
                <div className={cx('content')}>{children}</div>
            </section>
            <Footer />
            <FloatButton.BackTop />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
