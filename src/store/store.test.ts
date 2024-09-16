import { configureStore } from '@reduxjs/toolkit';
import userReducer, { fetchUsers, setFilters } from './userSlice';
import { RootState } from './store';
import axios from 'axios';

jest.mock('axios');

describe('store', () => {
  let store = configureStore({
    reducer: {
      users: userReducer,
    },
  });

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: userReducer,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should configure the store with initial state', () => {
    const state: RootState = store.getState();
    expect(state.users).toBeDefined();
    expect(state.users.users).toEqual([]);
    expect(state.users.filteredUsers).toEqual([]);
    expect(state.users.loading).toBe(false);
    expect(state.users.error).toBeNull();
    expect(state.users.filters).toEqual({
      name: '',
      username: '',
      email: '',
      phone: '',
    });
    expect(state.users.currentPage).toBe(1);
    expect(state.users.itemsPerPage).toBe(10);
    expect(state.users.totalPages).toBe(0);
  });

  it('should handle fetching users action', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      ],
    });

    await store.dispatch<any>(fetchUsers());

    const state: RootState = store.getState();
    expect(state.users.loading).toBe(false);
    expect(state.users.users.length).toBeGreaterThan(0);
    expect(state.users.filteredUsers.length).toBe(state.users.users.length);
    expect(state.users.totalPages).toBeGreaterThan(0);
  });

  it('should handle setFilters action', () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '1234567890',
      },
      {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        phone: '0987654321',
      },
    ];
    store.dispatch({
      type: 'users/fetchUsers/fulfilled',
      payload: mockUsers,
    });

    store.dispatch(
      setFilters({
        name: 'Jane',
        username: '',
        email: '',
        phone: '',
      })
    );

    const state: RootState = store.getState();
    expect(state.users.filters.name).toBe('Jane');
    expect(state.users.filteredUsers).toHaveLength(1);
    expect(state.users.filteredUsers[0].name).toBe('Jane Smith');
    expect(state.users.totalPages).toBe(1);
  });

  it('should handle setCurrentPage action', () => {
    store.dispatch({ type: 'users/setCurrentPage', payload: 2 });
    const state: RootState = store.getState();
    expect(state.users.currentPage).toBe(2);
  });
});
