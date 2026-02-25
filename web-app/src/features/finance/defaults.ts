import type { DefaultItem } from '@/features/core'
import type { CategoryInput, TransactionInput } from './types'

export const DEFAULT_CATEGORIES: DefaultItem<CategoryInput>[] = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#ef4444' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'shopping', name: 'Shopping', icon: '🛒', color: '#f59e0b' },
  { id: 'bills', name: 'Bills', icon: '📄', color: '#6b7280' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#10b981' },
  { id: 'salary', name: 'Salary', icon: '💰', color: '#22c55e' },
  { id: 'other', name: 'Other', icon: '📦', color: '#94a3b8' },
]

export const DEFAULT_TRANSACTIONS: DefaultItem<TransactionInput>[] = [
  { id: 'tx-1', amount: -45.5, categoryId: 'food', date: '2026-02-20', note: 'Groceries' },
  { id: 'tx-2', amount: -12.0, categoryId: 'transport', date: '2026-02-21', note: 'Bus pass' },
  {
    id: 'tx-3',
    amount: -89.99,
    categoryId: 'entertainment',
    date: '2026-02-22',
    note: 'Concert tickets',
  },
  { id: 'tx-4', amount: 2500.0, categoryId: 'salary', date: '2026-02-15', note: 'Monthly salary' },
  { id: 'tx-5', amount: -150.0, categoryId: 'bills', date: '2026-02-18', note: 'Electricity' },
  { id: 'tx-6', amount: -32.5, categoryId: 'food', date: '2026-02-23', note: 'Dinner out' },
  { id: 'tx-7', amount: -65.0, categoryId: 'health', date: '2026-02-19', note: 'Pharmacy' },
  { id: 'tx-8', amount: -120.0, categoryId: 'shopping', date: '2026-02-24', note: 'New shoes' },
]
