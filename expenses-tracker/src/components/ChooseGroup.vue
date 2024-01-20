<template>
    <router-link :to="{ name: 'SingleGroup', params: { id: group.id }}" class="hover:underline">
        <h3 class="text-xl font-semibold text-purple-700 hover:text-purple-900">{{ group.name }}</h3>
    </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

const { group } = defineProps(['group']);
</script>
