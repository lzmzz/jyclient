<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <form>
      名字：<input type="text" name="name" v-model="name"> <br>
      电话：<input type="text" name="tel" v-model="tel"> <br>
      工种：<input type="text" name="work_type" v-model="work_type"> <br>
      <a href="javascript:;" @click="addUser">提交</a>
    </form>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      name: '',
      tel: '',
      work_type: '',
    }
  },
  methods: {
    addUser() {
      var name = this.name;
      var tel = this.tel;
      var work_type = this.work_type;
      this.$http.post('/jyclient/api/user/addUser', {
        name: name,
        tel: tel,
        work_type: work_type
      },{}).then((response) => {
        console.log(response);
      })
    }
  }
}
</script>