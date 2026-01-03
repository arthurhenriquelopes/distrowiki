import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Catalog from "./pages/catalog/Catalog";
import { AuthProvider } from "./contexts/AuthContext";
import Comparison from "./pages/comparison/Comparison";
import DistroDetails from "./pages/distro/DistroDetails";
import About from "./pages/About";
import Dashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="distrowiki-theme">
        <TooltipProvider>
          <ComparisonProvider>
            <AuthProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/comparacao" element={<Comparison />} />
                    <Route path="/comparacao/:distroIds" element={<Comparison />} />
                    <Route path="/distro/:id" element={<DistroDetails />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </ComparisonProvider>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

