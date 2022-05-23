<template>
    <a-layout-sider width="200" style="background: #fff">
        <a-menu
            mode="inline"
            v-model:selectedKeys="menuSelectedKeys"
            v-model:openKeys="openKeys"
            :style="{ height: '100%', borderRight: 0 }"
        >
            <template v-for="item in menus" :key="item.name">
                <a-sub-menu
                    v-if="item.children"
                    :key="item.name"
                >
                    <template #title>
                        <span>
                            {{ item.label }}
                        </span>
                    </template>
                    <a-menu-item
                        v-for="subItem in item.children"
                        :key="subItem.name"
                    >
                        <router-link :to="subItem.path">
                            {{ subItem.label }}
                        </router-link>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item
                    v-else
                    :key="item.name"
                >
                    <router-link :to="item.path">
                        {{ item.label }}
                    </router-link>
                </a-menu-item>
            </template>

        </a-menu>
    </a-layout-sider>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import IMenuItem from "@/assets/scripts/IMenuItem";
import userMenu from "@/assets/scripts/UserMenus";

@Options({
})
export default class SubMenuComponent extends Vue {
    _menuSelectedKeys!: string[]
    _openKeys!: string[]

    get menuSelectedKeys(): string[]{
        return this.$route.matched.map(item => (item.name as string)).slice(-1)
    }

    set menuSelectedKeys(value: string[]){
        this._menuSelectedKeys = value
    }

    get openKeys(): string[]{
        const pathRoute = userMenu.getParentMenus(this.menuSelectedKeys[0])
        return pathRoute? pathRoute: []
    }

    set openKeys(value: string[]){
        this._openKeys = value
    }

    get menus(): IMenuItem[]{
        return userMenu.getSubMenus(this.$route.matched[1].path)
    }
}
</script>
