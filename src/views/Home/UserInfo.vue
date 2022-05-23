<template>
    <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
        <a-descriptions title="用户信息">
            <a-descriptions-item label="用户名">{{userInfo.username}}</a-descriptions-item>
            <a-descriptions-item label="姓名">{{userInfo.name}}</a-descriptions-item>
            <a-descriptions-item label="角色">
                <template v-for="role in userInfo.roles">
                    {{role}}
                </template>
            </a-descriptions-item>
        </a-descriptions>
    </a-layout-content>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component"
import utils from "../../assets/scripts/utils";
import {message} from "ant-design-vue";

@Options({})
export default class UserInfo extends Vue {
    userInfo = {
        username: '',
        name: '',
        roles: []
    }

    getUserInfo(): void{
        utils.wrappedFetch("/api/user", {method: "GET"})
            .then(res => {
                const resObj = JSON.parse(res.user);
                [this.userInfo.username, this.userInfo.name, this.userInfo.roles] = [resObj.username, resObj.name, resObj.roles]
            })
            .catch(err => {
                message.error(`${err.resource} | Error ${err.status}: ${err.statusText}`) //处理请求失败的情况，调用ant-design-vue的全局提示组件显示报错信息
            })
    }

    mounted(){
        this.getUserInfo()
    }

}
</script>