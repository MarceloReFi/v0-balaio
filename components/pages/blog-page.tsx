"use client"

import { useState } from "react"
import { ArrowLeft, Clock } from "lucide-react"
import { blogPosts, blogCategories, type BlogPost } from "@/lib/blog-data"

interface BlogPageProps {
  onBack?: () => void
  language?: string
}

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    const boldHeading = block.match(/^\*\*(.+)\*\*$/)
    if (boldHeading) {
      return (
        <h3 key={i} className="text-balaio-ink font-semibold text-base mt-6 mb-2">
          {boldHeading[1]}
        </h3>
      )
    }

    const parts = block.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-balaio-ink leading-relaxed mb-3 text-[15px]">
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j}>{part.slice(2, -2)}</strong>
          }
          return part
        })}
      </p>
    )
  })
}

const categoryColors: Record<string, string> = {
  Platform: "bg-[#EAF4EE] text-[#4A7B5E]",
  Partnership: "bg-[#E8F4F8] text-[#2A6B8A]",
  Education: "bg-[#F0EEF8] text-[#5A4A8A]",
  "Use Case": "bg-[#FEF9E7] text-[#8A6D00]",
  Tutorial: "bg-[#F2F4F1] text-[#7A8784]",
  Gamification: "bg-[#FFF0EC] text-[#A04030]",
  "Learn2Earn": "bg-[#EAF4EE] text-[#4A7B5E]",
  Insights: "bg-[#F2F4F1] text-[#7A8784]",
}

function CategoryBadge({ category }: { category: string }) {
  const cls = categoryColors[category] ?? "bg-balaio-surface text-balaio-muted"
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {category}
    </span>
  )
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")

  const featuredPost = blogPosts.find((post) => post.featured)
  const filteredPosts = blogPosts.filter(
    (post) => !post.featured && (activeCategory === "All" || post.category === activeCategory)
  )

  if (selectedPost) {
    return (
      <div className="bg-balaio-bg min-h-screen pb-28">
        <div className="px-5 pt-4 pb-2">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-balaio-muted hover:text-balaio-ink transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Blog
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge category={selectedPost.category} />
            <span className="text-balaio-muted text-xs">
              {new Date(selectedPost.date).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1
            className="text-[26px] italic leading-snug text-balaio-ink mb-4"
            style={{ fontFamily: "var(--balaio-font-display)" }}
          >
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-balaio-muted mb-6 pb-5 border-b border-balaio-rule">
            <span>{selectedPost.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {selectedPost.readTime}
            </span>
          </div>

          <blockquote className="border-l-[3px] border-balaio-sage pl-4 mb-6">
            <p className="text-balaio-ink text-base leading-relaxed italic">{selectedPost.excerpt}</p>
          </blockquote>

          <div className="mb-6">{renderContent(selectedPost.content)}</div>

          <div className="flex flex-wrap gap-2 pt-5 border-t border-balaio-rule mb-8">
            {selectedPost.tags.map((tag) => (
              <span key={tag} className="bg-balaio-surface text-balaio-muted text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-balaio-muted uppercase tracking-wider mb-3">Leia também</p>
            <div className="space-y-2">
              {blogPosts
                .filter((p) => p.id !== selectedPost.id)
                .slice(0, 3)
                .map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="w-full text-left p-3 bg-balaio-surface rounded-xl hover:bg-balaio-rule transition-colors"
                  >
                    <p className="text-[11px] text-balaio-muted mb-1">{post.category}</p>
                    <p className="text-sm font-medium text-balaio-ink leading-snug">{post.title}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-balaio-bg min-h-screen pb-28">
      <div className="px-5 pt-6 pb-5">
        <h1
          className="text-[32px] italic text-balaio-ink mb-1 leading-tight"
          style={{ fontFamily: "var(--balaio-font-display)" }}
        >
          Blog
        </h1>
        <p className="text-sm text-balaio-muted">Plataforma, parcerias e casos de uso</p>
      </div>

      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-balaio-sage text-white"
                  : "bg-balaio-surface text-balaio-muted hover:text-balaio-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {featuredPost && activeCategory === "All" && (
        <div className="px-5 mb-5">
          <button
            onClick={() => setSelectedPost(featuredPost)}
            className="w-full text-left bg-balaio-sage rounded-2xl p-5 active:opacity-90 transition-opacity"
          >
            <span className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-3 block">
              Em destaque
            </span>
            <h2
              className="text-white text-[22px] italic leading-snug mb-3"
              style={{ fontFamily: "var(--balaio-font-display)" }}
            >
              {featuredPost.title}
            </h2>
            <p className="text-white/75 text-sm leading-relaxed mb-4 line-clamp-3">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-3 text-white/60 text-xs">
              <span>{featuredPost.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {featuredPost.readTime}
              </span>
            </div>
          </button>
        </div>
      )}

      <div className="px-5 space-y-3">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white rounded-xl p-4 cursor-pointer border border-balaio-rule hover:border-balaio-sage/30 transition-colors"
            style={{ boxShadow: "var(--balaio-shadow-card)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={post.category} />
              <span className="text-balaio-muted text-xs">
                {new Date(post.date).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <h2 className="text-balaio-ink font-semibold text-[15px] leading-snug mb-1.5">{post.title}</h2>
            <p className="text-balaio-muted text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
