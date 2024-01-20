<template>
  <div class="contain">
    <div class="font-bold text-3xl mb-4">My Groups</div>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-hidden ml-5">
      <div v-for="group in groups" :key="group.id" class="group-item bg-gray-100 py-6 rounded-md shadow-md">
        <ChooseGroup :group="group" />
        <button @click="handleDelete(group.id)" class="text-red-500 hover:text-red-700 ml-auto">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>

    <div v-if="!selected" class="mt-10 flex flex-row justify-center">
      <router-link
        :to="{ name: 'MyExpenses'}"
        class="btn mr-2"
      >
        Go to My Expenses
      </router-link>

      <router-link
        :to="{ name: 'CreateGroup'}"
        class="btn"
      >
        Create New Group
      </router-link>
    </div>
  </div>
</template>

<script setup>
import ChooseGroup from '@/components/ChooseGroup.vue'
import GetGroups from '@/composables/GetGroups.js';
import { ref } from 'vue';

const selected = ref(false);

const { groups, error, load } = GetGroups();
load();


async function handleDelete(id) {
  try {
    await fetch(`http://localhost:3000/groups/${id}`, {
      method: 'DELETE',
    });

    window.location.reload();
  } catch (error) {
    console.error('Error deleting group:', error);
  }
}
</script>
