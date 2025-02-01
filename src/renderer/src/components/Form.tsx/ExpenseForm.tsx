import { Expense } from '@renderer/Interfaces';
import { useState, FormEvent, useEffect } from 'react';



interface Props {
  showNotification: (msg: string) => void; 
  editExpense: Expense | null;
  resetEditExpense: () => void;
}

interface ExpenseToAdd {
  id?: string;
  Description: string;
  Amount: number;
  Interval: string;
  StartDate: Date;
}



function ExpenseForm({ showNotification, editExpense, resetEditExpense }: Props): JSX.Element {
  const [description, setDescription] = useState('');
  const [expense, setExpense] = useState('');
  const [choice, setChoice] = useState('yearly');
  const [startDate, setStartDate] = useState('');



  // Check for edited Expense
  useEffect(() => {
    if (editExpense) {
      setDescription(editExpense.Description);
      setExpense(editExpense.Amount.toString());
      setChoice(editExpense.Interval);
      setStartDate(editExpense.StartDate);
    }
  }, [editExpense]);



  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!description || !expense || !startDate) {
      showNotification('All fields are required!');
      return;
    }

    try {

      const expenseToAdd: ExpenseToAdd = {
        Description: description,
        Amount: parseFloat(expense), // Konwersja do liczby
        Interval: choice,
        StartDate: new Date(startDate) // Konwersja do obiektu Date
      };

      if (editExpense?.id) {
        expenseToAdd.id = editExpense.id;
      }

      // submitExpense(expenseToAdd); 
      window.electron.ipcRenderer.send("add-expense", expenseToAdd);
      showNotification('Expense submitted successfully!'); 
      resetEditExpense();
    } catch (error) {
      showNotification('An error occurred while submitting the expense.');
    }

    // Reset formularza
    setDescription('');
    setExpense('');
    setChoice('yearly');
    setStartDate('');
  };



  const handleClear = () => {
    setDescription('');
    setExpense('');
    setChoice('yearly');
    setStartDate('');
    resetEditExpense();
    showNotification('Form cleared.');
  };

  const handleMessage = (message): void => {
    if (message.status === "success") {
      showNotification(message.message);
    } else {
      showNotification(message.message);
    }

  };

  const handleDelete = (): void => {
    window.electron.ipcRenderer.send("delete-expense", editExpense?.id);
    window.electron.ipcRenderer.on("delete-status", handleMessage);
  };






  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded max-w-md mx-auto">
      <div>
        <label htmlFor="description" className="block text-xl font-bold">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full p-2 border rounded border-gray-600 text-slate-300 bg-gray-800"
          placeholder="Enter expense description"
        />
      </div>

      <div className="flex space-x-4">
        <div>
          <label htmlFor="expense" className="block text-sm font-medium">
            Expense Amount
          </label>
          <input
            id="expense"
            type="number"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            className="mt-2 p-2 border rounded w-[100px] border-gray-600 text-slate-300 bg-gray-800"
            placeholder="Amount"
          />
        </div>

        <div>
          <label htmlFor="choice" className="block text-sm font-medium">
            Payment Type
          </label>
          <select
            id="choice"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            className="mt-2 w-full p-2 border rounded border-gray-600 text-slate-300 bg-gray-800"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="onetime">One Time</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 w-full p-2 border rounded border-gray-600 text-slate-300 bg-gray-800"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="w-3/5 bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-1/6 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="w-1/6 bg-rose-800 text-white p-2 rounded hover:bg-rose-900"
        >
          Delete
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
