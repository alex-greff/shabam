import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home/Home.vue';
import Search from "../views/Search/Search.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: "/search",
        name: "Search",
        component: Search
    },
    {
        path: '/catalog',
        name: 'Catalog',
        component: () => import(/* webpackChunkName: "catalog" */ '../views/Catalog/Catalog.vue')
    },
    {
        path: "/account/:id",
        name: "Account",
        component: () => import(/* webpackChunkName: "account" */ '../views/Account/Account.vue')
    }, 
    {
        path: "/account/:id/search-history",
        name: "AccountSearchHistory",
        component: () => import(/* webpackChunkName: "account-search-history" */ '../views/AccountSearchHistory/AccountSearchHistory.vue')
    },
    {
        path: "/account/:id/catalog",
        name: "AccountCatalog",
        component: () => import(/* webpackChunkName: "account-catalog" */ '../views/AccountCatalog/AccountCatalog.vue')
    },
    {
        path: "/signin",
        name: "Signin",
        component: () => import(/* webpackChunkName: "signin" */ '../views/Signin/Signin.vue')
    },
    {
        path: "/signup",
        name: "Signup",
        component: () => import(/* webpackChunkName: "signup" */ '../views/Signup/Signup.vue')
    },
    {
        path: "*",
        name: "PageNotFound",
        component: () => import(/* webpackChunkName: "page-not-found" */ '../views/PageNotFound/PageNotFound.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
