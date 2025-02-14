import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { publicRouters, privateRouters } from '~/routes';
import DefaultLayout from '~/layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';
import Loading from '~/components/Loading';

function App() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const isLoading = useSelector((state) => state.auth.login.isLoading);

    return (
        <Router>
            <div className="App">
                {isLoading && <Loading fullscreen />}
                <Routes>
                    {user?.isAdmin
                        ? privateRouters.map((route, index) => {
                              const Page = route.component;

                              let LayoutPrivate = AdminLayout;

                              if (route.layout) {
                                  LayoutPrivate = route.layout;
                              } else if (route.layout === null) {
                                  LayoutPrivate = Fragment;
                              }

                              return (
                                  <Route
                                      key={index}
                                      path={route.path}
                                      element={
                                          <LayoutPrivate>
                                              <Page />
                                          </LayoutPrivate>
                                      }
                                  />
                              );
                          })
                        : publicRouters.map((route, index) => {
                              const Page = route.component;

                              let LayoutPublic = DefaultLayout;

                              if (route.layout) {
                                  LayoutPublic = route.layout;
                              } else if (route.layout === null) {
                                  LayoutPublic = Fragment;
                              }

                              return (
                                  <Route
                                      key={index}
                                      path={route.path}
                                      element={
                                          <LayoutPublic>
                                              <Page />
                                          </LayoutPublic>
                                      }
                                  />
                              );
                          })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
