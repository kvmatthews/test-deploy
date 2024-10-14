import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// mengambil data transaksi
export const fetchTransactions = createAsyncThunk(
    'transaction/fetchTransactions',
    async ({ offset, limit, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil data transaksi.');
            }
            return data.data.records; // Mengembalikan data transaksi
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [],
        offset: 0,
        limit: 5,
        loading: false,
        error: null,
    },
    reducers: {
        resetTransactions: (state) => {
            state.transactions = [];
            state.offset = 0;
        },
        incrementOffset: (state) => {
            state.offset += state.limit;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                if (state.offset === 0) {
                    state.transactions = action.payload; // Ganti data transaksi saat offset = 0 (refresh)
                } else {
                    state.transactions = [...state.transactions, ...action.payload]; // Tambahkan data transaksi
                }
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Gagal mengambil data transaksi.';
            });
    },
});

export const { resetTransactions, incrementOffset } = transactionSlice.actions;
export default transactionSlice.reducer;
