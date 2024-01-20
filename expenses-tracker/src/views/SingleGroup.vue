<template>
<div class="contain">
    <h1 class="text-3xl font-semibold text-purple-500 mb-6">{{ group.name }}</h1>
    <div class="mb-6">Total Balance: {{ TotalBalance.toFixed(2) }}</div>

    <div>
    <div v-for="expense in group.expenses" :key="expense.description" class="mb-6 bg-gray-100 p-4 rounded-md">
        <h2 class="text-xl font-semibold mb-2">Expense: {{ expense.description }}</h2>
        <p>
        <span>{{ expense.paidBy }} paid {{ expense.amount }} euro for {{ expense.paidFor.join(', ') }}.</span>
        <button @click="handleDelete(group.id, expense.eid)" class="material-icons ml-2">delete</button>
        </p>
    </div>

    <div class="mt-6 mb-8">
        <h3 class="text-2xl font-semibold mb-2 text-purple-500">Total Balances:</h3>
        <div v-for="finaltotal in totalsArray" :key="`${finaltotal.user1}-${finaltotal.user2}`" class="mb-2">
        <ul>
            <li>
            <div :class="{ 'text-green-500': finaltotal.total > 0, 'text-red-500': finaltotal.total <= 0 }">
                <span>
                {{ finaltotal.total > 0 ? finaltotal.user2 + ' owes you: ' : 'You owe ' + finaltotal.user2 + ': ' }}
                {{ Math.abs(finaltotal.total).toFixed(2) }}
                </span>
            </div>
            </li>
        </ul>
        </div>
    </div>

    <div>
        <router-link :to="{ name: 'AddGroupTransactions', params: { id: group.id } }" class="btn">
        Add Group Expense
        </router-link>
    </div>
    </div>
</div>
</template>

<script setup>
import GetSingleGroup from '@/composables/GetSingleGroup.js'
import useHandleDeleteExpense from '@/composables/HandleDeleteExpense.js';
import { defineProps, ref, onMounted, computed } from 'vue';

const { id } = defineProps(['id']);
const { group, error, load } = GetSingleGroup(id);
const appUser = ref({});
const TotalBalance = ref(0);
const calculateOwe = ref({});
const totalsArray = ref([]);
const { handleDeleteExpense } = useHandleDeleteExpense();

onMounted(async () => {
await load();
try {
    const response = await fetch('http://localhost:3000/appUser');
    const data = await response.json();
    appUser.value = data[0];

    // Calculate TotalBalance for the appUser in the group
    TotalBalance.value = calculateTotalBalance(group.value, appUser.value.name);
    calculateOwe.value =  calculateOweAmounts(group.value, appUser.value.name);
    calculateTotals.value = calculateTotals(calculateOwe.value);
} catch (error) {
    console.error('Error fetching data:', error);
}
});

function calculateTotalBalance(group, userName) {
    let totalBalance = 0;

    if (group && group.expenses && Array.isArray(group.expenses)) {
        if (group.expenses.length === 0) {
        console.log('No expenses for this group');
        return totalBalance;
        }

        group.expenses.forEach((expense) => {
        const { amount, paidBy, paidFor } = expense;

        if (paidBy === userName) {
            const share = amount / paidFor.length;
            totalBalance += share * (paidFor.length - 1);
        } else if (paidFor.includes(userName)) {
            const share = amount / paidFor.length;
            totalBalance -= share;
        }
        });
    } else {
        console.error('Invalid group or expenses data:', group);
    }
return totalBalance;
}

function calculateOweAmounts(group, userName) {
    let balances = [];
    group.expenses.forEach((item) => {
        let count = item.amount / item.paidFor.length;

        item.paidFor.forEach((user) => {
            if (item.paidBy === userName) {
                balances.push({
                    "user1": userName,
                    "user2": user,
                    "count": count
                });
            } else {
                balances.push({
                    "user1": user,
                    "user2": item.paidBy,
                    "count": -count
                });
            }
        });
    });

    // Filter the array to remove elements where user1 === user2 and
    // where neither user1 nor user2 includes userName
    balances = balances.filter((elem) => {
        return elem.user1 !== elem.user2 && (elem.user1 === userName || elem.user2 === userName);
    });
    return balances;
}

function calculateTotals(balances) {
    if (balances) {
        const totalsMap = new Map();

        balances.forEach((balance) => {
            const { user1, user2, count } = balance;
            const key = `${user1}-${user2}`;

            if (totalsMap.has(key)) {
                totalsMap.set(key, totalsMap.get(key) + count);
            } else {
                totalsMap.set(key, count);
            }
        });

        // Convert the map to an array of objects
        totalsArray.value = Array.from(totalsMap, ([users, total]) => {
            const [user1, user2] = users.split('-');
            return { user1, user2, total };
        });

        return totalsArray;
    }
}

function handleDelete(groupId, expenseId) {
  handleDeleteExpense(groupId, expenseId);
}
</script>
