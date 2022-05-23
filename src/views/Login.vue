<template>
    <a-layout class="login">
        <a-layout-header>
            <div class="logo"/>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <a-form
                ref="LoginForm"
                :model="formData"
                :rules="rules"
                :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"
                :label-col="{ span:4 }" :wrapper-col="{ span: 8 }"
            >
                <a-form-item label="Username" name="username">
                    <a-input autocomplete="off" v-model:value="formData.username"/>
                </a-form-item>
                <a-form-item label="Password" name="password">
                    <a-input-password autocomplete="off" v-model:value="formData.password"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 8, offset: 4 }">
                    <a-button type="primary" @click="login"
                              :disabled="formData.username === '' || formData.password === ''"
                    >Login
                    </a-button>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 8, offset: 4 }">
                    <a-alert v-show="message && message.length > 0" :message="message" :type="loginSuccess? 'success': 'error'"/>
                </a-form-item>

            </a-form>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Vue-Koa ©2021 Created by WingSnow
        </a-layout-footer>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import {useLogger} from "vue-logger-plugin";
import utils from '../assets/scripts/utils'

@Options({
    data() {
        return {
            targetUrl: this.$route.query.targetUrl
        }
    }
})

export default class Login extends Vue {
    private logger = useLogger()

    targetUrl!: string

    message = ''
    loginSuccess = false

    formData = {  // 表单数据
        username: '',
        password: ''
    }
    rules = { //表单验证规则
        username: [
            {required: true, message: 'Please input your username.', trigger: 'blur'}
        ],
        password: [
            {required: true, message: 'Please input your password.', trigger: 'blur'}
        ]
    }

    login(): void {
        const userInfo = {
            username: this.formData.username,
            password: this.formData.password
        }

        // 通过设置html元素的ref属性，之后就可以在this.$refs中取到该元素，从而调用ant-design-vue赋予表单元素的validateFields方法
        this.$refs.LoginForm.validateFields()
            .then(() => {
                fetch("api/auth", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(({
                        username: userInfo.username,
                        password: userInfo.password
                    }))
                })
                    .then(res => {
                        this.loginSuccess = res.ok  // 当res.statusCode是2xx时res.ok是true，否则为false
                        return res.json()
                    })
                    .then(res => {
                        this.message = res.message
                        if(res.code === 200){
                            utils.saveToken(res.token)  // 将token保存在sessionStorage
                            setTimeout(()=>{
                                this.onAuthSuccess()
                            },500)
                        }
                        else{
                            utils.clearToken()  // 登录失败时清空token
                        }
                    })
            })
    }

    onAuthSuccess(): void{
        if(!utils.verifyToken()) return
        if (this.targetUrl) { //判断用户是直接访问登录页还是被重定向登录页
            this.$router.push({ path: this.targetUrl });
        } else {
            this.$router.push({ path: "/" });
        }
    }
}
</script>

<style lang="stylus" scoped>
.site-layout-content
    min-height 280px
    padding 24px
    background #fff

.logo
    float left
    width 120px
    height 31px
    margin 16px 24px 16px 0
    background rgba(255, 255, 255, 0.3)

.ant-row-rtl .logo
    float right
    margin 16px 0 16px 24px


[data-theme='dark'] .site-layout-content
    background: #141414

</style>