<template>
    <a-layout>
        <sub-menu-component></sub-menu-component>
        <a-layout style="padding: 0 24px 24px">
            <bread-crumb-component></bread-crumb-component>
            <router-view></router-view>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import SubMenuComponent from "@/components/SideMenuComponent.vue";
import BreadCrumbComponent from "@/components/BreadCrumbComponent.vue";

@Options({
    components: {SubMenuComponent, BreadCrumbComponent}
})
export default class sideMenuContent extends Vue {
}
</script>