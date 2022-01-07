//

export interface UserState {
    name: string
    age: number
}

const getDefaultState: () => UserState = () => {
    const raw: UserState = {
        name: '',
        age: 18
    }
    return raw
}

const state: UserState = getDefaultState()

const mutations = {
    RESET_STATE: (state: UserState) => {
        Object.assign(state, getDefaultState())
    },
    SET_NAME: (state: UserState, name: string) => {
        state.name = name
    },
    SET_AGE: (state: UserState, age: number) => {
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
