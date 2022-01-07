import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user, { UserState } from './modules/user'
import demo, { DemoState } from './modules/demo'

interface RootState {
    demo: DemoState
    user: UserState
}

export const store = createStore<RootState>({
    modules: { demo, user },
    plugins: [createPersistedState()], // 持久化数据，默认存储到localStorage
    strict: process.env.NODE_ENV !== 'production'
})
