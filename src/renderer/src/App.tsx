import { useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import Table from "./components/Table/Table";
import Summary from "./components/Summary/Summary";
import ExpenseForm from "./components/Form.tsx/ExpenseForm";


const data  = {
  allExpenses: 100,
  yearly: 29.99,
  monthly: 99.1,
  oneTime: 11
} 


function App(): JSX.Element {
  const [clickedDay, setClickedDay] = useState(0);

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');


  const highlightedDays = [3, 7, 15, 23]; 
  const handleDayClick = (day: number) => {
    alert(`Kliknięto dzień: ${day}`);
    setClickedDay(day);
  };
  return (
    <div className="relative w-screen h-screen px-4 py-8">

      {/* Expenses Table */}
      <div id="expenses-table" className="flex flex-row justify-between px-4 py-2">
        <div>
          <h1 className="text-xl font-bold mb-4">Expenses Table</h1>
          <Table />
        </div>
      </div>

      {/* <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
        Send IPC
      </a> */}

      {/* Calendar */}
      <div id="calendar" className="absolute top-8 right-8 2xl:right-32">
        <Calendar highlightedDays={highlightedDays} onDayClick={handleDayClick} />
      </div>

      {/*  */}
      <div className="flex flex-row w-full justify-between">
        <div id="summary" className="xl:mt-16 mt-4 w-fit">
          <Summary
            allExpenses={data.allExpenses}
            yearly={data.yearly}
            monthly={data.monthly}
            oneTime={data.oneTime}
          />
        </div>
        <div id="expenseForm" className="xl:mr-24 xl:mt-16 mt-4">
          <ExpenseForm clickedDay={clickedDay}/>
        </div>
      </div>
    </div>
  )
}

export default App
