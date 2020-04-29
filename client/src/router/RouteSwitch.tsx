import React, { Suspense, lazy, FunctionComponent } from "react";
import { Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { BaseProps } from "@/types/baseProps";
import { Location } from "history";

import HomeView from "@/views/Home/Home";
import SearchView from "@/views/Search/Search";
// import CatalogView from "@/views/Catalog/Catalog";
const CatalogView = lazy(() => import(/* webpackChunkName: "catalog" */ "@/views/Catalog/Catalog"));
const AccountView = lazy(() => import(/* webpackChunkName: "account" */ "@/views/Account/Account"));
const AccountSearchHistoryView = lazy(() => import(/* webpackChunkName: "account-search-history" */ "@/views/AccountSearchHistory/AccountSearchHistory"));
const AccountCatalogView = lazy(() => import(/* webpackChunkName: "account-catalog" */ "@/views/AccountCatalog/AccountCatalog"));
const SigninView = lazy(() => import(/* webpackChunkName: "signin" */ "@/views/Signin/Signin"));
const SignupView = lazy(() => import(/* webpackChunkName: "signup" */ "@/views/Signup/Signup"));
const PageNotFoundView = lazy(() => import(/* webpackChunkName: "page-not-found" */ "@/views/PageNotFound/PageNotFound"));

export interface Props extends BaseProps {
    location: Location;
};

// const routes = [
//     { path: "/", name: "Home", Component: HomeView },
//     { path: "/search", name: "Search", Component: SearchView },
//     { path: "/catalog", name: "Catalog", Component: CatalogView },
//     { path: "/account/:id", name: "Account", Component: AccountView },
//     { path: "/account/:id/search-history", name: "AccountSearchHistory", Component: AccountSearchHistoryView },
//     { path: "/account/:id/catalog", name: "AccountCatalog", Component: AccountCatalogView },
//     { path: "/signin", name: "Signin", Component: SigninView },
//     { path: "/signup", name: "Signup", Component: SignupView },
//     // { name: "PageNotFound", Component: PageNotFoundView }
// ];

const RouteSwitch: FunctionComponent<Props> = (props) => {
    // return (
    //     <Suspense fallback={<div>Loading...</div>}>
    //         <div className="Container">
    //             {routes.map(({path, Component }) => (
    //                 <Route
    //                     key={path}
    //                     exact
    //                     path={path}
    //                 >
    //                     {({ match })=>(
    //                         <CSSTransition
    //                             in={match != null}
    //                             timeout={300}
    //                             classNames="page"
    //                             unmountOnExit
    //                         >
    //                             <div className="Page">
    //                                 <Component />
    //                             </div>
    //                         </CSSTransition>
    //                     )}
    //                 </Route>
    //             ))}
    //         </div>
    //     </Suspense>
    // );

    const { location } = props;

    return (
        <div>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Suspense fallback={null}>
                <Switch location={location}>
                    <Route exact path="/" component={HomeView} />
                    <Route exact path="/search" component={SearchView} />
                    <Route exact path="/catalog" component={CatalogView} />
                    <Route exact path="/account/:id" component={AccountView} />
                    <Route exact path="/account/:id/search-history" component={AccountSearchHistoryView} />
                    <Route exact path="/account/:id/catalog" component={AccountCatalogView} />
                    <Route exact path="/signin" component={SigninView} />
                    <Route exact path="/signup" component={SignupView} />
                    <Route component={PageNotFoundView} />
                </Switch>
            </Suspense>
        </div>
    );

    // TODO: make an actual loading component
    

    // return (
    //     <Route
    //         render={({ location }) => (
    //             <Suspense fallback={<div>Loading...</div>}>
    //                 <Switch>
    //                     <Route exact path="/" component={HomeView} />
    //                     <Route path="/search" component={SearchView} />
    //                     <Route path="/catalog" component={CatalogView} />
    //                     <Route path="/account/:id" component={AccountView} />
    //                     <Route path="/account/:id/search-history" component={AccountSearchHistoryView} />
    //                     <Route path="/account/:id/catalog" component={AccountCatalogView} />
    //                     <Route path="/signin" component={SigninView} />
    //                     <Route path="/signup" component={SignupView} />
    //                     <Route component={PageNotFoundView} />
    //                 </Switch>
    //             </Suspense>
    //         )}
    //     />
    // );
};

export default RouteSwitch;