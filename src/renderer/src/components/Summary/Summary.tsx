import { useEffect, useState } from "react";

interface ExpenseSummary {
  allExpenses: number
  yearly: number;
  monthly: number;
  oneTime: number;

}

const defaultSummaryData: ExpenseSummary = {
  allExpenses: 0,
  yearly: 0,
  monthly: 0,
  oneTime: 0,
};



function Summary() : JSX.Element {
  const [summaryData, setSummaryData] = useState<ExpenseSummary>(defaultSummaryData)

  useEffect(() => {
    const calculateSummary = () => {
      window.electron.ipcRenderer.send("calculate-expenses");
    }

    const handleMessage = (data) => {
      if ("error" in data) {
        setSummaryData(defaultSummaryData);
      } else {
        setSummaryData(data);
      }
    };

    // Initial load
    calculateSummary()


    const handleStatus = (message) => {
      if (message) {
        calculateSummary();
      };
    };

    // Listen for updates after add or delete
    window.electron.ipcRenderer.on("add-status", handleStatus)
    window.electron.ipcRenderer.on("delete-status", handleStatus)
    window.electron.ipcRenderer.on("response-expenses", handleStatus);
    window.electron.ipcRenderer.on("calculate-expenses-response", handleMessage)

    // Cleanup listeners
    return () => {
      window.electron.ipcRenderer.on("response-expenses", () => {});
      window.electron.ipcRenderer.on("add-status", () => {});
      window.electron.ipcRenderer.on("delete-status", () => {});
    };

  }, []) 



  return (
    <div className="p-4 w-[300px]">
      <p className="mb-4 text-xl font-bold">Summary</p>

      <table className="table-auto  text-left  text-gray-500 text-xl">
        <tbody>
          <tr className="border-b">
            <td className="py-2 text-left">All expenses:</td>
            <td className="py-2 px-4 text-right">{summaryData.allExpenses} PLN</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 ">Yearly:</td>
            <td className="py-2 px-4 text-right">{summaryData.yearly} PLN</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Monthly:</td>
            <td className="py-2 px-4 text-right">{summaryData.monthly} PLN</td>
          </tr>
          <tr>
            <td className="py-2 ">One time:</td>
            <td className="py-2 px-4 text-right">{summaryData.oneTime} PLN</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Summary;