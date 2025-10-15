import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase URL or Service Key is not configured.' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)
  const query = getQuery(event)

  // --- Pagination ---
  const page = parseInt(query.page?.toString() || '1', 10)
  const pageSize = parseInt(query.pageSize?.toString() || '5', 10)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // --- Filtering ---
  const keyword = query.keyword?.toString()
  const subreddit = query.subreddit?.toString()
  const intent = query.intent?.toString()
  const minScore = parseInt(query.minScore?.toString() || '40', 10)

  // --- Sorting ---
  const sortBy = query.sortBy?.toString(); // Lấy tham số sortBy, có thể là undefined

  // --- Build Query ---
  let leadsQuery = supabase
    .from('leads')
    .select('*');
    
  let countQuery = supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  // Apply filters to both queries
  if (keyword) {
    leadsQuery = leadsQuery.or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`);
    countQuery = countQuery.or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`);
  }
  if (subreddit) {
    leadsQuery = leadsQuery.eq('subreddit', subreddit);
    countQuery = countQuery.eq('subreddit', subreddit);
  }
  if (intent) {
    leadsQuery = leadsQuery.eq('intent', intent);
    countQuery = countQuery.eq('intent', intent);
  }
  if (minScore > 0) {
    leadsQuery = leadsQuery.gte('score', minScore);
    countQuery = countQuery.gte('score', minScore);
  }

  // Apply sorting based on sortBy parameter
  if (sortBy === 'score') {
    // Chỉ sắp xếp theo score khi được yêu cầu rõ ràng (từ Pro Filter)
    leadsQuery = leadsQuery.order('score', { ascending: false }).order('posted_at', { ascending: false });
  } else if (sortBy === 'upvotes') {
    // Sắp xếp theo upvotes khi được yêu cầu
    leadsQuery = leadsQuery.order('engagement_details->upvotes', { ascending: false, nullsFirst: false });
  } else {
    // Mặc định cho trang free và khi không có filter: sắp xếp theo mới nhất
    leadsQuery = leadsQuery.order('posted_at', { ascending: false });
  }

  // Apply pagination AFTER sorting
  leadsQuery = leadsQuery.range(from, to);
  
  // --- Execute Queries ---
  const [
      { data: leads, error: leadsError }, 
      { count, error: countError }
  ] = await Promise.all([
      leadsQuery,
      countQuery
  ]);

  if (leadsError || countError) {
    const dbError = leadsError || countError;
    console.error('Error fetching leads from Supabase:', dbError);
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch leads from database.' });
  }

  return {
      leads,
      total: count
  };
})

