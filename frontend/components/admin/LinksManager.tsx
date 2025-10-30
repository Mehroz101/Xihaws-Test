'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSites, deleteSite, createSite, updateSite } from '@/store/slices/sitesSlice';
import AddLinkModal from './AddLinkModal';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, ExternalLink, Search, Plus, Image as LucideImage } from 'lucide-react';
import { Site } from '@/types';
import Image from 'next/image';



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

export default function LinksManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredSites, isLoading } = useSelector((state: RootState) => state.sites);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<Site | null>(null);

  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  // Effect to dispatch search when debounced term changes
  useEffect(() => {
    dispatch({ type: 'sites/setSearchTerm', payload: debouncedSearchTerm });
  }, [debouncedSearchTerm, dispatch]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const result = await dispatch(deleteSite(id));
        if (deleteSite.fulfilled.match(result)) {
          toast.success('Link deleted');
        } else {
          const msg = (result.payload as string) || 'Failed to delete link';
          toast.error(msg);
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast.error((err as Error)?.message || 'Failed to delete link');
      }
    }
  };

  const handleModalSubmit = async (data: { id?: string | number; site_url: string; title: string; cover_image?: string; description: string; category: string }) => {
    try {
      if (data.id) {
        const result = await dispatch(updateSite({ 
          id: Number(data.id), 
          data: { 
            title: data.title, 
            site_url: data.site_url, 
            category: data.category, 
            cover_image: data.cover_image, 
            description: data.description 
          } 
        }));
        if (updateSite.fulfilled.match(result)) {
          toast.success('Link updated');
          setShowAddModal(false);
          setSelectedForEdit(null);
        } else {
          toast.error((result.payload as string) || 'Failed to update link');
        }
      } else {
        const result = await dispatch(createSite({ 
          title: data.title, 
          site_url: data.site_url, 
          category: data.category, 
          coverImage: data.cover_image, 
          description: data.description 
        }));
        if (createSite.fulfilled.match(result)) {
          toast.success('Link added');
          setShowAddModal(false);
        } else {
          toast.error((result.payload as string) || 'Failed to create link');
        }
      }
    } catch (err) {
      console.error('Modal submit error', err);
      toast.error((err as Error)?.message || 'Failed to save link');
    }
  };

  const categories = ['Technology', 'Design', 'Development', 'Business', 'Education', 'Entertainment', 'Health', 'News'];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 mt-6 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Links</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredSites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500">
              <ExternalLink className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No links found</p>
              <p className="text-gray-500 dark:text-gray-400 px-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first link'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSites.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center min-w-0">
                        {link.cover_image ? (
                          <Image
                            src={link.cover_image}
                            alt={link.title}
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-lg object-cover mr-3 -shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <LucideImage className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {link.title}
                          </div>
                          <a
                            href={link.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center truncate"
                          >
                            <span className="truncate">{link.site_url}</span>
                            <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {link.description}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {link.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { setSelectedForEdit(link); setShowAddModal(true); }}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transition-colors p-1"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(Number(link.id))}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddLinkModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedForEdit(null); }}
        initial={selectedForEdit || undefined}
        onSubmit={handleModalSubmit}
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
}