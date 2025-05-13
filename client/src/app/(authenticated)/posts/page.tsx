'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { fetchPosts } from '@/services/posts/fetchPosts'
import { Post } from '@/types/post'
import { TrashIcon, PencilIcon } from 'lucide-react'

function Posts() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const token = await getToken()
        if (!token) {
          router.push('/sign-in')
          return
        }
        const fetchedPosts = await fetchPosts({ token })
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
      }
    }

    loadPosts()
  }, [getToken, router])

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
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                </CardContent>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.preview}</p>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(post.id)}
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TrashIcon className="w-4 h-4 mr-2" />
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