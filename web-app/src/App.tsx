import { useEffect, useState } from 'react'
import { useCategoryStore, useTransactionStore } from '@/features/finance'

function App() {
  const { seedDefaults: seedCategories, getActive: getActiveCategories } = useCategoryStore()
  const {
    seedDefaults: seedTransactions,
    add: addTransaction,
    remove: removeTransaction,
    getActive: getActiveTransactions,
  } = useTransactionStore()

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [filterYear, setFilterYear] = useState(currentYear)
  const [filterMonth, setFilterMonth] = useState(currentMonth)
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    seedCategories()
    seedTransactions()
  }, [seedCategories, seedTransactions])

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!amount || !categoryId || !date) return

    addTransaction({
      amount: parseFloat(amount),
      categoryId,
      date,
      note: note || undefined,
    })

    setAmount('')
    setCategoryId('')
    setDate('')
    setNote('')
  }

  const activeCategories = getActiveCategories()
  const activeTransactions = getActiveTransactions()

  const filteredTransactions = activeTransactions
    .filter((tx) => {
      const txDate = new Date(tx.date)
      return txDate.getFullYear() === filterYear && txDate.getMonth() + 1 === filterMonth
    })
    .sort((a, b) => (sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))

  const total = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Tracker</h1>

      <h2 className="text-xl font-semibold mb-2">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <div>
          <label className="mr-2">Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="-50.00"
            className="border px-2 py-1"
          />
        </div>
        <div>
          <label className="mr-2">Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Select...</option>
            {activeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1"
          />
        </div>
        <div>
          <label className="mr-2">Note:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            className="border px-2 py-1"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-1">
          Add
        </button>
      </form>

      <div className="mb-4 flex gap-4 items-center">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(Number(e.target.value))}
          className="border px-2 py-1"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(Number(e.target.value))}
          className="border px-2 py-1"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <span className="text-gray-500">({filteredTransactions.length} items)</span>
        <button onClick={() => setSortAsc(!sortAsc)} className="border px-2 py-1 text-sm">
          {sortAsc ? '↑ Oldest' : '↓ Newest'}
        </button>
      </div>

      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Note</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((tx) => {
            const category = activeCategories.find((c) => c.id === tx.categoryId)
            return (
              <tr key={tx.id} className="border-b">
                <td className="p-2">{tx.date}</td>
                <td className="p-2">
                  {category?.icon} {category?.name}
                </td>
                <td className="p-2">{tx.amount.toFixed(2)}</td>
                <td className="p-2">{tx.note}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeTransaction(tx.id)}
                    className="bg-red-500 text-white px-2 py-1 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t font-semibold">
            <td className="p-2" colSpan={2}>
              Balance
            </td>
            <td className="p-2">{total.toFixed(2)}</td>
            <td className="p-2" colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default App
