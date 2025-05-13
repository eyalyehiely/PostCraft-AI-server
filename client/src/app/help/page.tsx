import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & Documentation | PostCraft AI',
  description: 'Learn how to use PostCraft AI effectively',
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help & Documentation</h1>
      
      <div className="space-y-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              Welcome to PostCraft AI! This guide will help you get started with our platform.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">Quick Start Guide</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Create your first post using the dashboard</li>
              <li>Configure your API settings in the settings page</li>
              <li>Customize your profile preferences</li>
              <li>Start generating content!</li>
            </ol>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">How do I generate my first post?</h3>
              <p className="text-gray-600 mt-2">
                Navigate to the dashboard and click the "Create New Post" button. Follow the prompts to generate your content.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">What languages are supported?</h3>
              <p className="text-gray-600 mt-2">
                We currently support English, Spanish, French, and German. More languages are coming soon!
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">How do I customize my content?</h3>
              <p className="text-gray-600 mt-2">
                You can adjust content settings in the Settings page, including language preferences and content length.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              If you need additional assistance, please don't hesitate to contact our support team.
            </p>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Contact Support
            </button>
          </div>
        </section>
      </div>
    </div>
  )
} 