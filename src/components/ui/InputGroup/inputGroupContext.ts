import { createContext, useContext } from 'react'

export type InputGroupContextValue = {
  /** The id of the group's error message, which describes each of its fields. */
  errorId: string | undefined
}

export const InputGroupContext = createContext<InputGroupContextValue | null>(
  null,
)

/** The `InputGroup` a field is in, or `null` when it stands alone. */
export function useInputGroup() {
  return useContext(InputGroupContext)
}
