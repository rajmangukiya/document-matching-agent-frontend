import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/auth';
import { ToastProvider } from '../context/toast';
import { router } from '../routes';

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </AuthProvider>
);

export default App;
