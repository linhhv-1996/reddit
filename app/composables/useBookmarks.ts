// app/composables/useBookmarks.ts
import { ref, onMounted } from 'vue';

// Shared state that will be consistent across all components using this composable
const bookmarks = ref(new Set<string>());
const isLoading = ref(false);
const hasFetched = ref(false);

export function useBookmarks() {

  /**
   * Fetches the initial list of bookmarks from the server.
   * Runs only once to prevent unnecessary network requests.
   */
  const fetchBookmarks = async () => {
    if (hasFetched.value) return; // Fetch only once
    isLoading.value = true;
    try {
      // Fetch a large number of items to get all bookmark IDs for the user
      const response = await $fetch<{ leads: { id: string }[] }>('/api/bookmarks?pageSize=9999');
      if (response && response.leads) {
        bookmarks.value = new Set(response.leads.map(lead => lead.id));
      }
      hasFetched.value = true;
    } catch (e) {
      console.error("Failed to fetch bookmarks:", e);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Toggles a bookmark on or off for a specific lead.
   * @param leadId The ID of the lead to bookmark/unbookmark.
   */
  const toggleBookmark = async (leadId: string) => {
    const isBookmarked = bookmarks.value.has(leadId);
    isLoading.value = true;
    try {
      await $fetch('/api/bookmarks', {
        method: 'POST',
        body: { lead_id: leadId, bookmarked: !isBookmarked },
      });

      // Update the local state reactively
      if (isBookmarked) {
        bookmarks.value.delete(leadId);
      } else {
        bookmarks.value.add(leadId);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Removes all bookmarks for the current user.
   */
  const clearAllBookmarks = async () => {
    isLoading.value = true;
    try {
        // Create an array of promises to delete all bookmarks in parallel
        const deletePromises = Array.from(bookmarks.value).map(leadId =>
            $fetch('/api/bookmarks', {
                method: 'POST',
                body: { lead_id: leadId, bookmarked: false },
            })
        );
        await Promise.all(deletePromises);
        bookmarks.value.clear(); // Clear the local state
    } catch (error) {
        console.error('Failed to clear bookmarks:', error);
    } finally {
        isLoading.value = false;
    }
  };

  // Automatically fetch bookmarks when the composable is used for the first time
  onMounted(fetchBookmarks);

  // Expose the state and actions to the components
  return {
    bookmarks,
    isLoading,
    toggleBookmark,
    clearAllBookmarks,
  };
}
