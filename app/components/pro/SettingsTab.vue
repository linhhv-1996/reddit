<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <!-- Cột trái: Notifications -->
    <div class="md:col-span-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 class="text-base font-semibold">Notifications</h3>
        <p class="mt-1 text-sm text-slate-600">Configure how and when you get alerts for new leads.</p>

        <div class="mt-4 space-y-4">
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Delivery Channels</h4>
            <div class="mt-2 space-y-2">
              <div class="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <label for="notifEmail" class="flex items-center gap-3 text-sm font-medium">
                  <input id="notifEmail" type="checkbox" v-model="settings.notifications.email.enabled" class="size-4 rounded border-slate-300 text-ink focus:ring-ink" />
                  Email Alerts
                </label>
                <input v-model="settings.notifications.email.address" type="email" placeholder="you@domain.com" class="w-48 rounded-md border border-slate-200 px-2 py-1 text-sm" />
              </div>
              <div class="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <label for="notifTelegram" class="flex items-center gap-3 text-sm font-medium">
                  <input id="notifTelegram" type="checkbox" v-model="settings.notifications.telegram.enabled" class="size-4 rounded border-slate-300 text-ink focus:ring-ink" />
                  Telegram Alerts
                </label>
                <button @click="connectTelegram" class="rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">Connect Telegram</button>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Conditions</h4>
            <div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label class="text-xs font-medium text-slate-600">Notify for subreddits
                <input v-model="settings.notifications.conditions.subreddits" type="text" placeholder="saas, marketing, startups" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
              <label class="text-xs font-medium text-slate-600">Only if Score ≥
                <input v-model.number="settings.notifications.conditions.minScore" type="number" min="60" max="99" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Digest</h4>
            <div class="mt-2 rounded-lg border border-slate-200 p-3">
              <label class="inline-flex items-center gap-3 text-sm font-medium">
                <input v-model="settings.notifications.weeklyDigest" type="checkbox" class="size-4 rounded border-slate-300 text-ink focus:ring-ink" />
                Send weekly email digest
              </label>
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-end">
          <button @click="saveSettings" class="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Save Settings</button>
        </div>
      </div>
    </div>

    <!-- Cột phải: Sources & Account -->
    <div class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 class="text-base font-semibold">Sources</h3>
        <p class="mt-1 text-sm text-slate-600">Manage the subreddits your crawler scans.</p>

        <div class="mt-4">
          <input v-model="newSource" @keyup.enter="addSource" type="text" placeholder="e.g. saas" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <button @click="addSource" class="mt-2 w-full rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Add</button>
        </div>

        <div class="mt-3 flex flex-wrap gap-2 empty:hidden">
          <span v-for="(source, index) in settings.sources" :key="source" class="group inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs">
            {{ source.replace(/^r\//i,'') }}
            <button @click="removeSource(index)" class="opacity-60 group-hover:opacity-100">✕</button>
          </span>
        </div>

        <div class="mt-4 border-t border-slate-200 pt-4">
          <button @click="connectReddit" class="w-full justify-center inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:opacity-90 border border-slate-200/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 2.00002C17.5229 2.00002 22.0001 6.47717 22.0001 12.0001C22.0001 17.5229 17.5229 22.0001 12.0001 22.0001C6.47717 22.0001 2.00002 17.5229 2.00002 12.0001C2.00002 6.47717 6.47717 2.00002 12.0001 2.00002ZM8.63353 12.5947C7.97945 12.5947 7.45215 13.122 7.45215 13.7761C7.45215 14.4302 7.97945 14.9575 8.63353 14.9575C9.28761 14.9575 9.81491 14.4302 9.81491 13.7761C9.81491 13.122 9.28761 12.5947 8.63353 12.5947ZM15.3667 12.5947C14.7126 12.5947 14.1853 13.122 14.1853 13.7761C14.1853 14.4302 14.7126 14.9575 15.3667 14.9575C16.0208 14.9575 16.5481 14.4302 16.5481 13.7761C16.5481 13.122 16.0208 12.5947 15.3667 12.5947ZM12.0001 8.24317C10.702 8.24317 9.88233 9.48835 9.58572 10.3929L14.4144 10.3929C14.1178 9.48835 13.2981 8.24317 12.0001 8.24317ZM17.4109 16.2209C17.1517 16.7139 16.6341 17.0654 16.0121 17.0654H7.9881C7.36605 17.0654 6.84848 16.7139 6.58925 16.2209C6.39867 15.8617 6.50554 15.4244 6.83984 15.1903C8.07354 14.3312 9.94723 13.7761 12.0001 13.7761C14.0529 13.7761 15.9266 14.3312 17.1603 15.1903C17.4946 15.4244 17.6015 15.8617 17.4109 16.2209Z"></path></svg>
            <span>Connect Reddit to Speed Up Crawling</span>
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 class="text-base font-semibold">Account</h3>
        <div class="mt-4 space-y-3">
          <label class="block text-xs font-medium text-slate-600">Plan
            <input disabled :value="settings.account.plan" class="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </label>
          <label class="block text-xs font-medium text-slate-600">Email
            <input v-model="settings.account.email" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
        </div>
        <div class="mt-4 flex flex-col gap-2">
          <button class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">Manage Subscription</button>
          <button class="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">Cancel Subscription</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const settings = ref({
  notifications: {
    email: { enabled: false, address: 'you@domain.com' },
    telegram: { enabled: false },
    conditions: { subreddits: 'saas, marketing, startups', minScore: 90 },
    weeklyDigest: false,
  },
  sources: ['r/marketing','r/SaaS','r/startups'],
  account: {
    plan: 'Pro – $19/M',
    email: 'you@domain.com',
  },
});

const newSource = ref('');

function connectTelegram() {
  alert('Demo: Connect Telegram OAuth flow');
}

function saveSettings() {
  alert('Settings saved!\n' + JSON.stringify(settings.value, null, 2));
}

function addSource() {
  const val = newSource.value.trim().toLowerCase();
  if (!val) return;
  const formattedSource = val.startsWith('r/') ? val : `r/${val}`;
  if (!settings.value.sources.includes(formattedSource)) {
    settings.value.sources.push(formattedSource);
  }
  newSource.value = '';
}

function removeSource(index) {
  settings.value.sources.splice(index, 1);
}

function connectReddit() {
  alert('Demo: Connect Reddit OAuth flow');
}
</script>

