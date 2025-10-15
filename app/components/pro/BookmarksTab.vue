<template>
    <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">Bookmarked Leads</h3>
        <button v-if="data && data.leads.length > 0" @click="showConfirmModal = true" class="text-xs rounded-md border border-slate-200 bg-white px-2.5 py-1 hover:bg-slate-50">Clear all</button>
      </div>
      <p class="mt-1 text-sm text-slate-600">Your saved leads appear here. They’re independent from Feed filters.</p>

      <div v-if="pending" class="mt-6 text-center py-10 text-slate-500">
        Fetching bookmarks...
      </div>
      <div v-else-if="error" class="mt-6 text-center py-10 text-red-600 bg-red-50 rounded-lg">
        <p>Could not fetch bookmarks. Please try again later.</p>
        <p class="text-xs mt-1">{{ error.message }}</p>
      </div>
      <div v-else-if="!data || !data.leads || data.leads.length === 0" class="mt-6 text-sm text-slate-500 text-center py-10">
        No bookmarks yet. Click “⭐ Bookmark” on any lead in the Feed.
      </div>
      <div v-else class="mt-4">
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
      :is-bookmarked="selectedLead ? bookmarks.has(selectedLead.id) : false"
      :is-bookmark-loading="isBookmarkLoading"
      @close="closeLeadDetails"
      @toggle-bookmark="toggleBookmark"
    />

    <ConfirmModal
      :show="showConfirmModal"
      :is-loading="isBookmarkLoading"
      title="Clear All Bookmarks"
      message="Are you sure you want to remove all of your saved leads? This action cannot be undone."
      @close="showConfirmModal = false"
      @confirm="handleConfirmClearAll"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ProLeadCard from '~/components/pro/ProLeadCard.vue';
import LeadDetailModal from '~/components/LeadDetailModal.vue';
import ConfirmModal from '~/components/ConfirmModal.vue';
import { useBookmarks } from '~/composables/useBookmarks'; // Import the composable

// --- Use shared state and actions from the composable ---
const { bookmarks, toggleBookmark, clearAllBookmarks, isLoading: isBookmarkLoading } = useBookmarks();

// --- Data Fetching & Pagination ---
const currentPage = ref(1);
const pageSize = 8;
const apiUrl = computed(() => `/api/bookmarks?page=${currentPage.value}&pageSize=${pageSize}`);

// Fetch data for the current page
const { data, pending, error, refresh } = useFetch(apiUrl, {
  default: () => ({ leads: [], total: 0 }),
});

// IMPORTANT: Watch for changes in the global bookmarks state and refresh the data
watch(bookmarks, () => refresh(), { deep: true });

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

// --- Lead Detail Modal ---
const showDetailModal = ref(false);
const selectedLead = ref(null);

function openLeadDetails(lead) {
  selectedLead.value = lead;
  showDetailModal.value = true;
}

function closeLeadDetails() {
  showDetailModal.value = false;
  selectedLead.value = null;
}

// --- Confirmation Modal for Clearing All ---
const showConfirmModal = ref(false);

async function handleConfirmClearAll() {
  await clearAllBookmarks();
  showConfirmModal.value = false;
  // The watcher will automatically refresh the data
}
</script>
