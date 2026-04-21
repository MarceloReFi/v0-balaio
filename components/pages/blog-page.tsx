"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Share2 } from "lucide-react"
import { blogPosts, blogCategories, type BlogPost } from "@/lib/blog-data"

interface BlogPageProps {
  onBack?: () => void
  language?: string
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary">
      {category}
    </span>
  )
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered = blogPosts.filter(p =>
    activeCategory === "Todos" ? true : p.category === activeCategory
  )
  const featuredPost = blogPosts.find(p => p.featured)

  if (selectedPost) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 mb-8 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Voltar ao Blog
        </button>

        <CategoryBadge category={selectedPost.category} />
        <h1 className="mt-3 text-2xl font-bold text-primary-container leading-tight mb-4" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
          {selectedPost.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-6">
          <span>{selectedPost.author}</span>
          <span>·</span>
          <span>{new Date(selectedPost.date).toLocaleDateString("pt-BR", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {selectedPost.readTime}</span>
        </div>

        <div className="w-full h-px bg-secondary/20 mb-6" />

        <div className="bg-surface-container-low rounded-xl p-5 mb-8">
          <p className="text-sm text-on-surface-variant leading-relaxed italic">{selectedPost.excerpt}</p>
        </div>

        <div className="flex flex-col gap-4">
          {selectedPost.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-sm text-on-surface leading-relaxed">{paragraph}</p>
          ))}
        </div>

        <div className="w-full h-px bg-secondary/20 my-8" />

        <div className="flex flex-wrap gap-2 mb-6">
          {selectedPost.tags.map(tag => (
            <span key={tag} className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <button className="flex items-center gap-2 text-secondary text-sm font-semibold hover:opacity-70 transition-opacity">
          <Share2 size={14} /> Compartilhar
        </button>

        <div className="mt-12">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-4">Leia também</p>
          <div className="flex flex-col gap-3">
            {blogPosts.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
              <button key={post.id} onClick={() => setSelectedPost(post)} className="text-left p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                <CategoryBadge category={post.category} />
                <p className="font-semibold text-on-surface text-sm mt-1">{post.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 mb-8 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Voltar
          </button>
        )}

        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-2">Blog</p>
        <h1 className="text-3xl font-bold text-primary-container mb-2" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
          Balaio Journal
        </h1>
        <p className="text-on-surface-variant text-sm mb-8">Coordenação, execução e o futuro do trabalho onchain.</p>

        <div className="flex gap-2 flex-wrap mb-10">
          {blogCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-primary-container text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {featuredPost && activeCategory === "Todos" && (
          <div className="bg-primary-container rounded-2xl p-8 mb-8 cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setSelectedPost(featuredPost)}>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-marigold">Em destaque</span>
            <h2 className="mt-3 text-xl font-bold text-surface leading-tight mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
              {featuredPost.title}
            </h2>
            <p className="text-on-primary-container text-sm leading-relaxed mb-4">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-on-primary-container/70">
              <span>{featuredPost.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {featuredPost.readTime}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col">
          {filtered.filter(p => !p.featured || activeCategory !== "Todos").map(post => (
            <article key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer group">
              <div className="flex justify-between items-start gap-4 py-6 border-b border-outline-variant/20">
                <div className="flex-1 min-w-0">
                  <CategoryBadge category={post.category} />
                  <h2 className="mt-2 font-bold text-on-surface text-base leading-snug group-hover:text-secondary transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>
                    {post.title}
                  </h2>
                  <p className="mt-1 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-on-surface-variant">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
