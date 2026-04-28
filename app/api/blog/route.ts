import { NextResponse } from "next/server"

const HASHNODE_GQL = "https://gql.hashnode.com"
const HOST = "balaio.hashnode.dev"

export async function GET() {
  try {
    const res = await fetch(HASHNODE_GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            publication(host: "${HOST}") {
              posts(first: 20) {
                edges {
                  node {
                    title
                    brief
                    slug
                    publishedAt
                    readTimeInMinutes
                    tags { name }
                    author { name }
                  }
                }
              }
            }
          }
        `,
      }),
      next: { revalidate: 300 },
    })

    const json = await res.json()
    const edges: { node: HashnodePost }[] = json?.data?.publication?.posts?.edges ?? []

    const posts = edges.map(({ node }) => ({
      id: node.slug,
      title: node.title,
      excerpt: node.brief,
      date: node.publishedAt,
      readTime: node.readTimeInMinutes,
      tags: (node.tags ?? []).map((t) => t.name),
      author: node.author?.name ?? "",
      url: `https://${HOST}/${node.slug}`,
    }))

    return NextResponse.json(posts)
  } catch (err) {
    console.error("[Blog API] Error fetching from Hashnode:", err)
    return NextResponse.json([], { status: 500 })
  }
}

interface HashnodePost {
  title: string
  brief: string
  slug: string
  publishedAt: string
  readTimeInMinutes: number
  tags: { name: string }[]
  author: { name: string }
}
