import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { UserPlus, Car, ClipboardList, CheckCircle2, KeyRound } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: 'Create an Account',
      description: 'Sign up in just a few minutes to get started.',
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Browse & Select Vehicle',
      description: 'Explore our wide range of vehicles and find the perfect one for your needs.',
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: 'Place a Reservation',
      description: 'Select your dates and place a request to reserve your chosen vehicle.',
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: 'Admin Approval & Payment',
      description: 'Our team will review your request. Once approved, you can proceed with the payment.',
    },
    {
      icon: <KeyRound className="w-8 h-8" />,
      title: 'Get Your Vehicle',
      description: 'Head to the designated drop-off location to pick up your vehicle and start your journey.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Booking your dream vehicle is simple and straightforward with our five-step process.
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Vertical Line - Desktop Only */}
          <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-accent/20 hidden md:block" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-center md:justify-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Card Content */}
                <div className="w-full md:w-5/12">
                  <motion.div
                    whileHover={{ y: -8 }}
                    className={`p-6 ml-12 md:ml-0 ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}
                  >
                    <h3 className="font-heading text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                </div>

                {/* Icon and Connector for Mobile */}
                <div className="absolute left-0 md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-accent z-10 border-4 border-secondary">
                        {step.icon}
                    </div>
                </div>

                {/* Spacer for Desktop */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;