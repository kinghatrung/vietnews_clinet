import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('text-white py-4 mt-auto', 'footer')}>
            <div></div>
            <div className={cx('container')}>
                <div className={cx('row')}>
                    <div className={cx('col-md-4 mb-3 mb-md-0')}>
                        <h3 className={cx('h5 mb-3')}>Về chúng tôi</h3>
                        <p>
                            Thuộc Bộ Khoa học và Công nghệ Số giấy phép: 548/GP-BTTTT do Bộ Thông
                            tin và Truyền thông cấp ngày 24/08/2021
                        </p>
                    </div>
                    <div className={cx('col-md-4 mb-3 mb-md-0')}>
                        <h3 className={cx('h5 mb-3')}>Liên hệ</h3>
                        <p>Email: webmaster@vietnews.net</p>
                        <p>Điện thoại: 0933 222 8821 - máy lẻ 4500</p>
                    </div>
                    <div className={cx('col-md-4')}>
                        <h3 className={cx('h5 mb-3')}>Theo dõi</h3>
                        <div className={cx('d-flex gap-3')}>
                            <Link href="#" className={cx('text-white')}>
                                Facebook
                            </Link>
                            <Link href="#" className={cx('text-white')}>
                                Twitter
                            </Link>
                            <Link href="#" className={cx('text-white')}>
                                Instagram
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className={cx('my-4')} />
                <div className={cx('text-center')}>
                    <p className={cx('mb-0')}>&copy; 2025 Toàn bộ bản quyền thuộc VietNews</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
