const errorMapDict = {
  errorUserAlreadyExists: 'error.userAlreadyExists',
  errorTypeContactAndPasswordRequired: 'error.userIncorrect',
  errorPasswordTooShort: 'error.errorPasswordTooShort',
  errorInvalidOrExpiredCode: 'error.invalidOrExpiredCode',
  errorTooManyCodeAttempts: 'error.tooManyCodeAttempts',
  errorTelegramStartBotRequired: 'error.telegramStartBotRequired',
  errorVerificationSendFailed: 'error.verificationSendFailed',
  errorVerificationCooldown: 'error.verificationCooldown',
  errorTooManyVerificationRequests: 'error.tooManyVerificationRequests',
  errorTypeContactAndCodeRequired: 'error.typeContactAndCodeRequired',
  errorInvalidRegistrationSession: 'error.invalidRegistrationSession',
  errorInvalidRegistrationToken: 'error.invalidRegistrationToken',
  errorRegistrationSessionExpired: 'error.registrationSessionExpired',
  errorTelegramBotUsernameRequired: 'error.telegramBotUsernameRequired',
  errorEmailAndPasswordRequired: 'error.userIncorrect',
  errorInvalidContactOrPassword: 'error.errorInvalidContactOrPassword',
  errorDataLater: 'error.errorDataLater',
  errorPasswordNum: 'error.errorPasswordNum',
  errorEmailAddress: 'error.errorEmailAddress',
  errorTelegramName: 'error.errorTelegramName',
  errorPasswordNoMatch: 'error.errorPasswordNoMatch',
  errorInvalidFormat: 'error.invalidFormat',
  errorRequiredField: 'error.requiredField',
  errorInvalidEmailOrTelegram: 'error.errorInvalidEmailOrTelegram',
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
        if (issue.minimum === 6) {
          return t(errorMapDict.errorPasswordNum, { num: issue.minimum })
        }
        return t(errorMapDict.errorRequiredField)

      case 'invalid_format':
        if (issue.path?.includes('telegram')) {
          return t(errorMapDict.errorTelegramName)
        }
        if (issue.format === 'email') {
          return t(errorMapDict.errorEmailAddress)
        }
        return t(errorMapDict.errorInvalidFormat)

      case 'custom':
        if (issue.path?.includes('confirmPassword')) {
          return t(errorMapDict.errorPasswordNoMatch)
        }
        if (issue.path?.includes('invalidEmailOrTelegram')) {
          return t(errorMapDict.errorInvalidEmailOrTelegram)
        }
        return t(issue.message)

      default:
        return t(issue.message || issue.code)
    }
  }
}
