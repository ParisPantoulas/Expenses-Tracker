import { ref } from 'vue';

const GetSingleGroupExpense = (id, eid) => {
  const expense = ref(null);
  const error = ref(null);

  const load = async () => {
    try {
      let data = await fetch(`http://localhost:3000/groups/${id}`);
      if (!data.ok) {
        throw Error('No available data');
      }
      
      const group = await data.json();
      
      // Assuming 'expenses' is the correct property in the API response
      const matchingExpense = group.expenses.find(element => element.eid == eid);

      if (matchingExpense) {
        expense.value = matchingExpense;
      } else {
        throw Error(`Expense with eid ${eid} not found`);
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  return { expense, error, load };
};

export default GetSingleGroupExpense;
