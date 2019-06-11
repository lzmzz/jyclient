<template>
    <div>
        <div class="logoPanel">
            <div>
                <img src="@/assets/images/xlmgLogo.png" alt="">
                <p>修改密码</p>
            </div>
        </div>
        <div class="iptPanel">
            <div>
                <img src="@/assets/images/userIcon.png" alt="">
                <input type="tel" placeholder="输入手机号" v-model="tel">
            </div>
            <div>
                <img src="@/assets/images/pwdIcon.png" alt="">
                <input type="password" placeholder="输入旧密码" v-model="oldPwd">
            </div>
            <div>
                <img src="@/assets/images/pwdIcon1.png" alt="">
                <input type="password" placeholder="输入新的密码" v-model="newPwd1">
            </div>
            <div>
                <img src="@/assets/images/pwdIcon1.png" alt="">
                <input type="password" placeholder="确认新密码" v-model="newPwd2">
            </div>
        </div>
        <div class="qdBtn" @click="changePwd">确定</div>
        <div class="qdBtn" @click="$router.go(-1)">返回</div>
    </div>
</template>

<script>
import _ from 'lodash'
    export default {
        data() {
        return {
            tel: '',
            oldPwd: '',
            newPwd1: '',
            newPwd2: '',
        }
    },
    created(){
    },
    methods: {
        checkPwd: function(){

        },
        changePwd: function(){
            if(_.isEmpty(this.tel)){
                this.$toast('请输入手机号')
                return
            }
            if(_.isEmpty(this.oldPwd)){
                this.$toast('请输入旧密码')
                return
            }
            if(_.isEmpty(this.newPwd1)){
                this.$toast('请输入新密码')

                return
            }
            if(_.isEmpty(this.newPwd2)||this.newPwd1!=this.newPwd2){
                this.$toast('两次密码输入不一致')

                return
            }
            this.$http.post('/jyclient/api/user/changePwd', {tel: this.tel, newPwd: this.newPwd1, oldPwd: this.oldPwd}).then(res=>{
                if(res.status==-1){
                    this.$toast(res.data)

                }else{
                    this.$toast(res.data)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    }
</script>

<style scoped>
.logoPanel{height: 4.7733rem;background: #000;overflow: auto;display: flex;align-items: center;justify-content: center;}
.logoPanel img{width: 1.3733rem;display: block;margin: 0 auto;animation: xuanzhuan 1s forwards;}
@keyframes xuanzhuan {
    0%{}
    100%{transform: rotate(360deg)}
}
.logoPanel p{color: white;font-size: 0.5rem;text-align: center;margin-top: 0.4rem;letter-spacing: .03rem;}

.iptPanel{width: 8.2rem;margin: 1.0667rem auto;}
.iptPanel>div{position: relative;border-bottom: 1px solid #ccc;height: 1rem;margin-bottom: 1.12rem;}
.iptPanel>div img{position: absolute;bottom: 0.3rem;left: 0.3333rem;width: 0.4rem;}
.iptPanel>div input{background: transparent;height: 100%;position: absolute;left: 1rem;font-size: 0.4rem;width: 7rem;}
::-webkit-input-placeholder {color:#333;font-size: 0.4rem;}
.qdBtn{font-size: 0.4267rem;width: 6.2133rem;margin: 0 auto;color: white;border-radius: 0.6667rem;background: #000;line-height: 0.9067rem;text-align: center;margin-top: .5333rem;}
</style>