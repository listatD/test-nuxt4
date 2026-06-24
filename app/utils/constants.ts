export const defEnvironment = {
  localhost: { val: 'localhost' },
  dev: { val: 'dev' },
  prod: { val: 'prod' }
} as const

export const defLayoutPage = {
  blank: { name: 'blank' },
  default: { name: 'default' }
} as const

export const defAuthPage = {
  login: { path: '/login', name: 'login', title: 'nav.login' },
  error404: { path: '/404', name: '404', title: 'nav.404' },
  error500: { path: '/500', name: '500', title: 'nav.500' }
}

export const defUserPage = {
  main: { path: '/main', name: 'main', title: 'nav.main' }
}

export const defVariant = {
  primary: { val: 'primary' },
  secondary: { val: 'secondary' },
  ghost: { val: 'ghost' },
  danger: { val: 'danger' },
  text: { val: 'text' }
} as const

export const defSize = {
  sm: { val: 'sm' },
  md: { val: 'md' },
  lg: { val: 'lg' },
  full: { val: 'full' }
} as const

export const defHttpStatus = {
  s301: 301,
  s401: 401,
  s404: 404,
  s400: 400,
  s422: 422,
  s500: 500
} as const

export const defRegex = {
  telegram: { val: /^@[a-zA-Z0-9_]{5,32}$/ }
} as const
