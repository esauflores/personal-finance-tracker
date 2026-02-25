export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type DefaultItem<TInput> = TInput & { id: string }

export type BaseStore<T extends BaseEntity, TInput> = {
  items: T[]
  seeded: boolean // Track if defaults have been seeded
  add: (input: TInput) => void
  remove: (id: string) => void
  update: (id: string, input: Partial<TInput>) => void
  getById: (id: string) => T | undefined
  getActive: () => T[]
  seedDefaults: () => void
}
