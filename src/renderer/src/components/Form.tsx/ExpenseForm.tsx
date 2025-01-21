import { useState, FormEvent } from 'react';

function ExpenseForm({clickedDay}): JSX.Element {
  const [description, setDescription] = useState('');
  const [expense, setExpense] = useState('');
  const [choice, setChoice] = useState('yearly');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!description || !expense || !startDate) {
      alert('All fields are required!');
      return;
    }

    // Prepare the data to send
    const expenseData = {
      description,
      expense: parseFloat(expense),
      choice,
      startDate,
    };

    // Send data to the Electron backend
    // window.electronAPI.sendExpense(expenseData);

    // Reset the form
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
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
      alert('Deleted successfully (implement backend logic here).');
      // Implement delete logic if needed
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded shadow-md max-w-md mx-auto">
      <div>
        <label htmlFor="description" className="block text-xl font-bold">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full p-2 border rounded text-slate-700"
          placeholder="Enter expense description"
        />
      </div>

      <div className="flex space-x-4">
        <div>
          <label htmlFor="expense" className="block text-sm font-medium">
            Expense
          </label>
          <input
            id="expense"
            type="number"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            className="mt-2 p-2 border rounded w-[100px] text-slate-700"
            placeholder="Amount"
          />
        </div>

        <div>
          <label htmlFor="choice" className="block text-sm font-medium">
            Interval
          </label>
          <select
            id="choice"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            className="mt-2 w-full p-2 border rounded text-slate-700"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="onetime">One Time</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium">
            Date
          </label>
          <input
            id="startDate"
            type="date"
            // value={startDate}
            value={clickedDay}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 w-full p-2 border rounded text-slate-700"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="w-3/5 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
