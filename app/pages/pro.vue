<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div class="mx-auto max-w-5xl px-4">
        <div class="relative flex h-14 items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-6 rounded-md bg-ink"></div>
            <span class="text-sm font-semibold tracking-wide">Lead Scout</span>
            <span class="hidden md:inline-flex items-center rounded-md bg-mint/50 px-2 py-0.5 text-[11px] font-medium">PRO</span>
          </div>

          <!-- Account section updated for consistency -->
          <div v-if="isMounted && user" class="flex items-center gap-2">
            <span class="text-sm text-slate-600 truncate max-w-28 sm:max-w-40" :title="user.email">
                {{ truncatedEmail }}
            </span>
            <button @click="handleLogout" class="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">Log out</button>
          </div>

        </div>
      </div>
    </header>

    <main class="flex-1 mx-auto max-w-5xl px-4 pb-16 w-full">
      <section class="mt-6">
        <!-- Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            :class="[
              'px-3 py-2 text-sm',
              activeTab === tab.id ? '-mb-px border-b-2 border-ink font-semibold' : 'text-slate-600 hover:text-ink'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- Tab panes -->
        <div class="mt-4">
          <KeepAlive>
            <FeedTab v-if="activeTab === 'feed'" />
            <BookmarksTab v-else-if="activeTab === 'bookmarks'" />
            <AnalyticsTab v-else-if="activeTab === 'analytics'" />
            <SettingsTab v-else-if="activeTab === 'settings'" />
          </KeepAlive>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import FeedTab from '~/components/pro/FeedTab.vue';
import BookmarksTab from '~/components/pro/BookmarksTab.vue';
import AnalyticsTab from '~/components/pro/AnalyticsTab.vue';
import SettingsTab from '~/components/pro/SettingsTab.vue';

definePageMeta({
  middleware: 'pro-access'
});

useHead({
  title: 'Lead Scout – Pro Dashboard',
  meta: [
    { name: 'description', content: 'Lead Scout Pro: AI-vetted leads with filters, analytics, like/dislike feedback, and bookmarks.' }
  ]
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const activeTab = ref('feed');

// Added isMounted to prevent hydration issues
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const tabs = [
  { id: 'feed', name: 'Feed' },
  { id: 'bookmarks', name: 'Bookmarks' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'settings', name: 'Settings' },
];

// Added computed property to truncate email
const truncatedEmail = computed(() => {
    if (!user.value?.email) return '';
    const email = user.value.email;
    if (email.length > 20) {
        return email.substring(0, 17) + '...';
    }
    return email;
});

const handleLogout = async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  }
  await router.replace('/');
};
</script>

