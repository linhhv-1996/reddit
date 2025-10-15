<template>
  <section class="mx-auto max-w-5xl px-4 py-3">
    <div class="relative group rounded-xl border border-slate-200 bg-white/60 p-3 md:p-4 overflow-hidden">
      <!-- Full-surface gate to open Upgrade -->
      <button @click="$emit('openProModal')" type="button" aria-hidden="true" class="absolute inset-0 z-10 rounded-2xl bg-transparent"></button>

      <!-- Header row, small + subtle -->
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-xs font-semibold text-slate-700">Filters</h3>
        <!-- <span class="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">Pro only</span> -->
      </div>

      <!-- Content with muted/blurred look -->
      <div class="pointer-events-none select-none opacity-50">
        <div class="grid grid-cols-1 gap-2 md:grid-cols-10 md:gap-3">
          <label class="md:col-span-5 text-[11px] font-medium text-slate-600">
            Keyword
            <input disabled type="text" placeholder="e.g. stripe retries, dunning…" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:bg-slate-50" />
          </label>
          <label class="md:col-span-3 text-[11px] font-medium text-slate-600">
            Subreddit
            <select disabled class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:bg-slate-50">
              <option selected>All</option>
            </select>
          </label>
          <label class="md:col-span-2 text-[11px] font-medium text-slate-600">
            Intent
            <select disabled class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:bg-slate-50">
              <option selected>Any</option>
            </select>
          </label>
        </div>
      </div>

      <!-- Overlay prompt (visible, but subtle) -->
      <div class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div class="rounded-lg border border-dashed border-slate-300/80 bg-white/80 px-3 py-1.5 text-[11px] text-slate-700 shadow-soft">
          <span class="mr-1">🔒</span>
          <span class="font-semibold">Unlock Pro filters</span>
          <span class="text-slate-500">— click to upgrade</span>
        </div>
      </div>

      <!-- Hover affordance -->
      <div class="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-slate-300/80 transition"></div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['openProModal']);
</script>

