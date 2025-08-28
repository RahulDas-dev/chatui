/* import TitleBar from './components/TitleBar'; */
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/home';
import { ToastContainer } from './components/ui/Toasts';
import { Routes, Route } from 'react-router-dom';
import ChatContextProvider from './context/ChatContextProvider';

// Wrapper component to apply ChatContextProvider to HomePage

function App() {
  const HomePageWithChat = () => (
    <ChatContextProvider>
      <HomePage />
    </ChatContextProvider>
  );

  return (
    <ErrorBoundary>
      {/* <TitleBar title={import.meta.env.VITE_APP_TITLE} /> */}
      <main>
        <Routes>
          <Route path="/" element={<HomePageWithChat />} />
          <Route path="*" element={<HomePageWithChat />} />
        </Routes>
      </main>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
