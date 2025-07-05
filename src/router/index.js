import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
    {
        path: '/',
        component: () => import('@/App.vue'), // 主布局作为父组件
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/albums'
            },
            {
                path: '/albums',
                name: 'Albums',
                component: () => import('@/views/album/Albums.vue')
            },
            {
                path: '/album/:albumId',
                name: 'AlbumView',
                component: () => import('@/views/album/AlbumView.vue'),
                props: true,
                meta: { requiresAuth: true }
            },
            {
                path: '/album/create',
                name: 'CreateAlbum',
                component: () => import('@/views/album/CreateAlbum.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/shared',
                name: 'SharedAlbums',
                component: () => import('@/views/shared/SharedAlbums.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('@/views/profile/Profile.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { guestOnly: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    await store.dispatch('user/initialize')

    const isAuthenticated = store.getters['user/isAuthenticated']
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)

    if (requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (guestOnly && isAuthenticated) {
        next('/albums')
    } else {
        next()
    }
})

export default router