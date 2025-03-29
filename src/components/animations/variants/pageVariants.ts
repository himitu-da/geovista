
/**
 * ページ遷移アニメーションのバリエーション定義
 */
export const pageVariants = {
  // 標準のフェードとスケールの組み合わせ
  default: {
    initial: {
      opacity: 0,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 1.02,
    },
  },
  
  // スライド効果（横方向）
  slide: {
    initial: {
      opacity: 0,
      x: -20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 20,
    },
  },
  
  // バウンス効果（スプリングを使用）
  spring: {
    initial: {
      opacity: 0,
      y: 40,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -40,
    },
  },
  
  // 回転効果
  rotate: {
    initial: {
      opacity: 0,
      rotateY: -10,
      perspective: 1000,
    },
    in: {
      opacity: 1,
      rotateY: 0,
      perspective: 1000,
    },
    out: {
      opacity: 0,
      rotateY: 10,
      perspective: 1000,
    },
  },
  
  // スケールと回転の組み合わせ
  fancy: {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      rotateZ: -2,
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateZ: 0,
    },
    out: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      rotateZ: 2,
    },
  },
  
  // 3Dフリップ効果
  flip: {
    initial: {
      opacity: 0,
      rotateX: 90,
      perspective: 1200,
    },
    in: {
      opacity: 1,
      rotateX: 0,
      perspective: 1200,
    },
    out: {
      opacity: 0,
      rotateX: -90,
      perspective: 1200,
    },
  },
};
