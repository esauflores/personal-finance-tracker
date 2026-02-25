import { describe, it, expect, beforeEach, vi } from 'vitest'
import { create } from 'zustand'
import { createCrudMethods } from '../store'
import type { BaseEntity, DefaultItem } from '../types'

type TestEntity = BaseEntity & { name: string }
type TestInput = Omit<TestEntity, keyof BaseEntity>
type TestDefault = DefaultItem<TestInput>

const TEST_DEFAULTS: TestDefault[] = [{ id: 'default-1', name: 'Default Item' }]

function createTestStore(defaults: TestDefault[] = []) {
  return create<{
    items: TestEntity[]
    seeded: boolean
    add: (input: TestInput) => void
    remove: (id: string) => void
    update: (id: string, input: Partial<TestInput>) => void
    getById: (id: string) => TestEntity | undefined
    getActive: () => TestEntity[]
    seedDefaults: () => void
  }>()((set, get) => ({
    ...createCrudMethods<TestEntity, TestInput>(set, get, defaults, (input, base) => ({
      ...input,
      ...base,
    })),
  }))
}

describe('createCrudMethods', () => {
  let useStore: ReturnType<typeof createTestStore>

  beforeEach(() => {
    useStore = createTestStore()
    vi.useFakeTimers()
  })

  describe('add', () => {
    it('should add item with generated id and timestamps', () => {
      useStore.getState().add({ name: 'Test' })
      const items = useStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('Test')
      expect(items[0].id).toBeDefined()
      expect(items[0].createdAt).toBeDefined()
      expect(items[0].updatedAt).toBeDefined()
      expect(items[0].deletedAt).toBeNull()
    })

    it('should add multiple items with unique ids', () => {
      useStore.getState().add({ name: 'First' })
      useStore.getState().add({ name: 'Second' })
      useStore.getState().add({ name: 'Third' })
      const items = useStore.getState().items
      expect(items).toHaveLength(3)
      const ids = items.map((item) => item.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(3)
    })
  })

  describe('remove', () => {
    it('should soft delete item by setting deletedAt', () => {
      useStore.getState().add({ name: 'Test' })
      const id = useStore.getState().items[0].id
      useStore.getState().remove(id)
      const item = useStore.getState().items[0]
      expect(item.deletedAt).not.toBeNull()
    })

    it('should not fail for non-existent id', () => {
      useStore.getState().add({ name: 'Test' })
      expect(() => {
        useStore.getState().remove('non-existent')
      }).not.toThrow()
      expect(useStore.getState().items).toHaveLength(1)
      expect(useStore.getState().items[0].deletedAt).toBeNull()
    })
  })

  describe('update', () => {
    it('should update item and set updatedAt', () => {
      useStore.getState().add({ name: 'Test' })
      const item = useStore.getState().items[0]
      const originalUpdatedAt = item.updatedAt
      vi.advanceTimersByTime(1000)
      useStore.getState().update(item.id, { name: 'Updated' })
      const updated = useStore.getState().items[0]
      expect(updated.name).toBe('Updated')
      expect(updated.updatedAt).not.toBe(originalUpdatedAt)
    })

    it('should not fail for non-existent id', () => {
      useStore.getState().add({ name: 'Test' })
      expect(() => {
        useStore.getState().update('non-existent', { name: 'Updated' })
      }).not.toThrow()
      expect(useStore.getState().items[0].name).toBe('Test')
    })
  })

  describe('getById', () => {
    it('should return item by id', () => {
      useStore.getState().add({ name: 'Test' })
      const id = useStore.getState().items[0].id
      const found = useStore.getState().getById(id)
      expect(found?.name).toBe('Test')
    })

    it('should return undefined for non-existent id', () => {
      const found = useStore.getState().getById('non-existent')
      expect(found).toBeUndefined()
    })
  })

  describe('getActive', () => {
    it('should return only non-deleted items', () => {
      useStore.getState().add({ name: 'Active' })
      useStore.getState().add({ name: 'Deleted' })
      const deletedId = useStore.getState().items[1].id
      useStore.getState().remove(deletedId)
      const active = useStore.getState().getActive()
      expect(active).toHaveLength(1)
      expect(active[0].name).toBe('Active')
    })

    it('should return empty array when all items deleted', () => {
      useStore.getState().add({ name: 'Item1' })
      useStore.getState().add({ name: 'Item2' })
      useStore.getState().items.forEach((item) => {
        useStore.getState().remove(item.id)
      })
      const active = useStore.getState().getActive()
      expect(active).toHaveLength(0)
    })
  })

  describe('seedDefaults', () => {
    it('should seed defaults when not seeded', () => {
      const storeWithDefaults = createTestStore(TEST_DEFAULTS)
      storeWithDefaults.getState().seedDefaults()
      expect(storeWithDefaults.getState().items).toHaveLength(1)
      expect(storeWithDefaults.getState().items[0].name).toBe('Default Item')
      expect(storeWithDefaults.getState().seeded).toBe(true)
    })

    it('should not seed again if already seeded', () => {
      const storeWithDefaults = createTestStore(TEST_DEFAULTS)
      storeWithDefaults.getState().seedDefaults()
      storeWithDefaults.getState().add({ name: 'New' })
      storeWithDefaults.getState().seedDefaults()
      expect(storeWithDefaults.getState().items).toHaveLength(2)
    })
  })
})
