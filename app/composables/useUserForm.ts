const loginDefaults: LoginForm = {
  username: '',
  phone: ''
}

export const useLoginForm = () => {
  const form = useState<LoginForm>('loginForm', () => ({ ...loginDefaults }))

  const reset = () => {
    form.value = { ...loginDefaults }
  }

  return { form, reset }
}
