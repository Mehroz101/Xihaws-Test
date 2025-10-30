'use client'
import { RootState, AppDispatch } from "@/store";
import { fetchSites } from "@/store/slices/sitesSlice";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { filteredSites, isLoading } = useSelector((state: RootState) => state.sites);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">🌐 Smart Links</h1>
          </div>

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
                    <span className="text-2xl">🔗</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No links found
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Add some links to get started
                  </p>
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