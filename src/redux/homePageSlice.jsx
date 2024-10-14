import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// mengambil data services dari API
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/services', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil data layanan.');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// mengambil data banner dari API
export const fetchBanners = createAsyncThunk(
  'services/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/banner', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil data banner.');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  services: [],
  banner: [],
  servicesStatus: 'idle',
  bannerStatus: 'idle',
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchServices
      .addCase(fetchServices.pending, (state) => {
        state.servicesStatus = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.servicesStatus = 'succeeded';
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.servicesStatus = 'failed';
        state.error = action.payload;
      })
      // Handle fetchBanners
      .addCase(fetchBanners.pending, (state) => {
        state.bannerStatus = 'loading';
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.bannerStatus = 'succeeded';
        state.banner = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.bannerStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export default servicesSlice.reducer;
