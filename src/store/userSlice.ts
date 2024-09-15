import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserState, Filters, User } from '../types/types';


const getInitialState = (): UserState => ({
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  filters: {
    name: '',
    username: '',
    email: '',
    phone: '',
  },
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 0,
});

const initialState: UserState = getInitialState();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
      state.currentPage = 1;
      state.filteredUsers = state.users.filter((user) =>
        Object.keys(state.filters).every((key) =>
          user[key as keyof User]
            .toString()
            .toLowerCase()
            .includes(state.filters[key as keyof Filters].toLowerCase())
        )
      );
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetState: () => getInitialState(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
        state.totalPages = Math.ceil(action.payload.length / state.itemsPerPage);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setFilters, setCurrentPage, resetState } = userSlice.actions;
export default userSlice.reducer;
export type { UserState, User, Filters };
