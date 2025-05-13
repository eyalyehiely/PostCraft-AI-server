'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import React from 'react'

function Posts() {
  const router = useRouter()
  const posts = [
    {
      id: 1,
      title: "The Future of AI in Web Development",
      preview: "Exploring how artificial intelligence is revolutionizing the way we build and maintain web applications...",
      date: "2024-03-20",
      style: "Technical",
      content: "Full content here..."
    },
    {
      id: 2,
      title: "Getting Started with Next.js",
      preview: "A comprehensive guide to building modern web applications with Next.js...",
      date: "2024-03-19",
      style: "Professional",
      content: "Full content here..."
    },
    {
      id: 3,
      title: "The Art of Clean Code",
      preview: "Best practices and principles for writing maintainable and efficient code...",
      date: "2024-03-18",
      style: "Professional",
      content: "Full content here..."
    }
  ]

  const handleEdit = (postId: number) => {
    router.push(`/posts/edit/${postId}`)
  }

  return (
    <>
    <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <CardDescription className="text-xs">
                    Style: {post.style}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.preview}</p>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(post.id)}
                    >
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    </>
  )
}

export default Posts