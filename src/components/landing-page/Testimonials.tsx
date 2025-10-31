import React from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from '../ui/card';
import { Star, Users } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="py-20 bg-secondary">
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

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Business Executive", rating: 5, text: "Exceptional service and stunning vehicles. The Mercedes G-Class exceeded all my expectations. Will definitely book again!" },
              { name: "Michael Chen", role: "Entrepreneur", rating: 5, text: "Professional, reliable, and luxurious. Jobunya made our wedding day even more special with their Range Rover. Highly recommended!" },
              { name: "Emily Rodriguez", role: "Travel Blogger", rating: 5, text: "The booking process was seamless and the 24/7 support gave me peace of mind. The Lexus was immaculate. Five stars!" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
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
        </div>
      </section>
  )
}

export default Testimonials
