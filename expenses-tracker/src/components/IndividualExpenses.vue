<template>
  <div class="contain">
    <div class="flex flex-col text-center sm:flex-wrap">

      <div class="flex flex-row justify-between items-center mb-4">
        <h1 class="text-3xl font-semibold text-purple-500">My Expenses</h1>
        <div class="text-lg text-purple-500">Total Individual Balance: {{ TotalBalance }}</div>
      </div>

      <h2 class="text-2xl font-semibold mb-4 text-purple-500">Transaction History</h2>
      
      <div id="history" class="flex flex-col scroll-smooth overflow-y-auto mb-12">
        <div v-for="transaction in transactions" :key="transaction.id" class="relative bg-gray-100 p-4 mb-6 mr-2 h-28 rounded-md">
          <button @click="handleDelete(transaction.id)" class="material-icons absolute top-102 right-2">delete</button>
          <div class="text-lg font-semibold mb-2">{{ transaction.title }}</div>
          <div class="text-gray-600 mb-2">{{ transaction.details }}</div>
          <div :class="transaction.amount > 0 ? 'text-green-500' : 'text-red-400'">{{ transaction.amount }}</div>
        </div>
      </div>
    </div>

    <div>
      <router-link to="/mygroups" class="btn mr-4">
        Group Expenses
      </router-link>

      <router-link to="/addtransaction" class="btn">
        Add Transaction
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';

const transactions = ref([]);
const TotalBalance = ref(0);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/transactions');
    const data = await response.json();
    transactions.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const findTotal = computed(() => {
  return transactions.value.reduce((total, transaction) => total + transaction.amount, TotalBalance.value);
});

watch(transactions, () => {
  TotalBalance.value = findTotal.value;
});

async function handleDelete(id) {
  try {
    // Send a DELETE request to the server to delete the transaction with the given id
    await fetch(`http://localhost:3000/transactions/${id}`, {
      method: 'DELETE',
    });

    // Remove the deleted transaction from the local transactions array
    transactions.value = transactions.value.filter((transaction) => transaction.id !== id);

    // Reload the page after deleting the transaction
    window.location.reload();
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
}
</script>

<style scoped>
#history {
  max-height: 28rem;
}
</style>