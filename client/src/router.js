import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'
import DiagnosticRecorder from '@/views/DiagnosticRecorder.vue';
import DiagnosticUploader from '@/views/DiagnosticUploader.vue';

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/diagnostic-recorder',
            name: 'diagnosticRecorder',
            component: DiagnosticRecorder
        },
        {
            path: '/diagnostic-uploader',
            name: 'diagnosticUploader',
            component: DiagnosticUploader
        }
        // {
        //     path: '/about',
        //     name: 'about',
        //     // route level code-splitting
        //     // this generates a separate chunk (about.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        // }
    ]
})
