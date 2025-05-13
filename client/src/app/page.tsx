import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to PostCraft AI</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className="text-gray-600">View your analytics and overview</p>
          </Link>
          
          <Link href="/posts" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Posts</h2>
            <p className="text-gray-600">Manage and create your posts</p>
          </Link>
          
          <Link href="/profile" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Profile</h2>
            <p className="text-gray-600">View and edit your profile</p>
          </Link>
          
          <Link href="/settings" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">Configure your preferences</p>
          </Link>
          
          <Link href="/help" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Help</h2>
            <p className="text-gray-600">Get support and documentation</p>
          </Link>
        </div>
        
      </div>
    </main>
  )
}
