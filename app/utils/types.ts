import type { AsyncDataOptions } from 'nuxt/app'
type BaseButtonVariant = (typeof defVariant)[keyof typeof defVariant]['val']
type BaseSize = (typeof defSize)[keyof typeof defSize]['val']

export interface FetchError {
  status?: number
  message?: string
}

export interface ServiceResponse<T> {
  data: Ref<T | null>
  pending: Ref<boolean>
  error: Ref<string>
}

export interface RunAsyncOptions<T = any> {
  asyncOptions?: AsyncDataOptions<T>
  errorOptions?: { fatal?: boolean }
}

export interface BaseButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: BaseButtonVariant
  size?: BaseSize
  rounded?: BaseSize
  loading?: boolean
  disabled?: boolean
  block?: boolean
  icon?: string
  class?: string
  iconClass?: string
  to?: string
  href?: string
}

export interface BaseInputProps {
  modelValue: string | number | null
  label?: string
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'url' | 'tel' | 'number' | 'search'
  size?: BaseSize
  error?: string
  disabled?: boolean
  name?: string
  autocomplete?: string
  class?: string
  controlClass?: string
  inputClass?: string
  rules?: Array<(val: any) => string | boolean>
}

export interface BaseSelectOption {
  label: string
  value: string | number
}

export interface BaseSelectProps {
  modelValue: string | number | null
  options?: BaseSelectOption[]
  label?: string
  placeholder?: string
  size?: BaseSize
  error?: string
  disabled?: boolean
  name?: string
  class?: string
}

export interface BasePaginationProps {
  modelValue: number
  totalItems: number
  perPage: number
}

export interface BaseCheckboxProps {
  modelValue?: boolean
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  name?: string
}

export interface BaseSwitchProps {
  modelValue?: boolean
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  name?: string
  icon?: string
}

export interface BaseRadioboxProps {
  modelValue?: string | number | boolean | null
  value: string | number | boolean
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  name?: string
}

export interface BaseMenuItemProps {
  label?: string
  icon?: string
  to?: string
  href?: string
  click?: () => void
  class?: string
  [key: string]: any
}

export interface BaseMenuProps {
  items?: BaseMenuItemProps[]
  block?: boolean
  class?: string
  position?: 'left' | 'right'
}

export interface BaseAlertProps {
  type?: 'success' | 'info' | 'warning' | 'error'
  message?: string
  show?: boolean
}

export interface BaseModalProps {
  modelValue?: boolean
  title?: string
  description?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  showClose?: boolean
  widthClass?: string
}

export interface LoginForm {
  username: string
  phone: string
}

export interface LoginPayload {
  username: string
  phone: string
}

export interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface JsonPlaceholderTodo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export type TodoStatusFilter =
  (typeof defTodoStatusFilter)[keyof typeof defTodoStatusFilter]['val']
