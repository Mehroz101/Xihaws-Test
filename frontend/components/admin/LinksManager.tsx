'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSites, deleteSite, createSite } from '@/store/slices/sitesSlice';
import { Edit2, Trash2, ExternalLink, Search, Plus, Image as LucideImage, Sparkles, Upload, X } from 'lucide-react';

interface SiteLink {
  id: string;
  siteUrl: string;
  title: string;
  coverImage?: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function LinksManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredSites, isLoading } = useSelector((state: RootState) => state.sites);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newLink, setNewLink] = useState<Omit<SiteLink, 'id' | 'createdAt' | 'updatedAt'>>({
    siteUrl: '',
    title: '',
    coverImage: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'sites/setSearchTerm', payload: searchTerm });
  }, [searchTerm, dispatch]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      dispatch(deleteSite(id));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);
        setNewLink(prev => ({ ...prev, coverImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setNewLink(prev => ({ ...prev, coverImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateAIDescription = async () => {
    if (!newLink.title && !newLink.siteUrl) {
      alert('Please provide at least a title or URL to generate description');
      return;
    }

    setIsGeneratingDescription(true);

    try {
      setTimeout(() => {
        const mockDescriptions = [
          `A powerful ${newLink.category.toLowerCase()} platform offering innovative solutions and seamless user experience.`,
          `Discover amazing ${newLink.category.toLowerCase()} features and tools that enhance productivity and creativity.`,
          `Your go-to ${newLink.category.toLowerCase()} resource for cutting-edge technology and modern solutions.`,
          `Transform your digital experience with this comprehensive ${newLink.category.toLowerCase()} platform.`
        ];

        const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
        setNewLink(prev => ({ ...prev, description: randomDescription }));
        setIsGeneratingDescription(false);
      }, 2000);

    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
      setIsGeneratingDescription(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLink.siteUrl || !newLink.title || !newLink.category || !newLink.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      new URL(newLink.siteUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    dispatch(createSite(newLink));
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewLink({
      siteUrl: '',
      title: '',
      coverImage: '',
      description: '',
      category: '',
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categories = ['Technology', 'Design', 'Development', 'Business', 'Education', 'Entertainment', 'Health', 'News'];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200  mt-6 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 ">
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
    <div>
      <div className="flex justify-between items-center mb-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Links</h2>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
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
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first link'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSites.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {link.coverImage ? (
                          <img
                            src={link.coverImage}
                            alt={link.title}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                            <LucideImage className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {link.title}
                          </div>
                          <a
                            href={link.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            {link.siteUrl}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                        {link.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {link.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* TODO: Implement edit */ }}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(Number(link.id))}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Link
              </h3>
            </div>

            <form onSubmit={handleAddLink} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  value={newLink.siteUrl}
                  onChange={(e) => setNewLink(prev => ({ ...prev, siteUrl: e.target.value }))}
                  placeholder="https://example.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter website title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image
                </label>

                {imagePreview && (
                  <div className="mb-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop an image, or click to browse
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose Image</span>
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={isGeneratingDescription || (!newLink.title && !newLink.siteUrl)}
                    className="flex items-center space-x-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-1 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                    </span>
                  </button>
                </div>
                <textarea
                  value={newLink.description}
                  onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter website description or use AI to generate one"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {newLink.description.length}/150 characters
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}