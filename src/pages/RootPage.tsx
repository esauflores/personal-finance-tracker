import { HelloMessage } from '@/shared/components'

export function RootPage(): React.ReactElement {
  return (
    <div>
      <HelloMessage name="World" />
    </div>
  )
}
