<template>

  <el-container class="home-container">
    <!--    顶部-->
    <el-header>
      <div class="header-left">
        <img src="../assets/images/kind.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="exit" type="info">exit</el-button>
    </el-header>
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse"><div class="iconfont icon-zhedie1"></div></div>
        <!--        侧边栏菜单区-->
        <el-menu
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition="false"
          router
          :default-active="activePath"
        >

          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
            <!--            模板区-->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级菜单区-->
            <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path"
                          v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="iconfont icon-renxiang"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>


</template>

<script>
export default {
  name: 'home',

  // 钩子
  data() {
    return {
      // 被激活链接的地址
      activePath: '',
      menuList: [],
      // 字体图标对象
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-lifangtilitiduomiantifangkuai2',
        '101': 'iconfont icon-shangpinguanli1',
        '102': 'iconfont icon-dingdanguanli',
        '145': 'iconfont icon-shujutongji',
      },
      isCollapse: false
    }

  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    console.log('1')
  },
  methods: {
    // 登出操作
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      console.log(this.isCollapse)
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }

  }
}
</script>

<style scoped lang="less">
@theme-color: #304156;
//折叠图标调整
.icon-zhedie1{
  font-size: 25px;
  margin:15px 10px 0 10px !important;
  color: #c7c7c7;
}
.home-container {
  height: 100%;
}

.el-header {
  background-color: #324b64;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #F7F7F7;
  padding-left: 0px;

  > div {
    display: flex;
    align-items: center;

    img {
      height: 100px;
      width: 130px;
      margin-top: 15px;
    }
  }


}
//菜单展开时右侧细微突出
.el-menu{
  border-right: none;
}
.el-aside {
  background-color: @theme-color;


  .toggle-button {
    background-color: @theme-color;
    text-align: center;
    font-size: 18px;
    height: 30px;
    letter-spacing: 3px;
    color: #eff1f4;
    line-height: 30px;
    cursor: pointer;
  }
}

.iconfont {
  margin-right: 10px;
}

.el-main {
  background-color: #eff1f4;
}

</style>
