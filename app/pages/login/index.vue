<script setup lang="ts">
import { useForm } from 'vee-validate'
import { loginFormTypedSchema } from '@/utils/schemaZod'

definePageMeta({
  layout: defLayoutPage.blank.name,
  public: true,
  ssr: false
})

const mainStore = useMainStore()
const userService = useUserService()
const localePath = useLocalePath()
const { form, reset } = useLoginForm()

const errorMessage = ref('')
const hasSubmitted = ref(false)
const isLoading = ref(false)
const fieldOptions = () => ({
  validateOnModelUpdate: hasSubmitted.value
})

const { errors, defineField, handleSubmit, validate } = useForm({
  validationSchema: loginFormTypedSchema,
  initialValues: form.value
})

const [usernameField] = defineField('username', fieldOptions)
const [phoneField] = defineField('phone', fieldOptions)

const enableValidateOnModelUpdate = () => {
  hasSubmitted.value = true
}

const username = computed({
  get: () => usernameField.value,
  set: value => {
    usernameField.value = value
    form.value.username = value || ''
    if (hasSubmitted.value) {
      nextTick(() => validate())
    }
  }
})

const phone = computed({
  get: () => phoneField.value,
  set: value => {
    phoneField.value = value
    form.value.phone = value || ''
    if (hasSubmitted.value) {
      nextTick(() => validate())
    }
  }
})

const onLogin = handleSubmit(
  async values => {
    enableValidateOnModelUpdate()
    errorMessage.value = ''
    isLoading.value = true

    const { data, pending, error } = await userService.postLogin({
      username: values.username,
      phone: values.phone
    })

    isLoading.value = pending.value

    if (!error.value && data.value) {
      mainStore.setUserInfo(data.value)
      mainStore.setAccessToken({ token: String(data.value.id) })
      reset()
      await navigateTo(localePath(defUserPage.main.name))
    } else {
      errorMessage.value = error.value
    }

    isLoading.value = false
  },
  () => {
    enableValidateOnModelUpdate()
  }
)
</script>

<template>
  <main class="bg-auth-page text-auth-text flex flex-1 items-center justify-center p-6">
    <section
      class="bg-auth-card w-full max-w-[447px] overflow-hidden rounded"
      aria-labelledby="login-title"
    >
      <header
        class="border-auth-border bg-auth-header flex min-h-[51px] items-center justify-center border-b"
      >
        <h1 id="login-title" class="text-auth-title m-0 text-[17px] font-normal leading-tight">
          {{ $t('page.loginTitle') }}
        </h1>
      </header>

      <form class="flex flex-col gap-5 px-6 pb-[30px] pt-[17px]" @submit.prevent="onLogin">
        <p class="text-auth-description m-0 text-[15px] leading-tight">
          {{ $t('page.loginDescription') }}
        </p>

        <BaseInput
          v-model="username"
          type="text"
          :placeholder="$t('label.username')"
          id="login-username"
          name="username"
          autocomplete="username"
          control-class="h-[41px] rounded border-0 bg-white focus-within:ring-brand-primary/35"
          input-class="rounded px-2.5 text-auth-text placeholder:text-auth-text"
          :error="errors.username"
        />

        <BaseInput
          v-model="phone"
          type="tel"
          :placeholder="$t('label.phoneNumber')"
          id="login-phone"
          name="phone"
          autocomplete="tel"
          control-class="h-[41px] rounded border-0 bg-white focus-within:ring-brand-primary/35"
          input-class="rounded px-2.5 text-auth-text placeholder:text-auth-text"
          :error="errors.phone"
        />

        <BaseAlert
          type="error"
          :show="!!errorMessage"
          :message="errorMessage ? $t(errorMessage) : ''"
        />

        <BaseButton type="submit" block :loading="isLoading" class="min-h-[41px] rounded">
          {{ isLoading ? $t('btn.loading') : $t('btn.login') }}
        </BaseButton>
      </form>
    </section>
  </main>
</template>
