<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item
            v-for="item in breadcrumbs"
            :key="item.name"
        >
            <router-link :to="item.path">
                {{ item.label }}
            </router-link>
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
})
export default class BreadCrumbComponent extends Vue {
    get breadcrumbs(): { name: string, path: string, label: string }[]{
        return this.$route.matched.map(item => {
            return {
                name: item.name as string,
                path: item.path as string,
                label: item.meta.label as string
            }
        })
    }
}
</script>