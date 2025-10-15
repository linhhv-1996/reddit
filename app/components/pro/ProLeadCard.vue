<template>
  <article class="card rounded-xl border border-slate-200 bg-white p-3 md:p-4">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="badge">{{ lead.subreddit }}</span>
        <span v-if="lead.intent" class="badge">Intent: {{ lead.intent }}</span>
        <span class="badge">Score: {{ lead.score }}</span>
      </div>
      <div class="text-[11px] text-slate-500 flex-shrink-0">{{ formattedDate }}</div>
    </div>

    <div class="mt-2">
      <h3 class="text-base md:text-lg font-semibold leading-snug">{{ lead.title }}</h3>
      <p class="mt-1 text-sm text-slate-700">{{ lead.summary }}</p>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-3 text-xs text-slate-600">
        <span>by <span class="font-medium">{{ lead.author }}</span></span>
        <span>▲ {{ lead.engagement_details?.upvotes || 0 }}</span>
        <span>💬 {{ lead.engagement_details?.total_comments || 0 }}</span>
      </div>
      <div class="flex items-center gap-3">
        <!-- Interaction Buttons -->
        <button 
          @click="$emit('toggleBookmark', lead.id)"
          :class="['btn-bookmark', { 'active': isBookmarked }]"
        >
          {{ isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark' }}
        </button>
        <div class="flex items-center gap-2">
          <button 
            @click="$emit('setFeedback', { leadId: lead.id, type: 'like' })"
            :class="['btn-like', { 'active': feedbackStatus === 'like' }]"
          >
            👍 Like
          </button>
          <button 
            @click="$emit('setFeedback', { leadId: lead.id, type: 'dislike' })"
            :class="['btn-dislike', { 'active': feedbackStatus === 'dislike' }]"
          >
            👎 Dislike
          </button>
        </div>
        <a class="text-sm font-semibold text-ink underline underline-offset-2" :href="lead.url" target="_blank" rel="noopener">Open source →</a>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  lead: { type: Object, required: true },
  feedbackStatus: { type: String, default: '' }, // 'like' | 'dislike' | ''
  isBookmarked: { type: Boolean, default: false },
});

defineEmits(['toggleBookmark', 'setFeedback']);

// --- Utility Functions ---
const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const formattedDate = computed(() => timeAgo(props.lead.posted_at));
</script>

<style scoped>
.badge {
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium;
}
.btn-like, .btn-dislike, .btn-bookmark {
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs transition-colors;
}
</style>
