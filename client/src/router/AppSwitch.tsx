import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

import HomeView from "@/views/Home/Home";
import SearchView from "@/views/Search/Search";
const CatalogView = lazy(() => import(/* webpackChunkName: "catalog" */ "@/views/Catalog/Catalog"));
const AccountView = lazy(() => import(/* webpackChunkName: "account" */ "@/views/Account/Account"));
const AccountSearchHistoryView = lazy(() => import(/* webpackChunkName: "account-search-history" */ "@/views/AccountSearchHistory/AccountSearchHistory"));
const AccountCatalogView = lazy(() => import(/* webpackChunkName: "account-catalog" */ "@/views/AccountCatalog/AccountCatalog"));
const SigninView = lazy(() => import(/* webpackChunkName: "signin" */ "@/views/Signin/Signin"));
const SignupView = lazy(() => import(/* webpackChunkName: "signup" */ "@/views/Signup/Signup"));
const PageNotFoundView = lazy(() => import(/* webpackChunkName: "page-not-found" */ "@/views/PageNotFound/PageNotFound"));

const AppSwitch = () => (
    // TODO: make an actual loading component
    <Suspense fallback={<div>Loading...</div>}>
        <Switch>
            <Route exact path="/" component={HomeView} />
            <Route path="/search" component={SearchView} />
            <Route path="/catalog" component={CatalogView} />
            <Route path="/account/:id" component={AccountView} />
            <Route path="/account/:id/search-history" component={AccountSearchHistoryView} />
            <Route path="/account/:id/catalog" component={AccountCatalogView} />
            <Route path="/signin" component={SigninView} />
            <Route path="/signup" component={SignupView} />
            <Route component={PageNotFoundView} />
        </Switch>
    </Suspense>
);

export default AppSwitch;