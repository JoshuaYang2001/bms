<template>
  <div class="login">
    <section class="login-box">
      <div class="login-wrap">


        <div class="input-wrap">
          <input
            class="login-input login-code"
            placeholder="请输入短信验证码"
            type="number"
            v-model="loginCodeVal"
            @input="lenControl"
          />
          <!--          <img class="icon-left" src="@/assets/images/logo.jpg" />-->
          <input
            class="getCode"
            type="button"
            @click.stop="toGetCode"
            ref="eleCode"
            :value="codeText"
          />
<!--           <span class="getCode" @click.stop="toGetCode">获取验证码</span>-->
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loginNumberVal: "1",
      loginCodeVal: "",
      rightCode: 1234,
      isRegistered: true, //是否已注册
      isTrue: false,
      codeText: "获取验证码",
      timer: 60,//倒计时时间设置成五秒
    };
  },
  components: {},
  created() {
    let urlParams = this.$route.query;
    if (this.$route.query.reqParams) {
      this.reqParams = this.$route.query.reqParams;
    } else {
      this.reqParams = ``;
    }
  },
  computed: {
    //登陆按钮是否可点击
    isDisabled() {
      if (this.loginNumberVal && this.loginCodeVal && this.isTrue) {
        return false;
      }
      return true;
    },
    isDel() {
      if (this.loginNumberVal.length) {
        return true;
      }
      return false;
    },
  },
  methods: {
    //输入框长度控制
    lenControl() {
      if (this.loginNumberVal.length > 11) {
        this.loginNumberVal = this.loginNumberVal.slice(0, 11);
      }
      if (this.loginCodeVal.length > 6) {
        this.loginCodeVal = this.loginCodeVal.slice(0, 6);
      }
    },
    //号码输入框右边的那个叉
    delBtn() {
      this.loginNumberVal = "";
    },
    //验证码倒计时
    codeTimer() {
      if (this.timer >= 1) {
        this.$refs.eleCode.setAttribute("disabled", "true");
        this.$refs.eleCode.setAttribute("value", this.timer + "s 后获取");
        this.$refs.eleCode.style.backgroundColor = "#082653";
        this.timer--;
        setTimeout(() => {
          this.codeTimer();  //箭头函数this 就是vueComponent
        }, 1000);
      } else {
        console.log(this)
        this.$refs.eleCode.setAttribute("value", this.codeText);
        this.$refs.eleCode.removeAttribute("disabled");
        this.$refs.eleCode.style.backgroundColor = "#da5959";
        this.timer = 3;
      }
    },
    //获取验证码
    toGetCode() {
      // let model = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      // if (model.test(this.loginNumberVal))
      if (this.loginNumberVal)
      {
        //格式正确调用接口发送验证码
        this.codeTimer();
        this.isTrue = true;
      }
      else {
        alert("手机号格式不正确");
      }
    },
    //登陆
    toLogin() {
      console.log("登陆,判断手机号是否已经注册、验证码是否正确");
      if (this.isRegistered && this.loginCodeVal == this.rightCode) {
        alert("可以登录");
        this.$axios
          .post("?_m=loginPaper&_a=loginCommit", {//调取登陆的接口
            loginPhoneNumber: this.loginNumberVal,
            loginPhoneCode: this.loginCodeVal,
          })
          .then((res) => {
            if (res.ret === 0) {
              this.$store.commit();//储存要提交的数据
              this.$router.replace({//登陆成功之后要跳转的页面
                path: "/exam/test",
                query: {is_pass: res.data.is_pass, reqParams: this.reqParams},
              });
            } else {
              alert(res.msg || "网络错误");
            }
          })
          .catch(() => {
            alert("网络错误");
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
//使用的是flex布局，进行自适应
.login {
  background: radial-gradient(ellipse at bottom, #082653, #111);
  height: 100vh;
}

.login-box {
  display: flex;
  display: -webkit-flex;
}

.login-wrap {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  padding: 40px;
  flex: 1;
}

.login-icon {
  margin: 20% auto;
}

.icon-top {
  width: 180px;
  height: 60px;
  flex: 1;
}

.input-wrap {
  flex: 1;
  position: relative;
}

.login-input {
  background-color: rgba(255, 255, 255, 0.2 );
  display: block;
  border-bottom: 1px solid silver;
  height: 60px;
  box-sizing: border-box;
  padding-left: 30px;
  width: 100%;
}

.icon-left {
  position: absolute;
  left: 0;
  top: 24px;
}

.icon-right {
  width: 15px;
  height: 15px;
  position: absolute;
  right: 10px;
  top: 24px;
}

.getCode {
  width: 90px;
  position: absolute;
  right: 5px;
  bottom: 10px;
  color: #fff;
  background-color: #f16622;
  border-radius: 5px;
  padding: 10px;
}

.login-btn {
  margin-top: 10%;
}
</style>
