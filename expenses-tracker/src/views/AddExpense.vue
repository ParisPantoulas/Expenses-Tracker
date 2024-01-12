
<template>
    <div class="container p-8 bg-gray-200 shadow-md rounded-md border border-gray-500 md:w-6/12 mx-auto h-5/6 mt-6">
      <div class="flex flex-col text-center sm:flex-wrap">
        <div class="flex flex-row justify-between items-center mb-4">
          <h1 class="text-3xl font-semibold text-purple-500">My Expenses</h1>
          <div class="text-lg text-purple-500">Total Balance: {{ TotalBalance }}</div>
        </div>
  
        <div id="history" class="overflow-y-auto mb-12">
          <h2 class="text-2xl font-semibold mb-4 text-purple-500">Transaction History</h2>
  
          <div v-for="transaction in filteredTransactions" :key="transaction.id" class="bg-gray-100 p-4 mb-6 mr-2 h-28 rounded-md">
            <div class="text-lg font-semibold mb-2">{{ transaction.title }}</div>
            <div class="text-gray-600 mb-2">{{ transaction.details }}</div>
            <div :class="transaction.amount > 0 ? 'text-green-500' : 'text-red-400'">{{ transaction.amount }}</div>
          </div>
        </div>
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
  
  const filteredTransactions = computed(() => {
    return transactions.value.filter(transaction => transaction.profileId === 0);
  });
  
  const findTotal = computed(() => {
    return filteredTransactions.value.reduce((total, transaction) => total + transaction.amount, TotalBalance.value);
  });
  
  watch(filteredTransactions, () => {
    TotalBalance.value = findTotal.value;
  });
  </script>
  
  <style scoped>
  #history {
    max-height: 30rem;
  }
  </style>