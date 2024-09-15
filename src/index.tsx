import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import UserTable from './components/UserTable';
import './global.css';

ReactDOM.render(
  <Provider store={store}>
    <UserTable />
  </Provider>,
  document.getElementById('root')
);
