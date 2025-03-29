
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

// ページの読み込み状態を単純化
const PageLoadAnimator = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // 単純にConsoleにロギング
    console.log('ページ遷移:', pathname);
  }, [pathname]);
  
  return null;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageLoadAnimator />
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
};
