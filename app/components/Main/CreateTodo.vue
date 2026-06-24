<script setup lang="ts">
defineProps<{
  error?: string
}>()

const emit = defineEmits<{
  submit: []
}>()

const userId = defineModel<string>('userId', { default: '' })
const title = defineModel<string>('title', { default: '' })
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
        size="md"
      />
      <BaseInput
        v-model="title"
        type="text"
        :label="$t('label.title')"
        id="create-todo-title"
        name="title"
        size="md"
      />
      <BaseButton type="submit">{{ $t('btn.add') }}</BaseButton>
    </form>
    <p v-if="error" class="m-0 font-semibold text-[#b42318]">{{ $t(error) }}</p>
  </div>
</template>
