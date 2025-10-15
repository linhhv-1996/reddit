export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient();

  // Ensure we get a fresh session from Supabase
  const { data: { session }, error: sessionError } = await client.auth.getSession();

  const userId = session?.user?.id;

  if (!userId) {
    console.error('No user session found.');
    return navigateTo('/login');
  }

  // Now we are certain userId exists
  const { data: profile, error } = await client
    .from('profiles')
    .select('subscription_status')
    .eq('id', userId)
    .single();

  if (error || !profile || profile.subscription_status !== 'pro') {
    console.error("Pro access denied. Reason:", error ? error.message : "Profile not found or user is not 'pro'.");
    return navigateTo('/');
  }

  // All checks passed
});
