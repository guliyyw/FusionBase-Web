import { createRouter, createWebHistory } from 'vue-router'
import Albums from '../views/Albums.vue'
import AlbumView from '../views/AlbumView.vue'
import CreateAlbum from '../views/CreateAlbum.vue'
import EditAlbum from '../views/EditAlbum.vue'
import SharedAlbums from '../views/SharedAlbums.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import store from '../index.js'

const routes = [
    { path: '/', redirect: '/albums' },
    {
        path: '/albums',
        component: Albums,
        meta: { requiresAuth: true }
    },
    {
        path: '/album/:id',
        component: AlbumView,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/album/create',
        component: CreateAlbum,
        meta: { requiresAuth: true }
    },
    {
        path: '/album/edit/:id',
        component: EditAlbum,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/shared',
        component: SharedAlbums,
        meta: { requiresAuth: true }
    },
    { path: '/login', component: Login },
    { path: '/register', component: Login },
    {
        path: '/profile',
        component: Profile,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = store.state.token !== null

    if (requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router