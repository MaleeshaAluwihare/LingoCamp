import { FiSmartphone, FiUsers, FiGlobe } from 'react-icons/fi';
import { Link } from "react-router-dom";


export default function HomePage() {
    
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FiGlobe className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">LingoCamp</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
              <Link to="/tutorlogin" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/tutorregistration" className="text-gray-600 hover:text-blue-600">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Learn Languages Naturally with
              <span className="text-blue-600"> LingoCamp</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Immerse yourself in real conversations with native speakers from around the world.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <FiUsers className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">Native Speakers</h3>
              <p className="mt-2 text-gray-500">
                Connect with language partners who are native speakers of your target language.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <FiSmartphone className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">Mobile Friendly</h3>
              <p className="mt-2 text-gray-500">
                Learn anywhere, anytime with our mobile-optimized platform.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <FiGlobe className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">100+ Languages</h3>
              <p className="mt-2 text-gray-500">
                Choose from a wide variety of languages and dialects from around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2023 LingoCamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}