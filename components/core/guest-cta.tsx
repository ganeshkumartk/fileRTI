import { motion } from "framer-motion";
import { ArrowRight, Heart, CheckCircle, MessageCircle, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRTIStore } from "@/hooks/use-rti-store";
import { useEffect, useState } from "react";

// Predefined rotations to avoid hydration issues
const cardRotations = [1.5, -2.1, 0.8, -1.3, 2.2, -0.9];

// RTI Success Stories Data
const successStories = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, MH",
    story: "Got my property documents released in 15 days! The department had been sitting on my file for 3 months.",
    outcome: "Property documents obtained",
    timeframe: "15 days",
    likes: 234,
    comments: 18,
    verified: true,
    avatar: "PS",
    department: "Revenue Dept"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    story: "Filed RTI for my pending scholarship funds. Within 2 weeks, I got a call and my scholarship was processed!",
    outcome: "₹25,000 scholarship released",
    timeframe: "12 days",
    likes: 189,
    comments: 24,
    verified: true,
    avatar: "RK",
    department: "Education Dept"
  },
  {
    id: 3,
    name: "Meena Devi",
    location: "Patna, Bihar",
    story: "My husband's pension was stuck for 8 months. RTI helped me track the file and get it approved.",
    outcome: "Pension approved",
    timeframe: "20 days",
    likes: 156,
    comments: 31,
    verified: true,
    avatar: "MD",
    department: "Pension Office"
  },
  {
    id: 4,
    name: "Arjun Patel",
    location: "Ahmedabad, Gujarat",
    story: "Water connection was promised but delayed for 6 months. RTI revealed the real status and got action.",
    outcome: "Water connection installed",
    timeframe: "18 days",
    likes: 201,
    comments: 12,
    verified: true,
    avatar: "AP",
    department: "Water Board"
  },
  {
    id: 5,
    name: "Lakshmi Reddy",
    location: "Hyderabad, TA",
    story: "Hospital was refusing free treatment under government scheme. RTI brought clarity and I got treatment.",
    outcome: "Free treatment received",
    timeframe: "10 days",
    likes: 278,
    comments: 45,
    verified: true,
    avatar: "LR",
    department: "Health Dept"
  },
  {
    id: 6,
    name: "Suresh Yadav",
    location: "Lucknow, UP",
    story: "Road repair work was incomplete in our area. RTI helped expose the contractor and work resumed.",
    outcome: "Road construction completed",
    timeframe: "25 days",
    likes: 167,
    comments: 22,
    verified: true,
    avatar: "SY",
    department: "PWD"
  }
];

