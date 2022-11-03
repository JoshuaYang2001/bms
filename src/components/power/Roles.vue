<template>
  <div >
    <!--  面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--    角色列表区域-->
    <el-table  :data="roleList" border stripe>
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row :class="['bd-bottom','v-center',i1 === 0 ? 'bd-top' : '']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
            <el-col :span="5">
              <el-tag>
                {{item1.authName}}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row :class="['v-center',i2 === 0 ? '' : 'bd-top']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success">
                    {{item2.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable
                          @close="removeRightById(scope.row,item3.id)" > {{item3.authName}} </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button  type="danger" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" icon="el-icon-search">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const {data: res} = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取用户列表失败')
      } else {
        this.roleList = res.data
        this.$message.success('获取用户列表成功')
      }
      console.log(this.roleList)
    },
    async removeRightById(role,rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件,是否继续？','提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err=>err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      console.log('确认了删除')
      const { data : res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')

      await this.getRoleList()
    },
  }
  }
  // 删除用户权限

</script>

<style scoped lang="less">
      .el-tag {
        margin:  27px;
      }
      .bd-top {
        border-top: 1px solid  #eee ;
      }
      .bd-bottom {
        border-top: 1px solid  #eee ;
      }
      .v-center {
        display: flex;
        align-items: center;
      }
</style>
