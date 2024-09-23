import { HNPost } from "./types";

type Post = {
    objectID: string;
    points: number;
  };
  
  export async function searchHNPosts(keywords: string[]) {
    const HN_API_URL = "http://hn.algolia.com/api/v1/search_by_date";
  
    // Get the current timestamp and subtract 2 years in seconds (2 * 365 * 24 * 60 * 60)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const twoYearsAgoTimestamp = currentTimestamp - 2 * 365 * 24 * 60 * 60;
  
    // Construct the numericFilters to filter by creation time (>= 2 years ago) and points (>= 20)
    const numericFilters = `created_at_i>=${twoYearsAgoTimestamp},points>=20`;
  
    // Function to perform individual search for a keyword
    const performSearch = async (keyword: string) => {
      const apiUrl = `${HN_API_URL}?query=${encodeURIComponent(
        keyword
      )}&tags=story&hitsPerPage=50&numericFilters=${encodeURIComponent(numericFilters)}`;
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.hits || [];
      } catch (error) {
        console.error(`Error fetching posts for keyword "${keyword}":`, error);
        return [];
      }
    };
  
    try {
      // Use Promise.all to perform all searches in parallel
      const results = await Promise.all(keywords.map((keyword) => performSearch(keyword)));
  
      // Flatten the array of results and deduplicate by "objectID"
      const allPosts = results.flat(); // Flatten the array of arrays
  
      const deduplicatedPosts: HNPost[] = Object.values(
        allPosts.reduce((acc: Record<string, Post>, post: Post) => {
          acc[post.objectID] = post; // Use objectID as the key to deduplicate
          return acc;
        }, {})
      );
  
      // Sort by points in descending order
      const sortedResults = deduplicatedPosts.sort((a, b) => b.points - a.points);
  
      return sortedResults;
    } catch (error) {
      console.error("Error performing HN search:", error);
      return [];
    }
  }
  