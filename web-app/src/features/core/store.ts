import type { BaseEntity, DefaultItem } from './types'
import { now } from './utils'

type State<T> = { items: T[]; seeded: boolean }
type SetFn<T> = (partial: Partial<State<T>> | ((state: State<T>) => Partial<State<T>>)) => void
type GetFn<T> = () => State<T>

type BaseFields = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: null
}

type CreateEntity<T, TInput> = (input: TInput, base: BaseFields) => T

export function createCrudMethods<T extends BaseEntity, TInput>(
  set: SetFn<T>,
  get: GetFn<T>,
  defaults: DefaultItem<TInput>[] = [],
  createEntity: CreateEntity<T, TInput>,
) {
  return {
    items: [] as T[],
    seeded: false,

    add: (input: TInput): void => {
      const timestamp = now()
      const item = createEntity(input, {
        id: crypto.randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })
      set((state) => ({ items: [...state.items, item] }))
    },

    remove: (id: string): void => {
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? { ...item, deletedAt: now() } : item)),
      }))
    },

    update: (id: string, input: Partial<TInput>): void => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...input, updatedAt: now() } : item,
        ),
      }))
    },

    getById: (id: string): T | undefined => {
      return get().items.find((item) => item.id === id)
    },

    getActive: (): T[] => {
      return get().items.filter((item) => item.deletedAt === null)
    },

    seedDefaults: (): void => {
      if (!get().seeded) {
        const timestamp = now()
        const items = defaults.map((defaultItem) =>
          createEntity(defaultItem, {
            id: defaultItem.id,
            createdAt: timestamp,
            updatedAt: timestamp,
            deletedAt: null,
          }),
        )
        set({ items, seeded: true })
      }
    },
  }
}
