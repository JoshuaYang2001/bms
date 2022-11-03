<template>
  <div>
    <!--  面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightList" border>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName" ></el-table-column>
          <el-table-column label="路径" prop="path" ></el-table-column>
          <el-table-column label="权限等级" prop="level" >
<!--            利用插槽展示展示不同的内容-->
            <template v-slot="scope" >
              <el-tag v-if="scope.row.level === '0'" type="info">标签一</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">标签二</el-tag>
              <el-tag type="warning" v-else>标签三</el-tag>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "right",
  data(){
    return {
      rightList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
   async getRightList() {
     const {data:res} = await this.$http.get('rights/list')
     if (res.meta.status !== 200) {
       return this.$message.error('获取列表失败')
     } else {
       this.rightList = res.data
       console.log(this.rightList)
       this.$message.success('获取列表成功')
     }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
