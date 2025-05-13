import { toast } from 'sonner';
import axios from 'axios';

interface GenerateParams {
  topic: string;
  style: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export async function generateContent({ topic, style }: GenerateParams): Promise<string> {
  try {
    const { data } = await axios.post(`${API_URL}/posts/generate`, {
      topic,
      style
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
} 