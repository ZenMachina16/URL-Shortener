import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import UrlShortenerForm from '../components/UrlShortenerForm';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Authenticated Home Page
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
        <Header />
        
        <main className="flex-grow pt-20">
          {/* Welcome Hero Section */}
          <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-black py-20 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="absolute bottom-40 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="mb-8 animate-fade-in">
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-md rounded-full text-cyan-300 text-sm font-medium border border-blue-500/30">
                    🎉 Welcome Back!
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="text-white">Welcome back,</span>{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent animate-gradient">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-white">! 👋</span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100/80 mb-8 max-w-3xl mx-auto animate-fade-in-delayed">
                  Your personalized URL shortening workspace is ready. Manage your links, track analytics, and boost your productivity.
                </p>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up-delayed">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 glow-button-strong relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 group-hover:animate-pulse">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    Open Dashboard
                  </span>
                </Link>
                <Link
                  href="/dashboard/links"
                  className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-blue-400/30 hover:border-cyan-400/50 text-blue-200 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/20 glass-button"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    Manage Links
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Features Overview */}
          <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-blue-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">What You Can Do</span>
                </h2>
                <p className="text-xl text-blue-100/80">
                  Explore all the powerful features at your fingertips
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link href="/dashboard" className="group card-hover animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  <div className="text-center p-6 bg-gray-900/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">Create Short URLs</h3>
                    <p className="text-blue-100/80 text-sm group-hover:text-blue-100 transition-colors">Transform long URLs into short, memorable links</p>
                  </div>
                </Link>
                
                <Link href="/dashboard" className="group card-hover animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  <div className="text-center p-6 bg-gray-900/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-green-500/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">View Analytics</h3>
                    <p className="text-blue-100/80 text-sm group-hover:text-blue-100 transition-colors">Track clicks, devices, and referrers in real-time</p>
                  </div>
                </Link>
                
                <Link href="/dashboard" className="group card-hover animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                  <div className="text-center p-6 bg-gray-900/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-purple-500/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Manage Settings</h3>
                    <p className="text-blue-100/80 text-sm group-hover:text-blue-100 transition-colors">Customize your account and preferences</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick URL Shortener */}
          <section className="py-16 bg-gradient-to-b from-blue-900/50 via-gray-900 to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">Quick URL Shortener</span>
                </h2>
                <p className="text-xl text-blue-100/80">
                  Shorten a URL right here, or go to your dashboard for more features
                </p>
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <UrlShortenerForm />
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Landing Page for unauthenticated users
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section id="url-shortener" className="py-16 bg-gradient-to-b from-blue-900 via-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-10 animate-fade-in">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-md rounded-full text-cyan-300 text-sm font-medium border border-blue-500/30">
                  🔗 Try It Out
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Shorten Your URL in</span>{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Seconds</span>
              </h2>
              <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
                Experience the power of our URL shortener. Sign in to unlock advanced analytics and management features.
              </p>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <UrlShortenerForm requireAuth={true} />
            </div>
          </div>
        </section>

        <FeatureSection />
        
        <section className="py-20 bg-gradient-to-r from-blue-900 via-cyan-800 to-blue-900 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center relative z-10">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Simplify</span> Your Links?
              </h2>
              <p className="text-xl text-blue-100/80 mb-10 max-w-3xl mx-auto">
                Join thousands of businesses and individuals who trust Shrinkr for their URL shortening needs.
              </p>
              <a 
                href="#url-shortener" 
                className="group inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/25 glow-button-strong relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Get Started for Free
                </span>
          </a>
        </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
