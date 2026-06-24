<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { BaseMenuProps } from '@/utils/types'

const NuxtLinkLocale = resolveComponent('NuxtLinkLocale')
const {
  items = [],
  block = false,
  class: className = '',
  position = 'left'
} = defineProps<BaseMenuProps>()

const isOpen = ref(false)
const target = ref(null)

onClickOutside(target, () => (isOpen.value = false))

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const onHandleSelect = (item: any) => {
  item.click?.()
  isOpen.value = false
}

const positionClasses = computed(() => {
  if (position === 'left') {
    return 'start-0 origin-top-left'
  }
  return 'end-0 origin-top-right'
})
</script>

<template>
  <div ref="target" class="align-center relative flex" :class="{ 'w-full': block }">
    <div class="align-center flex cursor-pointer" @click="toggleMenu">
      <slot name="trigger" :is-open="isOpen" />
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="
          twMerge(
            'absolute top-full z-50 mt-2 min-w-[14rem] rounded-md bg-white p-1 shadow-md ring-1 ring-black/5 focus:outline-none',
            positionClasses,
            className
          )
        "
      >
        <div class="flex flex-col gap-0.5">
          <template v-for="(item, index) in items" :key="index">
            <slot name="item" :item="item" :is-active="item.active" :close="() => (isOpen = false)">
              <component
                :is="item.to ? NuxtLinkLocale : item.href ? 'a' : 'button'"
                :to="item.to"
                :href="item.href"
                :target="item.href ? '_blank' : undefined"
                class="text-gray-200/900 group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors"
                :class="[
                  item.class,
                  item.active
                    ? 'bg-brand-primary text-white hover:brightness-110'
                    : 'text-gray-200/900 hover:bg-gray-200/50'
                ]"
                @click="onHandleSelect(item)"
              >
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                  class="text-gray-200/400 me-2 h-5 w-5 group-hover:text-brand-primary"
                />
                <span>{{ item.label }}</span>
              </component>
            </slot>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>
