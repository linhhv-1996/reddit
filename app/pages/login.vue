<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50">
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div class="flex flex-col items-center mb-4">
        <div class="size-10 rounded-md bg-ink mb-2"></div>
        <h2 class="text-xl font-bold text-ink">Sign in to Lead Scout</h2>
        <p class="mt-1 text-sm text-slate-600">Choose a sign-in method to continue.</p>
      </div>

      <div class="mt-4 grid gap-3">
        <button @click="signInWithGoogle" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
          <span>🔐</span><span>Continue with Google</span>
        </button>
        <button class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
          <span>✨</span><span>Continue with another SSO</span>
        </button>
      </div>
      <p v-if="authError" class="mt-3 text-xs text-red-600 text-center">{{ authError }}</p>

      <div class="mt-4 text-center">
        <NuxtLink to="/" class="text-xs text-slate-500 hover:underline">← Go back to homepage</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

definePageMeta({
  layout: false
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const authError = ref(null);

// Redirect sau khi login xong quay lại /login
watch(user, async (currentUser) => {
  if (currentUser) {
    const { data: profile } = await client
      .from('profiles')
      .select('subscription_status')
      .eq('id', currentUser.id)
      .single();

    if (profile?.subscription_status === 'pro') {
      router.push('/pro');
    } else {
      router.push('/');
    }
  }
}, { immediate: true });

async function signInWithGoogle() {
  authError.value = null;
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/login',
      queryParams: {
        prompt: 'select_account'
      }
    }
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    authError.value = 'Could not sign in with Google. Please try again.';
  }
}
</script>
