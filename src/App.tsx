
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhotoProvider } from "./context/PhotoContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhotoDetail from "./pages/PhotoDetail";
import Albums from "./pages/Albums";
import Favorites from "./pages/Favorites";
import FavoriteButton from "./components/FavoriteButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PhotoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/photo/:id" element={<PhotoDetail />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FavoriteButton />
        </BrowserRouter>
      </PhotoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
