

interface Props {
  allExpenses: number
  yearly: number;
  monthly: number;
  oneTime: number;

}


function Summary(props: Props) : JSX.Element {
  return (
    <div className="p-4 w-[300px]">
      <p className="mb-4 text-xl font-bold">Summary</p>
      {/* <p>All expenses: {props.allExpenses}</p>
      <p>Yearly: {props.yearly}</p>
      <p>Monthly: {props.monthly}</p>
      <p>One time: {props.oneTime}</p> */}

      <table className="table-auto  text-left  text-gray-500 text-xl">
        <tbody>
          <tr className="border-b">
            <td className="py-2 text-left">All expenses:</td>
            <td className="py-2 px-4 text-right">{props.allExpenses} PLN</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 ">Yearly:</td>
            <td className="py-2 px-4 text-right">{props.yearly} PLN</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Monthly:</td>
            <td className="py-2 px-4 text-right">{props.monthly} PLN</td>
          </tr>
          <tr>
            <td className="py-2 ">One time:</td>
            <td className="py-2 px-4 text-right">{props.oneTime} PLN</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Summary;