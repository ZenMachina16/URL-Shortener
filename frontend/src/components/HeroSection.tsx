import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 relative overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left side - Text content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="space-y-2 mb-6">
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up">
                <span className="text-white">Simplify Your</span>{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient">
                  Links
                </span>
                <br />
                <span className="text-white">Amplify Your</span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Reach
                </span>
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-2xl animate-fade-in-delayed">
              Transform lengthy URLs into powerful, trackable short links. 
              Get real-time analytics and boost your digital presence with our lightning-fast platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-delayed">
              <Link 
                href="#url-shortener" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 glow-button-strong relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Get Started Free
                </span>
                <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                href="#features" 
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-blue-400/30 hover:border-cyan-400/50 text-blue-200 hover:text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 glass-button"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Features
                </span>
              </Link>
            </div>

            {/* Social proof */}
            
          </div>

          {/* Right side - Animated URL shortening demo */}
          <div className="lg:w-1/2 relative">
            <div className="relative max-w-md mx-auto">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              
              {/* Main demo container */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 ml-4 bg-gray-800/60 h-4 rounded-full flex items-center px-3">
                    <span className="text-xs text-blue-300">shortlink.app</span>
                  </div>
                </div>

                {/* URL Input Demo */}
                <div className="space-y-4">
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-blue-500/20">
                    <label className="text-sm text-blue-300 mb-2 block">Long URL</label>
                    <div className="bg-gray-900/60 rounded-lg p-3 border border-gray-600/50">
                      <div className="text-sm text-gray-400 animate-typing">
                        https://example.com/very-long-url-that-needs-shortening...
                      </div>
                    </div>
                  </div>

                  {/* Animated Shorten Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-medium hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 animate-pulse">
                    ⚡ Shorten URL
                  </button>

                  {/* Result */}
                  <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                    <label className="text-sm text-green-400 mb-2 block">Short URL</label>
                    <div className="bg-gray-900/60 rounded-lg p-3 border border-green-400/30 flex items-center justify-between">
                      <span className="text-cyan-300 font-mono text-sm">short.ly/abc123</span>
                      <button className="text-green-400 hover:text-green-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Analytics Preview */}
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                    <h4 className="text-sm text-blue-300 mb-3">Real-time Analytics</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-cyan-300 animate-counter">247</div>
                        <div className="text-xs text-blue-200">Clicks</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cyan-300 animate-counter">15</div>
                        <div className="text-xs text-blue-200">Countries</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cyan-300 animate-counter">89%</div>
                        <div className="text-xs text-blue-200">Mobile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 