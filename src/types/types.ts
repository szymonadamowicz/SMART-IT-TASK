export interface UserState {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export type ColumnId = 'name' | 'username' | 'email' | 'phone';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface Filters {
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface UserTableContentProps {
  filters: Filters;
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  itemsPerPage: number;
  filteredUsers: User[];
  columns: Column[];
  tableTitle:string;
}

export interface Column {
  id: ColumnId;
  name: string;
  placeholder:string;
}
