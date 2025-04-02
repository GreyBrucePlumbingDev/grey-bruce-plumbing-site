"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

interface BlogPostProps {
  id: string
  title: string
  preview: string
  imageUrl: string
  date: string
}

const BlogPreview: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true)

        // Fetch the last 4 published blog posts ordered by creation date
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, excerpt, featured_image, slug, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(4)

        if (error) {
          throw new Error(error.message)
        }

        // Transform the Supabase data to match your BlogPostProps format
        const formattedPosts: BlogPostProps[] = (data || []).map((post) => ({
          id: post.slug, // Using slug as the ID
          title: post.title,
          preview: post.excerpt || "",
          imageUrl: post.featured_image || "/images/blog/default.jpg", // Fallback to default image if needed
          date: formatDate(post.created_at),
        }))

        setBlogPosts(formattedPosts)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch blog posts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) return <div className="text-center p-4">Loading blog posts...</div>
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>

  return (
    <div id="blog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-secondary-700 mb-12">Plumbing Tips & Insights</h2>

        <div className="max-w-5xl mx-auto space-y-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image section (30%) */}
                <div className="md:w-[30%] h-48 md:h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    // Fallback image in case the actual image doesn't load
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/300x200?text=Plumbing+Blog"
                    }}
                  />
                </div>

                {/* Text section (70%) */}
                <div className="md:w-[70%] p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                    <h3 className="text-xl font-bold text-secondary-700 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.preview}</p>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to={`/blogs/${post.id}`}
                      className="text-primary-500 hover:text-secondary-700 font-medium underline flex items-center transition-colors duration-300"
                    >
                      Read more <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* "View all blog posts" button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/blogs"
            className="px-6 py-3 bg-secondary-700 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors duration-300 flex items-center"
          >
            View All Blog Posts <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPreview

