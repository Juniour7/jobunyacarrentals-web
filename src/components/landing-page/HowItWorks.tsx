import React from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from '../ui/card';

const HowItWorks = () => {
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
                  How It Works
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Booking your dream vehicle is simple and straightforward
                </p>
              </motion.div>
    
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  { step: "1", title: "Choose Your Vehicle", description: "Browse our premium fleet and select the perfect vehicle for your journey" },
                  { step: "2", title: "Book Online", description: "Complete your booking in minutes with our simple online process" },
                  { step: "3", title: "Hit the Road", description: "Pick up your vehicle and enjoy an unforgettable driving experience" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Card className="text-center h-full hover:shadow-xl transition-shadow">
                      <CardContent className="pt-8">
                        <motion.div 
                          className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                          whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
                        >
                          <span className="text-3xl font-bold text-accent">{item.step}</span>
                        </motion.div>
                        <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
  )
}

export default HowItWorks
