<template>
  <div class="hello">
    <el-input v-model="input" placeholder="请输入内容" clearable style="width:50%"></el-input>
    <p>{{value}}</p>
    <el-button @click="convert">Button</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data() {
    return {
      input: '',
      value: ''
    }
  },
  methods: {
    convert() {
      var url = 'https://api.weibo.com/2/short_url/shorten.json?source=560331235&url_long=' + this.input
      console.log(url)
      axios.get(url)
        .then(resp => {
          // console.log(resp)
          this.value = resp
        })
        .catch(error => {
          // console.log(resp)
          alert(error)
        })
    }
  }
}
</script>
