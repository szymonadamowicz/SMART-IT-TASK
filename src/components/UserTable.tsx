import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setFilters, setCurrentPage } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';
import { TailSpin } from 'react-loader-spinner';
import UserTableContent from './TableComponent';
import { Column } from '../types/types';

const UserTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    filteredUsers,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns: Column[] = [
    { id: 'name', name: 'Name', placeholder: 'Search by name...' },
    { id: 'username', name: 'Username', placeholder: 'Search by username...' },
    { id: 'email', name: 'Email', placeholder: 'Search by email...' },
    { id: 'phone', name: 'Phone', placeholder: 'Search by phone...' },
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setFilters({ ...filters, [name]: value }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin color="#4A90E2" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto px-5 sm:px-10 lg:px-20 mt-5 mb-5">
      <div className="max-w-7xl mx-auto p-5 shadow-lg rounded-lg bg-gray-800 border-4 border-blue-500">
        <UserTableContent
          filters={filters}
          handleFilterChange={handleFilterChange}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          itemsPerPage={itemsPerPage}
          filteredUsers={filteredUsers}
          columns={columns}
          tableTitle={'User Management Table'}
        />
      </div>
    </div>
  );
};
export default UserTable;
