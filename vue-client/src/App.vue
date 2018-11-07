<template>
  <div>
    <router-view></router-view>
    <!-- <tabbar @tabbar-text-active-color="'#fff'" v-if="showFooter">
      <tabbar-item selected>
          <img slot="icon" src="@/assets/images/shouye.png">
          <span slot="label">订单中心</span>
      </tabbar-item>
      <tabbar-item>
          <img slot="icon" src="@/assets/images/userIcon.png">
          <span slot="label">个人中心</span>
      </tabbar-item>
    </tabbar> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      showFooter: false,
    }
  },
  methods: {
    
  },
  mounted() {
    if(this.$route.path=='/'||this.$route.path=='/home'||this.$route.path=='/user'){
      this.showFooter=true
    }else{
      this.showFooter=false
    }
  },
  watch: {
    $route(to, from) {
      if(to.path=='/'||to.path=='/home'||to.path=='/user'){
        this.showFooter=true
      }else{
        this.showFooter=false
      }
    }
  }
}
</script>

