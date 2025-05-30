"use client";

import { useState } from 'react';

interface ShortenedUrl {
  shortUrl: string;
  originalUrl: string;
}

export default function UrlShortenerForm() {
  const [longUrl, setLongUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Make API call to your Go backend
      const response = await fetch('http://localhost:9808/create-short-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          long_url: longUrl,
          user_id: 'guest-user', // In a real app, you'd use the actual user ID from auth
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }
      
      const data = await response.json();
      
      setShortenedUrl({
        shortUrl: data.short_url,
        originalUrl: longUrl,
      });
      
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      console.error('Error shortening URL:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enter your long URL
            </label>
            <input
              type="url"
              id="longUrl"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
      </form>
      
      {shortenedUrl && (
        <div className="mt-8 p-5 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your shortened URL is ready!</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                Original: <span className="text-gray-700 dark:text-gray-300">{shortenedUrl.originalUrl}</span>
              </p>
            </div>
            
            <div className="flex space-x-2">
              <a 
                href={shortenedUrl.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Open
              </a>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <input
              type="text"
              readOnly
              value={shortenedUrl.shortUrl}
              className="flex-1 px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 