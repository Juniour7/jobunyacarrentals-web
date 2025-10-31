import React from 'react'
import { motion } from "framer-motion";
import { Clock, Shield, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
                  Why Choose Jobunya Cars?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We're committed to delivering excellence in every aspect of your rental experience
                </p>
              </motion.div>
    
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Shield, title: "Fully Insured", description: "All our vehicles come with comprehensive insurance coverage for your peace of mind" },
                  { icon: Clock, title: "24/7 Support", description: "Round-the-clock assistance whenever you need it, wherever you are" },
                  { icon: Sparkles, title: "Premium Fleet", description: "Meticulously maintained luxury vehicles that exceed expectations" }
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
                      <CardContent className="pt-8 pb-8">
                        <motion.div 
                          className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                          whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                        >
                          <item.icon className="w-8 h-8 text-accent" />
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

export default WhyChooseUs
