import { useEffect, useMemo, useState } from 'react'

import { TransactionForm, TransactionsTable } from '@/transactions/components'
import { addTransaction, fetchCategories, fetchTransactions } from '@/transactions/lib'
import type { Transaction, TransactionCategory } from '@/transactions/types'

export function TransactionsPage(): React.ReactElement {
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const balance = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch categories:', err)
      })

    fetchTransactions()
      .then(setTransactions)
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch transactions:', err)
      })
  }, [])

  function handleAddTransaction(data: Transaction): void {
    addTransaction(data)
      .then((data) => {
        setTransactions((prev) => [...prev, data])
      })
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction:', err)
      })
  }

  return (
    <div>
      <h1>Transactions</h1>
      <p>Here you can manage your transactions.</p>
      <TransactionForm categories={categories} onSubmit={handleAddTransaction} />
      <br />
      <h2>Balance: {balance.toFixed(2)}</h2>
      <TransactionsTable transactions={transactions} />
    </div>
  )
}
