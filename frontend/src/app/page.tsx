import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import UrlShortenerForm from '@/components/UrlShortenerForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section id="url-shortener" className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Shorten Your URL in Seconds
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Paste your long URL below, click the button, and get your short link instantly.
              </p>
            </div>
            
            <UrlShortenerForm />
          </div>
        </section>
        
        <FeatureSection />
        
        <section className="py-20 bg-blue-600 dark:bg-blue-700">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Simplify Your Links?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of businesses and individuals who trust ShortLink for their URL shortening needs.
            </p>
            <a 
              href="#url-shortener" 
              className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors text-center"
            >
              Get Started for Free
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
