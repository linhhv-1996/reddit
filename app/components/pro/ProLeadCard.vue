<template>
  <article class="card rounded-xl border border-slate-200 bg-white p-3 md:p-4 cursor-pointer hover:border-ink/50" @click="$emit('view-details', lead)">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="badge">r/{{ lead.subreddit }}</span>
        <span v-if="lead.intent" class="badge">Intent: {{ lead.intent }}</span>
        <span class="badge" :class="getScoreBadgeClass(lead.score)">Score: {{ lead.score }}</span>
      </div>
      <div class="text-[11px] text-slate-500 flex-shrink-0">{{ formatPostedAt(props.lead.posted_at) }}</div>
    </div>

    <div class="mt-2">
      <h3 class="text-base md:text-lg font-semibold leading-snug">{{ lead.title }}</h3>
      <p class="mt-1 text-sm text-slate-700 line-clamp-2">{{ lead.summary }}</p>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-3 text-xs text-slate-600">
        <span>by <span class="font-medium">{{ lead.author }}</span></span>
        <span>▲ {{ lead.engagement_details?.upvotes || 0 }}</span>
        <span>💬 {{ lead.engagement_details?.total_comments || 0 }}</span>
      </div>
      <div class="flex items-center gap-3">
        <button class="text-sm font-semibold text-ink underline underline-offset-2" @click.stop="$emit('view-details', lead)">Details →</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  lead: { type: Object, required: true },
});

defineEmits(['view-details']);

</script>

<style scoped>
.badge {
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium;
}
</style>
