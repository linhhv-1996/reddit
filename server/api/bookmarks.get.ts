import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = await serverSupabaseClient(event)

  // Lấy thông tin user đã được xác thực từ Supabase server
  const { data: { user }, error: userError } = await client.auth.getUser()

  if (userError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = user.id
  const query = getQuery(event)

  // --- Pagination ---
  const page = parseInt(query.page?.toString() || '1', 10)
  const pageSize = parseInt(query.pageSize?.toString() || '8', 10)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // --- Build Query ---
  const { data: bookmarkIds, error: bookmarkIdsError } = await client
    .from('bookmarks')
    .select('lead_id')
    .eq('user_id', userId);

  if (bookmarkIdsError) {
    console.error('Error fetching bookmark ids:', bookmarkIdsError);
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bookmark ids.' });
  }

  const leadIds = bookmarkIds.map(b => b.lead_id);

  if (leadIds.length === 0) {
    return { leads: [], total: 0 };
  }

  // --- Execute Queries ---
  const leadsQuery = client
    .from('leads')
    .select('*')
    .in('id', leadIds)
    .order('posted_at', { ascending: false })
    .range(from, to);

  const countQuery = client
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .in('id', leadIds);


  const [
      { data: leads, error: leadsError },
      { count, error: countError }
  ] = await Promise.all([
      leadsQuery,
      countQuery
  ]);


  if (leadsError || countError) {
    const dbError = leadsError || countError;
    console.error('Error fetching bookmarked leads from Supabase:', dbError);
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bookmarked leads from database.' });
  }

  return {
      leads,
      total: count
  };
})
