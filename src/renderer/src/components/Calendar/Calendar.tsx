import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ShowMonth from './ShowMonth';

interface CalendarProps {
  highlightedDays: number[];
  onDayClick?: (day: number) => void;
}

const nameOfDays: string[] = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];




function Calendar({highlightedDays, onDayClick}:CalendarProps): JSX.Element {

  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [isMonthPickerOpen, setMonthPickerOpen] = useState(false); // Stan do obsługi menu wyboru miesiąca

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day(); // Pierwszy dzień miesiąca (1 = poniedziałek)
  const monthName = currentDate.format('MMMM YYYY'); // Nazwa miesiąca i rok

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
  const handleSelectMonth = (month: number) => {
    setCurrentDate(currentDate.month(month));
    setMonthPickerOpen(false); 
  };

  return (
    <div className="max-w-md ">
      {/* Month header */}
      <div className="flex items-center justify-between mb-2 relative">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-gray-900"
        >
          &larr;
        </button>

        <div className="relative">
          {/* Month name*/}
          <h2
            onClick={() => setMonthPickerOpen((prev) => !prev)}
            className="text-xl font-bold text-center cursor-pointer"
          >
            {monthName}
          </h2>
          {/* Select month show */}
          {isMonthPickerOpen && ( <ShowMonth handleSelectMonth={handleSelectMonth}/>)}
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-900"
        >
          &rarr;
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Name of day header */}
        {nameOfDays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700">
            {day}
          </div>
        ))}

        {/* Empty grid if no day in month */}
        {Array.from({ length: firstDayOfMonth - 1 }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {/* Days of the month */}
        {days.map((day) => {
          const isHighlighted = highlightedDays.includes(day);
          return (
            <div
              key={day}
              onClick={() => onDayClick?.(day)}
              className={`flex items-center justify-center p-2 rounded-md cursor-pointer
                ${
                  isHighlighted
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-blue-100 '
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
