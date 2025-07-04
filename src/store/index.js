import { createStore } from 'vuex'
import albumApi from '@/api/album'
import userApi from '@/api/user'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    albums: [],
    sharedAlbums: []
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
      const index = state.albums.findIndex(a => a.albumId === updatedAlbum.albumId)
      if (index !== -1) {
        state.albums.splice(index, 1, updatedAlbum)
      }
    },
    REMOVE_ALBUM(state, albumId) {
      state.albums = state.albums.filter(a => a.albumId !== albumId)
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await userApi.login(credentials)
      commit('SET_TOKEN', response.data.data)
      const user = await userApi.getUserInfo()
      commit('SET_USER', user.data.data)
    },
    async register({ commit }, credentials) {
      const user = await userApi.register(credentials)
      commit('SET_USER', user.data.data)
    },
    async fetchUser({ commit }) {
      const user = await userApi.getUserInfo()
      commit('SET_USER', user.data.data)
    },
    async updateUserInfo({ commit }, userData) {
      const response = await userApi.updateUserInfo(userData)
      commit('SET_USER', response.data.data)
      return response
    },
    async fetchAlbums({ commit }) {
      const albums = await albumApi.getAlbumList()
      commit('SET_ALBUMS', albums.data.data)
    },
    async fetchSharedAlbums({ commit }) {
      const albums = await albumApi.getSharedAlbums()
      commit('SET_SHARED_ALBUMS', albums.data.data)
    },
    async createAlbum({ commit }, albumData) {
      const newAlbum = await albumApi.createAlbum(albumData)
      commit('ADD_ALBUM', newAlbum.data.data)
      return newAlbum
    },
    async updateAlbum({ commit }, { id, albumData }) {
      const updatedAlbum = await albumApi.updateAlbum(id, albumData)
      commit('UPDATE_ALBUM', updatedAlbum.data.data)
      return updatedAlbum
    },
    async deleteAlbum({ commit }, id) {
      await albumApi.deleteAlbum(id)
      commit('REMOVE_ALBUM', id)
    },
    async shareAlbum({ commit }, { id, shareData }) {
      await albumApi.shareAlbum(id, shareData)
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
    albumById: state => id => state.albums.find(a => a.albumId === id) ||
        state.sharedAlbums.find(a => a.albumId === id)
  }
})