// Story Card Component
const StoryCard = ({ story, index }: { story: typeof successStories[0]; index: number }) => {
  const rotation = cardRotations[story.id % cardRotations.length];
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      rotate: rotation * 0.6 // Increased for more visible rotation
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotate: rotation * 0.8, // Increased for more visible rotation
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -8,
      rotate: rotation * 0.4, // Keep some rotation on hover
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible" // Force animation instead of whileInView for mobile
      whileHover="hover"
      className="w-full"
    >
      <Card className="bg-white backdrop-blur-sm border border-black/20 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl">
        <CardContent className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-black/70">{story.avatar}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-black text-sm truncate">{story.name}</h4>
                  {story.verified && (
                    <CheckCircle className="w-3 h-3 text-black/60 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-black/50">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{story.location}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-black/5 text-black/60 text-xs px-2 py-1 rounded-full border-0">
              {story.department}
            </Badge>
          </div>

          {/* Story Content */}
          <p className="text-sm text-black/80 leading-relaxed mb-4 line-clamp-3">
            "{story.story}"
          </p>

          {/* Outcome */}
          <div className="bg-black/5 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-black/60" />
              <span className="text-sm font-medium text-black/80">Outcome</span>
            </div>
            <p className="text-sm text-black/70">{story.outcome}</p>
            <div className="flex items-center space-x-1 mt-2 text-xs text-black/50">
              <Clock className="w-3 h-3" />
              <span>Resolved in {story.timeframe}</span>
            </div>
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between text-xs text-black/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{story.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{story.comments}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>via FileRTI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function GuestCTA() {
  const { setGuestMode } = useRTIStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleStartComposing = () => {
    setGuestMode(true);
    document.getElementById('composer')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  // Client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if mobile
  useEffect(() => {
    if (!isClient) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isClient]);

  // Auto-scroll for mobile
  useEffect(() => {
    if (!isClient || !isMobile) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex >= Math.ceil(successStories.length / 2) ? 0 : nextIndex;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isClient, isMobile]);

  // Split stories into two rows for desktop
  const row1Stories = successStories.slice(0, 3);
  const row2Stories = successStories.slice(3, 6);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6 tracking-tight leading-tight">
            Real People, Real Results
          </h2>
          <p className="text-base sm:text-lg text-black/60 mb-6 sm:mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            See how FileRTI helped citizens get the information and action they deserved
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-black/20 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-black/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-black/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </motion.div>

        {/* Success Stories - Mobile Vertical Auto-scroll & Desktop Horizontal */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          {/* Mobile: Rotated cards with proper spacing */}
          <div className="lg:hidden px-8 sm:px-12">
            <div className="relative min-h-[700px]">
              {isClient ? (
                // Show 2 cards at a time, stacked vertically with rotations
                <>
                  {Array.from({ length: Math.ceil(successStories.length / 2) }, (_, pageIndex) => (
                    <div 
                      key={`page-${pageIndex}`}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        currentIndex === pageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="space-y-12 py-8">
                        {successStories.slice(pageIndex * 2, pageIndex * 2 + 2).map((story, storyIndex) => (
                          <div key={`mobile-${story.id}`} className="flex justify-center">
                            <div className="w-full max-w-sm">
                              <StoryCard story={story} index={storyIndex} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // Fallback for SSR - show first 2 cards
                <div className="space-y-12 py-8">
                  {successStories.slice(0, 2).map((story, index) => (
                    <div key={`fallback-${story.id}`} className="flex justify-center">
                      <div className="w-full max-w-sm">
                        <StoryCard story={story} index={index} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Progress Indicators */}
            {isClient && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                {Array.from({ length: Math.ceil(successStories.length / 2) }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i 
                        ? 'bg-black/60 w-6' 
                        : 'bg-black/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Horizontal Scrolling Rows (Opposite Directions) */}
          <div className="hidden lg:block space-y-12 py-8">
            {isClient ? (
              <>
                {/* Row 1 - Left to Right */}
                <div className="relative overflow-hidden py-4">
                  <motion.div
                    className="flex space-x-8 pl-8"
                    animate={{ x: [0, -400, 0] }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* Duplicate the row for seamless loop */}
                    {[...row1Stories, ...row1Stories, ...row1Stories].map((story, index) => (
                      <div
                        key={`row1-${story.id}-${index}`}
                        className="flex-shrink-0 w-80"
                      >
                        <StoryCard story={story} index={index} />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Row 2 - Right to Left */}
                <div className="relative overflow-hidden py-4">
                  <motion.div
                    className="flex space-x-8 pr-8"
                    animate={{ x: [-400, 0, -400] }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* Duplicate the row for seamless loop */}
                    {[...row2Stories, ...row2Stories, ...row2Stories].map((story, index) => (
                      <div
                        key={`row2-${story.id}-${index}`}
                        className="flex-shrink-0 w-80"
                      >
                        <StoryCard story={story} index={index} />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-8">
                {successStories.map((story, index) => (
                  <div key={`desktop-fallback-${story.id}`}>
                    <StoryCard story={story} index={index} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 lg:p-16 border border-black/10 max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-4 sm:mb-6 tracking-tight">
              Your RTI Success Story Starts Here
            </h3>
            <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Join hundreds who've used FileRTI to get answers, action, and justice. No registration required.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 sm:space-x-12 mb-8 sm:mb-10">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-light text-black mb-1">247+</div>
                <div className="text-xs sm:text-sm text-black/50 uppercase tracking-wide">Success Stories</div>
              </div>
              <div className="w-px h-8 bg-black/20"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-light text-black mb-1">94%</div>
                <div className="text-xs sm:text-sm text-black/50 uppercase tracking-wide">Success Rate</div>
              </div>
              <div className="w-px h-8 bg-black/20"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-light text-black mb-1">~16 days</div>
                <div className="text-xs sm:text-sm text-black/50 uppercase tracking-wide">Avg. Resolution</div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleStartComposing}
              className="bg-black text-white hover:bg-black/90 h-12 sm:h-14 px-8 sm:px-10 rounded-full font-light text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg"
            >
              Start Your RTI Application
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            
            <p className="text-xs sm:text-sm text-black/40 mt-4 font-light">
              Free • No Registration • Professional Format
            </p>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
} 