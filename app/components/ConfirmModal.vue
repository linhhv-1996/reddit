<template>
  <div v-if="show" class="fixed inset-0 z-50">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <!-- Modal Panel -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold">{{ title }}</h3>
            <p class="mt-1 text-sm text-slate-600">{{ message }}</p>
          </div>
          <button @click="$emit('close')" class="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">✖️</button>
        </div>
        <div class="mt-5 flex items-center justify-end gap-2">
          <button 
            @click="$emit('close')" 
            :disabled="isLoading" 
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            @click="$emit('confirm')" 
            :disabled="isLoading" 
            class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {{ isLoading ? 'Processing...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  isLoading: Boolean, // Prop to control loading state
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: 'This action cannot be undone.'
  }
});
defineEmits(['close', 'confirm']);
</script>
