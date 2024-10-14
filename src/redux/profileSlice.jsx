import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// mengambil data profil
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengambil data profil.');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// memperbarui data profil
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ token, firstName, lastName }, { rejectWithValue }) => {
    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile/update", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil.');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// mengubah gambar profil
export const updateProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile/image", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui gambar profil.');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    email: '',
    first_name: '',
    last_name: '',
    profile_image: '',
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
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.profile_image = action.payload.profile_image || '';
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.message = 'Profil berhasil diperbarui!';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.profile_image = action.payload.profile_image;
        state.message = 'Gambar profil berhasil diperbarui!';
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = profileSlice.actions;
export default profileSlice.reducer;
