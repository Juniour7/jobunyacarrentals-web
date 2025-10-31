import React from 'react'
import { motion } from "framer-motion";
import { ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const image = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920'

const Cta = () => {
  return (
    <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920"
    >
      <source src="/24385-342401489_small.mp4" type="video/mp4" />
      {/* Optional fallback text */}
      Your browser does not support the video tag.
    </video>
          <div className="absolute inset-0 " />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4 text-center text-white"
        >
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Book your premium vehicle today and elevate your journey with Jobunya Cars. 
            Exceptional service, unmatched quality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/fleet">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Our Fleet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white  hover:bg-white hover:text-accent">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
  )
}

export default Cta
