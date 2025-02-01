import { useState } from "react";
import MenuBar from "./components/MenuBar/MenuBar";
import Calendar from "./components/Calendar/Calendar";
import Table from "./components/Table/Table";
import Summary from "./components/Summary/Summary";
import ExpenseForm from "./components/Form.tsx/ExpenseForm";
import Notification from "./components/Notification";

import { Expense } from "./Interfaces";



function App(): JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [notification, setNotification] = useState<boolean>(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);




  // Error/Info message handling
  const showNotification = (msg: string): void => {
    setMessage(msg);
    setNotification(true);
  };

  const closeNotification = (): void => {
    setNotification(false);
    setMessage(""); 
  };

  const handleEditExpense = (expense): void => {
    // console.log(expense)
    setEditExpense(expense)
    console.log(editExpense)

  }



  return (
    <>

      <MenuBar />
      <div className="relative w-screen h-screen px-4 py-4">

        {/* Expenses Table */}
        <div id="expenses-table" className="flex flex-row justify-between px-4 ">
          <div>
            <h1 className="text-xl font-bold mb-4">Expenses Table</h1>
            <Table showNotification={showNotification} handleEditExpense={handleEditExpense}/>
          </div>
        </div>


        {/* Calendar */}
        <div id="calendar" className="absolute top-2 right-8 2xl:right-32">
          <Calendar />
        </div>

        {/* Summary */}
        <div className="flex flex-row w-full justify-between">
          <div id="summary" className="xl:mt-16 mt-4 w-fit">
            <Summary />
          </div>
          <div id="expenseForm" className="xl:mr-24 xl:mt-16 mt-4">
            <ExpenseForm 
              showNotification={showNotification} 
              editExpense={editExpense}
              resetEditExpense={() => setEditExpense(null)}
            />
          </div>
        </div>
          {/* Notification Modal */}
          {notification && (
            <Notification message={message} onClose={closeNotification} />
          )}
      </div>
    </>
  )
}

export default App
