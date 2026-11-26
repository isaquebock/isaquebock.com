import { llmsIndex } from "@/lib/llms";

/** https://llmstxt.org: site summary for language models and AI agents. */
export function GET() {
  return new Response(llmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
