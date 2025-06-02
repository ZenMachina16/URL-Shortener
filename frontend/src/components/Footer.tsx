import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-blue-900/50 mt-auto py-8 border-t border-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-blue-200/70">
            © 2025 Shrinkr. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors duration-300 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-blue-200/70 hover:text-cyan-300 transition-colors duration-300 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
        
        {/* Decorative gradient line */}
        <div className="mt-6 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
      </div>
    </footer>
  );
} 