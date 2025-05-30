import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Simplify Your Links, <span className="text-blue-600 dark:text-blue-400">Amplify Your Reach</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Create short, memorable links in seconds. Track performance with powerful analytics. 
              Share with confidence on any platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="#url-shortener" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center">
                Get Started for Free
              </Link>
              <Link href="/features" className="px-8 py-4 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors text-center">
                Explore Features
              </Link>
            </div>
            <div className="mt-10 flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">JD</div>
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">AP</div>
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">TK</div>
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-medium">MS</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">5,000+</span> users trust ShortLink
              </p>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-2xl">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
                  <div className="relative h-full w-full">
                    <div className="absolute top-0 left-0 right-0 h-10 flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1 ml-4 bg-gray-100 dark:bg-gray-700 h-6 rounded"></div>
                    </div>
                    <div className="mt-14 space-y-4">
                      <div className="h-12 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center px-4">
                        <div className="w-4 h-4 rounded-full bg-blue-600 mr-3"></div>
                        <div className="h-4 w-2/3 bg-blue-200 dark:bg-blue-800 rounded"></div>
                      </div>
                      <div className="h-28 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-3">
                        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600/70 rounded mb-4"></div>
                        <div className="h-8 w-1/3 bg-blue-600 rounded-md ml-auto"></div>
                      </div>
                      <div className="h-20 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3">
                        <div className="h-4 w-1/3 bg-green-600 rounded mb-2"></div>
                        <div className="h-6 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center px-3">
                          <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-500 rounded"></div>
                        </div>
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