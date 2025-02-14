import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Flex } from 'antd';

import styles from './ListArticle.module.scss';
import ArticleRelated from './ArticleRelated';

const cx = classNames.bind(styles);

function ListArticle({ articles, id }) {
    return (
        <div className={cx('article-relate')}>
            <h5 className={cx('fw-semibold mb-3')}>Cùng thể loại</h5>
            {articles.genres?.map((genre) => (
                <ArticleRelated key={genre._id} id={id} genre={genre} {...genre} />
            ))}
        </div>
    );
}

export default ListArticle;
