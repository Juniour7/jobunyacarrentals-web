import React from 'react'
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';


const TheExperience = () => {
  return (
    <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="order-2 lg:order-1"
                >
                  <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
                    The Jobunya Experience
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    At Jobunya Cars, we redefine luxury car rental. Our commitment to excellence ensures every journey 
                    is extraordinary, from the moment you book to the final mile.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      { title: "Premium Fleet", description: "Handpicked luxury vehicles maintained to perfection" },
                      { title: "24/7 Support", description: "Round-the-clock assistance for your peace of mind" },
                      { title: "Flexible Booking", description: "Easy online booking with transparent pricing" }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/fleet">
                      <Button variant="accent" size="lg">
                        Explore Our Fleet
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="order-1 lg:order-2"
                >
                  <video 
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    src="https://res.cloudinary.com/dxvzdn2ao/video/upload/v1761888683/158316-816359649_small_muihlj.mp4"
                    className="w-full h-[30rem] object-cover rounded-md"
                    ></video>
                </motion.div>
              </div>
            </div>
          </section>
  )
}

export default TheExperience
