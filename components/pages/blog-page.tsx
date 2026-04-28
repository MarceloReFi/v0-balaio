"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: number
  tags: string[]
  author: string
  url: string
}

interface BlogPageProps {
  onBack?: () => void
  language?: string
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then(data => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const featuredPost = posts[0] ?? null

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

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-6 border-b border-outline-variant/20 animate-pulse">
                <div className="h-3 w-20 bg-surface-container-high rounded mb-3" />
                <div className="h-5 w-3/4 bg-surface-container-high rounded mb-2" />
                <div className="h-3 w-full bg-surface-container-high rounded mb-1" />
                <div className="h-3 w-2/3 bg-surface-container-high rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {featuredPost && (
              <div
                className="bg-primary-container rounded-2xl p-8 mb-8 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(featuredPost.url, "_blank")}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-marigold">Em destaque</span>
                <h2 className="mt-3 text-xl font-bold text-surface leading-tight mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
                  {featuredPost.title}
                </h2>
                <p className="text-on-primary-container text-sm leading-relaxed mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-on-primary-container/70">
                  <span>{featuredPost.author}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {featuredPost.readTime} min</span>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              {posts.slice(1).map(post => (
                <article key={post.id} onClick={() => window.open(post.url, "_blank")} className="cursor-pointer group">
                  <div className="flex justify-between items-start gap-4 py-6 border-b border-outline-variant/20">
                    <div className="flex-1 min-w-0">
                      {post.tags[0] && (
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary">
                          {post.tags[0]}
                        </span>
                      )}
                      <h2 className="mt-2 font-bold text-on-surface text-base leading-snug group-hover:text-secondary transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>
                        {post.title}
                      </h2>
                      <p className="mt-1 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-on-surface-variant">
                        <span>{post.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime} min</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
