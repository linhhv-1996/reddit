<template>
  <div v-if="show" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-bold">Sign in</h3>
          <button @click="$emit('close')" class="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">Esc</button>
        </div>
        <p class="mt-1 text-sm text-slate-600">Choose a sign-in method to continue.</p>
        <div class="mt-4 grid gap-2">
          <!-- Cập nhật sự kiện click để gọi hàm đăng nhập -->
          <button @click="signInWithGoogle" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
            <span>🔐</span><span>Continue with Google</span>
          </button>
          <button class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
            <span>✨</span><span>Continue with SSO</span>
          </button>
        </div>
        <p v-if="authError" class="mt-3 text-xs text-red-600">{{ authError }}</p>
        <p class="mt-3 text-xs text-slate-500">By continuing you agree to our Terms and acknowledge our Privacy Policy.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  show: Boolean
});
defineEmits(['close']);

const client = useSupabaseClient();
const authError = ref(null);

// Hàm xử lý đăng nhập với Google
async function signInWithGoogle() {
  authError.value = null;
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Bạn có thể tùy chỉnh redirectTo nếu cần
      // redirectTo: `${window.location.origin}/confirm`
    }
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    authError.value = 'Could not sign in with Google. Please try again.';
  }
}
</script>
