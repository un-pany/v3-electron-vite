<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :href="`#icon-${iconName}`" />
    </svg>
</template>

<script lang="ts" setup>
defineProps({
    iconName: {
        type: String,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    overflow: hidden;
    // background: red;
}
</style>
