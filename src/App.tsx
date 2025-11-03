import AppRouter from "./routes/AppRouter";
import { ToastProvider } from "./providers/ToastProvider";
import Navbar from "./components/layout/Navbar";
import { useLocation } from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const { pathname } = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const showNavbar = !hideNavbarPaths.includes(pathname);

  return (
    <ToastProvider>
      {showNavbar && <Navbar />}
      <main>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </main>
    </ToastProvider>
  );
}
