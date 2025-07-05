import { createRouter, createWebHistory } from 'vue-router'
import Albums from '../views/Albums.vue'
import AlbumView from '../views/AlbumView.vue'
import CreateAlbum from '../views/CreateAlbum.vue'
import EditAlbum from '../views/EditAlbum.vue'
import SharedAlbums from '../views/SharedAlbums.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import store from '../store/store.js'  // 确保路径正确

const routes = [
    {
        path: '/',
        redirect: '/albums',
        meta: { requiresAuth: true } // 添加认证要求
    },
    {
        path: '/albums',
        component: Albums,
        meta: { requiresAuth: true }
    },
    {
        path: '/album/:albumId',
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
        path: '/album/edit/:albumId',
        component: EditAlbum,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/shared',
        component: SharedAlbums,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        component: Login,
        meta: { guestOnly: true }
    },
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

// 添加详细的日志记录
router.beforeEach(async (to, from, next) => {
    //console.log(`路由守卫启动: 从 ${from.path} 到 ${to.path}`)

    try {
        //console.log("等待 store 初始化...")
        await store.dispatch('initialize')
        console.log("store 初始化完成")
    } catch (e) {
        console.error("store 初始化失败:", e)
        return next(false)
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)
    const isAuthenticated = store.getters.isAuthenticated

    //console.log(`认证状态: ${isAuthenticated}, 需要认证: ${requiresAuth}, 仅游客: ${guestOnly}`)

    if (requiresAuth && !isAuthenticated) {
        //console.log("需要认证但未登录，重定向到登录页")
        next('/login')
    } else if (guestOnly && isAuthenticated) {
        //console.log("已登录但访问登录页，重定向到相册页")
        next('/albums')
    } else {
        //console.log("允许访问")
        next()
    }
})

export default router