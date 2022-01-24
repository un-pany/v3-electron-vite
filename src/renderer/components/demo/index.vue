<template>
    <div class="demo">demo</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
defineProps({
    name: {
        type: String,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.demo {
    width: 100%;
    height: 10px;
    background-color: #409eff;
}
</style>
