
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, BarChart3, Users, BarChart2, Database, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* ヘッダーセクション */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-700">World Data Explorer</h1>
          <Link to="/explore">
            <Button variant="outline" className="flex items-center gap-2 rounded-full hover:bg-primary hover:text-white transition-all">
              Explorer を起動 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 z-0"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6 animate-fade-in">データビジュアライゼーション・プラットフォーム</span>
            <h1 className="text-5xl md:text-6xl font-bold text-apple-gray-700 tracking-tight mb-6 leading-tight">
              世界のデータを<br className="hidden md:block" />
              <span className="text-gradient-primary">直感的に探索する</span>
            </h1>
            <p className="text-xl md:text-2xl text-apple-gray-500 mb-8 leading-relaxed max-w-2xl">
              人口統計、経済指標など、世界の多様なデータをインタラクティブに可視化。グローバルな視点からパターンや洞察を発見しましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/explore">
                <Button size="lg" className="px-8 py-6 rounded-full text-lg shadow-apple-md hover:shadow-apple-lg transition-all bg-primary hover:bg-primary/90">
                  今すぐ探索を始める
                </Button>
              </Link>
              <a href="#features" className="inline-flex items-center justify-center px-8 py-6 text-lg font-medium text-apple-gray-700 bg-white rounded-full shadow-apple-sm hover:shadow-apple-md transition-all">
                機能を見る
              </a>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-apple-gray-700 mb-4">
                直感的なデータビジュアライゼーション
              </h2>
              <p className="text-xl text-apple-gray-500 max-w-2xl mx-auto">
                複雑なグローバルデータを簡単に理解し、分析するための強力なツール
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white shadow-apple-md hover:shadow-apple-lg transition-all border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-apple-gray-700">インタラクティブマップ</h3>
                <p className="text-apple-gray-500 text-lg">
                  カラーコード化されたメトリクスと詳細な国別情報を備えたインタラクティブな世界地図で探索できます。
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white shadow-apple-md hover:shadow-apple-lg transition-all border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-apple-gray-700">データ分析</h3>
                <p className="text-apple-gray-500 text-lg">
                  パターンや比較洞察を明らかにするインタラクティブなチャートでトレンドを分析できます。
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white shadow-apple-md hover:shadow-apple-lg transition-all border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-apple-gray-700">人口統計インサイト</h3>
                <p className="text-apple-gray-500 text-lg">
                  詳細な人口密度および分布データにより、世界の人口統計を理解できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 詳細セクション */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-700 mb-6 tracking-tight">
                  複雑なデータを<br />シンプルに可視化
                </h2>
                <p className="text-xl text-apple-gray-500 mb-8">
                  World Data Explorerは、世界規模のデータセットを直感的に理解できるように設計されています。研究者、教育者、データ愛好家の方々に最適なツールです。
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                      <BarChart2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-lg text-apple-gray-600">200以上の国と地域のデータを網羅</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-lg text-apple-gray-600">複数のデータセットと指標を切り替え可能</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-lg text-apple-gray-600">AIを活用した高度なデータ分析</span>
                  </li>
                </ul>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-apple-lg border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070" 
                  alt="データ分析ダッシュボード" 
                  className="w-full h-auto rounded-3xl" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 機能デモセクション */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-700 mb-4 tracking-tight">
                主要機能
              </h2>
              <p className="text-xl text-apple-gray-500 max-w-2xl mx-auto">
                World Data Explorerの使いやすさと機能性をご覧ください
              </p>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-apple-lg border border-gray-100 aspect-video mb-12">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <p className="text-2xl text-apple-gray-500 px-6 py-4 bg-white rounded-xl shadow-apple-sm">
                  デモ映像や画像をここに配置
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/explore">
                <Button size="lg" className="px-8 py-6 rounded-full text-lg shadow-apple-md hover:shadow-apple-lg transition-all bg-primary hover:bg-primary/90">
                  今すぐエクスプローラーを起動
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-24 px-6 text-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-5 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 z-0"></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-apple-gray-700">
              探索を始めませんか？
            </h2>
            <p className="text-xl text-apple-gray-500 mb-8 leading-relaxed">
              世界のデータを視覚化し、グローバルな洞察を発見する旅を今すぐ始めましょう。
            </p>
            <Link to="/explore">
              <Button size="lg" className="px-10 py-7 text-xl rounded-full shadow-apple-lg hover:shadow-apple-xl transition-all bg-primary hover:bg-primary/90">
                エクスプローラーを起動 <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-apple-gray-700 mb-2">World Data Explorer</h3>
              <p className="text-apple-gray-500">インタラクティブなグローバルデータビジュアライゼーション</p>
            </div>
            <div className="text-apple-gray-500">
              &copy; {new Date().getFullYear()} World Data Explorer | All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
