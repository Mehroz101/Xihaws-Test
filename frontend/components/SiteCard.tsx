import Image from 'next/image';
import { ExternalLink, Pencil, Trash } from 'lucide-react';
import { Site } from '@/types';

interface SiteCardProps {
  site: Site;
  isAdmin?: boolean;
  onEdit?: (site: Site) => void;
  onDelete?: (id: number) => void;
}

export default function SiteCard({ site, isAdmin, onEdit, onDelete }: SiteCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {site.coverImage ? (
          <Image
            src={site.coverImage}
            alt={site.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{site.title}</h3>
            <span className="inline-block px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full mt-2">
              {site.category}
            </span>
          </div>
          <a
            href={site.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {site.description}
        </p>
        {isAdmin && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit?.(site)}
              className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete?.(site.id)}
              className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}