<template>
  <details class="group rounded-xl border border-slate-200 bg-white">
    <!-- Header / Summary -->
    <summary class="flex cursor-pointer select-none items-center justify-between gap-3 rounded-2xl p-4 md:p-5">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-ink">Filters</span>
        <span v-if="activeCount > 0" class="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink">{{ activeCount }}</span>
      </div>
      <!-- Chevron -->
      <svg class="h-5 w-5 text-slate-500 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
      </svg>
    </summary>

    <!-- Body -->
    <div class="border-t border-slate-100 p-4 pt-3 md:p-5">
      <div class="grid grid-cols-1 gap-3">
        <!-- Row 1: Keyword -->
        <label class="text-xs font-medium text-slate-600">Keyword
          <input v-model="localFilters.keyword" type="text" placeholder="e.g. stripe retries, dunning…" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink bg-white focus:border-ink focus:ring-2 focus:ring-ink/10">
        </label>

        <!-- Row 2: Subreddit + Intent -->
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label class="text-xs font-medium text-slate-600">Subreddit
            <select v-model="localFilters.subreddit" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink bg-white focus:border-ink focus:ring-2 focus:ring-ink/10">
              <option value="">All</option>
              <option>r/marketing</option>
              <option>r/Entrepreneur</option>
              <option>r/SaaS</option>
              <option>r/startups</option>
              <option>r/indiehackers</option>
              <option>r/freelance</option>
            </select>
          </label>
          <label class="text-xs font-medium text-slate-600">Intent
            <select v-model="localFilters.intent" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink bg-white focus:border-ink focus:ring-2 focus:ring-ink/10">
              <option value="">Any</option>
              <option>SEEKING_ADVICE</option>
              <option>LOOKING_FOR_TOOL</option>
              <option>REQUEST_VENDOR</option>
              <option>HIRING</option>
            </select>
          </label>
        </div>

        <!-- Row 3: Score + Sort -->
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label class="text-xs font-medium text-slate-600">Score ≥
            <select v-model="localFilters.minScore" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink bg-white focus:border-ink focus:ring-2 focus:ring-ink/10">
              <option value="40">40</option>
              <option value="50">50</option>
                <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
            </select>
          </label>
          <label class="text-xs font-medium text-slate-600">Sort by
            <select v-model="localFilters.sortBy" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink bg-white focus:border-ink focus:ring-2 focus:ring-ink/10">
              <option value="score">Score (desc)</option>
              <option value="newest">Newest</option>
              <option value="upvotes">Most upvoted</option>
            </select>
          </label>
        </div>

        <!-- Row 4: Buttons -->
        <div class="flex justify-start gap-2">
          <button @click="handleReset" type="button" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">Reset</button>
          <button @click="handleApply" type="button" class="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Apply</button>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['apply-filters', 'reset-filters']);


const localFilters = ref({ ...defaultFilters });

const activeCount = computed(() => {
  let count = 0;
  if (localFilters.value.keyword !== defaultFilters.keyword) count++;
  if (localFilters.value.subreddit !== defaultFilters.subreddit) count++;
  if (localFilters.value.intent !== defaultFilters.intent) count++;
  if (localFilters.value.minScore !== defaultFilters.minScore) count++;
  if (localFilters.value.sortBy !== defaultFilters.sortBy) count++;
  return count;
});

function handleApply() {
  // Gửi một bản sao của object để tránh thay đổi không mong muốn
  emit('apply-filters', { ...localFilters.value });
}

function handleReset() {
  localFilters.value = { ...defaultFilters };
  // Sau khi reset, báo cho component cha để gọi lại API với filter mặc định
  emit('reset-filters');
}
</script>

