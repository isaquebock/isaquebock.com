import { llmsFull } from "@/lib/llms";

/** Full site content in one Markdown file, for language models and AI agents. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
