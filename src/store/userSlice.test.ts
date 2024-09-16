import userReducer, {
    setFilters,
    setCurrentPage,
  } from './userSlice';
  import { configureStore } from '@reduxjs/toolkit';
  import { RootState } from './store';
  
  jest.mock('axios');
  
  describe('userSlice', () => {
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
  
    it('should have initial state', () => {
      const state: RootState = store.getState();
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
  
    it('should handle fetchUsers.fulfilled', () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      ];
  
      store.dispatch({
        type: 'users/fetchUsers/fulfilled',
        payload: mockUsers,
      });
  
      const state: RootState = store.getState();
      expect(state.users.users).toEqual(mockUsers);
      expect(state.users.filteredUsers).toEqual(mockUsers);
      expect(state.users.loading).toBe(false);
      expect(state.users.error).toBeNull();
      expect(state.users.totalPages).toBe(1);
    });
  
    it('should handle fetchUsers.rejected', () => {
      store.dispatch({
        type: 'users/fetchUsers/rejected',
        error: { message: 'Failed to fetch users' },
      });
  
      const state: RootState = store.getState();
      expect(state.users.loading).toBe(false);
      expect(state.users.error).toEqual('Failed to fetch users');
    });
  
    it('should handle setFilters', () => {
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
  
    it('should handle setCurrentPage', () => {
      store.dispatch(setCurrentPage(2));
  
      const state: RootState = store.getState();
      expect(state.users.currentPage).toBe(2);
    });
  });
  