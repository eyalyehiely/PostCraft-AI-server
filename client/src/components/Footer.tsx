import React from 'react'
import Link from 'next/link'
function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PostCraft AI</h3>
          <p className="text-gray-600">
            Create, share, and discover amazing content powered by AI.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/posts" className="text-gray-600 hover:text-primary transition-colors">
                Explore Posts
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                Create Post
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} PostCraft AI. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer