// app/page.tsx (Next.js 13+ with App Router) 
const fakeLinks = [
  {
    id: 1,
    siteUrl: "https://techcrunch.com",
    title: "TechCrunch",
    coverImage: "https://source.unsplash.com/600x400/?technology",
    description:
      "TechCrunch covers technology news, startups, and Silicon Valley trends.",
    category: "Technology",
  },
  {
    id: 2,
    siteUrl: "https://behance.net",
    title: "Behance",
    coverImage: "https://source.unsplash.com/600x400/?design",
    description: "Showcase and discover creative work from designers worldwide.",
    category: "Design",
  },
  {
    id: 3,
    siteUrl: "https://bbc.com/news",
    title: "BBC News",
    coverImage: "https://source.unsplash.com/600x400/?news",
    description:
      "BBC News brings you the latest stories, headlines, and breaking updates from around the world.",
    category: "News",
  },
];

export default function Home() {

  return (
    <div >
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">🌐 Smart Links</h1>
          </div>

          {/* Card Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fakeLinks.map((link) => (
              <a
                key={link.id}
                href={link.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition transform flex flex-col"
              >
                {link.coverImage && (
                  <img
                    src={link.coverImage}
                    alt={link.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    {link.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow">
                    {link.description}
                  </p>
                  <button className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline self-start">
                    Visit Site →
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
