import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomeRoute } from './HomeRoute';
import { RouteLoadingFallback } from '../components/common/RouteLoadingFallback';
import { ProtectedRoute } from '../security/ProtectedRoute';

// Lazy-loaded routes for code-splitting and faster initial bundle loading
const PropertiesRoute = lazy(() => import('./PropertiesRoute').then(m => ({ default: m.PropertiesRoute })));
const PropertyDetailsRoute = lazy(() => import('./PropertyDetailsRoute').then(m => ({ default: m.PropertyDetailsRoute })));
const StartRoute = lazy(() => import('./StartRoute').then(m => ({ default: m.StartRoute })));
const CompareRoute = lazy(() => import('./CompareRoute').then(m => ({ default: m.CompareRoute })));
const AboutRoute = lazy(() => import('./AboutRoute').then(m => ({ default: m.AboutRoute })));
const ContactRoute = lazy(() => import('./ContactRoute').then(m => ({ default: m.ContactRoute })));
const ProfileRoute = lazy(() => import('./ProfileRoute').then(m => ({ default: m.ProfileRoute })));
const HelpRoute = lazy(() => import('./HelpRoute').then(m => ({ default: m.HelpRoute })));
const SellerRoute = lazy(() => import('./SellerRoute').then(m => ({ default: m.SellerRoute })));
const AdminRoute = lazy(() => import('./AdminRoute').then(m => ({ default: m.AdminRoute })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<HomeRoute />} />
          <Route path="properties" element={<PropertiesRoute />} />
          <Route path="property/:id" element={<PropertyDetailsRoute />} />
          <Route path="start" element={<StartRoute />} />
          <Route path="compare" element={<CompareRoute />} />
          <Route path="about" element={<AboutRoute />} />
          <Route path="contact" element={<ContactRoute />} />
          <Route path="help" element={<HelpRoute />} />

          {/* Protected User Routes */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute requiredAuth>
                <ProfileRoute />
              </ProtectedRoute>
            } 
          />

          {/* Protected Seller Routes */}
          <Route 
            path="seller/dashboard" 
            element={
              <ProtectedRoute requiredAuth>
                <SellerRoute />
              </ProtectedRoute>
            } 
          />
          <Route path="seller" element={<Navigate to="/seller/dashboard" replace />} />

          {/* Protected Admin & Internal Staff Routes */}
          <Route 
            path="admin" 
            element={
              <ProtectedRoute 
                requiredAuth 
                requiredRole={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'PROPERTY_REVIEWER', 'SALES_USER', 'CONTENT_MANAGER']}
              >
                <AdminRoute />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/:subtab" 
            element={
              <ProtectedRoute 
                requiredAuth 
                requiredRole={['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'PROPERTY_REVIEWER', 'SALES_USER', 'CONTENT_MANAGER']}
              >
                <AdminRoute />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
