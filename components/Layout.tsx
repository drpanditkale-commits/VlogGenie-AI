
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">VlogGenie <span className="text-indigo-600">AI</span></h1>
          </div>
          <nav className="hidden sm:flex space-x-6">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">How it works</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Pricing</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Docs</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2024 VlogGenie AI. Powered by Gemini Flash.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
