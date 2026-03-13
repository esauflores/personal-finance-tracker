import { format } from 'date-fns'

import type { Transaction, TransactionCategory } from '../types'

type TransactionFormProps = {
  categories: TransactionCategory[]
  onSubmit: (data: Transaction) => void
}

export function TransactionForm({
  categories,
  onSubmit,
}: TransactionFormProps): React.ReactElement {
  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const categoryId = formData.get('Description') as string
    const category = categories.find((c) => c.id === categoryId)
    const amount = Number(formData.get('Amount'))

    if (!category) {
      // eslint-disable-next-line no-console
      console.error('Selected category not found:', categoryId)
      return
    }

    onSubmit({
      id: Date.now().toString(),
      amount: category.type === 'expense' ? -amount : amount,
      categoryId: categoryId,
      date: formData.get('Date') as string,
      note: (formData.get('Note') as string) || undefined,
    })
    event.currentTarget.reset()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Amount">Amount:</label>
          <input type="number" id="Amount" name="Amount" min="0.01" step="0.01" required />
        </div>
        <div>
          <label htmlFor="Description">Category:</label>
          <select id="Description" name="Description" required>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="Date">Date:</label>
          <input
            type="date"
            id="Date"
            name="Date"
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>
        <div>
          <label htmlFor="Note">Note:</label>
          <input type="text" id="Note" name="Note" />
        </div>
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  )
}
