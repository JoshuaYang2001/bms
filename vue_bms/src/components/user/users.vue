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
          <el-input placeholder="请输入内容" :clearable="true" v-model="queryInfo.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--   表单-->
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
      >
        <!--        索引列-->
        <el-table-column type="index">
        </el-table-column>
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
          prop="role_name"
          label="角色">
        </el-table-column>

        <!--        el-table-column 上有全部的userlist的数据 通过prop可以接受其中一部分-->
        <el-table-column
          label="状态">
          <!--       通过作用域插槽   逆向得到全部的el-table-colum组件里的数据-->
          <template v-slot="scope">
            <!--            scope.row代表每一列拿到的数据-->
            <!--          {{scope.row}}}-->
            <!--            开关-->
            <!--            既然我已经在更高层面拿到了被使用组件的数据，我就可以在这一层面直接使用-->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <!--            编辑用户信息-->
            <el-button type="primary" icon="el-icon-edit" @click="editUserInfo(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUserInfo(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="right" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      数据分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--  添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close='addDialogClosed'
    >
      <!--      表单-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUserConfirm">确 定</el-button>
  </span>
    </el-dialog>

    <!--    编辑用户对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      width="50%"
      @close='editDialogClosed'
    >
      <!--     编辑用户信息表单-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialog = false">取 消</el-button>
    <el-button type="primary" @click="editUserConfirm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    // 校验邮箱
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    const checkNumber = (rule, value, cb) => {
      const regNumber = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regNumber.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      input: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      userList: [],
      total: 0,
      // 添加用户对话框开关
      dialogVisible: false,
      // 编辑用户对话框的开关
      editUserDialog: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机号', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
        ],
      },
      // 编辑到用户的信息
      editForm: {},
      // 编辑用户的表单校验
      editFormRules: {
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机号', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
        ],

      }
    }

  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },

    // 监听switch开关的改变
    async userStateChanged(userInfo) {
      console.log(userInfo)
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (res.meta.status == !200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听页码改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 清空增加用户对话框的表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户确定
    addUserConfirm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 如果验证有效就发起网络请求
        const {data: res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('用户创建失败')
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 编辑用户信息
    async editUserInfo(id) {
      this.editUserDialog = true
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('用户信息查询失败!')
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 清空编辑用户对话框的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.editUserDialog = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },
    // 删除用户信息
    async deleteUserInfo(id) {
      const deleteResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err);

      // 如果确认返回confirm,如果取消则返回cancel

      console.log(deleteResult)
      if (deleteResult !== 'confirm') return this.$message.info('已取消')
      const{data:res} = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success(res.meta.msg)
      this.getUserList()
    }
  }

}
</script>

<style scoped>

</style>


const {data:res} =  this.$http.delete('users/'+ id)
if (res.meta.status !==200) return this.$message.error('删除失败！')
this.$message.success(res.meta.msg)
