<template>
  <div v-if="show && lead" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold">{{ lead.title }}</h3>
            <div class="mt-1 flex items-center gap-2 flex-wrap">
              <span class="badge bg-white">r/{{ lead.subreddit }}</span>
              <span v-if="lead.intent" class="badge bg-white">Intent: {{ lead.intent }}</span>
              <span class="badge" :class="getScoreBadgeClass(lead.score)">Score: {{ lead.score }}</span>
            </div>
          </div>
          <button @click="$emit('close')" class="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Esc</button>
        </div>

        <div class="mt-4 space-y-4">
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Summary</h4>
            <p class="mt-1 text-sm text-slate-700">{{ lead.summary }}</p>
          </div>

          <div v-if="lead.reasoning">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Analysis</h4>

            <p class="mt-1 text-sm text-slate-700">{{ truncatedAiReasoning }}</p>

            <div v-if="!isPro && lead.score > 80 " class="mt-2 text-left">
                <p @click="$emit('openProModal')" class="mt-2 text-sm underline cursor-pointer text-blue-600">Upgrade to Read Full Analysis</p>
            </div>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-between">
          <div v-if="isPro" class="flex items-center gap-3">
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
          </div>
          <div v-else>
             </div>

          <div>
            <a v-if="isPro || Number(lead.score) <= 80" class="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:opacity-90" :href="lead.url" target="_blank" rel="noopener">
              Open Source →
            </a>
            <button v-else @click="$emit('openProModal')" class="rounded-lg bg-banana px-3 py-2 text-sm font-semibold text-ink shadow-soft hover:opacity-90">
              🔒 Unlock Link
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';


const props = defineProps({
  show: Boolean,
  lead: { type: Object, default: null },
  isPro: { type: Boolean, default: false },
  feedbackStatus: { type: String, default: '' },
  isBookmarked: { type: Boolean, default: false },
});

defineEmits(['close', 'openProModal', 'toggleBookmark', 'setFeedback']);


const truncatedAiReasoning = computed(() => {
  // Nếu là Pro hoặc không có text, trả về toàn bộ
  if (props.isPro || !props.lead?.reasoning || props.lead.score < 80) {
    return props.lead?.reasoning;
  }
  
  // Lấy khoảng 100 ký tự đầu tiên để làm "mồi"
  const teaser = props.lead.reasoning.substring(0, 100);
  return teaser + '...';
});


</script>

<style scoped>
.badge {
  /* `bg-white` đã được chuyển vào logic của computed property */
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium;
}
.btn-like, .btn-dislike, .btn-bookmark {
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs transition-colors;
}
</style>
