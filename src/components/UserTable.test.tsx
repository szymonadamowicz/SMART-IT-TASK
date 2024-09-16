import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice';
import UserTable from './UserTable';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

describe('UserTable Component', () => {
  let store: ReturnType<typeof configureStore>;

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

  test('displays an error message when there is an error fetching data', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch users')
    );

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );

    expect(
      await screen.findByText(/Error: Failed to fetch users/i)
    ).toBeInTheDocument();
  });

  test('displays loading spinner when fetching data', async () => {
    (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('filters users correctly when input is typed into filter fields', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '1234567890',
        },
        {
          id: 2,
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'jane@example.com',
          phone: '0987654321',
        },
      ],
    });

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    );

    const input = screen.getByPlaceholderText('Search by name...');

    fireEvent.change(input, { target: { value: 'Jane' } });

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  test('filters users correctly when filtering by username and phone number', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '1234567890',
        },
        {
          id: 2,
          name: 'Sam Smith',
          username: 'samsmith',
          email: 'sam@example.com',
          phone: '1234567890',
        },
        {
          id: 3,
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'jane@example.com',
          phone: '0987654321',
        },
      ],
    });

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    );

    const usernameInput = screen.getByPlaceholderText('Search by username...');
    const phoneInput = screen.getByPlaceholderText('Search by phone...');

    fireEvent.change(usernameInput, { target: { value: 'sam' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  test('filters users correctly when filtering by name and email', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
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
        {
          id: 3,
          name: 'Sam Smith',
          username: 'samsmith',
          email: 'sam@example.com',
          phone: '1234567890',
        },
      ],
    });

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    );

    const nameInput = screen.getByPlaceholderText('Search by name...');
    const emailInput = screen.getByPlaceholderText('Search by email...');

    fireEvent.change(nameInput, { target: { value: 'Jane' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();
  });
});
