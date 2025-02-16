"use client"
import { useState } from "react"
import Link from "next/link"
import { Shield, Key, Scroll, ChevronRight, Menu, X, Coins, Code, FileCheck } from "lucide-react"

const FeatureCard = ({ Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ${
        isHovered ? 'transform -translate-y-2 shadow-xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
        <Icon className="text-blue-600 w-12 h-12 mb-4" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
            CryptoWill
          </div>
          <div className="hidden md:flex space-x-6">
            {['About', 'Demo', 'Documentation'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`}
                className="relative text-gray-600 hover:text-blue-600 transition-colors group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="https://github.com/your-repo"
              target="_blank"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg flex items-center"
            >
              <Code className="w-4 h-4 mr-2" /> GitHub
            </Link>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-transform duration-300 hover:scale-110"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-64' : 'max-h-0'
        }`}>
          {['About', 'Demo', 'Documentation', 'GitHub'].map((item) => (
            <Link
              key={item}
              href={item === 'GitHub' ? 'https://github.com/your-repo' : `/${item.toLowerCase()}`}
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
              target={item === 'GitHub' ? '_blank' : '_self'}
            >
              {item}
            </Link>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-20">
         
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            NFT-Based Digital Asset Inheritance
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A decentralized solution for digital inheritance using blockchain technology. 
            Tokenize your assets and ensure secure transfer through smart contracts.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="group bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 inline-flex items-center hover:shadow-lg"
            >
              Get Started
              <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/documentation"
              className="group bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all duration-300 inline-flex items-center"
            >
              Documentation
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard 
            Icon={Shield}
            title="Smart Contract Security"
            description="Built on Ethereum blockchain with audited smart contracts. Automated inheritance execution with multi-signature verification."
          />
          <FeatureCard 
            Icon={Coins}
            title="Asset Tokenization"
            description="Convert digital and physical assets into NFTs. Support for cryptocurrencies, real estate deeds, and intellectual property rights."
          />
          <FeatureCard 
            Icon={FileCheck}
            title="Verifiable Inheritance"
            description="Decentralized verification system using oracle networks. Automated checks with death certificate verification."
          />
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 mb-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Technical Implementation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Smart Contracts</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-2 mt-1" />
                  ERC-721 for asset tokenization
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-2 mt-1" />
                  Chainlink oracles for death verification
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-2 mt-1" />
                  Multi-signature functionality
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-2 mt-1" />
                  Automated asset distribution
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-2 mt-1" />
                  Beneficiary management system
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 p-1 rounded mr-2 mt-1" />
                  Real-time asset tracking
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
           <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out our implementation and contribute to the future of digital inheritance.
          </p>
          <Link
            href="https://github.com/evadshell/willgaurd"
            target="_blank"
            className="group bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 inline-flex items-center hover:shadow-lg"
          >
            View on GitHub
            <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mt-4 space-x-4">
            <Link
              href="https://github.com/your-repo"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 transition-colors inline-block hover:underline"
            >
              GitHub
            </Link>
            <Link
              href="/documentation"
              className="text-blue-600 hover:text-blue-800 transition-colors inline-block hover:underline"
            >
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}