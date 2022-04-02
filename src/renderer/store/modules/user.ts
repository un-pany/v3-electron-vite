import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'user', // id必填，且需要唯一
    state: () => {
        return {
            name: '张三',
            age: 20,
            gender: '男'
        }
    },
    getters: {
        fullname: (state) => state.name
    },
    actions: {
        update(name: string) {
            this.name = name
        }
    },
    persist: {
        // 数据缓存
        // 默认存在 sessionStorage 里，并且会以 store 的 id 作为 key
        // 默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化
        enabled: true,
        strategies: [
            {
                key: 'user-key',
                storage: localStorage,
                paths: ['name', 'age']
            }
        ]
    }
})
