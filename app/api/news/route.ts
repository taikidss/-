import { NextResponse } from "next/server";

export const revalidate = 1800;

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: "mma" | "boxing";
};

function extract(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (m) return m[1];
  const m2 = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`));
  return m2?.[1] ?? "";
}

function parseRSS(xml: string, category: "mma" | "boxing"): NewsItem[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  return items.slice(0, 20).map((item) => {
    const rawTitle = extract(item, "title");
    const link = extract(item, "link");
    const pubDate = extract(item, "pubDate");
    const source = extract(item, "source");
    const parts = rawTitle.split(" - ");
    const title = parts.length > 1 ? parts.slice(0, -1).join(" - ") : rawTitle;
    const srcName = source || (parts.length > 1 ? parts[parts.length - 1] : "");
    return { title: title.trim(), link: link.trim(), pubDate: pubDate.trim(), source: srcName.trim(), category };
  }).filter((item) => item.title && item.link);
}

export async function GET() {
  try {
    const queries: { q: string; category: "mma" | "boxing" }[] = [
      { q: "RIZIN 格闘技", category: "mma" },
      { q: "ONE Championship 日本", category: "mma" },
      { q: "K-1 キックボクシング", category: "mma" },
      { q: "ボクシング 日本 試合", category: "boxing" },
      { q: "井上尚弥 ボクシング", category: "boxing" },
    ];

    const results = await Promise.allSettled(
      queries.map(({ q }) =>
        fetch(
          `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ja&gl=JP&ceid=JP:ja`,
          { next: { revalidate: 1800 } }
        ).then((r) => r.text())
      )
    );

    const allItems: NewsItem[] = [];
    const seenLinks = new Set<string>();

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        for (const item of parseRSS(result.value, queries[i].category)) {
          if (!seenLinks.has(item.link)) {
            seenLinks.add(item.link);
            allItems.push(item);
          }
        }
      }
    });

    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    return NextResponse.json(allItems);
  } catch {
    return NextResponse.json([]);
  }
}
