<template>
    <a-layout>
        <a-layout-header class="header">
            <div class="logo"/>
            <menu-component :menus="mainMenus"></menu-component>
        </a-layout-header>
        <router-view></router-view>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import MenuComponent from "@/components/MenuComponent.vue"
import userMenu from "@/assets/scripts/UserMenus";

@Options({
    components: {MenuComponent}
})
export default class Home extends Vue {
    mainMenus = userMenu.mainMenus
}
</script>

<style lang="stylus" scoped>
.logo
    float left
    width 120px
    height 31px
    margin 16px 24px 16px 0
    background rgba(255, 255, 255, 0.3)

.ant-row-rtl .logo
    float right
    margin 16px 0 16px 24px

.site-layout-background
    background #fff

</style>