import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const DocSection = ({ id, title, children, theme }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  return (
    <section 
      id={id} 
      ref={ref} 
      className="mb-16 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 gradient-heading">
          {title}
        </h1>
        {children}
      </motion.div>
    </section>
  );
};

export default DocSection;