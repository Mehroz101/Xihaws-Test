'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSites, setSearchTerm, setSelectedCategory } from '@/store/slices/sitesSlice';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const { sites, filteredSites, isLoading, searchTerm, selectedCategory, categories } = useSelector((state: RootState) => state.sites);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCategorySelect = (category: string) => {
    dispatch(setSelectedCategory(category === selectedCategory ? '' : category));
  };

  const handleSiteClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Smart Link Directory</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Discover, manage, and share your favorite websites.</p>
        </div>
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            className="w-full sm:w-96 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.length === 0 ? (
            <div className="col-span-full text-center text-zinc-400 py-20">
              <div className="text-5xl mb-4">🔍</div>
    background-color: #3b82f6;
    color: white;
  ` : `
    background-color: white;
    color: #6b7280;
    border-color: #d1d5db;

    &:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }
  `}
`;

const SiteCard = styled(Card)`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SiteImage = styled.div<{ imageUrl?: string }>`
  height: 200px;
  background-color: #f3f4f6;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
`;

const SiteInfo = styled.div`
  padding: 20px;
`;

const SiteTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const SiteDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SiteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VisitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  font-weight: 500;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #2563eb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

export default function HomePage() {
  const { sites, filteredSites, isLoading, searchTerm, selectedCategory, categories } = useSelector((state: RootState) => state.sites);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCategorySelect = (category: string) => {
    dispatch(setSelectedCategory(category === selectedCategory ? '' : category));
  };

  const handleSiteClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Navbar />
        <LoadingContainer>
          <LoadingSpinner size={48} />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      
      <HomeContainer>
        <Container>
          <HeaderSection>
            <Title>Smart Link Directory</Title>
            <Text style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Discover amazing websites organized by category. Find the perfect tools, resources, and platforms for your needs.
            </Text>
          </HeaderSection>

          <SearchSection>
            <SearchContainer>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search websites..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </SearchContainer>

            <CategoryFilters>
              <CategoryButton
                active={selectedCategory === ''}
                onClick={() => handleCategorySelect('')}
              >
                All Categories
              </CategoryButton>
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </CategoryButton>
              ))}
            </CategoryFilters>
          </SearchSection>

          {filteredSites.length > 0 ? (
            <Grid columns={3}>
              {filteredSites.map((site) => (
                <SiteCard
                  key={site.id}
                  onClick={() => handleSiteClick(site.siteUrl)}
                >
                  <SiteImage imageUrl={site.coverImage}>
                    {!site.coverImage && 'No Image'}
                  </SiteImage>
                  
                  <SiteInfo>
                    <SiteTitle>{site.title}</SiteTitle>

                    {site.description && (
                      <SiteDescription>{site.description}</SiteDescription>
                    )}

                    <SiteMeta>
                      <MetaItem>
                        <span>🏷️</span>
                        <span>{site.category}</span>
                      </MetaItem>
                      <MetaItem>
                        <span>📅</span>
                        <span>{new Date(site.createdAt).toLocaleDateString()}</span>
                      </MetaItem>
                    </SiteMeta>

                    <VisitButton>
                      <span>Visit Website</span>
                      <span>↗️</span>
                    </VisitButton>
                  </SiteInfo>
                </SiteCard>
              ))}
            </Grid>
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <Title style={{ fontSize: '20px', marginBottom: '8px' }}>No websites found</Title>
              <Text>Try adjusting your search terms or category filter.</Text>
            </EmptyState>
          )}
        </Container>
      </HomeContainer>
    </PageContainer>
  );
}