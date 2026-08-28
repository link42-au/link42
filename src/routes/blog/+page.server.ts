import { loadBlogArticles, toBlogArticleSummary } from "../../lib/server/blog";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
  articles: (await loadBlogArticles()).map(toBlogArticleSummary),
});
