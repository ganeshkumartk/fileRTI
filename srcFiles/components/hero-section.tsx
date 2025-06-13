import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import VoiceInput from "./voice-input";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight tracking-tight"
          >
            Your Right to Know,
            <br />
            <span className="text-gray-600 font-normal">
              Simplified
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Professional RTI applications with guaranteed legal compliance. 
            Generate government-ready documents in minutes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-16"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Legal Compliance
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Instant Generation
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All Departments
            </span>
          </motion.div>
          
          {/* Hand-drawn RTI Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-20"
          >
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
              <motion.div
                className="relative w-full h-full cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Background shadow */}
                <div
                  className="absolute inset-4 rounded-full opacity-20"
                  style={{
                    filter: 'blur(20px)',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                
                {/* Hand-drawn SVG Illustration */}
                <svg 
                  viewBox="0 0 300 300" 
                  className="absolute inset-8 w-auto h-auto text-gray-700"
                  style={{ 
                    filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))',
                  }}
                >
                  <defs>
                    <filter id="roughPaper">
                      <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" seed="1"/>
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
                    </filter>
                  </defs>
                  
                  {/* RTI Application Document */}
                  <motion.g
                    className="group-hover:opacity-0 transition-opacity duration-500"
                  >
                    {/* Main document with hand-drawn effect */}
                    <motion.path
                      d="M60 40 Q61 41 240 45 Q239 46 235 260 Q234 259 55 255 Q56 254 60 40"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      filter="url(#roughPaper)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    
                    {/* RTI Header with hand-drawn style */}
                    <motion.text
                      x="150" y="70"
                      textAnchor="middle"
                      className="text-xs font-bold fill-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      RIGHT TO INFORMATION
                    </motion.text>
                    
                    {/* Government of India */}
                    <motion.text
                      x="150" y="90"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                    >
                      Government of India
                    </motion.text>
                    
                    {/* Hand-drawn form fields */}
                    {Array.from({ length: 6 }, (_, i) => (
                      <motion.g key={i}>
                        <motion.path
                          d={`M70 ${120 + i * 25} Q${75 + Math.sin(i) * 2} ${120 + i * 25 + Math.cos(i)} 220 ${120 + i * 25}`}
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 2 + i * 0.1,
                          }}
                        />
                        <motion.text
                          x="75" y={115 + i * 25}
                          className="text-xs fill-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.2 + i * 0.1 }}
                        >
                          {['To:', 'Subject:', 'Information Request:', 'Details:', 'Yours faithfully,', 'Signature:'][i]}
                        </motion.text>
                      </motion.g>
                    ))}
                  </motion.g>

                  {/* Mail Envelope (appears on hover) */}
                  <motion.g
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    {/* Envelope body with hand-drawn effect */}
                    <motion.path
                      d="M80 100 Q81 101 220 105 Q219 106 215 180 Q214 179 75 175 Q76 174 80 100"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      filter="url(#roughPaper)"
                      initial={{ scale: 0.8, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Envelope flap */}
                    <motion.path
                      d="M80 100 Q150 130 220 105 Q150 140 80 100"
                      fill="rgba(0,0,0,0.05)"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                    
                    {/* Address lines */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <line x1="100" y1="140" x2="180" y2="143" stroke="currentColor" strokeWidth="1"/>
                      <line x1="100" y1="155" x2="165" y2="157" stroke="currentColor" strokeWidth="1"/>
                      <line x1="100" y1="170" x2="190" y2="172" stroke="currentColor" strokeWidth="1"/>
                    </motion.g>
                    
                    {/* Mail icon states */}
                    <motion.g
                      className="relative"
                      animate={{
                        x: [0, 15, 0],
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Default arrow state */}
                      <motion.g
                        className="group-hover:opacity-0"
                        initial={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <circle cx="240" cy="90" r="12" fill="currentColor" className="text-gray-900"/>
                        <text x="240" y="95" textAnchor="middle" className="text-xs fill-white font-bold">→</text>
                      </motion.g>

                      {/* Sent state with checkmark (shows directly on hover) */}
                      <motion.g
                        className="opacity-0 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <circle cx="240" cy="90" r="12" fill="currentColor" className="text-green-500"/>
                        <motion.path
                          d="M235 90 L238 93 L245 86"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 0 }}
                          whileHover={{
                            pathLength: 1,
                            transition: {
                              duration: 0.5,
                              ease: "easeOut"
                            }
                          }}
                        />
                        <text x="240" y="108" textAnchor="middle" className="text-xs fill-green-600 font-medium">Sent ✓</text>
                      </motion.g>
                    </motion.g>
                  </motion.g>
                </svg>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Voice Input Integration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <VoiceInput size="large" className="mb-8" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}