
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-700">World Data Explorer</h1>
          <Link to="/explore">
            <Button variant="outline" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-apple-gray-700 tracking-tight mb-6">
              Explore Our World Through Data
            </h1>
            <p className="text-xl md:text-2xl text-apple-gray-500 mb-8 leading-relaxed">
              Interactive visualization of global demographics, economics, and more. Discover patterns and insights from around the globe.
            </p>
            <Link to="/explore">
              <Button className="px-8 py-6 text-lg rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16 tracking-tight text-apple-gray-700">
              Interactive Data Visualization
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-6 rounded-2xl bg-gray-50 shadow-apple-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-apple-gray-700">Global Map View</h3>
                <p className="text-apple-gray-500">
                  Explore worldwide data through an interactive map with color-coded metrics and country details.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 shadow-apple-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-apple-gray-700">Data Analytics</h3>
                <p className="text-apple-gray-500">
                  Analyze trends with interactive charts that reveal patterns and comparative insights.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 shadow-apple-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-apple-gray-700">Population Insights</h3>
                <p className="text-apple-gray-500">
                  Understand global demographics with detailed population density and distribution data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 tracking-tight text-apple-gray-700">
              Ready to Explore?
            </h2>
            <p className="text-xl text-apple-gray-500 mb-8 leading-relaxed">
              Start your journey through global data visualizations and discover insights about our world.
            </p>
            <Link to="/explore">
              <Button className="px-8 py-6 text-lg rounded-xl">
                Begin Exploring
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-apple-gray-500">
            World Data Explorer &copy; {new Date().getFullYear()} | Interactive Global Data Visualization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
