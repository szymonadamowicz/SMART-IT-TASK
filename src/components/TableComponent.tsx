import React from 'react';
import { UserTableContentProps } from '../types/types';

const UserTableContent: React.FC<UserTableContentProps> = ({
  filters,
  handleFilterChange,
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
  itemsPerPage,
  filteredUsers,
  columns,
  tableTitle,
}) => {
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <div className="bg-gray-700 p-5 rounded-lg mb-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-200 shadow-sm">
          {tableTitle}
        </h1>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto border-collapse bg-gray-800 overflow-hidden">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="border-2 border-blue-500 p-3 text-left bg-blue-600 text-white uppercase font-bold min-w-[150px]"
                >
                  {column.name}
                  <input
                    type="text"
                    name={column.id}
                    value={filters[column.id]}
                    onChange={handleFilterChange}
                    placeholder={column.placeholder}
                    className="w-full p-2 mt-2 border-2 border-blue-600 rounded-md bg-gray-700 text-gray-200 font-bold"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border-2 border-red-500 p-4 text-center text-gray-200 bg-gray-700"
                >
                  No results found
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className="border-2 border-gray-500 p-4 text-left text-gray-200"
                    >
                      {user[column.id]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-5 text-gray-200 font-bold space-y-2 sm:space-y-0">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`p-2 bg-blue-500 rounded-lg ${
            currentPage === 1
              ? 'bg-gray-500 cursor-not-allowed'
              : 'hover:bg-blue-400'
          }`}
        >
          Previous
        </button>

        <span className="text-center">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={`p-2 bg-blue-500 rounded-lg ${
            currentPage >= totalPages
              ? 'bg-gray-500 cursor-not-allowed'
              : 'hover:bg-blue-400'
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default UserTableContent;
