import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "Your Spiritual Journey",
      "The Gateway to Divine Knowledge",
      "A Path to Inner Peace",
      "Wisdom for the Soul",
      "A Journey Through Divine Words",
      "Life Inspired by the Sunnah",
      "Live The Way of the Prophet",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="h-24 md:h-28 lg:h-32 flex items-center justify-center">
          {titles.map((title, index) => (
            <motion.h1
              key={index}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white absolute"
              initial={{ opacity: 0, y: 50 }}
              animate={
                titleNumber === index
                  ? {
                      y: 0,
                      opacity: 1,
                    }
                  : {
                      y: titleNumber > index ? -50 : 50,
                      opacity: 0,
                    }
              }
              transition={{ type: "spring", stiffness: 50 }}
            >
              {title}
            </motion.h1>
          ))}
        </div>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Experience the divine revelation with our beautiful and intuitive Quran reading app
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/quran/reading">
            <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700 text-white">
              Launch App
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Gradient overlay at the bottom */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default LandingPage; 