export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    avator: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    setAvator (state, path) {
      state.avator = path
    }
  }
}
