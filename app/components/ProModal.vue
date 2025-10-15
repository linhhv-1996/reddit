<template>
  <div v-if="show" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold">Unlock Pro</h3>
            <p class="mt-1 text-sm text-slate-600">Get full access to high-score leads, powerful filters, private feeds, and instant Telegram alerts.</p>
          </div>
          <button @click="$emit('close')" class="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Esc</button>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <span class="rounded-md bg-ink px-2 py-1 text-xs font-semibold text-white">$19/M</span>
          <span class="text-xs text-slate-500">No lock-in. Cancel anytime.</span>
        </div>
        <ul class="mt-3 grid gap-2 text-sm text-slate-700">
          <li class="flex items-center gap-2"><span>✅</span><span>See sources & details for 80–92 leads</span></li>
          <li class="flex items-center gap-2"><span>✅</span><span>Unblur Diamond (≥92) leads</span></li>
          <li class="flex items-center gap-2"><span>✅</span><span>AI filters by keyword / intent / score</span></li>
          <li class="flex items-center gap-2"><span>✅</span><span>Personalized feed + Telegram notifications</span></li>
        </ul>
        <div class="mt-5 flex items-center justify-end gap-2">
          <button @click="$emit('close')" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">Maybe later</button>
          <button class="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:opacity-90">Upgrade to Pro – $19/M</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
});
defineEmits(['close']);
</script>

