"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Mock data for search results
const mockData = [
  { id: 1, title: "Next.js Documentation", category: "Development", url: "https://nextjs.org/docs" },
  { id: 2, title: "React Hooks Guide", category: "Development", url: "https://reactjs.org/docs/hooks-intro.html" },
  { id: 3, title: "Tailwind CSS", category: "Design", url: "https://tailwindcss.com/docs" },
  { id: 4, title: "Framer Motion", category: "Animation", url: "https://www.framer.com/motion/" },
  { id: 5, title: "TypeScript Handbook", category: "Development", url: "https://www.typescriptlang.org/docs/" },
  { id: 6, title: "CSS Tricks", category: "Design", url: "https://css-tricks.com/" },
  { id: 7, title: "JavaScript ES6 Features", category: "Development", url: "https://www.w3schools.com/js/js_es6.asp" },
  { id: 8, title: "UI Design Patterns", category: "Design", url: "https://ui-patterns.com/" },
  { id: 9, title: "Web Accessibility", category: "Development", url: "https://www.w3.org/WAI/" },
  { id: 10, title: "Color Theory", category: "Design", url: "https://color.adobe.com/" },
];

// Category icons mapping
const categoryIcons = {
  Development: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  Design: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" />
      <path fillRule="evenodd" d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
    </svg>
  ),
  Animation: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  ),
};
const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }
};
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(mockData);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const featuredResourcesRef = useRef<HTMLDivElement>(null);
  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults(mockData);
    } else {
      const filteredResults = mockData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Sort results: exact matches first, then by title length
      filteredResults.sort((a, b) => {
        const aExact = a.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bExact = b.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        return a.title.length - b.title.length;
      });
      
      setResults(filteredResults);
    }
  }, [searchTerm]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check system preference for dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <motion.nav 
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95, rotate: -5 }}
                className="cursor-pointer"
              >
                <Image
                  className="dark:invert"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={100}
                  height={24}
                  priority
                />
              </motion.div>
              
              <div className="hidden md:flex ml-10 space-x-8">
  {["Home", "Features", "Pricing", "About"].map((item) => (
    <motion.a
      key={item}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (item === "Features" && featuredResourcesRef.current) {
          scrollToSection(featuredResourcesRef);
        }
      }}
      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium relative cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {item}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-0"
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  ))}
</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>
              
              <motion.button
                className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Get Started
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ scale }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Discover <motion.span 
              className="text-indigo-600 inline-block"
              animate={{ 
                color: ["#4f46e5", "#8b5cf6", "#6366f1", "#4f46e5"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >Knowledge</motion.span>
          </motion.h1>
          <motion.p 
                      className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      Search our extensive library of resources to find exactly what you need.
                    </motion.p>
                    
                    {/* Search Bar */}
                    <div 
                      ref={searchRef}
                      className="max-w-2xl mx-auto relative"
                    >
                      <motion.div 
                        className={`flex items-center rounded-full border ${
                          isSearchFocused 
                            ? "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800" 
                            : "border-gray-300 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 px-4 py-3 shadow-sm transition-all duration-200`}
                        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        animate={{ 
                          boxShadow: isSearchFocused 
                            ? "0 8px 20px rgba(79, 70, 229, 0.2)" 
                            : "0 2px 4px rgba(0,0,0,0.05)"
                        }}
                      >
                        <motion.svg 
                          className="h-5 w-5 text-gray-400" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                          animate={{ rotate: isSearchFocused ? [0, -10, 10, -10, 0] : 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </motion.svg>
                        <input
                          type="text"
                          placeholder="Search for anything..."
                          className="ml-2 flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                        />
                        {searchTerm && (
                          <motion.button
                            initial={{ scale: 0, rotate: 90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            onClick={() => setSearchTerm("")}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        )}
                      </motion.div>
                      
                      {/* Search Results */}
                      <AnimatePresence>
                        {isSearchFocused && (
                          <motion.div 
                            className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {results.length > 0 ? (
                              <ul className="max-h-80 overflow-y-auto">
                                {results.map((item, index) => (
                                  <motion.li 
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ 
                                      backgroundColor: "rgba(79, 70, 229, 0.1)",
                                      x: 5
                                    }}
                                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                                  >
                                    <a 
                                      href={item.url} 
                                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                          <div className="mr-3 text-indigo-500 dark:text-indigo-400">
                                            {categoryIcons[item.category as keyof typeof categoryIcons]}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                              {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                              {item.category}
                                            </p>
                                          </div>
                                        </div>
                                        <motion.svg 
                                          className="h-5 w-5 text-gray-400" 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          viewBox="0 0 20 20" 
                                          fill="currentColor"
                                          whileHover={{ x: 3 }}
                                        >
                                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </motion.svg>
                                      </div>
                                    </a>
                                  </motion.li>
                                ))}
                              </ul>
                            ) : (
                              <div className="px-4 py-6 text-center">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </motion.div>
                                <p className="mt-4 text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
          
                {/* Featured Categories */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <motion.h2 
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Popular Categories
                  </motion.h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["Development", "Design", "Animation"].map((category, index) => (
                      <motion.div
                        key={category}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ 
                          y: -5, 
                          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                          backgroundColor: category === "Development" ? "rgba(79, 70, 229, 0.05)" : 
                                          category === "Design" ? "rgba(236, 72, 153, 0.05)" : 
                                          "rgba(245, 158, 11, 0.05)"
                        }}
                      >
                        <div className="absolute top-0 right-0 mt-4 mr-4">
                          <div className={`p-2 rounded-full ${
                            category === "Development" ? "bg-indigo-100 text-indigo-600" : 
                            category === "Design" ? "bg-pink-100 text-pink-600" : 
                            "bg-amber-100 text-amber-600"
                          }`}>
                            {categoryIcons[category as keyof typeof categoryIcons]}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{category}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            Explore our {category.toLowerCase()} resources and tutorials.
                          </p>
                          <motion.a
                            href="#"
                            className={`inline-flex items-center ${
                              category === "Development" ? "text-indigo-600 dark:text-indigo-400" : 
                              category === "Design" ? "text-pink-600 dark:text-pink-400" : 
                              "text-amber-600 dark:text-amber-400"
                            } font-medium text-sm`}
                            whileHover={{ x: 5 }}
                          >
                            Browse {category}
                            <motion.svg 
                              className="ml-1 h-4 w-4" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            >
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          </motion.a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
          
                {/* Featured Content */}
                <div ref={featuredResourcesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-indigo-50 dark:bg-gray-800/50 rounded-3xl my-12">
                  <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Resources</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                      Handpicked content to help you learn and grow
                    </p>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockData.slice(0, 6).map((item, index) => (
                      <motion.a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div 
                          className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-6 relative overflow-hidden"
                          whileHover={{ 
                            backgroundPosition: ["0% 0%", "100% 100%"],
                          }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                        >
                          <motion.div 
                            className="absolute inset-0 opacity-20"
                            animate={{ 
                              backgroundImage: [
                                "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                                "radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
                              ]
                            }}
                            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                          />
                          <h3 className="text-xl font-bold text-white text-center relative z-10">{item.title}</h3>
                        </motion.div>
                        <div className="p-6 flex-grow">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            <span className="mr-1.5">{categoryIcons[item.category as keyof typeof categoryIcons]}</span>
                            {item.category}
                          </span>
                          <p className="mt-4 text-gray-600 dark:text-gray-300">
                            Explore comprehensive guides and tutorials about {item.title.toLowerCase()}.
                          </p>
                        </div>
                        <div className="px-6 pb-4">
                          <motion.div 
                            className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium"
                            whileHover={{ x: 5 }}
                          >
                            <span>Learn more</span>
                            <motion.svg 
                              className="ml-2 h-4 w-4" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            >
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </motion.svg>
                          </motion.div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
          
                {/* Newsletter */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <motion.div 
                    className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden relative"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ 
                      boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.4)"
                    }}
                  >
                    <motion.div 
                      className="absolute inset-0 opacity-20 z-0"
                      animate={{ 
                        backgroundImage: [
                          "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                          "radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
                        ]
                      }}
                      transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
                    />
                    <div className="px-6 py-12 md:py-16 md:px-12 lg:flex lg:items-center lg:justify-between relative z-10">
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                          <span className="block">Ready to dive deeper?</span>
                          <span className="block">Sign up for our newsletter.</span>
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-indigo-100">
                          Get the latest updates, tutorials, and resources delivered straight to your inbox.
                        </p>
                      </div>
                      <div className="mt-8 lg:mt-0 lg:ml-8">
                        <div className="sm:flex">
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white focus:outline-none rounded-md"
                          />
                          <motion.button
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 10px 15px -3px rgba(255, 255, 255, 0.2)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-3 w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0 shadow-md"
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              Subscribe
                            </span>
                          </motion.button>
                        </div>
                        <p className="mt-3 text-sm text-indigo-100">
                          We care about your data. Read our{" "}
                          <a href="#" className="text-white font-medium underline">
                            Privacy Policy
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
          
                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
                  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                          Solutions
                        </h3>
                        <ul className="mt-4 space-y-4">
                          {["Marketing", "Analytics", "Commerce", "Insights"].map((item) => (
                            <li key={item}>
                              <motion.a 
                                href="#" 
                                className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
                                whileHover={{ x: 3, color: "#4f46e5" }}
                              >
                                <svg className="w-4 h-4 mr-2 opacity-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                {item}
                              </motion.a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                          Support
                        </h3>
                        <ul className="mt-4 space-y-4">
                          {["Pricing", "Documentation", "Guides", "API Status"].map((item) => (
                            <li key={item}>
                              <motion.a 
                                href="#" 
                                className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
                                whileHover={{ x: 3, color: "#4f46e5" }}
                              >
                                <svg className="w-4 h-4 mr-2 opacity-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                {item}
                              </motion.a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                          Company
                        </h3>
                        <ul className="mt-4 space-y-4">
                          {["About", "Blog", "Jobs", "Press", "Partners"].map((item) => (
                            <li key={item}>
                              <motion.a 
                                href="#" 
                                className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
                                whileHover={{ x: 3, color: "#4f46e5" }}
                              >
                                <svg className="w-4 h-4 mr-2 opacity-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                {item}
                              </motion.a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                          Legal
                        </h3>
                        <ul className="mt-4 space-y-4">
                          {["Privacy", "Terms", "Cookies", "Settings"].map((item) => (
                            <li key={item}>
                              <motion.a 
                                href="#" 
                                className="text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
                                whileHover={{ x: 3, color: "#4f46e5" }}
                              >
                                <svg className="w-4 h-4 mr-2 opacity-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                {item}
                              </motion.a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
                      <motion.p 
                        className="text-base text-gray-500 dark:text-gray-400 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        &copy; {new Date().getFullYear()} FOBS, Inc. All rights reserved.
                      </motion.p>
                    </div>
                  </div>
                </footer>
              </div>
            );
          }
          
          
