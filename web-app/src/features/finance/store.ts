import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isWithinInterval, parseISO } from 'date-fns'
import { createCrudMethods, type BaseStore } from '@/features/core'
import type { Category, CategoryInput, Transaction, TransactionInput } from './types'
import { DEFAULT_CATEGORIES, DEFAULT_TRANSACTIONS } from './defaults'

// Category Store
type CategoryStore = BaseStore<Category, CategoryInput>

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      ...createCrudMethods<Category, CategoryInput>(
        set,
        get,
        DEFAULT_CATEGORIES,
        (input, base) => ({ ...input, ...base }),
      ),
    }),
    { name: 'categories-storage' },
  ),
)

// Transaction Store
type TransactionStore = BaseStore<Transaction, TransactionInput> & {
  getByCategory: (categoryId: string) => Transaction[]
  getByDateRange: (start: string, end: string) => Transaction[]
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      ...createCrudMethods<Transaction, TransactionInput>(
        set,
        get,
        DEFAULT_TRANSACTIONS,
        (input, base) => ({ ...input, ...base }),
      ),

      getByCategory: (categoryId: string): Transaction[] => {
        return get().items.filter((t) => t.categoryId === categoryId && t.deletedAt === null)
      },

      getByDateRange: (start: string, end: string): Transaction[] => {
        const interval = { start: parseISO(start), end: parseISO(end) }
        return get().items.filter(
          (t) => t.deletedAt === null && isWithinInterval(parseISO(t.date), interval),
        )
      },
    }),
    { name: 'transactions-storage' },
  ),
)
