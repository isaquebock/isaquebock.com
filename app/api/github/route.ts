import { profile } from "@/data/profile";

type ApiResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
};

export async function GET() {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(profile.githubUsername)}?y=last`,
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) {
    return Response.json({ error: "Could not load contributions" }, { status: 502 });
  }
  const data = (await res.json()) as ApiResponse;
  return Response.json({
    total: data.total.lastYear ?? 0,
    contributions: data.contributions,
  });
}
