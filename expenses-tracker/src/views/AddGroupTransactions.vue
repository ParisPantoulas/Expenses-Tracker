<template>
  <div class="contain">
    <div class="mb-4">
      <label class="block text-lg font-bold mb-2">Name</label>
      <input
        type="text"
        v-model="description"
        maxlength="10"
        placeholder="Describe your expense"
        required
        class="border border-gray-300 p-2 w-full"
      />
    </div>

    <div class="mb-4">
      <label class="block text-lg font-bold mb-2">Amount</label>
      <input
        type="number"
        v-model="amount"
        min="1"
        placeholder="0"
        required
        class="border border-gray-300 p-2 w-full"
      />
    </div>

    <div class="mb-4">
      <label class="block text-lg font-bold mb-2">Who paid?</label>
      <select v-model="selectedPayer" class="border border-gray-300 p-2 w-full">
        <option disabled>Select payer</option>
        <option v-for="member in group.members" :key="member" :value="member" required>{{ member }}</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block text-lg font-bold mb-2">Members included in this expense</label>
      <div v-for="member in group.members" :key="member" class="flex items-center mb-2">
        <input type="checkbox" v-model="selectedMember" :value="member" class="mr-2"/>
        <span>{{ member }}</span>
      </div>
    </div>

    <div>
      <button @click="addExpense" class="btn">
        Add this Expense
      </button>
    </div>

    <div v-if="errorMessages.length > 0" class="mt-4 text-red-500">
      <p v-for="message in errorMessages" :key="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import GetSingleGroup from '@/composables/GetSingleGroup.js'
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { id } = defineProps(['id']);
const { group, error, load } = GetSingleGroup(id);
const router = useRouter();
const description = ref('')
const amount = ref(0);
const lastEid = ref(0);
const selectedPayer = ref(null);
const selectedMember = ref([]);
const errorMessages = ref([]);

onMounted(async () => {
await load();

//lastEid.value = findLastEid(group.value.expenses).pop();
const lastExpenseIdList = findLastEid(group.value.expenses);
lastEid.value = lastExpenseIdList.length > 0 ? Math.max(...lastExpenseIdList) : 0;
});

function findLastEid(expenses) {
    let eidlist = [];
    expenses.forEach((item) => {
        eidlist.push(item.eid);
    });
    console.log(eidlist);
    return eidlist;
}


async function addExpense() {
  errorMessages.value = [];

  if (!description.value.trim()) {
    errorMessages.value.push('Name is required.');
  }
  if (!amount.value || isNaN(amount.value) || amount.value <= 0) {
    errorMessages.value.push('Valid Amount is required.');
  }
  if (!selectedPayer.value) {
    errorMessages.value.push('Who paid? is required.');
  }
  if (selectedMember.value.length === 0) {
    errorMessages.value.push('At least one Member must be selected.');
  }

  if (errorMessages.value.length > 0) {
    return;
  }

  const newExpense = {
    description: description.value,
    amount: amount.value,
    paidBy: selectedPayer.value,
    paidFor: selectedMember.value,
    eid: lastEid.value + 1
  };

  // Update the group data on the server
  await fetch('http://localhost:3000/groups/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...group.value, expenses: [...group.value.expenses, newExpense] }),
  });

  // Reset form fields
  description.value = '';
  amount.value = 0;
  selectedPayer.value = null;
  selectedMember.value = [];

  router.push(`/mygroups/${id}`);
}
</script>
