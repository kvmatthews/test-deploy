import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// fetch services
export const fetchServices = createAsyncThunk(
  'service/fetchServices',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/services', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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

// proses pembayaran
export const processPayment = createAsyncThunk(
  'service/processPayment',
  async ({ serviceCode, amount, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/transaction', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_code: serviceCode,
          total_amount: amount,
          transaction_type: 'PAYMENT',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Pembayaran gagal.');
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [],
    service: null,
    error: null,
    loading: false,
    message: null,
  },
  reducers: {
    selectService: (state, action) => {
      state.service = action.payload;
      state.message = null;
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'Transaksi berhasil!';
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectService, clearMessage } = serviceSlice.actions;
export default serviceSlice.reducer;
