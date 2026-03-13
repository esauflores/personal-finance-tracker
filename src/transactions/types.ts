export type TransactionCategory = {
  id: string
  name: string
  type: 'income' | 'expense'
}

export type Transaction = {
  id: string
  amount: number
  categoryId: string
  date: string
  note?: string
}
