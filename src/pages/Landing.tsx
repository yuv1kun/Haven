import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Activity, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp,
  ChevronRight,
  AlertTriangle,
  Droplets,
  Flame,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radar,
  Brain,
  Zap,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import HavenLogo from '../components/HavenLogo.tsx';

interface FAQItem {
  question: string;
  answer: string;
}

const Landing: React.FC = () => {
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoControls, setShowVideoControls] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastScrollY = useRef(0);

  const faqItems: FAQItem[] = [
    {
      question: "What is Haven?",
      answer: "Haven is a comprehensive disaster response platform that combines real-time monitoring, predictive analytics, and community engagement to help communities prepare for and respond to emergencies."
    },
    {
      question: "How does the alert system work?",
      answer: "Our alert system uses a network of IoT sensors and AI algorithms to detect potential disasters. When a threat is detected, notifications are sent to relevant authorities and community members through multiple channels."
    },
    {
      question: "Can I use Haven as an individual?",
      answer: "Yes! Haven is designed for both individual users and organizations. Individuals can receive alerts, report incidents, and access emergency resources through our platform."
    },
    {
      question: "What types of disasters does Haven monitor?",
      answer: "Haven currently monitors earthquakes, floods, fires, and other natural disasters. We're constantly expanding our capabilities to cover more types of emergencies."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 0) {
        setIsNavSticky(true);
      } else {
        setIsNavSticky(false);
      }
      
      if (currentScrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Auto-hide video controls after 3 seconds of inactivity
    let timeout: NodeJS.Timeout;
    if (showVideoControls) {
      timeout = setTimeout(() => {
        setShowVideoControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showVideoControls]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.log('Video failed to load, using fallback image');
    setVideoLoaded(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isNavSticky ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <HavenLogo className={`h-12 w-12 ${isNavSticky ? 'text-primary-600' : 'text-white'}`} />
              <span className={`ml-3 text-2xl md:text-3xl font-inter font-bold ${
                isNavSticky ? 'text-gray-900' : 'text-white'
              }`}>
                Haven
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  isNavSticky ? 'text-gray-600' : 'text-white'
                }`}
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/login"
                className={`hover:opacity-75 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isNavSticky ? 'text-gray-600' : 'text-white'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`px-6 py-3 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                  isNavSticky
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-white text-primary-600 hover:bg-gray-100'
                }`}
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            poster="https://images.pexels.com/photos/1250452/pexels-photo-1250452.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          >
            {/* Local Video Source - Primary */}
            <source src="/videos/hero-background.mp4" type="video/mp4" />
            {/* Fallback: Alternative environmental video */}
            <source src="https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          
          {/* Fallback Background Image */}
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/1250452/pexels-photo-1250452.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
            }}
          />
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
          
          {/* Video Controls */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onMouseEnter={() => setShowVideoControls(true)}
            onMouseLeave={() => setShowVideoControls(false)}
          >
            <div className={`absolute bottom-6 right-6 flex space-x-2 transition-opacity duration-300 ${
              showVideoControls ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={toggleVideoPlayback}
                className="p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-200"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleVideoMute}
                className="p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-200"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-6xl font-inter font-bold text-white leading-tight animate-fade-in">
              Empowering Communities Through Smart Disaster Response
            </h1>
            <p className="mt-6 text-xl text-gray-200 max-w-3xl leading-relaxed">
              Haven combines real-time monitoring, predictive analytics, and community engagement to create a comprehensive disaster management platform that saves lives and protects communities.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="btn bg-primary-600 text-white hover:bg-primary-700 text-center px-8 py-4 text-lg font-medium rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Get Started Today
              </Link>
              <a
                href="#features"
                className="btn bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 text-center px-8 py-4 text-lg font-medium rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Learn More
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-8 text-white/80">
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">Trusted by 500+ Organizations</span>
              </div>
              <div className="flex items-center">
                <Users className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">10,000+ Active Users</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                <span className="text-sm font-medium">24/7 Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer transition-opacity duration-300 hover:opacity-75 z-10">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 block font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-inter font-bold text-gray-900">Why Choose Haven?</h2>
            <p className="mt-4 text-xl text-gray-600">
              A comprehensive solution for disaster management and community safety
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Real-time Monitoring</h3>
              <p className="mt-4 text-gray-600">
                Advanced sensor networks provide instant alerts and continuous monitoring of potential hazards
              </p>
            </div>

            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Predictive Analytics</h3>
              <p className="mt-4 text-gray-600">
                AI-powered predictions help identify and prevent disasters before they occur
              </p>
            </div>

            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Community Engagement</h3>
              <p className="mt-4 text-gray-600">
                Empowering communities with tools for reporting and responding to emergencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-inter font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our comprehensive disaster response system in four simple steps
            </p>
          </div>

          <div className="mt-20">
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 transform -translate-y-1/2 z-0"></div>
                
                <div className="relative z-10 grid grid-cols-4 gap-8">
                  {/* Step 1: Detection */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-primary-100 flex items-center justify-center group-hover:border-primary-300 transition-all duration-300 transform group-hover:scale-110">
                        <Radar className="h-10 w-10 text-primary-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Detection</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      Our network of IoT sensors continuously monitors environmental conditions, detecting seismic activity, water levels, and temperature changes in real-time.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">Seismic Sensors</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Water Level</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Temperature</span>
                    </div>
                  </div>

                  {/* Step 2: Analysis */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-secondary-100 flex items-center justify-center group-hover:border-secondary-300 transition-all duration-300 transform group-hover:scale-110">
                        <Brain className="h-10 w-10 text-secondary-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Analysis</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      Advanced AI algorithms process sensor data, historical patterns, and weather conditions to assess threat levels and predict potential disasters.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">Machine Learning</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Pattern Recognition</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">Risk Assessment</span>
                    </div>
                  </div>

                  {/* Step 3: Response */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-warning-100 flex items-center justify-center group-hover:border-warning-300 transition-all duration-300 transform group-hover:scale-110">
                        <Zap className="h-10 w-10 text-warning-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Response</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      Automated alerts are instantly sent to emergency services, local authorities, and affected communities while coordinating available resources for rapid response.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">Instant Alerts</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Emergency Services</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Resource Coordination</span>
                    </div>
                  </div>

                  {/* Step 4: Community */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-success-100 flex items-center justify-center group-hover:border-success-300 transition-all duration-300 transform group-hover:scale-110">
                        <MessageSquare className="h-10 w-10 text-success-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-inter font-semibold text-gray-900">Community</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      Citizens can report incidents, share real-time updates, and access emergency information, creating a collaborative network for enhanced disaster response.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">Citizen Reports</span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Real-time Updates</span>
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">Emergency Info</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-12">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-primary-100 flex items-center justify-center">
                      <Radar className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                  </div>
                  <div className="w-0.5 h-12 bg-primary-200 mx-auto mt-4"></div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-inter font-semibold text-gray-900">Detection</h3>
                  <p className="mt-2 text-gray-600">
                    Our network of IoT sensors continuously monitors environmental conditions, detecting seismic activity, water levels, and temperature changes in real-time.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">Seismic Sensors</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Water Level</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-secondary-100 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-secondary-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                  </div>
                  <div className="w-0.5 h-12 bg-secondary-200 mx-auto mt-4"></div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-inter font-semibold text-gray-900">Analysis</h3>
                  <p className="mt-2 text-gray-600">
                    Advanced AI algorithms process sensor data, historical patterns, and weather conditions to assess threat levels and predict potential disasters.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">Machine Learning</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Pattern Recognition</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-warning-100 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-warning-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                  </div>
                  <div className="w-0.5 h-12 bg-warning-200 mx-auto mt-4"></div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-inter font-semibold text-gray-900">Response</h3>
                  <p className="mt-2 text-gray-600">
                    Automated alerts are instantly sent to emergency services, local authorities, and affected communities while coordinating available resources.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">Instant Alerts</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Emergency Services</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-success-100 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-success-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-success-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-inter font-semibold text-gray-900">Community</h3>
                  <p className="mt-2 text-gray-600">
                    Citizens can report incidents, share real-time updates, and access emergency information, creating a collaborative network for enhanced disaster response.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">Citizen Reports</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Real-time Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <span className="font-medium">See Haven in Action</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Network Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-inter font-bold text-gray-900">Our Sensor Network</h2>
            <p className="mt-4 text-xl text-gray-600">
              Reliable real-time data for accurate disaster prediction and monitoring
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/4558211/pexels-photo-4558211.jpeg"
                  alt="Earthquake Sensor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-red-600 bg-opacity-20 flex items-center justify-center">
                  <AlertTriangle className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-inter font-semibold text-gray-900">Earthquake Sensors</h3>
              <p className="mt-2 text-gray-600">High-sensitivity seismic activity detection with real-time monitoring and early warning capabilities</p>
            </div>

            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/5195490/pexels-photo-5195490.jpeg"
                  alt="Flood Sensors"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                  <Droplets className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-inter font-semibold text-gray-900">Flood Sensors</h3>
              <p className="mt-2 text-gray-600">Advanced water level monitoring systems with predictive flood analysis</p>
            </div>

            <div className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/5159914/pexels-photo-5159914.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Fire Sensors"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-orange-600 bg-opacity-20 flex items-center justify-center">
                  <Flame className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-inter font-semibold text-gray-900">Fire Sensors</h3>
              <p className="mt-2 text-gray-600">Thermal detection systems for early fire warning and spread prediction</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our network of sensors network provides continuous monitoring and early warning capabilities, helping communities stay safe and prepared.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-inter font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600">
              Find answers to common questions about Haven
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                >
                  <span className="text-left font-medium text-gray-900">{item.question}</span>
                  <ChevronRight
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                      activeAccordion === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    activeAccordion === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-inter font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-xl text-gray-600">
              Have questions? We're here to help
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto">
            <form className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                  placeholder="Your message"
                />
              </div>

              <button
                type="submit"
                className="btn bg-primary-600 text-white hover:bg-primary-700 py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <HavenLogo className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-inter font-bold">Haven</span>
              </div>
              <p className="mt-4 text-gray-400">
                Empowering communities through smart disaster response
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contact@haven.org</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Bengaluru, Karnataka</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-primary-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Landing;