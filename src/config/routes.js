const routes = {
    // public route
    home: '/',
    health: '/health',
    genre: '/genre/:id',
    add_article: '/add-article',
    article_detail: '/article_detail/:id',
    profile: '/profile',

    // Private route
    user: '/',
    articles: '/articles',
    genres: '/genres',
    writer: '/writer',
};

export default routes;
