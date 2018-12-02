// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import App from './components/MemoRoot'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

/*
var d = [
  {
    addDt: '2018/12/1 2:00:00',
    updDt: '2018/12/1 2:00:00',
    body: [
      {
        type: 1,
        val: 'data:image/png;base64,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'
      },
      {
        type: 0,
        val: '画像のキャプション'
      }
    ],
    children: [
      {
        addDt: '2018/12/1 2:00:00',
        updDt: '2018/12/1 2:00:00',
        body: [
          {
            type: 0,
            val: '入れ子'
          }
        ]
      }
    ]
  },
  {
    addDt: '2018/12/1 2:00:00',
    updDt: '2018/12/1 2:00:00',
    body: [
      {
        type: 0,
        val: '兄弟'
      }
    ]
  }
]
*/
