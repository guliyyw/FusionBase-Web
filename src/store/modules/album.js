import albumApi from '@/api/album'

export default {
    namespaced: true,
    state: () => ({
        albums: [],
        sharedAlbums: []
    }),
    mutations: {
        SET_ALBUMS(state, albums) {
            state.albums = albums
        },
        SET_SHARED_ALBUMS(state, albums) {
            state.sharedAlbums = albums
        },
        ADD_ALBUM(state, album) {
            state.albums.push(album)
        },
        UPDATE_ALBUM(state, { albumId, data }) {
            const index = state.albums.findIndex(a => a.albumId === albumId);
            if (index !== -1) {
                state.albums[index] = {
                    ...state.albums[index], // 保留原有属性
                    ...data // 用更新的数据覆盖原有属性
                };
            }
        },
        REMOVE_ALBUM(state, albumId) {
            state.albums = state.albums.filter(a => a.albumId !== albumId)
        }
    },
    actions: {
        async fetchAlbums({ commit }) {
            const response = await albumApi.getAlbumList()
            console.log(response)
            commit('SET_ALBUMS', response.data.data)
        },
        async fetchSharedAlbums({ commit }) {
            const response = await albumApi.getSharedAlbums()
            commit('SET_SHARED_ALBUMS', response.data.data)
        },
        async createAlbum({ commit }, albumData) {
            const response = await albumApi.createAlbum(albumData)
            commit('ADD_ALBUM', response.data.data)
            return response
        },
        async updateAlbum({ commit }, { albumId, data }) {
            console.log(albumId)
            const response = await albumApi.updateAlbum(albumId, data)
            commit('UPDATE_ALBUM', { albumId, data: response.data.data });
            return response
        },
        async deleteAlbum({ commit }, albumId) {
            await albumApi.deleteAlbum(albumId)
            commit('REMOVE_ALBUM', albumId)
        },
        async shareAlbum({ commit }, { albumId, shareData }) {
            await albumApi.shareAlbum(albumId, shareData)
        }
    },
    getters: {
        userAlbums: state => state.albums,
        sharedAlbums: state => state.sharedAlbums,
        albumById: state => albumId =>
            state.albums.find(a => a.albumId === albumId) ||
            state.sharedAlbums.find(a => a.albumId === albumId)
    }
}