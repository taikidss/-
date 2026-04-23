import { NextResponse } from "next/server";

export const revalidate = 1800; // 30分キャッシュ

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

function extract(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (m) return m[1];
  const m2 = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`));
  return m2?.[1] ?? "";
}

function parseRSS(xml: string): NewsItem[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  return items.slice(0, 30).map((item) => {
    const rawTitle = extract(item, "title");
    const link = extract(item, "link");
    const pubDate = extract(item, "pubDate");
    const source = extract(item, "source");

    // Google Newsは "タイトル - メディア名" 形式
    const parts = rawTitle.split(" - ");
    const title = parts.length > 1 ? parts.slice(0, -1).join(" - ") : rawTitle;
    const srcName = source || (parts.length > 1 ? parts[parts.length - 1] : "");

    return {
      title: title.trim(),
      link: link.trim(),
      pubDate: pubDate.trim(),
      source: srcName.trim(),
    };
  }).filter((item) => item.title && item.link);
}

export async function GET() {
  try {
    const queries = [
      "RIZIN 格闘技",
      "ONE Championship 日本",
      "K-1 キックボクシング",
      "ボクシング 井上尚弥",
    ];

    const results = await Promise.allSettled(
      queries.map((q) =>
        fetch(
          `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ja&gl=JP&ceid=JP:ja`,
          { next: { revalidate: 1800 } }
        ).then((r) => r.text())
      )
    );

    const allItems: NewsItem[] = [];
    const seenLinks = new Set<string>();

    for (const result of results) {
      if (result.status === "fulfilled") {
        for (const item of parseRSS(result.value)) {
          if (!seenLinks.has(item.link)) {
            seenLinks.add(item.link);
            allItems.push(item);
          }
        }
      }
    }

    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json(allItems.slice(0, 20));
  } catch {
    return NextResponse.json([]);
  }
}
