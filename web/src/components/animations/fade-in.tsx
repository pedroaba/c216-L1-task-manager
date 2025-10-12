'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { shouldReduceMotion } from '@/lib/utils';
import { ANIMATION_DURATION } from '@/constants/validation';
import type { AnimationProps } from '@/types';

/**
 * Fade in animation component
 */
export const FadeIn: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = ANIMATION_DURATION.ENTRANCE,
  disabled = false,
  className,
}) => {
  const shouldReduce = shouldReduceMotion();
  
  if (disabled || shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Slide up animation component
 */
export const SlideUp: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = ANIMATION_DURATION.ENTRANCE,
  disabled = false,
  className,
}) => {
  const shouldReduce = shouldReduceMotion();
  
  if (disabled || shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger children animation component
 */
interface StaggerProps extends AnimationProps {
  staggerDelay?: number;
}

export const StaggerChildren: React.FC<StaggerProps> = ({
  children,
  delay = 0,
  duration = ANIMATION_DURATION.MEDIUM,
  staggerDelay = 100,
  disabled = false,
  className,
}) => {
  const shouldReduce = shouldReduceMotion();
  
  if (disabled || shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay / 1000,
            staggerChildren: staggerDelay / 1000,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Scale animation component for buttons
 */
interface ScaleProps extends AnimationProps {
  scale?: number;
  whileHover?: number;
  whileTap?: number;
}

export const Scale: React.FC<ScaleProps> = ({
  children,
  scale = 1,
  whileHover = 1.02,
  whileTap = 0.98,
  disabled = false,
  className,
}) => {
  const shouldReduce = shouldReduceMotion();
  
  if (disabled || shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ scale }}
      whileHover={{ scale: whileHover }}
      whileTap={{ scale: whileTap }}
      transition={{
        duration: ANIMATION_DURATION.FAST / 1000,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Shake animation for error states
 */
export const Shake: React.FC<AnimationProps & { trigger?: boolean }> = ({
  children,
  trigger = false,
  disabled = false,
  className,
}) => {
  const shouldReduce = shouldReduceMotion();
  
  if (disabled || shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={trigger ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Page transition wrapper
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const shouldReduce = shouldReduceMotion();
  
  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: ANIMATION_DURATION.ENTRANCE / 1000,
          ease: 'easeOut',
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};