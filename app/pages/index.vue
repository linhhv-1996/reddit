<template>
  <div>
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div class="mx-auto max-w-5xl px-4">
        <div class="flex h-14 items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-6 rounded-md bg-ink"></div>
            <NuxtLink to="/" class="text-sm font-semibold tracking-wide">Lead Scout</NuxtLink>
          </div>

          <!-- Render phần user chỉ trên client để tránh lệch SSR/CSR -->
          <ClientOnly>
            <div class="flex items-center gap-3">
              <!-- ĐÃ LOGIN -->
              <template v-if="user">
                <!-- Loading profile -->
                <div v-if="!profile" class="flex items-center gap-2">
                  <div class="h-5 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                  <div class="h-8 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                </div>

                <!-- Free user -->
                <div v-else-if="profile.subscription_status !== 'pro'" class="flex items-center gap-2">
                  <span class="text-sm text-slate-600 truncate max-w-28 sm:max-w-40" :title="user.email">
                    {{ truncatedEmail }}
                  </span>
                  <button @click="handleLogout" class="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
                    Log out
                  </button>
                  <button @click="showProModal = true" class="hidden sm:block rounded-xl bg-banana px-3 py-1.5 text-sm font-semibold text-ink shadow-soft hover:opacity-90">
                    Upgrade
                  </button>
                </div>

                <!-- Pro user (watchEffect sẽ redirect) -->
                <div v-else class="flex items-center gap-2">
                  <span class="text-sm text-slate-500">Welcome Pro! Redirecting...</span>
                </div>
              </template>

              <!-- CHƯA LOGIN -->
              <template v-else>
                <NuxtLink to="/login" class="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">Log in</NuxtLink>
                <button @click="showProModal = true" class="rounded-xl bg-ink px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">Upgrade</button>
              </template>
            </div>
          </ClientOnly>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="mx-auto max-w-5xl px-4 py-8">
      <div class="flex flex-col gap-2">
        <h1 class="max-w-3xl text-2xl md:text-3xl font-extrabold leading-tight">
          Stop scrolling endlessly. Our AI finds prospects discussing problems you can solve and delivers them to you.
        </h1>
        <p class="max-w-3xl text-sm text-slate-600">
          A public, real-time portal of AI-vetted leads from Reddit. Free users can browse the stream; Pro unlocks filters, customize feeds, and instant Telegram notifications.
        </p>
      </div>
    </section>

    <!-- Upgrade Bar -->
    <div class="sticky top-14 z-30 border-y border-slate-200/70 bg-white/90 backdrop-blur">
      <div class="mx-auto max-w-5xl px-4 py-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div class="text-sm"><span class="font-semibold">Pro unlocks</span>: Customize Feeds • AI Filtering • Instant Notifications</div>
        <div class="flex items-center gap-2">
          <button @click="showProModal = true" class="rounded-lg bg-banana px-3 py-1.5 text-sm font-semibold text-ink shadow-soft hover:opacity-90">
            Upgrade to Pro
          </button>
          <span class="text-xs text-slate-500">Cancel anytime</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <FiltersFree @open-pro-modal="showProModal = true" />

    <!-- Feed -->
    <main id="feed" class="mx-auto max-w-5xl px-4 pb-16">
      <!-- Loading -->
      <div v-if="pending" class="text-center py-10 text-slate-500">
        Fetching latest leads...
      </div>
      <!-- Error -->
      <div v-else-if="error" class="text-center py-10 text-red-600 bg-red-50 rounded-lg">
        <p>Could not fetch leads. Please try again later.</p>
        <p class="text-xs mt-1">{{ error.message }}</p>
      </div>
      <!-- Loaded -->
      <div v-else-if="data && data.leads">
        <div id="feedList" class="flex flex-col gap-3">
          <LeadCard
            v-for="lead in data.leads"
            :key="lead.id"
            :lead="lead"
            @open-pro-modal="showProModal = true"
          />
        </div>
        <!-- Pager -->
        <div v-if="totalPages > 1" id="pager" class="mt-4 flex items-center justify-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-slate-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <ProModal :show="showProModal" @close="showProModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, watchEffect } from 'vue';
import LeadCard from '~/components/LeadCard.vue';
import FiltersFree from '~/components/FiltersFree.vue';
import ProModal from '~/components/ProModal.vue';

useHead({
  title: 'Lead Scout – The Open Dealflow Portal',
  meta: [
    { name: 'description', content: 'A live, public portal of AI-vetted leads from Reddit. Browse now, upgrade to Pro to unlock filters, customize feeds, and instant Telegram notifications.' }
  ]
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const profile = ref(null);

const showProModal = ref(false);

// Đồng bộ user ở client sau khi mounted + lắng nghe thay đổi auth
onMounted(async () => {
  const { data: { user: u } } = await client.auth.getUser();
  if (u && !user.value) user.value = u;

  const { data: sub } = client.auth.onAuthStateChange(async () => {
    const { data: { user: u2 } } = await client.auth.getUser();
    user.value = u2 ?? null;
  });

  onUnmounted(() => {
    try { sub.subscription.unsubscribe(); } catch {}
  });
});

// Lấy profile + redirect nếu là pro
watchEffect(async () => {
  if (user.value) {
    try {
      if (!profile.value) {
        const { data, error } = await client
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.value.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        profile.value = data;
      }
      if (profile.value?.subscription_status === 'pro') {
        router.push('/pro');
      }
    } catch (err) {
      console.error('Error in watchEffect:', err);
    }
  } else {
    profile.value = null;
  }
});

const truncatedEmail = computed(() => {
  const email = user.value?.email || '';
  return email.length > 20 ? email.slice(0, 17) + '...' : email;
});

// Pagination
const pageSize = 5;
const currentPage = ref(1);
const apiUrl = computed(() => `/api/leads?page=${currentPage.value}&pageSize=${pageSize}`);

const { data, pending, error } = useFetch(apiUrl, {
  default: () => ({ leads: [], total: 0 }),
  lazy: true,
});

const totalPages = computed(() => {
  if (!data.value || !data.value.total) return 1;
  return Math.max(1, Math.ceil(data.value.total / pageSize));
});

const handleLogout = async () => {
  try {
    // 1) Gọi signOut global để revoke mọi phiên (web + provider nếu hỗ trợ)
    const { error } = await client.auth.signOut({ scope: 'global' }); 
    if (error) {
      console.error('Error logging out:', error);
    }

    // 3) Chờ session thực sự null để tránh race condition
    const waitForNullSession = async () => {
      for (let i = 0; i < 10; i++) {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return true;
        await new Promise(r => setTimeout(r, 100));
      }
      return false;
    };
    await waitForNullSession();

    // 4) Dọn state reactivity ngay (tránh UI nháy)
    user.value = null;

    // 5) Hard redirect để reset toàn bộ app state
    window.location.assign('/login');
  } catch (e) {
    console.error('Logout fatal:', e);
    // fallback an toàn
    window.location.assign('/login');
  }
};


function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
watch(currentPage, () => {
  window.scrollTo(0, 0);
});
</script>
