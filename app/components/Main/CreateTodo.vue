<script setup lang="ts">
defineProps<{
  error?: string
}>()

const emit = defineEmits<{
  change: []
  submit: []
}>()

const userId = defineModel<string | number>('userId', { default: '' })
const title = defineModel<string>('title', { default: '' })

const normalizeUserId = () => {
  const value = Number(userId.value)

  if (!userId.value || Number.isNaN(value)) return

  userId.value = value > 0 ? value : ''
}

const onUserIdKeydown = (event: KeyboardEvent) => {
  if (['-', '+', 'e', 'E'].includes(event.key)) {
    event.preventDefault()
  }
}

const onUserIdInput = () => {
  normalizeUserId()
  emit('change')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <form class="grid gap-3" @submit.prevent="emit('submit')">
      <BaseInput
        v-model="userId"
        type="number"
        :label="$t('label.userId')"
        id="create-todo-user-id"
        name="userId"
        min="1"
        step="1"
        size="md"
        @keydown="onUserIdKeydown"
        @input="onUserIdInput"
        @blur="normalizeUserId"
      />
      <BaseInput
        v-model="title"
        type="text"
        :label="$t('label.title')"
        id="create-todo-title"
        name="title"
        size="md"
        @input="emit('change')"
      />
      <BaseAlert type="error" :show="!!error" :message="error ? $t(error) : ''" />
      <BaseButton type="submit">{{ $t('btn.add') }}</BaseButton>
    </form>
  </div>
</template>
