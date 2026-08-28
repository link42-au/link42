import { loadBlogArticles, renderBlogRss } from "../../../lib/server/blog";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () =>
  new Response(renderBlogRss(await loadBlogArticles()), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
