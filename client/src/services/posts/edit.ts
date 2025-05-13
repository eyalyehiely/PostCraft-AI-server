import { Post } from '@/types/post'

export async function editPost(postId: number, updatedPost: Partial<Post>) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    })

    if (!response.ok) {
      throw new Error('Failed to update post')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}
