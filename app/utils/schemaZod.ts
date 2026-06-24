import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { defRegex } from './constants'

export const loginFormSchema = z.object({
  username: z
    .string()
    .nonempty()
    .refine(value => defRegex.username.val.test(value)),
  phone: z
    .string()
    .nonempty()
    .min(7)
    .max(21)
    .refine(value => defRegex.phone.val.test(value))
})

export const loginFormTypedSchema = toTypedSchema(loginFormSchema)
