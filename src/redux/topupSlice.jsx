import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// menangani proses top up
export const handleTopUp = createAsyncThunk(
  'topup/handleTopUp',
  async ({ amount, token }, { rejectWithValue }) => {
    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ top_up_amount: amount }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Top Up gagal.");
      }

      return data.data; // Mengembalikan data top up
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const topupSlice = createSlice({
  name: 'topup',
  initialState: {
    balance: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleTopUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(handleTopUp.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload?.balance || null;
        state.message = `Top Up berhasil! Saldo Anda sekarang: Rp${action.payload?.balance}`;
      })
      .addCase(handleTopUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Top Up gagal. Mohon dicoba kembali.';
      });
  },
});

export const { clearMessage } = topupSlice.actions;
export default topupSlice.reducer;
