<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-button>Button</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
