import { motion } from "framer-motion";
import { Play, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRTIStore } from "@/hooks/use-rti-store";

export default function GuestCTA() {
  const { setGuestMode } = useRTIStore();

  const handleStartTrial = () => {
    setGuestMode(true);
    // Scroll to composer
    document.getElementById('composer')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="bg-gradient-to-br from-primary-500 to-purple-600 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10"></div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-5xl font-serif font-light text-white mb-8 tracking-tight"
        >
          Try Without Registration
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-primary-100 mb-12 leading-relaxed font-light max-w-3xl mx-auto"
        >
          Create and export your first RTI application for free. Start filing RTI requests immediately.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            onClick={handleStartTrial}
            className="bg-white text-primary-600 hover:bg-gray-900 hover:text-gray-50 shadow-large px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-3" />
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white/80 hover:bg-white hover:text-primary-600 px-10 py-4 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <UserPlus className="w-5 h-5 mr-3" />
            Create Account
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 text-primary-100 text-sm"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Full feature access</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Export to PDF/DOC</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
