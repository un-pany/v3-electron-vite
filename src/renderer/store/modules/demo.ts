// demo

export interface DemoState {
    name: string
    age: number
}

const getDefaultState: () => DemoState = () => {
    const raw: DemoState = {
        name: 'zhangsan',
        age: 18
    }
    return raw
}

const state: DemoState = getDefaultState()

const mutations = {
    RESET_STATE: (state: DemoState) => {
        Object.assign(state, getDefaultState())
    },
    SET_NAME: (state: DemoState, name: string) => {
        state.name = name
    },
    SET_AGE: (state: DemoState, age: number) => {
        state.age = age
    }
}

const actions = {
    reset({ commit }: any) {
        commit('RESET_STATE')
    },
    setName({ commit }: any, name: string) {
        commit('SET_NAME', name)
    },
    setAge({ commit }: any, age: number) {
        commit('SET_AGE', age)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
