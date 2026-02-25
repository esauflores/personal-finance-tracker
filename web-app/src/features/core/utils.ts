import { formatISO } from 'date-fns'

export const now = (): string => formatISO(new Date())
