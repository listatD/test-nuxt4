import { flushPromises, mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { computed, defineComponent, nextTick, ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { loginFormTypedSchema } from '@/utils/schemaZod'
import { zodMapError } from '@/utils/mapError'

const t = (key: string) => key

const waitForValidation = async () => {
  await flushPromises()
  await nextTick()
  await flushPromises()
}

const LoginFormHarness = defineComponent({
  setup() {
    const hasSubmitted = ref(false)
    const submitted = ref(false)
    const fieldOptions = () => ({
      validateOnModelUpdate: hasSubmitted.value
    })

    const { errors, defineField, handleSubmit, validate } = useForm({
      validationSchema: loginFormTypedSchema,
      initialValues: {
        username: '',
        phone: ''
      }
    })

    const [usernameField] = defineField('username', fieldOptions)
    const [phoneField] = defineField('phone', fieldOptions)

    const username = computed({
      get: () => usernameField.value,
      set: value => {
        usernameField.value = value
        if (hasSubmitted.value) {
          nextTick(() => validate())
        }
      }
    })

    const phone = computed({
      get: () => phoneField.value,
      set: value => {
        phoneField.value = value
        if (hasSubmitted.value) {
          nextTick(() => validate())
        }
      }
    })

    const enableValidateOnModelUpdate = () => {
      hasSubmitted.value = true
    }

    const onSubmit = handleSubmit(
      () => {
        enableValidateOnModelUpdate()
        submitted.value = true
      },
      () => {
        enableValidateOnModelUpdate()
      }
    )

    return {
      errors,
      onSubmit,
      phone,
      submitted,
      username
    }
  },
  template: `
    <form @submit.prevent="onSubmit">
      <input data-test="username" v-model="username" name="username" />
      <input data-test="phone" v-model="phone" name="phone" />
      <span data-test="username-error">{{ errors.username }}</span>
      <span data-test="phone-error">{{ errors.phone }}</span>
      <span data-test="submitted">{{ submitted }}</span>
      <button type="submit">Login</button>
    </form>
  `
})

describe('login form behavior', () => {
  beforeAll(() => {
    z.config({
      customError: zodMapError(t)
    })
  })

  it('does not show validation errors before first submit', async () => {
    const wrapper = mount(LoginFormHarness)

    await wrapper.get('[data-test="username"]').setValue('Dmitry123')
    await wrapper.get('[data-test="phone"]').setValue('123')
    await waitForValidation()

    expect(wrapper.get('[data-test="username-error"]').text()).toBe('')
    expect(wrapper.get('[data-test="phone-error"]').text()).toBe('')
  })

  it('shows validation errors after first submit', async () => {
    const wrapper = mount(LoginFormHarness)

    await wrapper.get('[data-test="username"]').setValue('Dmitry123')
    await wrapper.get('[data-test="phone"]').setValue('+1 (234) 567-890')
    await wrapper.vm.onSubmit()
    await waitForValidation()

    expect(wrapper.get('[data-test="username-error"]').text()).toBe('error.lettersOnly')
    expect(wrapper.get('[data-test="submitted"]').text()).toBe('false')
  })

  it('shows phone validation errors after first submit', async () => {
    const wrapper = mount(LoginFormHarness)

    await wrapper.get('[data-test="username"]').setValue('Dmitry')
    await wrapper.get('[data-test="phone"]').setValue('123')
    await wrapper.vm.onSubmit()
    await waitForValidation()

    expect(wrapper.get('[data-test="phone-error"]').text()).toBe('error.phoneMinLength')
    expect(wrapper.get('[data-test="submitted"]').text()).toBe('false')
  })
})
