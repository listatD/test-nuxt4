<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { BaseModalProps } from '@/utils/types'

const {
  title,
  description,
  closeOnBackdrop = true,
  closeOnEsc = true,
  showClose = true,
  widthClass = 'max-w-xl'
} = defineProps<BaseModalProps>()

const model = defineModel<boolean>({ default: false })

const close = () => {
  model.value = false
}

const onBackdropClick = () => {
  if (closeOnBackdrop) {
    close()
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && closeOnEsc && model.value) {
    close()
  }
}

watch(
  () => model.value,
  isOpen => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="model" class="fixed inset-0 z-[100]">
        <div
          class="absolute inset-0 bg-[#120f0d]/55 backdrop-blur-[6px]"
          @click="onBackdropClick"
        />

        <div class="relative flex min-h-full items-center justify-center p-4 md:p-8">
          <Transition name="modal-panel">
            <div
              v-if="model"
              class="relative w-full overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_28px_90px_rgba(20,16,12,0.18)]"
              :class="twMerge(widthClass)"
            >
              <div
                class="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(164,142,118,0.18),transparent_70%)]"
              />

              <div class="relative p-6 md:p-8">
                <div
                  v-if="title || description || showClose"
                  class="mb-6 flex items-start justify-between gap-4"
                >
                  <div class="min-w-0">
                    <h3 v-if="title" class="text-2xl leading-tight tracking-[-0.03em] text-slate-950">
                      {{ title }}
                    </h3>
                    <p v-if="description" class="mt-2 text-sm leading-6 text-slate-500">
                      {{ description }}
                    </p>
                  </div>

                  <BaseButton
                    v-if="showClose"
                    variant="ghost"
                    rounded="full"
                    size="sm"
                    icon="mdi:close"
                    class="shrink-0"
                    @click="close"
                  />
                </div>

                <div>
                  <slot />
                </div>

                <div v-if="$slots.actions" class="mt-6 flex justify-end gap-3">
                  <slot name="actions" />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.24s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
}

.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}
</style>
