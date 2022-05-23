<template>
    <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="menuSelectedKeys"
        :style="{ lineHeight: '64px' }"
    >
        <a-menu-item
            v-for="item in menus"
            :key="item.name"
        >
            <router-link :to="item.path">
                {{ item.label }}
            </router-link>
        </a-menu-item>
    </a-menu>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import IMenuItem from "@/assets/scripts/IMenuItem";

@Options({
    props: {
        menus: Array
    }
})
export default class MenuComponent extends Vue {
    menus!: IMenuItem[]
    _menuSelectedKeys!: string[]

    get menuSelectedKeys(): string[]{
        const routePath = this.$route.path.split('/')
        return this.menus.map(item => item.name).filter(item => routePath.includes(item))
    }

    set menuSelectedKeys(value: string[]){
        this._menuSelectedKeys = value
    }
}
</script>