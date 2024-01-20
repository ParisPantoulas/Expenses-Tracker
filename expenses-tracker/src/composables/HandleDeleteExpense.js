export default function useHandleDeleteExpense() {
    async function handleDeleteExpense(groupId, expenseId) {
      try {
        const response = await fetch('http://localhost:3000/groups/' + groupId);
        const groupData = await response.json();

        const updatedExpenses = groupData.expenses.filter(
          (expense) => expense.eid !== expenseId
        );
  
        groupData.expenses = updatedExpenses;
  
        await fetch('http://localhost:3000/groups/' + groupId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(groupData),
        });
  
        location.reload();
      } catch (error) {
        console.error('Error handling expense deletion:', error);
      }
    }
  
    return { handleDeleteExpense };
  }
  