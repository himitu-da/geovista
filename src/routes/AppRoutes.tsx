
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

// ページの読み込み状態を表示するコンポーネント
const PageLoadAnimator = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    // 新しいページに遷移したときの読み込み状態をシミュレート
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return null; // ローディングインジケーターが必要な場合は、ここに追加
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageLoadAnimator />
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
