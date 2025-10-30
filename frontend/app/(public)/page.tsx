'use client'
import { RootState, AppDispatch } from "@/store";
import { fetchSites, setSearchTerm, setCategoryFilter } from "@/store/slices/sitesSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, X } from "lucide-react";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const { filteredSites, isLoading, searchTerm: reduxSearchTerm, categoryFilter } = useSelector((state: RootState) => state.sites);
  const dispatch = useDispatch<AppDispatch>();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  const categories = ['Technology', 'Design', 'Development', 'Business', 'Education', 'Entertainment', 'Health', 'News'];

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  // Effect to dispatch search when debounced term changes
  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchTerm));
  }, [debouncedSearchTerm, dispatch]);

  const handleCategoryFilter = (category: string | null) => {
    dispatch(setCategoryFilter(category));
    setShowCategoryFilter(false);
  };

  const clearAllFilters = () => {
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
    dispatch(setCategoryFilter(null));
  };

  // Check if any filters are active
  const hasActiveFilters = localSearchTerm || categoryFilter;

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col">
      {/* Image skeleton */}
      <div className="h-48 w-full bg-gray-300 dark:bg-gray-700"></div>
      
      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Category skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        
        {/* Title skeleton */}
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2 flex-grow">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">🌐 Smart Links</h1>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by title or URL..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto ${
                    categoryFilter 
                      ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Category</span>
                  {categoryFilter && (
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>

                {showCategoryFilter && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
                        Filter by Category
                      </div>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryFilter(category)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            categoryFilter === category
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                      {categoryFilter && (
                        <button
                          onClick={() => handleCategoryFilter(null)}
                          className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2"
                        >
                          Clear Category Filter
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {localSearchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Search: {localSearchTerm}
                  <button
                    onClick={() => setLocalSearchTerm('')}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Category: {categoryFilter}
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results Count */}
          {!isLoading && filteredSites.length > 0 && (
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredSites.length} link{filteredSites.length !== 1 ? 's' : ''}
              {hasActiveFilters && ' (filtered)'}
            </div>
          )}

          {/* Card Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Show 6 skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredSites.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 dark:text-gray-500">
                  <div className="mx-auto h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {hasActiveFilters ? 'No matching links found' : 'No links found'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {hasActiveFilters 
                      ? 'Try adjusting your search terms or category filter' 
                      : 'Add some links to get started'
                    }
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Actual content
              filteredSites.map((link) => (
                <a
                  key={link.id}
                  href={link.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition transform flex flex-col group"
                >
                  {link.cover_image ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={link.cover_image}
                        alt={link.title}
                        width={800}
                        height={400}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-4xl">🌐</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
                      {link.category}
                    </span>
                    <h3 className="text-lg font-semibold mt-1 mb-2 line-clamp-2">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow line-clamp-3">
                      {link.description}
                    </p>
                    <button className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline self-start group-hover:translate-x-1 transition-transform">
                      Visit Site →
                    </button>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}