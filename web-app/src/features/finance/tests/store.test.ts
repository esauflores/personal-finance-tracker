import { describe, it, expect, beforeEach } from 'vitest'
import { useCategoryStore, useTransactionStore } from '../store'

describe('useCategoryStore', () => {
  beforeEach(() => {
    useCategoryStore.setState({ items: [] })
  })

  describe('seedDefaults', () => {
    it('should seed default categories when empty', () => {
      useCategoryStore.getState().seedDefaults()
      const items = useCategoryStore.getState().items
      expect(items.length).toBeGreaterThan(0)
      expect(items.find((c) => c.id === 'food')).toBeDefined()
    })

    it('should not seed if categories already exist', () => {
      useCategoryStore.getState().seedDefaults()
      const initialCount = useCategoryStore.getState().items.length
      useCategoryStore.getState().seedDefaults()
      expect(useCategoryStore.getState().items.length).toBe(initialCount)
    })
  })

  describe('CRUD operations', () => {
    it('should add category', () => {
      useCategoryStore.getState().add({ name: 'Custom', icon: '🎯', color: '#000' })
      const items = useCategoryStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('Custom')
    })

    it('should get category by id', () => {
      useCategoryStore.getState().add({ name: 'Test' })
      const id = useCategoryStore.getState().items[0].id
      const found = useCategoryStore.getState().getById(id)
      expect(found?.name).toBe('Test')
    })
  })
})

describe('useTransactionStore', () => {
  beforeEach(() => {
    useTransactionStore.setState({ items: [] })
    useCategoryStore.setState({ items: [] })
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
  })
})
