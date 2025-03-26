
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhotoProvider } from "./context/PhotoContext";
import { DatabaseProvider } from "./context/DatabaseContext";
import { AppConfigProvider } from "./context/AppConfigContext";
import { AlbumProvider } from "./context/AlbumContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhotoDetail from "./pages/PhotoDetail";
import Albums from "./pages/Albums";
import Favorites from "./pages/Favorites";
import ImageClassifier from "./pages/ImageClassifier";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppConfigProvider>
        <DatabaseProvider>
          <PhotoProvider>
            <AlbumProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/photo/:id" element={<PhotoDetail />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/classifier" element={<ImageClassifier />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner richColors closeButton position="top-right" duration={3000} />
            </AlbumProvider>
          </PhotoProvider>
        </DatabaseProvider>
      </AppConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
