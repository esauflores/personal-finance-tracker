import type { Transaction } from '../types'

type TransactionsTableProps = {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps): React.ReactElement {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx: Transaction) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.amount}</td>
              <td>{tx.categoryId}</td>
              <td>{tx.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
