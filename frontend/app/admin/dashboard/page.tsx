'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchSites, createSite, updateSite, deleteSite, generateDescription, setSearchTerm, setSelectedCategory } from '@/store/slices/sitesSlice';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import styled from 'styled-components';
import { PageContainer, Container, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, TextArea, Button, Title, Subtitle, Text, ErrorText, FormRow, LoadingContainer, LoadingSpinner, Flex } from '@/styles/GlobalStyles';

const DashboardContainer = styled.div`
  padding: 40px 0;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const FormSection = styled(Card)`
  margin-bottom: 32px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    color: #6b7280;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const SitesTable = styled(Card)`
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f9fafb;
`;

const TableBody = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const TableRow = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  gap: 20px;
  align-items: center;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderRow = styled(TableRow)`
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
`;

const SiteTitle = styled.div`
  font-weight: 500;
  color: #1a202c;
`;

const SiteCategory = styled.div`
  color: #6b7280;
  font-size: 14px;
`;

const SiteDescription = styled.div`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;

  ${props => props.variant === 'delete' ? `
    background-color: #dc2626;
    color: white;

    &:hover {
      background-color: #b91c1c;
    }
  ` : `
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  `}
`;

const SearchSection = styled.div`
  margin-bottom: 24px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const CategorySelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  min-width: 200px;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AIButton = styled(Button)`
  background-color: #10b981;
  color: white;

  &:hover {
    background-color: #059669;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`;

interface SiteForm {
  title: string;
  siteUrl: string;
  category: string;
  coverImage?: string;
  description?: string;
}

const categories = [
  'Technology',
  'Design',
  'News',
  'Education',
  'Entertainment',
  'Business',
  'Health',
  'Sports',
  'Travel',
  'Food',
  'Finance',
  'Shopping',
  'Social Media',
  'Tools',
  'Other'
];

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<any>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { sites, filteredSites, isLoading, searchTerm, selectedCategory, categories: siteCategories, error } = useSelector((state: RootState) => state.sites);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteForm>();

  const watchedTitle = watch('title');
  const watchedCategory = watch('category');

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    dispatch(fetchSites());
  }, [user, router, dispatch]);

  const onSubmit = async (data: SiteForm) => {
    try {
      if (editingSite) {
        await dispatch(updateSite({ id: editingSite.id, data })).unwrap();
      } else {
        await dispatch(createSite(data)).unwrap();
      }
      reset();
      setShowForm(false);
      setEditingSite(null);
    } catch (error) {
      console.error('Error saving site:', error);
    }
  };

  const handleEdit = (site: any) => {
    setEditingSite(site);
    setValue('title', site.title);
    setValue('siteUrl', site.siteUrl);
    setValue('category', site.category);
    setValue('coverImage', site.coverImage || '');
    setValue('description', site.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this site?')) return;
    
    try {
      await dispatch(deleteSite(id)).unwrap();
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingSite(null);
  };

  const handleGenerateDescription = async () => {
    if (!watchedTitle || !watchedCategory) {
      alert('Please enter both title and category first');
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = await dispatch(generateDescription({
        title: watchedTitle,
        category: watchedCategory
      })).unwrap();
      
      setValue('description', description);
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  if (user?.role !== 'admin') {
    return (
      <PageContainer>
        <Navbar />
        <Container>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Title>Access Denied</Title>
            <Text>You need admin privileges to access this page.</Text>
          </div>
        </Container>
      </PageContainer>
    );
  }

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
      
      <DashboardContainer>
        <Container>
          <HeaderSection>
            <div>
              <Title>Admin Dashboard</Title>
              <Text>Manage website links and categories</Text>
            </div>
            
            <Button onClick={() => setShowForm(true)}>
              Add New Site
            </Button>
          </HeaderSection>

          {/* Add/Edit Form */}
          {showForm && (
            <FormSection>
              <CardBody>
                <FormHeader>
                  <Subtitle>{editingSite ? 'Edit Site' : 'Add New Site'}</Subtitle>
                  <CloseButton onClick={handleCancel}>×</CloseButton>
                </FormHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormRow>
                    <FormGroup>
                      <Label>Title *</Label>
                      <Input
                        {...register('title', { required: 'Title is required' })}
                        placeholder="Website title"
                      />
                      {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Category *</Label>
                      <CategorySelect
                        {...register('category', { required: 'Category is required' })}
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </CategorySelect>
                      {errors.category && <ErrorText>{errors.category.message}</ErrorText>}
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>Website URL *</Label>
                    <Input
                      {...register('siteUrl', { 
                        required: 'URL is required',
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: 'Please enter a valid URL starting with http:// or https://'
                        }
                      })}
                      placeholder="https://example.com"
                    />
                    {errors.siteUrl && <ErrorText>{errors.siteUrl.message}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Cover Image URL</Label>
                    <Input
                      {...register('coverImage')}
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Flex justify="space-between" align="center">
                      <Label>Description</Label>
                      <AIButton
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDescription || !watchedTitle || !watchedCategory}
                      >
                        {isGeneratingDescription ? 'Generating...' : 'Ask AI for Description'}
                      </AIButton>
                    </Flex>
                    <TextArea
                      {...register('description')}
                      placeholder="AI-generated description will appear here..."
                      rows={4}
                    />
                  </FormGroup>

                  <ButtonGroup>
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSite ? 'Update Site' : 'Add Site'}
                    </Button>
                  </ButtonGroup>
                </Form>
              </CardBody>
            </FormSection>
          )}

          {/* Search and Filter */}
          <SearchSection>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search by title or URL..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <CategorySelect
                value={selectedCategory}
                onChange={handleCategoryFilterChange}
              >
                <option value="">All Categories</option>
                {siteCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </CategorySelect>
            </SearchContainer>
          </SearchSection>

          {/* Sites Table */}
          <SitesTable>
            <TableHeader>
              <Subtitle>All Sites ({filteredSites.length})</Subtitle>
            </TableHeader>
            
            <TableBody>
              <TableHeaderRow>
                <div>Title</div>
                <div>Category</div>
                <div>Description</div>
                <div>Actions</div>
              </TableHeaderRow>
              
              {filteredSites.map((site) => (
                <TableRow key={site.id}>
                  <SiteTitle>{site.title}</SiteTitle>
                  <SiteCategory>{site.category}</SiteCategory>
                  <SiteDescription>{site.description || 'No description'}</SiteDescription>
                  <ActionButtons>
                    <ActionButton onClick={() => handleEdit(site)}>
                      Change
                    </ActionButton>
                    <ActionButton variant="delete" onClick={() => handleDelete(site.id)}>
                      Remove
                    </ActionButton>
                  </ActionButtons>
                </TableRow>
              ))}
            </TableBody>

            {filteredSites.length === 0 && (
              <EmptyState>
                <Text>No sites found. Add your first site to get started.</Text>
              </EmptyState>
            )}
          </SitesTable>

          {error && <ErrorText style={{ marginTop: '16px' }}>{error}</ErrorText>}
        </Container>
      </DashboardContainer>
    </PageContainer>
  );
}
