<script setup lang="ts">
import type { JsonPlaceholderUser } from '@/utils/types'

defineProps<{
  user: JsonPlaceholderUser | null
}>()

const emit = defineEmits<{
  logout: []
}>()

const panelClass =
  'rounded-lg border border-slate-200 bg-white p-4 sm:p-6 grid items-start gap-6 min-[901px]:grid-cols-[minmax(180px,1fr)_2fr_auto]'
const titleClass = 'm-0 text-2xl font-bold leading-tight text-slate-900'
const eyebrowClass = 'mb-1.5 mt-0 text-xs font-bold uppercase tracking-[0.08em] text-slate-500'
</script>

<template>
  <section v-if="user" :class="panelClass">
    <div>
      <p :class="eyebrowClass">{{ $t('page.userProfile') }}</p>
      <h1 :class="titleClass">{{ user.name }}</h1>
    </div>

    <dl class="m-0 grid gap-4 min-[561px]:grid-cols-2">
      <div class="min-w-0">
        <dt class="text-xs font-semibold text-slate-500">{{ $t('label.username') }}</dt>
        <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
          {{ user.username }}
        </dd>
      </div>
      <div class="min-w-0">
        <dt class="text-xs font-semibold text-slate-500">{{ $t('label.phoneNumber') }}</dt>
        <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
          {{ user.phone }}
        </dd>
      </div>
      <div class="min-w-0">
        <dt class="text-xs font-semibold text-slate-500">{{ $t('label.email') }}</dt>
        <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
          {{ user.email }}
        </dd>
      </div>
      <div class="min-w-0">
        <dt class="text-xs font-semibold text-slate-500">{{ $t('label.company') }}</dt>
        <dd class="m-0 mt-1 text-[15px] text-slate-900 [overflow-wrap:anywhere]">
          {{ user.company.name }}
        </dd>
      </div>
    </dl>

    <BaseButton type="button" @click="emit('logout')">{{ $t('btn.logout') }}</BaseButton>
  </section>
</template>
