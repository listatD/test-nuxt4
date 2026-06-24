const loginDefaults: LoginForm = {
  contact: '',
  password: '',
  serverError: '',
  isPasswordShow: false
}

export const useLoginForm = () => {
  const form = useState<LoginForm>('loginForm', () => ({ ...loginDefaults }))

  const reset = () => {
    form.value = { ...loginDefaults }
  }

  return { form, reset }
}
