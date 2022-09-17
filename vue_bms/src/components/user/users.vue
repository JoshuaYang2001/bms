<template>
  <div>
    <!--  面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片-->
    <el-card>
      <!--    layout布局-->
      <el-row :gutter="30">
<!--        搜索框及按钮-->
        <el-col :span="7">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary">添加用户</el-button></el-col>
      </el-row>
      <!--   表单-->
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
    </el-card>


  </div>
</template>

<script>
export default {
  name: "user",
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0
    }

  },
  created() {
    this.getUserList()
  },
  methods:{
   async getUserList(){
     const {data:res} = await this.$http.get('users',{params:this.queryInfo})
     console.log(res)
     if(res.meta.status !== 200) {
       return this.$message.error('获取用户列表失败')
     }
     this.userList = res.data.users
     this.total = res.data.total
    }
  }
}
</script>

<style scoped>

</style>
