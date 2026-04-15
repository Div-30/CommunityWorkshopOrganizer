import { motion } from 'framer-motion';

const variantClasses = {
  default: 'card',
  glass: 'card-glass',
  interactive: 'card-interactive',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  animate = false,
  delay = 0,
  ...props
}) {
  const classes = `${variantClasses[variant] || variantClasses.default} ${className}`;

  if (animate) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
