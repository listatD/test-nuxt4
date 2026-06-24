<script setup lang="ts">
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({
  layout: defLayoutPage.blank.name,
  public: true,
  ssr: false
})

const mainStore = useMainStore()
const userService = useUserService()
const localePath = useLocalePath()
const { form, reset } = useLoginForm()
const isLoad = ref(false)

const createFormField = <K extends keyof typeof form.value>(key: K) =>
  computed({
    get: () => form.value[key],
    set: val => {
      form.value[key] = val
    }
  })

const serverError = createFormField('serverError')
const isPasswordShow = createFormField('isPasswordShow')

const schema = computed(() =>
  toTypedSchema(
    z.object({
      contact: z
        .string()
        .nonempty()
        .refine(
          data => {
            if (!data) return true

            const isEmail = z.string().pipe(z.email()).safeParse(data).success
            const isTelegram = new RegExp(defRegex.telegram.val).test(data)

            return isEmail || isTelegram
          },
          {
            path: ['invalidEmailOrTelegram']
          }
        ),
      password: z.string().nonempty()
    })
  )
)

const { errors, defineField, handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: form.value
})

const fieldOpts = reactive({
  validateOnModelUpdate: false
})

const [contact] = defineField('contact', fieldOpts)
const [password] = defineField('password', fieldOpts)

const enableValidateOnModelUpdate = () => {
  fieldOpts.validateOnModelUpdate = true
}

watch(contact, val => {
  form.value.contact = val || ''
})
watch(password, val => {
  form.value.password = val || ''
})

const togglePassword = () => {
  isPasswordShow.value = !isPasswordShow.value
}

const onLogin = handleSubmit(
  async values => {
    enableValidateOnModelUpdate()
    serverError.value = ''
    isLoad.value = true

    const { data, pending, error } = await userService.postLogin({
      contact: values.contact,
      password: values.password
    })

    if (!error.value && data.value) {
      mainStore.setAccessToken({ token: data.value.token, rt: data.value.rt })
      await navigateTo(localePath(defUserPage.main.name))
    } else {
      serverError.value = error.value
    }

    isLoad.value = false
  },
  () => {
    enableValidateOnModelUpdate()
  }
)

onBeforeRouteLeave(to => {
  const isRoute = to.name?.toString().includes(defAuthPage.login.name)
  if (!isRoute) {
    reset()
  }
})
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md ring-1 ring-black ring-opacity-5">
      <h2 class="mb-6 text-center text-3xl font-bold">{{ $t('nav.login') }}</h2>
      <form @submit.prevent="onLogin" class="space-y-4" novalidate>
        <BaseInput
          v-model="contact"
          :label="$t('label.login')"
          name="contact"
          autocomplete="username"
          size="lg"
          :error="errors.contact"
        />

        <BaseInput
          v-model="password"
          :type="isPasswordShow ? 'text' : 'password'"
          :label="$t('label.password')"
          name="password"
          autocomplete="current-password"
          size="lg"
          :error="errors.password"
        >
          <template #after>
            <BaseButton
              variant="text"
              size="lg"
              :icon="isPasswordShow ? 'mdi:eye' : 'mdi:eye-off'"
              @click="togglePassword"
              @mousedown.prevent
            /> </template
        ></BaseInput>

        <BaseAlert
          type="error"
          :show="!!serverError"
          :message="serverError ? $t(serverError) : ''"
        />

        <BaseButton variant="primary" :loading="isLoad" block size="lg" type="submit">
          {{ $t('btn.signIn') }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>
