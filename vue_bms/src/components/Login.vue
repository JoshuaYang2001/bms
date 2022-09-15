<template>
  <div class="login_container">
<!--    背景-->
    <div class="night">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>

    <!--    登陆区域-->
    <div class="login_box">
      <!--      头像-->
      <div class="avatar_box">
        <img src="@/assets/images/logo.jpg" alt="">
      </div>
      <!--      input框-->


      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">


        <div class="input_box">
          <!--      用户名-->
          <el-form-item prop="username">
            <el-input  v-model="loginForm.username"  prefix-icon="iconfont icon-renxiang" clearable></el-input>
          </el-form-item>

          <!--      密码-->

          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-suoding"
                      clearable></el-input>
          </el-form-item>
        </div>


        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 用户名是否合法
        username: [{
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '长度在 6 到 15 个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    resetLoginForm () {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 用解构赋将data从服务器返回的对象之中解构出来，并重命名为res
        // const params = {
        //   json: this.loginForm
        // }
        const {data:res} = await this.$http.post("/login",this.loginForm)
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        // 记录服务器颁发的token到sessionStorage
        window.sessionStorage.setItem('token',res.data.token)
        await this.$router.push('/home')
        })
      }
    }

}
</script>

<style lang="less" scoped>

.login_container {
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #082653, #111);
  overflow: hidden;

  //流星特效

  .night {
    position: absolute;
    width: 50%;
    height: 50%;
    transform: rotateZ(10deg);
  }

  .star {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 4px;
    background: linear-gradient(-45deg, #fff8b3, rgba(0, 0, 255, 0));
    filter: drop-shadow(0 0 4px #dbda74);
    animation: tail 10s ease-in-out infinite, falling 10s ease-in-out infinite;
  }

  @keyframes tail {
    0% {
      width: 0;
    }
    30% {
      width: 125px;
    }
    100% {
      width: 0px;
    }
  }

  @keyframes falling {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(1600px);
    }
  }

  .star::before,
  .star::after {
    content: '';
    position: absolute;
    top: calc(50% - 2px);
    right: 0;
    height: 4px;
    /* 这段啥意思 给星星 */
    background: linear-gradient(
      -45deg,
      rgba(0, 0, 255, 0),
      #fff8b3,
      rgba(0, 0, 255, 0)
    );
    border-radius: 100%;
    transform: translateX(50%) rotateZ(45deg);
    animation: shining 10s ease-in-out infinite;
  }

  @keyframes shining {
    0% {
      width: 0;
    }
    25% {
      width: 30px;
    }

    100%{
      width: 0;
    }
  }

  .star::after {
    transform: translateX(50%) rotateZ(-45deg);
  }

  .star:nth-child(1) {
    top: calc(50% - 180px);
    left: calc(70% - 350px);
    animation-delay: 1s;
  }

  .star:nth-child(1)::before,
  .star:nth-child(1)::after {
    animation-delay: 1s;
  }

  .star:nth-child(2) {
    top: calc(50% - 50px);
    left: calc(40% - 100px);
    animation-delay: 1.2s;
  }

  .star:nth-child(2)::before,
  .star:nth-child(2)::after {
    animation-delay: 1.2s;
  }

  .star:nth-child(3) {
    top: calc(50% - 100px);
    left: calc(50% - 100px);
    animation-delay: 1.2s;
  }

  .star:nth-child(3)::before,
  .star:nth-child(3)::after {
    animation-delay: 1.2s;
  }

  .login_box {
    background-color: rgba(255, 255, 255, 0.2 );
    backdrop-filter: blur(30px);
    box-shadow: 3px 2px 10px rgba(0,0,0,.2);
    height: 400px;
    width: 600px;
    border-radius: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 30px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(221, 221, 221, 0.7);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ddd;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .input_box {
        padding: 100px 0;
      }

      /deep/ .el-input__inner{
        background-color: rgba(255,255,255,.1);
        color: #ffffff;
      }

    }

    .btn {
      display: flex;
      justify-content: end;
    }
  }

}
</style>
<style>

</style>
