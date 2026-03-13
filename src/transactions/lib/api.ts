import type { Transaction, TransactionCategory } from '../types'

const categories: TransactionCategory[] = [
  { id: 'salary', name: 'Salary', type: 'income' },
  { id: 'food', name: 'Groceries', type: 'expense' },
]

const transactions: Transaction[] = [
  { id: '1', amount: 50, categoryId: 'food', date: '2024-06-01', note: 'Groceries' },
  { id: '2', amount: 1000, categoryId: 'salary', date: '2024-06-05', note: 'June Salary' },
]

export async function fetchCategories(): Promise<TransactionCategory[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories)
    }, 500)
  })
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Fetched transactions:', transactions)
      resolve(transactions)
    }, 500)
  })
}

export async function addTransaction(transaction: Transaction): Promise<Transaction> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // transactions.push(transaction) -- wont work
      // data is not persisted for now
      resolve(transaction)
    }, 500)
  })
}
