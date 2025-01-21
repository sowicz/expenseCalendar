


interface ShowMonthProps {
  handleSelectMonth: (month: number) => void;
}

const months: string[] = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];


function ShowMonth({handleSelectMonth}:ShowMonthProps):JSX.Element {

  return(
    <div
      className="absolute top-10 left-1/2 transform -translate-x-1/2 
             bg-gray-200 text-neutral-700 shadow-lg border rounded-lg 
             z-10 grid grid-cols-3 gap-4 p-4 w-96"
    >
      {months.map((month, index) => (
        <div
          key={month}
          onClick={() => handleSelectMonth(index)}
          className="px-4 py-2 hover:bg-blue-300 cursor-pointer hover:rounded-lg"
        >
          {month}
        </div>
      ))}
    </div>
  )
};


export default ShowMonth;