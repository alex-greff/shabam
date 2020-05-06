import React, { Suspense, lazy, FunctionComponent } from "react";
import { Switch, Route } from "react-router-dom";
import { BaseProps, AppLocationState } from "@/types";
import { Location } from "history";
import classnames from "classnames";

import HomeView from "@/views/Home/Home";
import SearchView from "@/views/Search/Search";
const CatalogView = lazy(() => import(/* webpackChunkName: "catalog" */ "@/views/Catalog/Catalog"));
const AccountView = lazy(() => import(/* webpackChunkName: "account" */ "@/views/Account/Account"));
const AccountSearchHistoryView = lazy(() => import(/* webpackChunkName: "account-search-history" */ "@/views/AccountSearchHistory/AccountSearchHistory"));
const AccountCatalogView = lazy(() => import(/* webpackChunkName: "account-catalog" */ "@/views/AccountCatalog/AccountCatalog"));
const SigninView = lazy(() => import(/* webpackChunkName: "signin" */ "@/views/Signin/Signin"));
const SignupView = lazy(() => import(/* webpackChunkName: "signup" */ "@/views/Signup/Signup"));
const PageNotFoundView = lazy(() => import(/* webpackChunkName: "page-not-found" */ "@/views/PageNotFound/PageNotFound"));

export interface Props extends BaseProps {
    navbarHeight: number;
    location: Location<AppLocationState>;
};

const RouteView: FunctionComponent<Props> = (props) => {
    const { location, navbarHeight } = props;

    return (
        <div className={classnames("RouteView", props.className)}>
            <Suspense fallback={null}>
                <Switch location={location}>
                    <Route exact path="/" component={() => <HomeView navbarHeight={navbarHeight} />}/>
                    <Route exact path="/search" component={() => <SearchView navbarHeight={navbarHeight} />} />
                    <Route exact path="/catalog" component={() => <CatalogView navbarHeight={navbarHeight} />} />
                    <Route exact path="/account/:id" component={() => <AccountView navbarHeight={navbarHeight} />} />
                    <Route exact path="/account/:id/search-history" component={() => <AccountSearchHistoryView navbarHeight={navbarHeight} />} />
                    <Route exact path="/account/:id/catalog" component={() => <AccountCatalogView navbarHeight={navbarHeight} />} />
                    <Route exact path="/signin" component={() => <SigninView navbarHeight={navbarHeight} />} />
                    <Route exact path="/signup" component={() => <SignupView navbarHeight={navbarHeight} />} />
                    <Route component={() => <PageNotFoundView navbarHeight={navbarHeight} />} />
                </Switch>
            </Suspense>
        </div>
    );
};

export default RouteView;