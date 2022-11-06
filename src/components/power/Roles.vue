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
<!--        通过  scope 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。-->
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
                  <el-tag type="success" v-for="(item2,i2) in item1.children" :key="item2.id" closable
                          @close="removeRightById(scope.row,item2.id)">
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
          <el-button type="warning" icon="el-icon-search" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
<!--    分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      @close="SetRightDialogClosed"
     >
<!--      树形控件-->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        >
      </el-tree>
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      rightList:[],
      // 树形组件对象属性
      treeProps:{
        label:"authName",
        children:'children'
      },
      defKeys:[]
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

      // await this.getRoleList()  不需要重新再刷一遍拿角色列表了,直接更新指定行就可以
      role.children = res.data
    },
    async showSetRightDialog(role){
      // 获取所有权限列表
       const{ data :res } = await this.$http.get('rights/tree')
        this.dialogVisible = true
      if ( res.meta.status !== 200 ) {
      return this.$message.error('获取权限列表失败!')
      }
      else {
        this.rightList = res.data
        this.getLeafKeys(role,this.defKeys)
        this.$message.success('获取列表权限成功!')
        console.log(this.rightList)
      }
     },
    // 拿到三级节点
    getLeafKeys(node,arr) {
      // 三级节点特征: 没有children
      if(!node.children) {
        return arr.push(node.id)
      }
      // 采用递归的方式,搜素树
      node.children.forEach( item => this.getLeafKeys( item, arr))
    },
    // 关闭对话框时重置默认勾选框
    SetRightDialogClosed (){
      this.defKeys = []
    }
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
