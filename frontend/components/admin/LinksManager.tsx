'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSites, deleteSite, createSite, updateSite, GenerateDescription } from '@/store/slices/sitesSlice';
import AddLinkModal from './AddLinkModal';
import Input from '@/components/ui/form/Input';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, ExternalLink, Search, Plus, Image as LucideImage, Sparkles, Upload, X } from 'lucide-react';

interface SiteLink {
  id: number;
  site_url: string;
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
  const [selectedForEdit, setSelectedForEdit] = useState<SiteLink | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatedescription = useSelector((state: RootState) => state.sites.generatedescription);
  const [newLink, setNewLink] = useState<Omit<SiteLink, 'id' | 'createdAt' | 'updatedAt'>>({
    site_url: '',
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
      try {
        const result = await dispatch(deleteSite(id));
        // unwrap is not used here because we match on action; check for rejected
        if (deleteSite.fulfilled.match(result)) {
          toast.success('Link deleted');
        } else {
          const msg = (result.payload as any) || 'Failed to delete link';
          toast.error(msg);
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast.error((err as any)?.message || 'Failed to delete link');
      }
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
    if (!newLink.title && !newLink.site_url && !newLink.category) {
      alert('Please provide at least a title, URL, and category to generate description');
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const result = await dispatch(GenerateDescription({ title: newLink.title, category: newLink.category, link: newLink.site_url }));
      if (GenerateDescription.fulfilled.match(result)) {
        const desc = result.payload as string;
        setNewLink(prev => ({ ...prev, description: desc || generatedescription || '' }));
        toast.success('AI description generated');
      } else {
        const msg = (result.payload as any) || 'Failed to generate description';
        toast.error(msg);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error((error as any)?.message || 'Error generating description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLink.site_url || !newLink.title || !newLink.category || !newLink.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      new URL(newLink.site_url);
      const result = await dispatch(createSite({ siteUrl: newLink.site_url, ...newLink }));
      if (createSite.fulfilled.match(result)) {
        toast.success('Link added');
        setShowAddModal(false);
        resetForm();
      } else {
        const msg = (result.payload as any) || 'Failed to create link';
        toast.error(msg);
      }
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }
  };

  const resetForm = () => {
    setNewLink({
      site_url: '',
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
                        {link.cover_image ? (
                          <img
                            src={link.cover_image}
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
                            href={link.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            {link.site_url}
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
                          onClick={() => { setSelectedForEdit(link as SiteLink); setShowAddModal(true); }}
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

      {/* Use the shared AddLinkModal for create and edit */}
      <AddLinkModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedForEdit(null); resetForm(); }}
        initial={selectedForEdit || undefined}
        onSubmit={async (data) => {
          try {
            if (data.id) {
              const result = await dispatch(updateSite({ id: Number(data.id), data: { title: data.title, site_url: data.site_url, category: data.category, cover_image: data.cover_image, description: data.description } }));
              if (updateSite.fulfilled.match(result)) {
                toast.success('Link updated');
                setShowAddModal(false);
                setSelectedForEdit(null);
                resetForm();
              } else {
                toast.error((result.payload as any) || 'Failed to update link');
              }
            } else {
              const result = await dispatch(createSite({ title: data.title, siteUrl: data.site_url, category: data.category, coverImage: data.cover_image, description: data.description } as any));
              if (createSite.fulfilled.match(result)) {
                toast.success('Link added');
                setShowAddModal(false);
                resetForm();
              } else {
                toast.error((result.payload as any) || 'Failed to create link');
              }
            }
          } catch (err) {
            console.error('Modal submit error', err);
            toast.error((err as any)?.message || 'Failed');
          }
        }}
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
}