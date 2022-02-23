import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'http',
    state: () => {
        return {
            cache: new Map() //
        }
    },
    getters: {},
    actions: {}
})
