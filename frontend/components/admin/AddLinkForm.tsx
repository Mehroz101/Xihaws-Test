'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import Input from '@/components/ui/form/Input';

interface LinkFormData {
  siteUrl: string;
  title: string;
  description: string;
}

export default function AddLinkForm() {
  const [formData, setFormData] = useState<LinkFormData>({
    siteUrl: '',
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to create link
      console.log('Creating link:', formData);

      // Reset form after successful submission
      setFormData({ siteUrl: '', title: '', description: '' });
      alert('Link added successfully!');
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Error adding link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!formData.title && !formData.siteUrl) {
      alert('Please provide at least a title or URL to generate description');
      return;
    }

    setIsGeneratingDescription(true);

    try {
      // TODO: Implement Gemini AI API call
      // Mock AI description generation
      setTimeout(() => {
        const mockDescription = `A comprehensive ${formData.title || 'website'} providing valuable services and information. This platform offers excellent user experience and reliable content.`;
        setFormData(prev => ({ ...prev, description: mockDescription }));
        setIsGeneratingDescription(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating description:', error);
      setIsGeneratingDescription(false);
    }
  };

  const isFormValid = formData.siteUrl && formData.title;

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Add New Link</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website URL *
          </label>
          <Input
            type="text"
            value={formData.siteUrl}
            onChange={(value) => setFormData(prev => ({ ...prev, siteUrl: value }))}
            placeholder="https://example.com"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            placeholder="Enter website title"
            required
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGeneratingDescription || (!formData.title && !formData.siteUrl)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGeneratingDescription ? 'Generating...' : 'AI Generate'}</span>
            </button>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter website description or use AI to generate one"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>{isLoading ? 'Adding...' : 'Add Link'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}