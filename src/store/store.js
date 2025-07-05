import { createStore } from 'vuex'
import albumApi from '@/api/album'
import userApi from '@/api/user'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    albums: [],
    sharedAlbums: [],
    initialized: false // 添加初始化标志
  },
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
    SET_ALBUMS(state, albums) {
      state.albums = albums
    },
    SET_SHARED_ALBUMS(state, albums) {
      state.sharedAlbums = albums
    },
    ADD_ALBUM(state, album) {
      state.albums.push(album)
    },
    UPDATE_ALBUM(state, updatedAlbum) {
      const index = state.albums.findIndex(a => a.albumId === updatedAlbum.albumId)  // 修改字段名
      if (index !== -1) {
        state.albums[index] = updatedAlbum
      }
    },
    REMOVE_ALBUM(state, albumId) {  // 修改参数名
      state.albums = state.albums.filter(a => a.albumId !== albumId)  // 修改字段名
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
          console.log("用户信息初始化成功")
        } catch (error) {
          console.error('初始化用户信息失败', error)
          commit('CLEAR_AUTH')
        }
      }
      commit('SET_INITIALIZED')
    },
    async login({ commit, dispatch }, credentials) {
      const response = await userApi.login(credentials)

      const token = response.data.data
      if (typeof token !== 'string') {
        throw new Error('无效的认证令牌格式')
      }
      console.log("token:",token)
      commit('SET_TOKEN', token)
      await dispatch('fetchUser')
    },
    async register({ commit, dispatch }, credentials) {
      await userApi.register(credentials)
      // 注册成功后自动登录
      await dispatch('login', {
        email: credentials.email,
        password: credentials.password
      })
    },
    async fetchUser({ commit }) {
      try {
        console.log("获取用户信息")
        const response = await userApi.getUserInfo()
        console.log("获取用户信息",response)
        // 确保正确获取用户对象
        if (response.data.data && typeof response.data.data === 'object') {
          commit('SET_USER', response.data.data)
        } else {
          throw new Error('无效的用户数据格式')
        }
      } catch (error) {
        console.error('获取用户信息失败', error)
        commit('CLEAR_AUTH')
        throw error
      }
    },
    async updateUserInfo({ commit }, userData) {
      const response = await userApi.updateUserInfo(userData)
      commit('SET_USER', response.data.data)
      return response
    },
    async fetchAlbums({ commit }) {
      try {
        const response = await albumApi.getAlbumList()
        console.log(response.data.data)
        commit('SET_ALBUMS', response.data.data)
      } catch (error) {
        console.error('获取相册列表失败', error)
      }
    },
    async fetchSharedAlbums({ commit }) {
      const albums = await albumApi.getSharedAlbums()
      commit('SET_SHARED_ALBUMS', albums.data.data)
    },
    async createAlbum({ commit }, albumData) {
      try {
        const response = await albumApi.createAlbum(albumData)
        // 创建成功后重新获取列表
        return response
      } catch (error) {
        console.error('创建相册失败', error)
        throw error
      }
    },
    async updateAlbum({ commit }, payload) {
      try {
        const { albumId, data } = payload;  // 修改参数名
        const response = await albumApi.updateAlbum(albumId, data)
        commit('UPDATE_ALBUM', response.data)
        return response
      } catch (error) {
        console.error('更新相册失败', error)
        throw error
      }
    },
    async deleteAlbum({ commit }, albumId) {  // 修改参数名
      await albumApi.deleteAlbum(albumId)
      commit('REMOVE_ALBUM', albumId)
    },
    async shareAlbum({ commit }, { albumId, shareData }) {
      await albumApi.shareAlbum(albumId, shareData)
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    userAlbums: state => state.albums,
    sharedAlbums: state => state.sharedAlbums,
    albumById: state => albumId =>
        state.albums.find(a => a.albumId === albumId) ||  // 修改字段名
        state.sharedAlbums.find(a => a.albumId === albumId),  // 修改字段名
    initialized: state => state.initialized
  }
})