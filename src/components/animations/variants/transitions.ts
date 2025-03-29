
/**
 * アニメーションのトランジション設定
 */
export const transitions = {
  default: {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  },
  slide: {
    type: 'tween',
    ease: 'circOut',
    duration: 0.5,
  },
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
  rotate: {
    type: 'spring',
    stiffness: 80,
    damping: 15,
  },
  fancy: {
    type: 'spring',
    stiffness: 100,
    damping: 10,
  },
  flip: {
    type: 'spring',
    stiffness: 120,
    damping: 12,
  },
};
