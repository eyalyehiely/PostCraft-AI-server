import axios from 'axios';
import { Post } from '@/types/post';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchPublicPost(publicId: string): Promise<Post> {
  try {
    const { data } = await axios.get(`${API_URL}/posts/public/${publicId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching public post:', error);
    throw error;
  }
} 