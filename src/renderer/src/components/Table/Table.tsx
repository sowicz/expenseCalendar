import { useState, useEffect } from "react";
import "./styleTable.css";

interface NotificationProps {
  showNotification: (message:string) => void;
}

interface Expense {
  expense_description: string;
  price: number;
  payment_day: string;
  interval: string;
}


const expenses = [
  { 
    expense_description: 'Electricity bill',
    price: 120.50,
    payment_day: 20,
    interval: 'month',
  }
];

function Table({showNotification}: NotificationProps): JSX.Element {
  const [data, setData] = useState<Expense[]>([]);


  useEffect(() => {
    // Send a request to load CSV data
    window.electron.ipcRenderer.send('request-expenses');

    const handleMessage = (message: string) => {
      console.log("Received message:", message);
    };

    window.electron.ipcRenderer.on('request-expenses', handleMessage);
    // Listen for the response
    // window.electron.ipcRenderer.on("send-expenses", (response) => {
    //   console.log(response)
    //   // if (response) {
    //   //   showNotification(response);
    //   // } else {
    //   //   setData(response);
    //   // }
    // });


  }, []);
  

  return (
    <div className="overflow-x-auto scrollbar-container shadow-md h-[240px] max-h-[240px] xl:max-w-[900px]  max-w-[540px] xl:w-[900px] overflow-y-auto ">
      <table className="min-w-full table-auto ">
        <thead className="bg-gray-100 text-gray-800 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold max-w-[180px]">Description</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[60px]">Price</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[120px]">Payment Day</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[80px]">Interval</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[50px]">Edit</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-700 ">
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2 text-sm max-w-[180px] overflow-hidden text-ellipsis break-words">
                {item.expense_description}
              </td>
              <td className="px-4 py-2 text-sm">{item.price.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm">{item.payment_day}</td>
              <td className="px-4 py-2 text-sm">{item.interval}</td>
              <td className="px-4 py-2 text-sm">click</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
