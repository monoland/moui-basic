import Vue from 'vue';
import VueRouter from 'vue-router';
import { StorageInstance } from '@plugins/storage';

Vue.use(VueRouter);

let routes = [];

/**
 * add landing page to routes
 */
routes.push({ 
    path: '/', 
    name: 'default-landing', 
    component: () => import(/* webpackChunkName: "monoland" */ '@monoland/landing') 
});

/**
 * scan and register routes
 */
const routemaps = require.context('@modules', true, /router\/index\.js$/);

routemaps.keys().forEach((path) => {
    let maps = routemaps(path).default;
    
    if (!Array.isArray(maps)) {
        routes.push(maps);
    } else {
        maps.forEach(route => {
            routes.push(route);
        });
    }
});

/**
 * add fallback page to routes
 */
routes.push({ 
    path: '*',
    name: 'default-fallback',  
    component: () => import(/* webpackChunkName: "monoland" */ '@monoland/fallback') 
});

/**
 * create new VueRouter
 */
const router = new VueRouter({
    base: '/',
	mode: process.env.VUE_APP_ROUTERMODE,
	routes,
});

/**
 * required-auth
 */
router.beforeEach((to, _from, next) => {
    if (to.matched.some((r) => r.meta.requiredAuth)) {
        if (!StorageInstance.authenticated) {
            next({ name: 'default-landing' });
        } else {
            next();
        }
    } else {
        if (to.name === 'default-landing' && StorageInstance.authenticated) {
            next({ name: process.env.VUE_APP_PAGE_DASHBOARD });
        } else {
            next();
        }
    }
});

export default router;