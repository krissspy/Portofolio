import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectData {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface ProjectCarouselProps {
  testimonials: ProjectData[];
  autoplay?: boolean;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const ProjectCarousel = ({ testimonials, autoplay = true }: ProjectCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    
    if (isActive) {
      return { zIndex: 3, opacity: 1, pointerEvents: "auto", transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`, transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
    }
    if (isLeft) {
      return { zIndex: 2, opacity: 1, pointerEvents: "auto", transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`, transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
    }
    if (isRight) {
      return { zIndex: 2, opacity: 1, pointerEvents: "auto", transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`, transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
    }
    return { zIndex: 1, opacity: 0, pointerEvents: "none", transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        
        {/* Images Container */}
        {}
        <div className="relative w-full h-96 perspective-[1000px]" ref={imageContainerRef}>
          {testimonials.map((testimonial, index) => (
            <img 
              key={testimonial.src} 
              src={testimonial.src}
              loading="lazy" 
              decoding="async"
              alt={testimonial.name} 
              className="absolute w-full h-full object-cover rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]" 
              data-index={index} 
              style={getImageStyle(index)} 
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} variants={quoteVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
              <h3 className="text-2xl sm:text-3xl font-bold font-poppins text-[#382B25] dark:text-[#E5D5CD] mb-1">
                {activeTestimonial.name}
              </h3>
              <p className="text-[#6D5447] dark:text-[#928883] font-medium mb-6 sm:mb-8">
                {activeTestimonial.designation}
              </p>
              <motion.p className="text-gray-700 dark:text-[#E0E0E0] font-inter leading-relaxed text-sm sm:text-base">
                {activeTestimonial.quote.split(" ").map((word, i) => (
                  <motion.span key={i} initial={{ filter: "blur(10px)", opacity: 0, y: 5 }} animate={{ filter: "blur(0px)", opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }} className="inline-block">
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-6 pt-8 md:pt-0 mt-auto">
            <button 
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#382B25] text-[#f1f1f7] hover:bg-[#6D5447] transition-colors duration-300 border-none cursor-pointer" 
              onClick={handlePrev}
              aria-label="Previous Project"
            >
              <FaArrowLeft size={20} />
            </button>
            <button 
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#382B25] text-[#f1f1f7] hover:bg-[#6D5447] transition-colors duration-300 border-none cursor-pointer" 
              onClick={handleNext}
              aria-label="Next Project"
            >
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCarousel;