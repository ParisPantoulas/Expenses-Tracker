<template>
<div class="container p-8 bg-gray-200 shadow-md rounded-md border border-gray-500 md:w-6/12 mx-auto h-5/6 mt-6">
    <div class="flex flex-col items-center">
    <label class="text-xl font-semibold mb-2 text-purple-500">Group Name</label>
    <input
        type="text"
        v-model="groupname"
        placeholder="Give a name to your group"
        required
        maxlength="10"
        class="w-full p-2 border border-gray-300 rounded-md mb-4"
    >

    <label class="text-xl font-semibold mb-2 text-purple-500">
        How many members
        <h4 class="text-xs">(Type your name also in the list below)</h4>
    </label>
    <input
        type="number"
        v-model="membercount"
        min="0"
        max="12"
        class="w-full p-2 border border-gray-300 rounded-md mb-4"
    >

    <div v-for="index in membercount" :key="index" :class="membercount === 0 ? 'hidden' : ''">
        <input
        type="text"
        v-model="members[index - 1]"
        :placeholder="'Member ' + index"
        required
        maxlength="10"
        class="w-full p-2 border border-gray-300 rounded-md mb-4"
        >
    </div>

    <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

    <button @click="handleCreate" class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring focus:border-purple-700">
        Create Group
    </button>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const groupname = ref('');
const membercount = ref(0);
const members = ref([]);
const errorMessage = ref('');

const router = useRouter();

const handleCreate = async () => {
  const uniqueMembers = new Set(members.value);
  if (uniqueMembers.size !== members.value.length) {
    errorMessage.value = 'Each member should have a unique name.';
    return;
  } else {
    errorMessage.value = '';
  }

  const groupData = {
    name: groupname.value,
    members: members.value,
    expenses: []
  };

  try {
    const response = await fetch('http://localhost:3000/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });

    if (response.ok) {
      router.push('/mygroups');
    } else {
      console.error('Failed to create group');
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
};
</script>

