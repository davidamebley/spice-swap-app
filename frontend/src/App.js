import AppRouter from './routes/AppRouter';
import { SnackbarProvider } from 'notistack';

import './App.css';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <AppRouter />
      </div>
    </SnackbarProvider>
  );
}

export default App;
