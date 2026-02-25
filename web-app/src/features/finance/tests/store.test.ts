import { describe, it, expect, beforeEach } from 'vitest'
import { useCategoryStore, useTransactionStore } from '../store'

describe('useCategoryStore', () => {
  beforeEach(() => {
    useCategoryStore.setState({ items: [], seeded: false })
  })

  describe('seedDefaults', () => {
    it('should seed default categories when empty', () => {
      useCategoryStore.getState().seedDefaults()
      const items = useCategoryStore.getState().items
      expect(items.length).toBeGreaterThan(0)
      expect(items.find((c) => c.id === 'food')).toBeDefined()
    })

    it('should not seed if already seeded', () => {
      useCategoryStore.getState().seedDefaults()
      const initialCount = useCategoryStore.getState().items.length
      useCategoryStore.getState().seedDefaults()
      expect(useCategoryStore.getState().items.length).toBe(initialCount)
    })
  })
})

describe('useTransactionStore', () => {
  beforeEach(() => {
    useTransactionStore.setState({ items: [], seeded: false })
    useCategoryStore.setState({ items: [], seeded: false })
    useCategoryStore.getState().seedDefaults()
  })

  describe('seedDefaults', () => {
    it('should seed default transactions when empty', () => {
      useTransactionStore.getState().seedDefaults()
      const items = useTransactionStore.getState().items
      expect(items.length).toBeGreaterThan(0)
    })
  })

  describe('getByCategory', () => {
    it('should return transactions for category', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-25',
      })
      useTransactionStore.getState().add({
        amount: -20,
        categoryId: 'transport',
        date: '2026-02-25',
      })
      const foodTransactions = useTransactionStore.getState().getByCategory('food')
      expect(foodTransactions).toHaveLength(1)
      expect(foodTransactions[0].amount).toBe(-50)
    })

    it('should exclude deleted transactions', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-25',
      })
      const id = useTransactionStore.getState().items[0].id
      useTransactionStore.getState().remove(id)
      const foodTransactions = useTransactionStore.getState().getByCategory('food')
      expect(foodTransactions).toHaveLength(0)
    })

    it('should return empty array for non-existent category', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-25',
      })
      const transactions = useTransactionStore.getState().getByCategory('non-existent')
      expect(transactions).toHaveLength(0)
    })
  })

  describe('getByDateRange', () => {
    it('should return transactions within date range', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-15',
      })
      useTransactionStore.getState().add({
        amount: -30,
        categoryId: 'food',
        date: '2026-02-20',
      })
      useTransactionStore.getState().add({
        amount: -10,
        categoryId: 'food',
        date: '2026-02-28',
      })
      const inRange = useTransactionStore.getState().getByDateRange('2026-02-14', '2026-02-21')
      expect(inRange).toHaveLength(2)
    })

    it('should return empty array for range with no transactions', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-15',
      })
      const inRange = useTransactionStore.getState().getByDateRange('2026-03-01', '2026-03-31')
      expect(inRange).toHaveLength(0)
    })

    it('should include boundary dates', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-15',
      })
      useTransactionStore.getState().add({
        amount: -30,
        categoryId: 'food',
        date: '2026-02-20',
      })
      const inRange = useTransactionStore.getState().getByDateRange('2026-02-15', '2026-02-20')
      expect(inRange).toHaveLength(2)
    })

    it('should exclude deleted transactions', () => {
      useTransactionStore.getState().add({
        amount: -50,
        categoryId: 'food',
        date: '2026-02-15',
      })
      const id = useTransactionStore.getState().items[0].id
      useTransactionStore.getState().remove(id)
      const inRange = useTransactionStore.getState().getByDateRange('2026-02-01', '2026-02-28')
      expect(inRange).toHaveLength(0)
    })
  })
})
