import userApi from '@/api/user'
import {useToast} from 'vue-toast-notification'

const toast = useToast()

export default {
    namespaced: true,
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        initialized: false
    }),
    mutations: {
        SET_USER(state, user) {
            state.user = user
        },
        SET_TOKEN(state, token) {
            state.token = token
            localStorage.setItem('token', token)
        },
        CLEAR_AUTH(state) {
            state.user = null
            state.token = null
            localStorage.removeItem('token')
        },
        SET_INITIALIZED(state) {
            state.initialized = true
        }
    },
    actions: {
        async initialize({ commit, state, dispatch }) {
            if (state.initialized) return

            const token = localStorage.getItem('token')
            if (token) {
                commit('SET_TOKEN', token)
                try {
                    await dispatch('fetchUser')
                } catch (error) {
                    commit('CLEAR_AUTH')
                }
            }
            commit('SET_INITIALIZED')
        },
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await userApi.login(credentials);
                if (response.data.code === 200) {
                    const token = response.data.data;
                    commit('SET_TOKEN', token);
                    await dispatch('fetchUser');
                    toast.success('登录成功');
                    return { success: true };
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                const message = error.response.data.message || '登录失败，请检查凭据';
                toast.error(message);
                return { success: false, message };
            }
        },

        async register({ commit, dispatch }, credentials) {
            try {
                const response = await userApi.register(credentials);
                if (response.data.code === 200) {
                    toast.success('注册成功');
                    return await dispatch('login', {
                        email: credentials.email,
                        password: credentials.password
                    });
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                const message = error.response?.data?.message || '注册失败，邮箱可能已被使用';
                toast.error(message);
                return { success: false, message };
            }
        },
        async fetchUser({ commit }) {
            const response = await userApi.getUserInfo()
            commit('SET_USER', response.data.data)
        },
        async updateUserInfo({ commit }, userData) {
            const response = await userApi.updateUserInfo(userData)
            commit('SET_USER', response.data.data)
        },
        logout({ commit }) {
            commit('CLEAR_AUTH')
        }
    },
    getters: {
        isAuthenticated: state => !!state.token,
        currentUser: state => state.user,
        initialized: state => state.initialized
    }
}