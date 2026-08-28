import { error } from "@sveltejs/kit";
import { getBlogArticle } from "../../../lib/server/blog";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const article = await getBlogArticle(params.slug);
  if (!article) error(404, "Blog article not found");
  return { article };
};
