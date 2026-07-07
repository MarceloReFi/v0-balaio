import { NextResponse } from "next/server"

const SUBSTACK_FEED_URL = "https://usebalaio.substack.com/feed"

function extract(pattern: RegExp, block: string): string {
  return block.match(pattern)?.[1]?.trim() ?? ""
}

export async function GET() {
  try {
    const res = await fetch(SUBSTACK_FEED_URL, { cache: "no-store" })
    const xml = await res.text()

    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? []

    const posts = items.map((item) => {
      const title = extract(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/, item)
      const link = extract(/<link>([\s\S]*?)<\/link>/, item)
      const pubDate = extract(/<pubDate>([\s\S]*?)<\/pubDate>/, item)
      const description = extract(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/, item)
      const creator = extract(/<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/, item)
      const contentEncoded = extract(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/, item)

      const plainText = contentEncoded.replace(/<[^>]+>/g, "")
      const wordCount = plainText.split(/\s+/).filter(Boolean).length
      const readTime = Math.max(1, Math.ceil(wordCount / 200))

      return {
        id: link.split("/").filter(Boolean).pop() ?? link,
        title,
        excerpt: description,
        date: pubDate,
        readTime,
        tags: [] as string[],
        author: creator,
        url: link,
      }
    })

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(posts)
  } catch (err) {
    console.error("[Blog API] Error fetching from Substack:", err)
    return NextResponse.json([], { status: 500 })
  }
}
