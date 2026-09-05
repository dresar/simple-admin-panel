import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/admin/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import {
  LoginPage,
  DashboardPage,
  ProjectsPage,
  BlogPage,
  ResumePage,
  ContentPage,
  InboxPage,
  SubscribersPage,
  ProfilePage,
  UsersPage,
  SecurityPage,
  SettingsPage,
} from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute>
                <BlogPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/resume" element={
              <ProtectedRoute>
                <ResumePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute>
                <ContentPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/inbox" element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/subscribers" element={
              <ProtectedRoute>
                <SubscribersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="superadmin">
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/security" element={
              <ProtectedRoute>
                <SecurityPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
