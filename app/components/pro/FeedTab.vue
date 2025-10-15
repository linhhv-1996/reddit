<template>
  <div>
    <FiltersPro @apply-filters="handleApplyFilters" @reset-filters="handleResetFilters" />

    <div class="mt-4">
      <div v-if="pending" class="text-center py-10 text-slate-500">
        Fetching latest leads...
      </div>

      <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50 rounded-lg">
        <p>Could not fetch leads. Please try again later.</p>
        <p class="text-xs mt-1">{{ error.message }}</p>
      </div>
      
      <div v-else-if="!data || !data.leads || data.leads.length === 0" class="text-center py-10 text-slate-500">
        No leads found matching your criteria.
      </div>

      <div v-else>
        <div class="flex flex-col gap-3">
          <ProLeadCard 
            v-for="lead in data.leads" 
            :key="lead.id" 
            :lead="lead"
            @view-details="openLeadDetails"
          />
        </div>

        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <span class="text-sm text-slate-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
    
    <LeadDetailModal
      :show="showDetailModal"
      :lead="selectedLead"
      :is-pro="true"
      :feedback-status="selectedLead ? (feedback[selectedLead.id] || '') : ''"
      :is-bookmarked="selectedLead ? bookmarks.has(selectedLead.id) : false"
      @close="closeLeadDetails"
      @toggle-bookmark="handleToggleBookmark"
      @set-feedback="handleSetFeedback"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ProLeadCard from '~/components/pro/ProLeadCard.vue';
import FiltersPro from '~/components/pro/FiltersPro.vue';
import LeadDetailModal from '~/components/LeadDetailModal.vue'; // Import modal mới

// --- Modal State ---
const showDetailModal = ref(false);
const selectedLead = ref(null);

function openLeadDetails(lead) {
  selectedLead.value = lead;
  showDetailModal.value = true;
}
function closeLeadDetails() {
  showDetailModal.value = false;
}


// --- State Management for Interactions ---
const feedback = ref({}); // { lead_id: 'like' | 'dislike' }
const bookmarks = ref(new Set()); // Set of bookmarked lead_ids

function handleToggleBookmark(leadId) {
  if (bookmarks.value.has(leadId)) bookmarks.value.delete(leadId);
  else bookmarks.value.add(leadId);
}

function handleSetFeedback({ leadId, type }) {
  if (feedback.value[leadId] === type) delete feedback.value[leadId];
  else feedback.value[leadId] = type;
}

// --- Data Fetching & Filtering ---

const filters = ref({ ...defaultFilters });

const currentPage = ref(1);

const apiUrl = computed(() => {
  const params = new URLSearchParams({
    page: currentPage.value.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters.value.keyword) params.append('keyword', filters.value.keyword);
  if (filters.value.subreddit) params.append('subreddit', filters.value.subreddit);
  if (filters.value.intent) params.append('intent', filters.value.intent);
  if (filters.value.minScore && filters.value.minScore !== defaultFilters.minScore) {
     params.append('minScore', filters.value.minScore);
  }
  if (filters.value.sortBy) params.append('sortBy', filters.value.sortBy);

  return `/api/leads?${params.toString()}`;
});


const { data, pending, error, refresh } = useFetch(apiUrl, {
  default: () => ({ leads: [], total: 0 }),
});

function handleApplyFilters(newFilters) {
  currentPage.value = 1;
  filters.value = newFilters;
}

function handleResetFilters() {
  currentPage.value = 1;
  filters.value = { ...defaultFilters };
}


// --- Pagination ---
const totalPages = computed(() => {
    if (!data.value || !data.value.total) return 1;
    return Math.max(1, Math.ceil(data.value.total / pageSize))
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
watch(currentPage, () => {
    window.scrollTo(0, 0);
})
</script>
