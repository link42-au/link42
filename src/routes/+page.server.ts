import { loadLatestBlogArticle } from "$lib/server/blog";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
  latestArticle: await loadLatestBlogArticle(),
});
