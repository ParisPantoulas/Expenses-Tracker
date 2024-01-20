<template>
<div class="contain">
    <div class="flex flex-col text-center sm:flex-wrap">
    <label class="trlabels">Title</label>
    <input type="text" v-model="title" class="field h-10" required placeholder="Type the title">

    <label class="trlabels">Details</label>
    <input type="text" v-model="details" class="field h-28" required placeholder="Type the details">

    <label class="trlabels">
        Amount 
        <h4 class="font-bold text-sm">(for expenses use - in front)</h4>
    </label>
    <input type="number" v-model="amount" class="field h-8" required>

    <button @click="addExpense" class="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300">Add</button>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('');
const details = ref('');
const amount = ref(0);

const addExpense = async () => {
    if (!title.value || !details.value || !amount.value) {
        alert('Please fill in all fields.');
        return;
    }

    let expense = { title: title.value, details: details.value, amount: amount.value };

    await fetch("http://localhost:3000/transactions", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
    });

    router.push({name: 'MyExpenses' })
};
</script>
