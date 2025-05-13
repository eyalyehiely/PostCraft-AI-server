export interface Post {
  id: number
  uuid: string
  title: string
  publicId: string
  content: string
  preview: string
  date: string
  style: string
  isPublic: boolean
  author: {
    name: string
    image?: string
  }
  createdAt: string
  updatedAt: string
} 