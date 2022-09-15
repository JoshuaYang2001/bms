<template>
  <div>
    <h1>这里是home</h1>
    <el-button @click="exit" type="info">exit</el-button>
  </div>


</template>

<script>
export default {
  name: 'home',
  methods:{
    // 登出操作
    exit(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
