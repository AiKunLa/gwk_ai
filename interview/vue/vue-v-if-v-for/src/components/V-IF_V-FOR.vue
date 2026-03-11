<template>
    <div>
        <li v-for="item in activeItems" :key="item.id">
            {{ item.name }}
        </li>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    { id: 1, name: 'Item 1', show: true },
                    { id: 2, name: 'Item 2', show: true },
                    { id: 3, name: 'Item 3', show: true },
                ]
            }
        },

        computed: {
            activeItems() {
                return this.items.filter(item => item.show)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>