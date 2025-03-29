
import React, { useEffect } from 'react';
import { BrowserRouter, Route, useLocation } from "react-router-dom";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { AnimatedRoutes } from '@/components/animations/AnimatedRoutes';
import { LandingTransition, ExplorerTransition, DefaultTransition } from '@/components/animations/PageTransition';

// スクロール位置をリセットするコンポーネント
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes>
        <Route 
          path="/" 
          element={
            <LandingTransition>
              <Landing />
            </LandingTransition>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ExplorerTransition>
              <Index />
            </ExplorerTransition>
          } 
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route 
          path="*" 
          element={
            <DefaultTransition>
              <NotFound />
            </DefaultTransition>
          } 
        />
      </AnimatedRoutes>
    </BrowserRouter>
  );
};
