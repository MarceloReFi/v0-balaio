"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Share2 } from "lucide-react"
import { blogPosts, type BlogPost } from "@/lib/blog-data"

interface BlogPageProps {
  onBack: () => void
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

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

        <div className="bg-white border-2 border-black p-5 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🎓</span>
            <h1 className="text-xl font-bold leading-tight">{selectedPost.title}</h1>
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

          <div className="bg-[#FFF244] border-l-4 border-black p-4">
            <p className="text-base leading-relaxed">{selectedPost.excerpt}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-5 mb-4">
          <div className="prose prose-sm max-w-none">
            {selectedPost.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="my-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-black p-4">
          <div className="flex justify-center">
            <button className="bg-[#636D4F] text-white px-6 py-2 font-bold border-2 border-black flex items-center gap-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

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

  return (
    <div className="pb-24">
      <button onClick={onBack} className="flex items-center gap-2 p-5 font-bold hover:opacity-80">
        <ArrowLeft size={20} />
        Back to Profile
      </button>

      <div className="bg-gradient-to-r from-[#C36DF0] via-[#E8B4F5] to-[#FFF244] border-t-2 border-b-2 border-black p-6 mb-5 text-center">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">📝 TheOffice Blog</h1>
        <p className="text-sm text-gray-800">Insights, tutorials, and stories from the Web3 Learn2Earn community</p>

        <div className="flex justify-center gap-2 mt-4">
          <button className="bg-white border-2 border-black px-4 py-2 text-sm font-bold">Web3</button>
          <button className="bg-white border-2 border-black px-4 py-2 text-sm font-bold">Education</button>
          <button className="bg-white border-2 border-black px-4 py-2 text-sm font-bold">Community</button>
        </div>
      </div>

      {featuredPost && (
        <div className="mx-5 mb-5">
          <div className="bg-[#2B325C] border-2 border-black p-5 text-white">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">⭐ Featured Post</h2>

            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">🎓</span>
              <h3 className="text-xl font-bold leading-tight">{featuredPost.title}</h3>
            </div>

            <p className="text-sm mb-4 text-white/90">{featuredPost.excerpt}</p>

            <div className="flex items-center gap-4 text-xs mb-4 text-white/80">
              <span className="flex items-center gap-1">✍️ {featuredPost.author}</span>
              <span className="flex items-center gap-1">
                📅{" "}
                {new Date(featuredPost.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {featuredPost.readTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {featuredPost.tags.map((tag) => (
                <span key={tag} className="bg-[#636D4F] text-white px-3 py-1 text-xs font-bold border-2 border-black">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedPost(featuredPost)}
              className="bg-[#FFF244] text-black px-6 py-2 font-bold border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow inline-flex items-center gap-2"
            >
              📖 Read Full Post
            </button>
          </div>
        </div>
      )}

      <div className="mx-5 mb-5">
        <div className="bg-[#EBDAD8] border-2 border-black p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">📁 Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-white border-2 border-black p-3 text-sm font-bold text-left hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow">
              Web3
            </button>
            <button className="bg-white border-2 border-black p-3 text-sm font-bold text-left hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow">
              Education
            </button>
          </div>
        </div>
      </div>

      {/* Blog post list */}
      <div className="mx-5 space-y-4">
        {blogPosts
          .filter((post) => !post.featured)
          .map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white border-2 border-black p-4 cursor-pointer hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 text-xs font-bold border-2 border-black ${
                    post.category === "Platform"
                      ? "bg-[#C36DF0] text-white"
                      : post.category === "Education"
                        ? "bg-[#636D4F] text-white"
                        : post.category === "Tutorial"
                          ? "bg-[#FFF244] text-black"
                          : "bg-[#D96E5F] text-white"
                  }`}
                >
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
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.excerpt}</p>

              <div className="flex items-center gap-2 flex-wrap">
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
