import config from '~/config';

// Pages
import DetailArticle from '~/components/DetailArticle';
// Public Page
import Home from '~/pages/PublicPages/Home';
import AddArticle from '~/pages/PublicPages/AddArticle';
import Genre from '~/pages/PublicPages/Genre';
import Profile from '~/pages/PublicPages/Profile';
// Private Page
import UserMange from '~/pages/PrivatePages/UserMange';
import ArticlesMange from '~/pages/PrivatePages/ArticlesMange';
import GenresMange from '~/pages/PrivatePages/GenresMange';

// Public routes
const publicRouters = [
    { path: config.routes.home, component: Home },
    { path: config.routes.add_article, component: AddArticle },
    { path: config.routes.genre, component: Genre },
    { path: config.routes.article_detail, component: DetailArticle },
    { path: config.routes.profile, component: Profile },
];

// Private routes
const privateRouters = [
    { path: config.routes.user, component: UserMange },
    { path: config.routes.articles, component: ArticlesMange },
    { path: config.routes.genres, component: GenresMange },
];

export { publicRouters, privateRouters };
