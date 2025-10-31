import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Star, Quote } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery'; // Adjust the import path as needed

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Executive',
    rating: 5,
    text: 'Exceptional service and stunning vehicles. The Mercedes G-Class exceeded all my expectations. Will definitely book again!',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Entrepreneur',
    rating: 5,
    text: 'Professional, reliable, and luxurious. Jobunya made our wedding day even more special with their Range Rover. Highly recommended!',
    avatar: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Travel Blogger',
    rating: 5,
    text: 'The booking process was seamless and the 24/7 support gave me peace of mind. The Lexus was immaculate. Five stars!',
    avatar: 'ER',
  },
  {
    name: 'David Lee',
    role: 'Photographer',
    rating: 5,
    text: 'The perfect vehicle for a weekend getaway. Clean, well-maintained, and an absolute joy to drive. The team was incredibly helpful.',
    avatar: 'DL',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)'); // Tailwind's `md` breakpoint

  // Automatic carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const cardAnimation = (index) => {
    const offset = index - activeIndex;

    // Mobile Animation (Simple Horizontal Slide)
    if (!isDesktop) {
      return {
        x: `${offset * 100}%`,
        scale: 1,
        opacity: offset === 0 ? 1 : 0, // Show only the active card
        zIndex: testimonials.length - Math.abs(offset),
      };
    }

    // Desktop Animation (3D Flip)
    const isVisible = Math.abs(offset) <= 1;
    return {
      x: `${offset * 40}%`,
      rotateY: offset * -45,
      z: -Math.abs(offset) * 150,
      scale: offset === 0 ? 1 : 0.7,
      opacity: isVisible ? (offset === 0 ? 1 : 0.6) : 0,
      zIndex: testimonials.length - Math.abs(offset),
    };
  };

  return (
    <section className="py-20 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Jobunya Cars
          </p>
        </motion.div>

        <div
          className="relative w-full max-w-4xl mx-auto h-[400px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ perspective: '1200px' }}
        >
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  width: '90%', // Wider on mobile
                  maxWidth: '450px', // Max width to prevent it from being too large
                  height: 'auto',
                  top: '50%',
                  left: '50%',
                  translateX: '-50%',
                  translateY: '-50%',
                }}
                initial={false}
                animate={cardAnimation(index)}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              >
                <Card className="h-full shadow-2xl">
                  <CardContent className="p-6 md:p-8 text-center flex flex-col justify-center items-center h-full">
                    <Quote className="w-10 h-10 text-accent/20 mb-4" />
                    <p className="text-muted-foreground mb-6 italic text-sm md:text-base">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center font-bold text-accent text-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  i === activeIndex ? 'bg-accent' : 'bg-accent/20 hover:bg-accent/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;