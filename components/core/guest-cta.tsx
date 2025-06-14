import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRTIStore } from "@/hooks/use-rti-store";

export default function GuestCTA() {
  const { setGuestMode } = useRTIStore();

  const handleStartComposing = () => {
    setGuestMode(true);
    document.getElementById('composer')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="bg-gray-50 py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight leading-tight"
        >
          Start Your RTI Application
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-lg text-gray-600 mb-12 max-w-xl mx-auto font-light leading-relaxed"
        >
          Professional RTI applications in minutes. 
          No registration required.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Button
            size="lg"
            onClick={handleStartComposing}
            className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
          >
            Start Application
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
        
      </div>
    </section>
  );
} 