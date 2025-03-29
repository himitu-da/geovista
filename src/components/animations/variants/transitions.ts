
/**
 * アニメーションのトランジション設定
 */
export const transitions = {
  default: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  },
  slide: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  },
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
  rotate: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  },
  fancy: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  },
  flip: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  },
};
