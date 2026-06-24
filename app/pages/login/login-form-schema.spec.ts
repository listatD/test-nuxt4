import { describe, expect, it } from 'vitest'
import { loginFormSchema } from '@/utils/schemaZod'
import { zodMapError } from '@/utils/mapError'

const t = (key: string, params?: Record<string, unknown>) => {
  if (!params) return key

  return Object.entries(params).reduce(
    (message, [paramKey, value]) => message.replace(`{${paramKey}}`, String(value)),
    key
  )
}

const getIssue = (values: { username: string; phone: string }) => {
  const result = loginFormSchema.safeParse(values)

  if (result.success) return null

  return result.error.issues[0]
}

describe('loginFormSchema', () => {
  it('accepts username letters and phone numbers with phone symbols', () => {
    const result = loginFormSchema.safeParse({
      username: 'Dmitry',
      phone: '+1 (234) 567-890'
    })

    expect(result.success).toBe(true)
  })

  it('accepts jsonplaceholder phone numbers', () => {
    const phones = [
      '1-770-736-8031 x56442',
      '010-692-6593 x09125',
      '1-463-123-4447',
      '493-170-9623 x156',
      '(254)954-1289',
      '1-477-935-8478 x6430',
      '210.067.6132',
      '586.493.6943 x140',
      '(775)976-6794 x41206',
      '024-648-3804'
    ]

    expect(
      phones.every(phone =>
        loginFormSchema.safeParse({
          username: 'Dmitry',
          phone
        }).success
      )
    ).toBe(true)
  })

  it('returns letters-only error for username with non-letter characters', () => {
    const issue = getIssue({
      username: 'Dmitry123',
      phone: '+1 (234) 567-890'
    })

    expect(issue?.path).toEqual(['username'])
    expect(zodMapError(t)(issue)).toBe('error.lettersOnly')
  })

  it('accepts jsonplaceholder usernames', () => {
    const usernames = [
      'Bret',
      'Antonette',
      'Samantha',
      'Karianne',
      'Kamren',
      'Leopoldo_Corkery',
      'Elwyn.Skiles',
      'Maxime_Nienow',
      'Delphine',
      'Moriah.Stanton'
    ]

    expect(
      usernames.every(username =>
        loginFormSchema.safeParse({
          username,
          phone: '+1 (234) 567-890'
        }).success
      )
    ).toBe(true)
  })

  it('returns required field error for an empty phone', () => {
    const issue = getIssue({
      username: 'Dmitry',
      phone: ''
    })

    expect(issue?.path).toEqual(['phone'])
    expect(zodMapError(t)(issue)).toBe('error.requiredField')
  })

  it('returns minimum length error for a short phone', () => {
    const issue = getIssue({
      username: 'Dmitry',
      phone: '123456'
    })

    expect(issue?.path).toEqual(['phone'])
    expect(zodMapError(t)(issue)).toBe('error.phoneMinLength')
  })

  it('returns maximum length error for a long phone', () => {
    const issue = getIssue({
      username: 'Dmitry',
      phone: '+1 (234) 567-890-123456'
    })

    expect(issue?.path).toEqual(['phone'])
    expect(zodMapError(t)(issue)).toBe('error.phoneMaxLength')
  })

  it('returns phone symbols error when phone contains letters', () => {
    const issue = getIssue({
      username: 'Dmitry',
      phone: '+1 (234) abc-890'
    })

    expect(issue?.path).toEqual(['phone'])
    expect(zodMapError(t)(issue)).toBe('error.phoneSymbolsOnly')
  })
})
