<template>
    <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
        <div class="content">
            <h1>This is an {{ $route.meta.label }} page</h1>
        </div>
    </a-layout-content>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({})
export default class Content extends Vue {}
</script>