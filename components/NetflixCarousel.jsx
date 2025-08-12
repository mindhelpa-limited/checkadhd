// components/NetflixCarousel.jsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const NetflixCarousel = ({ title, items }) => {
  return (
    <div className="mb-10">
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white/90">{title}</h3>
      <div className="flex overflow-x-scroll no-scrollbar space-x-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(129, 140, 248, 0.5)" }}
            className="flex-none w-48 rounded-lg overflow-hidden cursor-pointer group"
          >
            <Link href={item.link}>
              <div className="relative w-48 h-32">
                <Image 
                  src={item.imageUrl} 
                  alt={item.name} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-lg transform group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="relative mt-2 text-center">
                <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NetflixCarousel;