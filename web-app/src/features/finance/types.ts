import type { BaseEntity } from '@/features/core'

// Categories
export type Category = BaseEntity & {
  name: string
  icon?: string
  color?: string
}

export type CategoryInput = Omit<Category, keyof BaseEntity>

// Transactions
export type Transaction = BaseEntity & {
  amount: number
  categoryId: string
  date: string
  note?: string
}

export type TransactionInput = Omit<Transaction, keyof BaseEntity>
