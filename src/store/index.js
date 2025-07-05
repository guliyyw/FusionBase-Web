import { createStore } from 'vuex'
import user from './modules/user'
import album from './modules/album'

export default createStore({
    modules: {
        user,
        album
    }
})