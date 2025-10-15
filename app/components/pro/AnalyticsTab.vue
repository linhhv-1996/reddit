<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div class="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h3 class="text-base font-semibold">Top Issues Breakdown</h3>
        <p class="mt-1 text-sm text-slate-600">Keyword occurrences from the last filtered lead set.</p>
        <div class="mt-4 space-y-3">
             <p class="text-sm text-slate-500">Analytics chart will be rendered here.</p>
        </div>
      </div>
      <div class="lg:col-span-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h3 class="text-base font-semibold">Leads by Intent</h3>
          <ul class="mt-3 space-y-2 text-sm">
              <li class="text-sm text-slate-500">Intent data will be listed here.</li>
          </ul>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h3 class="text-base font-semibold">Leads by Subreddit</h3>
          <ul class="mt-3 space-y-2 text-sm">
             <li class="text-sm text-slate-500">Subreddit data will be listed here.</li>
          </ul>
        </div>
      </div>
    </div>
</template>

