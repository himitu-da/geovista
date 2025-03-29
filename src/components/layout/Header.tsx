
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-apple-gray-700">World Data Explorer</h1>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Explorer</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-apple-gray-500 hidden md:block">
              インタラクティブなグローバルデータビジュアライゼーション
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-full">
                <Home className="h-4 w-4 mr-1" /> ホーム
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
