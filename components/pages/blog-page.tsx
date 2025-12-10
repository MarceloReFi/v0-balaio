"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { blogPosts, type BlogPost } from "@/lib/blog-data"

interface BlogPageProps {
  onBack: () => void
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  if (selectedPost) {
    return (
      <div className="p-5">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 mb-5 font-bold hover:opacity-80"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        <article className="bg-white border-2 border-black p-5">
          <div className="mb-4">
            <span className="bg-[#B88FD8] text-white px-2 py-1 text-xs font-bold border border-black">
              {selectedPost.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-3">{selectedPost.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 pb-5 border-b-2 border-black">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(selectedPost.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {selectedPost.content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-2xl font-bold mt-6 mb-3">
                    {line.slice(2)}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-[#3A4571]">
                    {line.slice(3)}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-[#7A8770]">
                    {line.slice(4)}
                  </h3>
                )
              }
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
                if (match) {
                  return (
                    <p key={i} className="ml-4 my-1">
                      <strong>{match[1]}</strong>: {match[2]}
                    </p>
                  )
                }
              }
              if (line.startsWith("- ")) {
                return (
                  <p key={i} className="ml-4 my-1">
                    • {line.slice(2)}
                  </p>
                )
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-bold mt-3 mb-1">
                    {line.slice(2, -2)}
                  </p>
                )
              }
              if (line.trim() === "") {
                return <br key={i} />
              }
              return (
                <p key={i} className="my-2 leading-relaxed">
                  {line}
                </p>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-gray-600" />
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="bg-[#F2E885] px-2 py-1 text-xs font-bold border border-black">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="p-5">
      <button onClick={onBack} className="flex items-center gap-2 mb-5 font-bold hover:opacity-80">
        <ArrowLeft size={20} />
        Back to Profile
      </button>

      <h1 className="text-2xl font-bold mb-5">Balaio Blog</h1>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white border-2 border-black p-4 cursor-pointer hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#B88FD8] text-white px-2 py-0.5 text-xs font-bold border border-black">
                {post.category}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h2 className="text-lg font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{post.excerpt}</p>

            <div className="mt-3 flex items-center gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-0.5 text-xs border border-black">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
