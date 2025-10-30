"use client";

import React, { useState, useRef, useEffect } from "react";
import Input from "@/components/ui/form/Input";
import { Upload, X, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { GenerateDescription } from "@/store/slices/sitesSlice";
import Image from "next/image";

interface LinkData {
  id?: number | string;
  site_url: string;
  title: string;
  cover_image?: string;
  description: string;
  category: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Partial<LinkData>;
  onSubmit: (data: LinkData) => Promise<void>;
  categories: string[];
  isLoading?: boolean;
}

const defaultFormState: LinkData = {
  site_url: "",
  title: "",
  cover_image: "",
  description: "",
  category: "",
  id: undefined,
};

export default function AddLinkModal({
  open,
  onClose,
  initial = {},
  onSubmit,
  categories,
  isLoading = false,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<LinkData>({ ...defaultFormState, ...initial });
  const [imagePreview, setImagePreview] = useState<string | null>(initial.cover_image || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { generatedescription, isCreateLoading } = useSelector((state: RootState) => state.sites);

  useEffect(() => {
    if (open) {
      setForm({
        ...defaultFormState,
        site_url: initial?.site_url || '',
        title: initial?.title || '',
        cover_image: initial?.cover_image || '',
        description: initial?.description || '',
        category: initial?.category || '',
        id: initial?.id,
      });
      setImagePreview(initial?.cover_image || null);
    }
  }, [open, initial]);

  /** ✅ Handle image upload */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      setImagePreview(data);
      setForm((prev) => ({ ...prev, cover_image: data }));
    };
    reader.readAsDataURL(file);
  };

  /** ✅ Remove image */
  const removeImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, cover_image: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  /** ✅ AI Description Generation */
  const generateAIDescription = async () => {
    if (!form.title || !form.site_url || !form.category) {
      toast.error("Please provide title, URL, and category first.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await dispatch(
        GenerateDescription({
          title: form.title,
          category: form.category,
          link: form.site_url,
        })
      );

      if (GenerateDescription.fulfilled.match(result)) {
        const desc = result.payload as string;
        setForm((prev) => ({ ...prev, description: desc }));
        toast.success("AI description generated successfully.");
      } else {
        const errorMessage = result.payload as string || "Failed to generate description.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("AI Description Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Error generating AI description";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  /** ✅ Form submission */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Validate required fields
    if (!form.site_url || !form.title || !form.category || !form.description) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Validate URL format
    try {
      new URL(form.site_url);
    } catch {
      toast.error("Invalid URL format.");
      return;
    }

    try {
      await onSubmit(form);
      toast.success("Link saved successfully!");
      onClose();
    } catch (err: unknown) {
      console.error("Submit failed", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save link.";
      toast.error(errorMessage);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {form.id ? "Edit Link" : "Add New Link"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL *
            </label>
            <Input
              type="text"
              value={form.site_url}
              onChange={(v) => setForm((prev) => ({ ...prev, site_url: v }))}
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <Input
              type="text"
              value={form.title}
              onChange={(v) => setForm((prev) => ({ ...prev, title: v }))}
              placeholder="Enter website title"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>

            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <Image
                  src={imagePreview}
                  alt="preview"
                  height={128}
                  width={128}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileRef.current?.click();
                }
              }}
            >
              <input 
                ref={fileRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFile} 
                className="hidden" 
              />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag & drop or click to select image
              </p>
              <span className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                <Upload className="h-4 w-4" />
                <span>Choose Image</span>
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Description + AI Generate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <button
                type="button"
                disabled={isGenerating}
                onClick={generateAIDescription}
                className="flex items-center space-x-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-1 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGenerating ? "Generating..." : "AI Generate"}</span>
              </button>
            </div>

            <textarea
              value={form.description || generatedescription || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter website description"
              required
              rows={4}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(form.description || generatedescription || '').length}/150 characters
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreateLoading || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg disabled:cursor-not-allowed transition-colors"
            >
              {isCreateLoading || isLoading ? "Saving..." : form.id ? "Save" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}