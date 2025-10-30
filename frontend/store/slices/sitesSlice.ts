import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sitesAPI } from '../../lib/api';
import { Site } from '../../types';

interface SitesState {
  sites: Site[];
  filteredSites: Site[];
  isLoading: boolean;
  isCreateLoading: boolean;
  generatedescription: string;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
}

const initialState: SitesState = {
  sites: [],
  filteredSites: [],
  generatedescription: '',
  isLoading: false,
  isCreateLoading: false,
  error: null,
  searchTerm: '',
  selectedCategory: '',
  categories: [],
};

// Async thunks
export const fetchSites = createAsyncThunk(
  'sites/fetchSites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sitesAPI.getSites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites');
    }
  }
);

export const createSite = createAsyncThunk(
  'sites/createSite',
  async (siteData: {
    title: string;
    siteUrl: string;
    category: string;
    coverImage?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await sitesAPI.createSite(siteData);
      console.log({ response });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create site');
    }
  }
);

export const updateSite = createAsyncThunk(
  'sites/updateSite',
  async ({ id, data }: { id: number; data: Partial<Site> }, { rejectWithValue }) => {
    try {
      const response = await sitesAPI.updateSite(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update site');
    }
  }
);

export const deleteSite = createAsyncThunk(
  'sites/deleteSite',
  async (id: number, { rejectWithValue }) => {
    try {
      await sitesAPI.deleteSite(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete site');
    }
  }
);

export const GenerateDescription = createAsyncThunk(
  'sites/generateDescription',
  async ({ title, category, link }: { title: string; category: string; link: string }, { rejectWithValue }) => {
    try {
      const response = await sitesAPI.generateDescription({ title, category, link });
      console.log({ response });
      return response.data.description;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate description');
    }
  }
);

const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      filterSites(state);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      filterSites(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sites
      .addCase(fetchSites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sites = action.payload;
        state.categories = Array.from(new Set(action.payload.map((site: Site) => site.category)));
        filterSites(state);
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create site
      .addCase(createSite.pending, (state) => {
        state.isCreateLoading = true;
        state.error = null;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.isCreateLoading = false;
        state.sites.push(action.payload);
        state.categories = Array.from(new Set(state.sites.map(site => site.category)));
        filterSites(state);
      })
      .addCase(createSite.rejected, (state, action) => {
        state.isCreateLoading = false;
        state.error = action.payload as string;
      })
      // Update site
      .addCase(updateSite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sites.findIndex(site => site.id === action.payload.id);
        if (index !== -1) {
          state.sites[index] = action.payload;
        }
        state.categories = Array.from(new Set(state.sites.map(site => site.category)));
        filterSites(state);
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete site
      .addCase(deleteSite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sites = state.sites.filter(site => site.id !== action.payload);
        state.categories = Array.from(new Set(state.sites.map(site => site.category)));
        filterSites(state);
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate description
      .addCase(GenerateDescription.pending, (state) => {
        state.error = null;
      })
      .addCase(GenerateDescription.fulfilled, (state, action) => {
        state.generatedescription = action.payload;
      })
      .addCase(GenerateDescription.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Helper function to filter sites
function filterSites(state: SitesState) {
  let filtered = state.sites;

  if (state.searchTerm) {
    filtered = filtered.filter(
      (site) =>
        site.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        site.site_url.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        site.category.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        (site.description && site.description.toLowerCase().includes(state.searchTerm.toLowerCase()))
    );
  }

  if (state.selectedCategory) {
    filtered = filtered.filter((site) => site.category === state.selectedCategory);
  }

  state.filteredSites = filtered;
}

export const { setSearchTerm, setSelectedCategory, clearError } = sitesSlice.actions;
export default sitesSlice.reducer;
