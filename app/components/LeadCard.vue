<template>
  <article 
    class="card group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:border-ink/50 hover:shadow-lg md:p-4"
    @click="handleClick"
  >
    <!-- Lớp phủ cho Lead Kim Cương (Diamond Tier) -->
    <div v-if="isDiamond" class="diamond-overlay">
      <div class="transform text-center text-white transition-all duration-300 group-hover:scale-105">
        <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-banana/20 backdrop-blur-sm">
            <span class="text-2xl">💎</span>
        </div>
        <div class="text-lg font-bold">Diamond Lead</div>
        <div class="text-xs text-slate-300">Click to upgrade and unlock</div>
      </div>
    </div>

    <!-- Nội dung thẻ, sẽ bị làm mờ nếu là Diamond -->
    <div :class="{ 'blur-locked': isDiamond }">
      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="badge">r/{{ lead.subreddit }}</span>
          <span v-if="lead.intent" class="badge">Intent: {{ lead.intent }}</span>
          <span class="badge" :class="getScoreBadgeClass(lead.score)">Score: {{ lead.score }}</span>
        </div>
        <div class="flex-shrink-0 text-[11px] text-slate-500">{{ formatPostedAt(lead.posted_at) }}</div>
      </div>

      <div class="mt-2">
        <h3 class="text-base font-semibold leading-snug md:text-lg">{{ lead.title }}</h3>
        <p class="mt-1 text-sm text-slate-700 line-clamp-2">{{ lead.summary }}</p>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center gap-3 text-xs text-slate-600">
          <span>by <span class="font-medium">{{ lead.author }}</span></span>
          <span v-if="lead.engagement_details">▲ {{ lead.engagement_details.upvotes || 0 }}</span>
          <span v-if="lead.engagement_details">💬 {{ lead.engagement_details.total_comments || 0 }}</span>
        </div>
        <div>
          <button type="button" class="text-sm font-semibold text-ink underline underline-offset-2">
            Details →
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-details', 'open-upgrade-modal'])

const isDiamond = computed(() => props.lead.score > 90);

function handleClick() {
  // Logic xử lý tập trung tại một nơi duy nhất.
  if (isDiamond.value) {
    emit('open-upgrade-modal');
  } else {
    emit('view-details', props.lead);
  }
}
</script>

<style scoped>
.badge {
  @apply inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium;
}

/* Làm mờ nội dung khi bị khoá, mượt hơn và ít gắt hơn */
.blur-locked {
  filter: blur(3px);
  transition: filter 200ms ease;
  user-select: none;
  pointer-events: none;
}

/* Overlay kim cương: kính mờ + gradient dịu + viền phát sáng */
.diamond-overlay {
  @apply absolute inset-0 z-10 flex items-center justify-center rounded-xl;
  background:
    radial-gradient(120% 140% at 20% 10%, rgba(255, 230, 109, 0.25) 0%, rgba(255, 230, 109, 0.05) 40%, transparent 70%),
    linear-gradient(135deg, rgba(2, 6, 23, 0.70), rgba(2, 6, 23, 0.55));
  backdrop-filter: blur(3px) saturate(140%);
  -webkit-backdrop-filter: blur(3px) saturate(140%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);
  transition: transform 250ms ease, opacity 250ms ease;
}

/* Viền gradient “shimmer” chạy quanh card */
.diamond-overlay::before {
  content: "";
  position: absolute;
  inset: -1px;
  padding: 1px;                 /* tạo khung “rỗng” */
  border-radius: 0.75rem;       /* khớp rounded-xl */
  background: conic-gradient(
    from 0deg,
    #FFE66D,
    #ffffff,
    #f59e0b,
    #FFE66D
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: diamond-spin 8s linear infinite;
  opacity: 0.6;
  pointer-events: none;
}

/* Ribbon góc “DIAMOND” */
.diamond-overlay::after {
  content: "DIAMOND";
  position: absolute;
  top: 10px;
  left: -36px;
  transform: rotate(-45deg);
  padding: 4px 28px;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #0f172a;
  background: linear-gradient(90deg, #FFE66D, #fcd34d);
  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.25);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  opacity: 0.95;
  pointer-events: none;
}

/* Làm 💎 “pulse” nhẹ + vòng sáng dịu */
.diamond-overlay .rounded-full {
  box-shadow:
    0 0 0 2px rgba(255, 230, 109, 0.25),
    0 8px 24px rgba(255, 230, 109, 0.15);
  animation: diamond-pulse 2.2s ease-in-out infinite;
}

/* Dòng chữ trong overlay rõ nét hơn */
.diamond-overlay .text-lg {
  text-shadow:
    0 1px 0 rgba(0,0,0,0.25),
    0 0 24px rgba(255, 230, 109, 0.25);
}
.diamond-overlay .text-xs {
  color: rgba(226, 232, 240, 0.85);
}

/* Hover: tăng “độ sống” một chút, không quá lòe loẹt */
.group:hover .diamond-overlay {
  transform: translateY(-1px);
}
.group:hover .diamond-overlay::before {
  animation-duration: 5.5s; /* shimmer nhanh hơn khi hover */
}

@keyframes diamond-pulse {
  0%   { transform: scale(1); box-shadow: 0 0 0 2px rgba(255, 230, 109, 0.25), 0 8px 24px rgba(255, 230, 109, 0.15); }
  50%  { transform: scale(1.06); box-shadow: 0 0 0 3px rgba(255, 230, 109, 0.35), 0 12px 30px rgba(255, 230, 109, 0.28); }
  100% { transform: scale(1); box-shadow: 0 0 0 2px rgba(255, 230, 109, 0.25), 0 8px 24px rgba(255, 230, 109, 0.15); }
}

/* Tôn nhẹ phần content mờ phía dưới để tạo chiều sâu */
.card {
  position: relative;
  isolation: isolate; /* đảm bảo overlay và hiệu ứng nằm đúng layer */
}
</style>

