<template>
  <div class="hello">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-tabs type="card" v-model="activeTab">
          <el-tab-pane label="缩短网址" name="first">
            <!-- 阻止表单默认行为：回车刷新 -->
            <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent>
              <el-form-item prop="url_long">
                <!-- 绑定输入框回车事件 -->
                <el-input v-model="form.url_long" placeholder="请输入长链接，例如：https://www.baidu.com" clearable @keyup.enter.native="shortenURL">
                  <el-button type="primary" slot="append" @click="shortenURL">缩短网址</el-button>
                </el-input>
              </el-form-item>
            </el-form>
            <!-- 单元格点击复制 -->
            <el-table :data="urls" @cell-click="handleCellClick">
              <el-table-column prop="url_short" label="短网址">
              </el-table-column>
              <el-table-column width="180">
                <template slot-scope="scope">
                  <el-button size="small" type="primary" icon="el-icon-document-copy"
                    @click="handleCopy(scope.$index, scope.row, $event)">复制</el-button>
                  <el-button size="small" icon="el-icon-s-promotion"
                    @click="handleOpen(scope.$index, scope.row)">打开</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="还原网址" name="second">
            再等等
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import clipboard from '@/utils/clipboard'
export default {
  name: 'HelloWorld',
  data() {
    return {
      activeTab: 'first',
      form: {
        url_long: '',
      },
      rules: {
        url_long: [
          { type: 'url', required: true, message: '请输入有效的长链接', trigger: 'blur' }
        ],
      },
      urls: [],
    }
  },
  methods: {
    handleCopy(index, row, event) {
      // console.log(index, row, event)
      let url = row.url_short
      clipboard(url, event)
      // event.preventDefault()
    },
    handleOpen(index, row) {
      let url = row.url_short
      window.open(url, '_blank')
    },
    handleCellClick(row, column, cell, event) {
      if (column.property == 'url_short') {
        let url = row.url_short
        clipboard(url, event)
      }
    },
    shortenURL() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.ajaxShortenURL()
        }
      })
    },
    // ajax 使用 jsonp 方式请求数据，支持跨域
    ajaxShortenURL() {
      $.getJSON('/weibo-api2/short_url/shorten.json?callback=?', {
        'source': 560331235,
        'url_long': this.form.url_long
      })
        .done((response) => {
          let resp = response.data
          if (resp.urls) {
            this.urls = resp.urls
          } else {
            // code == 1, jsonp 有两层, 内层有服务器返回的真正原因, 用正则表达式匹配出来
            // try{jQuery34104005386049708404_1569573108273({"code":1,"data":"try{jQuery34104005386049708404_1569573108273({\"code\":0,\"data\":{\"error\":\"Error: Link Forbidden!\",\"error_code\":21506,\"request\":\"\/2\/sinaurl\/public\/shorten.json\"}});}catch(e){}"});}catch(e){}
            let reg = /^.*\((\{.*?\}\})\).*$/
            let matches = resp.match(reg)
            if(matches){
              resp = JSON.parse(matches[1])
              resp = resp.data
              this.$notify.error({
                title: resp.error_code,
                message: resp.error
              });
            }
          }
        })
        .fail((jqxhr, textStatus, error) => {
          // status code not 2xx
          this.$notify.error({
              title: '错误',
              message: error
            });
        })
    },
    // axios 不支持 jsonp，跨域实现需要在服务端设置
    axiosShortenURL() {
      axios.get('/weibo-api2/short_url/shorten.json', {
        params: {
          'source': 560331235,
          'url_long': this.form.url_long
        }
      })
        .then(response => {
          let resp = response.data
          if (resp.urls) {
            this.urls = resp.urls
          }
        })
        .catch(error => {
          // status code not 2xx
          if (error.response) {
            let resp = error.response.data
            this.$notify.error({
              title: resp.error_code,
              message: resp.error
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: error.message
            });
          }
        })
    }
  }
}
</script>
