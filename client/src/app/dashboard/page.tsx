'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { generateContent } from '@/services/generate'

export default function Dashboard() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const typeText = (text: string) => {
    let index = 0
    setIsTyping(true)
    setContent('')

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setContent(prev => prev + text[index])
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 30) // Adjust typing speed here (lower = faster)
  }

  const handleGenerate = async () => {
    if (!topic || !style) {
      toast.error('Please fill in both topic and writing style')
      return
    }

    setIsGenerating(true)
    try {
      const generatedContent = await generateContent({ topic, style })
      typeText(generatedContent)
      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = () => {
    if (!content) {
      toast.error('No content to save')
      return
    }
    // TODO: Implement draft saving logic
    toast.success('Draft saved successfully!')
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Blog Post Generator</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Post</CardTitle>
            <CardDescription>Enter your topic and preferred writing style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">Topic</label>
              <Input
                id="topic"
                placeholder="e.g., Tech News in a Professional Tone"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="style" className="text-sm font-medium">Writing Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Post'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>Edit and save your generated content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Your generated content will appear here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
              disabled={isTyping}
            />
            <Button 
              className="w-full" 
              onClick={handleSaveDraft}
              disabled={!content}
            >
              Save Draft
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 