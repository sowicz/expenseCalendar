import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import ShowMonth from "./ShowMonth";


const nameOfDays: string[] = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];


function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [isMonthPickerOpen, setMonthPickerOpen] = useState(false);
  const [monthly, setMonthly] = useState<number[]>([]);
  const [oneTimeDays, setOneTimeDays] = useState<number[]>([]);
  const [yearlyDays, setYearlyDays] = useState<number[]>([]);


  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();
  const monthName = currentDate.format("MMMM YYYY");
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);


  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const handleSelectMonth = (month: number) => {
    setCurrentDate(currentDate.month(month));
    setMonthPickerOpen(false);
  };


  const parseMonthlyArray = (arr: string[]): number[] => {
    return arr.map((el) => parseInt(el.substring(8, 10)));
  };


  const parseOneTimeArray = (arr: string[]): number[] => {
    return arr
      .map(dateStr => dateStr.split("-"))
      .filter(([year, month]) => 
        parseInt(year, 10) === currentDate.year() &&  // ✅ Match year
        parseInt(month, 10) === currentDate.month() + 1 // ✅ Match month
      )
      .map(([_, __, day]) => parseInt(day, 10));
  };


  const parseYearlyArray = (arr: string[]): number[] => {
    return arr
      .map(dateStr => dateStr.split("-"))
      .filter(([_, month]) => 
        parseInt(month, 10) === currentDate.month() + 1)
      .map(([_, __, day]) => parseInt(day, 10));
  };
  
  

  useEffect(() => {
    window.electron.ipcRenderer.send("get-expenses");

    const handleMessage = (data) => {
      if ("error" in data) {
      } else {
        setMonthly(parseMonthlyArray(data.monthly));
        setOneTimeDays(parseOneTimeArray(data.oneTime));
        setYearlyDays(parseYearlyArray(data.yearly))

      }
    };

    window.electron.ipcRenderer.on("get-expenses-response", handleMessage);
    return () => {
      window.electron.ipcRenderer.on("get-expenses-response", () => {});
    };
  }, [currentDate]);

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-2 relative">
        <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-gray-900">
          &larr;
        </button>
        <div className="relative">
          <h2 onClick={() => setMonthPickerOpen((prev) => !prev)} className="text-xl font-bold text-center cursor-pointer">
            {monthName}
          </h2>
          {isMonthPickerOpen && <ShowMonth handleSelectMonth={handleSelectMonth} />}
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-900">
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {nameOfDays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth - 1 }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const isMonthlyExpense = monthly.includes(day);
          const isOneTimeExpense = oneTimeDays.includes(day);
          const isYearlyExpense = yearlyDays.includes(day);

          return (
            <div
              key={day}
              className={`flex items-center justify-center p-2 rounded-md
                ${
                  isMonthlyExpense ? "bg-blue-500 text-white" :
                  isOneTimeExpense ? "bg-green-500 text-white" :
                  isYearlyExpense ? "bg-yellow-500 text-white" :
                  "bg-gray-100 text-gray-900"
                }`}
              >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
