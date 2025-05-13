"use client"
import Link from 'next/link'
import { Home, Settings, FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar container */}
      <div className="md:static">
        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed top-0 left-0 w-64 h-screen bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static w-64 border-r min-h-screen p-4 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="space-y-2 mt-12 md:mt-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard/posts"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-4 w-4" />
              <span>Posts</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>
      </div>
    </>
  )
} 