<template>
<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
    <h1 class="text-4xl font-bold mb-4" v-if="firstElement.name === null">
        Welcome!
    </h1>
    <h1 class="text-4xl font-bold mb-4" v-else>
        Welcome back {{ firstElement.name }}!
    </h1>

    <div v-if="firstElement.name === null" class="mt-4">
        <p class="mb-2">Please type your name to continue</p>
        <input
        type="text"
        v-model="inputName"
        @keydown.enter="updateName()"
        class="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 shadow-md"
        />
    </div>

    <div v-else>
        <router-link to="/myexpenses">Go to My Expenses</router-link>
    </div>
    </div>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const people = ref([]);
const firstElement = ref([]);
const inputName = ref('');

const router = useRouter();

onMounted(async () => {
try {
    const response = await fetch('http://localhost:3000/people');
    const data = await response.json();
    people.value = data;
    firstElement.value = people.value[0];
} catch (error) {
    console.error('Error fetching data:', error);
}
});

const updateName = async () => {
try {
    await fetch('http://localhost:3000/people/' + firstElement.value.id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: inputName.value })
    });

    const updatedResponse = await fetch('http://localhost:3000/people');
    const updatedData = await updatedResponse.json();

    people.value = updatedData;
    firstElement.value = updatedData[0];

    if (firstElement.value.name !== null) {
    router.push({ name: 'MyExpenses' });
    }
} catch (error) {
    console.error('Error updating name:', error);
}
};
</script>
