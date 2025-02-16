"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Key, Scroll, ChevronRight, Menu, X } from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">DigitalWill</div>
          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Launch App
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden bg-white py-2">
            <Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
              About
            </Link>
            <Link href="/features" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
              Features
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
              Contact
            </Link>
            <Link href="/app" className="block px-4 py-2 text-blue-600 hover:bg-blue-100">
              Launch App
            </Link>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Secure Your Digital Legacy</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create and manage digital wills on the blockchain. Ensure your digital assets are protected and transferred
            according to your wishes.
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Get Started <ChevronRight className="ml-2" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="text-blue-600 w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Secure</h2>
            <p className="text-gray-600">
              Your digital assets are protected by blockchain technology, ensuring maximum security and transparency.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Key className="text-blue-600 w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Private</h2>
            <p className="text-gray-600">
              Your will details are encrypted and only accessible to authorized beneficiaries and trusted contacts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Scroll className="text-blue-600 w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Flexible</h2>
            <p className="text-gray-600">Easily update your digital will as your assets and wishes change over time.</p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Secure Your Digital Future?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust DigitalWill for their digital asset management.
          </p>
          <Link
            href="/app"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Create Your Will Now <ChevronRight className="ml-2" />
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">&copy; 2025 DigitalWill. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 mx-2">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

