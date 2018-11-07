<template>
    <div class="loginPanel">
        <img src="@/assets/images/logo.png" alt="" class="logo">
        <div class="iptPanel">
            <div>
                <img src="@/assets/images/userIcon.png" alt="">
                <input type="number" placeholder="输入您的电话号码" v-model="tel">
            </div>
            <div>
                <img src="@/assets/images/pwdIcon.png" alt="">
                <input type="password" placeholder="输入您的密码" v-model="pwd">
            </div>
        </div>
        <div class="loginBtn" @click="login">登录</div>
        <p class="changePwd" @click="changePwd">修改密码</p>
    </div>
</template>

<script>
    export default {
        data() {
        return {
            tel: '',
            pwd: '',
        }
    },
    created(){
    },
    methods: {
        login: function(){
            //登录
            this.$http.post('/jyclient/api/user/login', {tel: this.tel, pwd: this.pwd}).then((res)=>{
                if(res.status==-1){
                    this.$toast(res.data)
                }else{
                    this.$toast('登录成功')
                    localStorage.setItem('userInfo', JSON.stringify(res.data))
                    this.$router.push({
                        path: '/'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        changePwd(){
            this.$router.push({
                path: '/changePwd'
            })
        }
    },
    }
</script>

<style scoped>
.loginPanel{position: absolute;left: 0;width: 100%;height: 100%;background: url(../../assets/images/loginBg.jpg)no-repeat;background-size: 100% 100%;overflow: hidden;}
.logo{margin: 0 auto;display: block;width: 3.8533rem;animation: fangda 1s forwards}
@keyframes fangda {
    0%{transform: scale(0)}
    50%{transform: scale(1.2)}
    100%{transform: scale(1);margin-top: 2.8133rem;}
}
.iptPanel{width: 8.2rem;margin: 1.0667rem auto;}
.iptPanel>div{position: relative;border-bottom: 1px solid #ccc;height: 1rem;margin-bottom: 1.12rem;}
.iptPanel>div img{position: absolute;bottom: 0.3rem;left: 0.3333rem;width: 0.4rem;}
.iptPanel>div input{background: transparent;height: 100%;position: absolute;left: 1rem;font-size: 0.4rem;width: 7rem;}
::-webkit-input-placeholder {color:#333;font-size: 0.4rem;}
.loginBtn{background: url(../../assets/images/loginBtn.png)no-repeat;background-size: 100% 100%;width: 6.2533rem;height: 0.9867rem;text-align: center;font-size: 0.4333rem;color: white;margin: 2rem auto;line-height: .8867rem;letter-spacing: 0.1333rem}
.changePwd{text-align: center;font-size: 0.3467rem;text-decoration: underline;}
</style>