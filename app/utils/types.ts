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

export interface RunAsyncOptions {
  asyncOptions?: AsyncDataOptions<any>
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
  rules?: Array<(val: any) => string | boolean>
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
  contact: string
  password: string
  serverError: string
  isPasswordShow: boolean
}
