"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Share2 } from "lucide-react"
import { blogPosts, type BlogPost } from "@/lib/blog-data"

interface BlogPageProps {
  onBack: () => void
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts =
    selectedCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === selectedCategory)

  const featuredPost = blogPosts.find((post) => post.featured)

  // Article view
  if (selectedPost) {
    return (
      <div className="p-5 pb-24">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 mb-5 font-bold hover:opacity-80"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        {/* Article header card */}
        <div className="bg-white border-2 border-black p-5 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🎓</span>
            <div>
              <h1 className="text-xl font-bold leading-tight">{selectedPost.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">✍️ {selectedPost.author}</span>
            <span className="flex items-center gap-1">
              📅{" "}
              {new Date(selectedPost.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {selectedPost.readTime}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPost.tags.map((tag) => (
              <span key={tag} className="bg-white border-2 border-black px-3 py-1 text-xs font-bold">
                {tag}
              </span>
            ))}
          </div>

          {/* Yellow excerpt box */}
          <div className="bg-[#F2E885] border-l-4 border-black p-4">
            <p className="text-base leading-relaxed">{selectedPost.excerpt}</p>
          </div>
        </div>

        {/* Article content */}
        <div className="bg-white border-2 border-black p-5 mb-4">
          <div className="prose prose-sm max-w-none">
            {selectedPost.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-lg font-bold mt-5 mb-3 text-[#7A8770]">
                    {line.slice(3)}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                const text = line.slice(4)
                // Check if it's a highlighted section title
                if (
                  [
                    "Rural Communities",
                    "Professional Development",
                    "Student Support",
                    "For Learners",
                    "For Educators",
                  ].includes(text)
                ) {
                  return (
                    <div key={i} className="bg-white border-2 border-black p-4 my-3">
                      <h3 className="font-bold mb-1">{text}</h3>
                    </div>
                  )
                }
                return (
                  <h3 key={i} className="text-base font-bold mt-4 mb-2">
                    {text}
                  </h3>
                )
              }
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
                if (match) {
                  return (
                    <p key={i} className="ml-4 my-1">
                      • <strong>{match[1]}</strong>: {match[2]}
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
              if (
                line.startsWith("1. ") ||
                line.startsWith("2. ") ||
                line.startsWith("3. ") ||
                line.startsWith("4. ")
              ) {
                return (
                  <p key={i} className="ml-4 my-1">
                    {line}
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
        </div>

        {/* Share button */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex justify-center">
            <button className="bg-[#7A8770] text-white px-6 py-2 font-bold border-2 border-black flex items-center gap-2">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Related Posts */}
        <div className="bg-white border-2 border-black p-4 mt-4">
          <h3 className="font-bold flex items-center gap-2 mb-3">📚 Related Posts</h3>
          <div className="space-y-2">
            {blogPosts
              .filter((p) => p.id !== selectedPost.id)
              .slice(0, 2)
              .map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="w-full text-left p-2 border border-gray-200 hover:bg-gray-50"
                >
                  <p className="font-bold text-sm">{post.title}</p>
                  <p className="text-xs text-gray-600">{post.category}</p>
                </button>
              ))}
          </div>
        </div>
      </div>
    )
  }

  // Blog list view
  return (
    <div className="p-5 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 mb-5 font-bold hover:opacity-80">
        <ArrowLeft size={20} />
        Back to Profile
      </button>

      <h1 className="text-2xl font-bold mb-5">Balaio Blog</h1>

      {/* Blog post list */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white border-2 border-black p-4 cursor-pointer hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#C4897B] text-white px-2 py-0.5 text-xs font-bold">{post.category}</span>
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

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-white border border-black px-2 py-0.5 text-xs">
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
