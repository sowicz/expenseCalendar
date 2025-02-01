import { useState, useEffect } from "react";
import { Expense } from "@renderer/Interfaces";
import "./styleTable.css";

interface NotificationProps {
  showNotification: (message:string) => void;
  handleEditExpense: (expense: Expense) => void;
}



function Table({ handleEditExpense}: NotificationProps): JSX.Element {
  const [data, setData] = useState<Expense[]>([]);

  

  useEffect(() => {
    const loadExpenses = () => {
      window.electron.ipcRenderer.send("request-expenses");
      
    };
    const handleMessage = (message) => {
      if (message.error) {
        setData([]);
      } else {
        setData(message);
      }
    };

    // Initial load of expenses
    loadExpenses();


    const handleStatus = (message) => {
      if (message) {
        loadExpenses();
      };
    };

    // Listen for updates after add or delete
    window.electron.ipcRenderer.on("add-status", handleStatus)
    window.electron.ipcRenderer.on("delete-status", handleStatus)
    window.electron.ipcRenderer.on("response-expenses", handleMessage);

    // Cleanup listeners
    return () => {
      window.electron.ipcRenderer.on("response-expenses", () => {});
      window.electron.ipcRenderer.on("add-status", () => {});
      window.electron.ipcRenderer.on("delete-status", () => {});
    };
  }, []);

  

  return (
    <div className="overflow-x-auto scrollbar-container h-[240px] max-h-[240px] xl:max-w-[900px] max-w-[540px] xl:w-[900px] overflow-y-auto ">
      <table className="min-w-full table-auto ">
        <thead className="bg-gray-300 text-gray-800 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold max-w-[180px]">Description</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[60px]">Price</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[120px]">Payment Day</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[80px]">Interval</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[50px]">Edit</th>
          </tr>
        </thead>
        <tbody className=" text-gray-400 ">
          {data.map((data) => (
            <tr key={data.id} className="border-b">
              <td className="px-4 py-2 text-sm max-w-[180px] overflow-hidden text-ellipsis break-words">
                {data.Description}
              </td>
              {/* <td className="px-4 py-2 text-sm">{item.amount.toFixed(2)}</td> */}
              <td className="px-4 py-2 text-sm">{data.Amount.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm">{data.StartDate}</td>
              <td className={`px-4 py-2 text-sm `}>
                <span className={` px-2 py-1 rounded-lg
                  ${data.Interval == "onetime" ? "bg-emerald-200 text-green-900" :
                  data.Interval == "yearly" ? "bg-yellow-200 text-yellow-900" : data.Interval == "monthly" ? "bg-blue-200 text-blue-900" : "" }  
                  `}>
                  {data.Interval}
                </span>
              </td>
              <td className="px-4 py-2 text-sm">
                <button onClick={()=> handleEditExpense(data)}>
                  <svg fill="#ababab" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M45.5,17l-3.4,3.5c-0.6,0.6-0.9,1.3-0.9,2.1V40c0,0.8-0.7,1.5-1.5,1.5h-27c-0.8,0-1.5-0.7-1.5-1.5V13 c0-0.8,0.7-1.5,1.5-1.5h17.5c0.8,0,1.6-0.3,2.1-0.9l3.4-3.4c0.6-0.6,0.2-1.7-0.7-1.7H9.2c-2.2,0-4,1.8-4,4v34c0,2.2,1.8,4,4,4h34 c2.2,0,4-1.8,4-4V17.7C47.2,16.8,46.1,16.4,45.5,17z"></path> <path d="M18.9,30.7l3.7,3.7c0.2,0.2,0.4,0.2,0.6,0l19.4-19.9c0.2-0.2,0.2-0.4,0-0.6L39,10.3c-0.2-0.2-0.4-0.2-0.6,0 L18.9,30.1C18.7,30.3,18.7,30.5,18.9,30.7z"></path> <path d="M40.1,8.6c-0.2,0.2-0.2,0.4,0,0.6l3.6,3.6c0.2,0.2,0.4,0.2,0.6,0l2.5-2.5c0.7-0.6,0.7-1.6,0-2.3l-1.8-1.8 c-0.7-0.7-1.7-0.7-2.4,0C42.5,6.2,40.1,8.6,40.1,8.6z"></path> <path d="M15.6,36.9c-0.1,0.4,0.3,0.8,0.7,0.7c0.6-0.2,1.3-0.3,1.9-0.5c0.5-0.1,1-0.2,1.5-0.4c0.5-0.1,1-0.2,1.4-0.4 c0.2-0.1,0.6-0.5,0.3-0.8c0,0-3.8-3.8-3.8-3.8c-0.3-0.3-0.6,0-0.7,0.2c-0.3,0.4-0.4,1-0.5,1.4c-0.1,0.5-0.3,1-0.4,1.5 C15.9,35.7,15.8,36.3,15.6,36.9z">
                    </path> </g>
                  </svg>  
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
