export default {
  state: {
    mode: 0
  },
  mutations: {
    toWriteMode: state => { state.mode = 0; },
    toTodoMode: state => { state.mode = 1; }
  }
}
