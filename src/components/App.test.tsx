import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./UserTable', () => () => <div>UserTable Mock</div>);

test('renders UserTable component inside App', () => {
  render(<App />);
  const userTableElement = screen.getByText(/UserTable Mock/i);
  expect(userTableElement).toBeInTheDocument();
});
