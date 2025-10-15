<template>
  <article 
    :class="[
        'card rounded-xl border border-slate-200 bg-white p-3 md:p-4',
        (isLockedLink || isDiamond) && 'cursor-pointer'
    ]"
    @click="handleCardClick"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="badge">r/{{ lead.subreddit }}</span>
        <span class="badge">Intent: {{ lead.intent }}</span>
        <span class="badge">Score: {{ lead.score }}</span>
      </div>
      <!-- 👇 Thay đổi chỗ này -->
      <div class="text-[11px] text-slate-500 flex-shrink-0">{{ formattedPostedAt }}</div>
    </div>

    <div class="mt-2">
      <h3 :class="['text-base md:text-lg font-semibold leading-snug', { 'blur-locked': isDiamond }]">{{ lead.title }}</h3>
      <p :class="['mt-1 text-sm text-slate-700', { 'blur-locked': isDiamond }]">{{ lead.summary }}</p>

      <div v-if="isDiamond" class="mt-2 rounded-lg border border-dashed border-slate-300 p-2 text-xs text-slate-600 bg-slate-50">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-slate-700"><path d="M11 3l-7 7 7 7 7-7-7-7z"/></svg>
          <span><span class="font-semibold">Diamond lead.</span> Upgrade to Pro to view full details.</span>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-3 text-xs text-slate-600">
        <span>by <span class="font-medium">{{ lead.author }}</span></span>
        <span>▲ {{ lead.engagement_details.upvotes }}</span>
        <span>💬 {{ lead.engagement_details.total_comments }}</span>
      </div>
      <div>
        <a v-if="isFull" class="text-sm font-semibold text-ink underline underline-offset-2" :href="lead.url" target="_blank" rel="noopener">Open source →</a>
        <button v-else-if="isLockedLink" type="button" @click.stop="$emit('openProModal')" class="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-ink">
          <span class='inline-flex items-center gap-1 rounded-md bg-slate-900 text-white px-2 py-0.5 text-[11px] font-medium'>
            <svg xmlns='http://www.w3.org/2000/svg' class='size-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z'/></svg>
            Pro only
          </span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
// Nếu muốn dùng tiếng Việt:
// import 'dayjs/locale/vi'
// dayjs.locale('vi')

dayjs.extend(relativeTime)

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['openProModal'])

const isFull = computed(() => props.lead.score <= 80)
const isLockedLink = computed(() => props.lead.score > 80 && props.lead.score < 92)
const isDiamond = computed(() => props.lead.score >= 92)

function handleCardClick() {
  if (isLockedLink.value || isDiamond.value) {
    emit('openProModal')
  }
}

// 👉 Format thời gian hiển thị
const formattedPostedAt = computed(() => {
  const now = dayjs()
  const postTime = dayjs(props.lead.posted_at)

  const diffInHours = now.diff(postTime, 'hour')

  if (diffInHours < 24) {
    return postTime.fromNow() // "3 giờ trước"
  } else {
    return postTime.format('DD/MM/YYYY') // "14/10/2025"
  }
})
</script>

<style scoped>
.badge {
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium;
}
</style>
