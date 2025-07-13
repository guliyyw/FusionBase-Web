import albumApi from '@/api/album'
import mediaApi from '@/api/media.js'

export default {
    namespaced: true,
    state: () => ({
        albums: [],
        sharedAlbums: [],
        currentAlbumMedia: []
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
        },
        SET_CURRENT_ALBUM_MEDIA(state, mediaList) {
            state.currentAlbumMedia = mediaList;
        },
        ADD_MEDIA(state, media) {
            if (!Array.isArray(state.currentAlbumMedia)) {
                state.currentAlbumMedia = [];
            }
            if (!isNaN(media.code)) {
                return
            }
            state.currentAlbumMedia.unshift(media);
            state.albums = state.albums.map(album => {
                if (album.albumId === media.albumId) {
                    return { ...album, mediaCount: album.mediaCount + 1 };
                }
                return album;
            });
        },
        REMOVE_MEDIA(state, { mediaId, albumId }) {
            state.currentAlbumMedia = state.currentAlbumMedia.filter(m => m.mediaId !== mediaId);
            state.albums = state.albums.map(album => {
                if (album.albumId === albumId) {
                    return { ...album, mediaCount: album.mediaCount - 1 };
                }
                return album;
            });
        }
    },
    actions: {
        async fetchAlbums({ commit }) {
            const response = await albumApi.getAlbumList()
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
        },
        async fetchAlbumMedia({ commit }, albumId) {
            const response = await mediaApi.getAlbumMedia(albumId);
            commit('SET_CURRENT_ALBUM_MEDIA', response.data);
            return response;
        },

        async uploadMedia({ commit }, { albumId, file }) {
            const response = await mediaApi.uploadMedia(albumId, file);
            commit('ADD_MEDIA', response.data);
            return response;
        },

        async deleteMedia({ commit }, { mediaId, albumId }) {
            await mediaApi.deleteMedia(mediaId);
            commit('REMOVE_MEDIA', { mediaId, albumId });
        },

        async downloadMedia(_, mediaId) {
            return mediaApi.downloadMedia(mediaId);
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