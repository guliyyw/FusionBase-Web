import userApi from '@/api/user'

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
            const response = await userApi.login(credentials)
            const token = response.data.data
            commit('SET_TOKEN', token)
            await dispatch('fetchUser')
        },
        async register({ commit, dispatch }, credentials) {
            await userApi.register(credentials)
            await dispatch('login', {
                email: credentials.email,
                password: credentials.password
            })
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