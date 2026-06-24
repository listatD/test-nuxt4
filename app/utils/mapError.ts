const errorMapDict = {
  errorDataLater: 'error.errorDataLater',
  errorInvalidFormat: 'error.invalidFormat',
  errorRequiredField: 'error.requiredField',
  errorLettersOnly: 'error.lettersOnly',
  errorPhoneSymbolsOnly: 'error.phoneSymbolsOnly',
  errorPhoneMinLength: 'error.phoneMinLength',
  errorPhoneMaxLength: 'error.phoneMaxLength',
  errorLogin: 'error.login',
  errorTodosLoadFailed: 'error.todosLoadFailed',
  errorCreateTodoFields: 'error.createTodoFields',
  errorCreateTodoFailed: 'error.createTodoFailed',
  errorUnknown: 'error.unknown'
} as const

export const mapError = (err: any): string => {
  const msg: unknown = err?.message || err?.statusMessage || err?.statusText

  if (typeof msg === 'string' && msg in errorMapDict) {
    return errorMapDict[msg as keyof typeof errorMapDict]
  }

  return errorMapDict.errorDataLater
}

export const zodMapError = (t: (key: string, params?: any) => string) => {
  return (issue: any) => {
    switch (issue.code) {
      case 'too_small':
        if (issue.path?.includes('phone') && issue.minimum > 1) {
          return t(errorMapDict.errorPhoneMinLength, { count: issue.minimum })
        }
        return t(errorMapDict.errorRequiredField)

      case 'too_big':
        if (issue.path?.includes('phone')) {
          return t(errorMapDict.errorPhoneMaxLength, { count: issue.maximum })
        }
        return t(errorMapDict.errorUnknown)

      case 'invalid_format':
        return t(errorMapDict.errorInvalidFormat)

      case 'custom':
        if (issue.path?.includes('username')) {
          return t(errorMapDict.errorLettersOnly)
        }
        if (issue.path?.includes('phone')) {
          return t(errorMapDict.errorPhoneSymbolsOnly)
        }
        return t(errorMapDict.errorUnknown)

      default:
        return t(errorMapDict.errorUnknown)
    }
  }
}
