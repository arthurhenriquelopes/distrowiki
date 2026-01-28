import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./pages/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy loading pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/catalog/Catalog"));
const Comparison = lazy(() => import("./pages/comparison/Comparison"));
const DistroQuiz = lazy(() => import("./pages/quiz/DistroQuiz"));
const DistroDetails = lazy(() => import("./pages/distro/DistroDetails"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="distrowiki-theme">
        <TooltipProvider>
          <ComparisonProvider>
            <AuthProvider>
              <Toaster />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                                          <Route path="/catalogo" element={<Catalog />} />
                                          <Route path="/quiz" element={<DistroQuiz />} />
                                          <Route path="/comparacao" element={<Comparison />} />                      <Route path="/comparacao/:distroIds" element={<Comparison />} />
                      <Route path="/distro/:id" element={<DistroDetails />} />
                      <Route path="/sobre" element={<About />} />
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </ComparisonProvider>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

