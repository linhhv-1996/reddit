import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data: { user }, error: userError } = await client.auth.getUser()

  if (userError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = user.id;
  const { lead_id, bookmarked } = body;

  if (!lead_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing lead_id' })
  }

  if (bookmarked) {
    const { error } = await client
      .from('bookmarks')
      .insert({ user_id: userId, lead_id });

    if (error) {
      console.error('Error adding bookmark:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to add bookmark.' });
    }
  } else {
    // Remove bookmark
    const { error } = await client
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('lead_id', lead_id);

    if (error) {
      console.error('Error removing bookmark:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to remove bookmark.' });
    }
  }

  return { success: true };
})
