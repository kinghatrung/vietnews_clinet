import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import styles from './SubHeader.module.scss';
import { startLoading, stopLoading } from '~/redux/loadingSlice';

const cx = classNames.bind(styles);

function SubHeader() {
    const [genres, setGenres] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(startLoading());
            try {
                const res = await axios.get('http://localhost:8080/api/genre');
                setGenres(res.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
            dispatch(stopLoading());
        };

        fetchData();
    }, []);

    return (
        <nav className={cx('subnav')}>
            <ul className={cx('list')}>
                {genres.map((genre) => (
                    <li key={genre._id} className={cx('item-link')}>
                        <NavLink
                            to={`/genre/${genre._id}`}
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            {genre.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default SubHeader;
