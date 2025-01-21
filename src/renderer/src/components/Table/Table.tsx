import "./styleTable.css";

interface TableProps {
  data: {
    id: number;
    expense_description: string;
    price: number;
    payment_day: string;
    one_time_pay: boolean;
  }[];
}


const expenses = [
  { 
    id: 1,
    expense_description: 'Electricity bill',
    price: 120.50,
    payment_day: '2025-01-20',
    one_time_pay: true,
  },
  {
    id: 2,
    expense_description: 'Internet subscription',
    price: 50.00,
    payment_day: '2025-01-25',
    one_time_pay: false,
  },
  {
    id: 3,
    expense_description: 'Water bill',
    price: 45.75,
    payment_day: '2025-02-10',
    one_time_pay: true,
  },
  {
    id: 4,
    expense_description: 'Water bill',
    price: 45.75,
    payment_day: '2025-02-10',
    one_time_pay: true,
  },
  {
    id: 5,
    expense_description: 'Water bill',
    price: 45.75,
    payment_day: '2025-02-10',
    one_time_pay: true,
  },
  {
    id: 6,
    expense_description: 'Water bill',
    price: 45.75,
    payment_day: '2025-02-10',
    one_time_pay: true,
  },
];

// function Table({ data }: TableProps): JSX.Element {
function Table(): JSX.Element {

  return (
    <div className="overflow-x-auto scrollbar-container shadow-md max-h-[240px] xl:max-w-[900px]  max-w-[540px] xl:w-[900px] overflow-y-auto ">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-gray-800 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold max-w-[180px]">Description</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[60px]">Price</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[120px]">Payment Day</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[80px]">OneTime</th>
            <th className="px-4 py-2 text-left text-sm font-semibold min-w-[50px]">Edit</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-700">
          {expenses.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2 text-sm max-w-[180px] overflow-hidden text-ellipsis break-words">
                {item.expense_description}
              </td>
              <td className="px-4 py-2 text-sm">{item.price.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm">{item.payment_day}</td>
              <td className="px-4 py-2 text-sm">{item.one_time_pay ? 'Yes' : ''}</td>
              <td className="px-4 py-2 text-sm">click</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
