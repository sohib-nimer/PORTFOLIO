/*
ULTIMATE PORTFOLIO - سفاح Edition كامل
*/

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Menu, X, Mail, Phone, MapPin, Code, Briefcase,
  GraduationCap, User, DownloadCloud, Mic, MicOff,
  Star, Award, Zap, Github, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { init, sendForm } from '@emailjs/browser';

// Custom Hooks
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => 
    localStorage.getItem('theme') === 'dark' || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return [isDark, setIsDark];
};

const useScrollSpy = (sections) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5, rootMargin: '-50px 0px -50% 0px' });

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return activeSection;
};

const useMagneticCursor = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const magneticElements = document.querySelectorAll('.magnetic');
      magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          const x = (e.clientX - centerX) * force * 0.3;
          const y = (e.clientY - centerY) * force * 0.3;
          el.style.transform = `translate(${x}px, ${y}px)`;
        } else {
          el.style.transform = 'translate(0, 0)';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
};

const useEasterEggs = () => {
  const [secretMode, setSecretMode] = useState(false);

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let currentKeys = [];

    const handleKeyDown = (e) => {
      currentKeys = [...currentKeys.slice(-9), e.code];
      
      if (JSON.stringify(currentKeys) === JSON.stringify(konamiCode)) {
        setSecretMode(true);
        setTimeout(() => setSecretMode(false), 10000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return secretMode;
};

const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);

  const unlock = useCallback((name) => {
    setAchievements(prev => {
      if (prev.find(a => a.name === name)) return prev;
      const newAchievement = { name, date: new Date(), id: Date.now() };
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Achievement Unlocked!', {
          body: name,
          icon: '/icon.png'
        });
      }
      
      return [...prev, newAchievement];
    });
  }, []);

  return { achievements, unlock };
};

// Particles Background Component
const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // You can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    await engine;
  }, []);

  return (
    <div className="particles-container">
      {/* Fallback particles effect using CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Live Metrics Component
const LiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    visitors: 1247,
    responseTime: '28ms',
    uptime: '99.9%'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        visitors: prev.visitors + Math.floor(Math.random() * 3),
        responseTime: `${20 + Math.floor(Math.random() * 20)}ms`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50 bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 text-xs"
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap size={14} className="text-red-500" />
        <span className="font-semibold">Live Metrics</span>
      </div>
      <div>👥 Visitors: {metrics.visitors}</div>
      <div>⚡ Response: {metrics.responseTime}</div>
      <div>🟢 Uptime: {metrics.uptime}</div>
    </motion.div>
  );
};

// Achievement Notification
const AchievementNotification = ({ achievement, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-600 to-red-400 text-white p-4 rounded-lg shadow-xl"
  >
    <div className="flex items-center gap-3">
      <Award className="text-yellow-300" />
      <div>
        <div className="font-bold">Achievement Unlocked!</div>
        <div>{achievement.name}</div>
      </div>
      <button onClick={onClose} className="ml-2">✕</button>
    </div>
  </motion.div>
);

// Main Component
export default function UltimatePortfolio() {
  const [isDark, setIsDark] = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeSection = useScrollSpy(['home', 'about', 'projects', 'skills', 'experience', 'contact']);
  const secretMode = useEasterEggs();
  const { achievements, unlock } = useAchievements();
  const [showAchievement, setShowAchievement] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  useMagneticCursor();

  // Skills & Experience Data
  const skills = {
    frontend: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Framer Motion'],
    backend: ['Node.js', 'ASP.NET Core', 'Express.js', 'Entity Framework'],
    databases: ['SQL Server', 'MongoDB', 'PostgreSQL'],
    tools: ['Git', 'Docker', 'AWS', 'Vite', 'Webpack']
  };

  const experiences = [
    {
      company: 'Image Technologies (ITEC)',
      role: 'Software Developer',
      period: '2025 - Present',
      description: 'Specializing in React, TypeScript, and full-stack development. Building dynamic, scalable solutions.'
    },
    {
      company: 'CSC Beyond',
      role: 'Web Developer',
      period: '2023 - 2024',
      description: 'Managed web development projects for clients, improving user engagement and performance.'
    }
  ];

  // Sample projects data
  const projects = [
   
    {
      id: 2,
      name: 'Sound2Emoji',
      description: 'Realtime sound-to-emoji translator using machine learning in the browser.',
      technologies: ['React', 'TensorFlow.js', 'Web Audio API'],
      githubUrl: 'https://github.com/sohibnimer/sound2emoji',
      liveUrl: 'https://sound2emoji.app',
      stars: 42,
      updated: '2024-01-10'
    },
    {
      id: 3,
      name: 'Portfolio v3',
      description: 'This interactive portfolio website with advanced animations and 3D effects.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'Tailwind'],
      githubUrl: 'https://github.com/sohibnimer/portfolio',
      liveUrl: '#',
      stars: 18,
      updated: '2024-01-20'
    }
  ];

  // Contact Form
  const formRef = useRef();
  useEffect(() => {
    const user = import.meta.env.VITE_EMAILJS_USER;
    if (user) init(user);
  }, []);

  const handleContact = (e) => {
    e.preventDefault();
    const service = import.meta.env.VITE_EMAILJS_SERVICE;
    const template = import.meta.env.VITE_EMAILJS_TEMPLATE;
    
    if (service && template) {
      sendForm(service, template, formRef.current)
        .then(() => {
          alert('Message sent successfully!');
          e.target.reset();
          unlock('First Contact');
        })
        .catch(err => alert('Error: ' + err.text));
    } else {
      alert('Email service not configured. Please check your environment variables.');
    }
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    unlock(`Visited ${id.charAt(0).toUpperCase() + id.slice(1)}`);
  };

  // Voice recognition effect
  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      
      // Voice commands
      if (text.toLowerCase().includes('go to projects')) scrollToSection('projects');
      if (text.toLowerCase().includes('go to about')) scrollToSection('about');
      if (text.toLowerCase().includes('go to contact')) scrollToSection('contact');
      if (text.toLowerCase().includes('toggle theme')) setIsDark(prev => !prev);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();

    return () => recognition.stop();
  }, [isListening]);

  // Auto-unlock achievements
  useEffect(() => {
    unlock('Portfolio Explorer');
    setTimeout(() => unlock('Early Visitor'), 5000);
  }, [unlock]);

  useEffect(() => {
    if (achievements.length > 0 && !showAchievement) {
      setShowAchievement(achievements[achievements.length - 1]);
      const timer = setTimeout(() => setShowAchievement(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [achievements, showAchievement]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-black text-white' 
        : 'bg-[#fafafa] text-[#374151]'
    } ${secretMode ? 'secret-mode' : ''}`}>
      
      {/* Special Effects */}
      {secretMode && <div className="secret-overlay"></div>}
      <ParticlesBackground />
      
      {/* Live Metrics */}

     

      {/* Navigation */}
      <nav className={`fixed w-full z-50 backdrop-blur-sm border-b transition-all ${
        isDark 
          ? 'bg-black/90 border-red-900/30' 
          : 'bg-white/90 border-[#e5e7eb]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.h1 
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-red-600 magnetic"
              >
                SN
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDark(!isDark)}
                className={`text-sm px-3 py-1 rounded-md border transition-all magnetic ${
                  isDark 
                    ? 'border-red-900/30 hover:border-red-600' 
                    : 'border-[#e5e7eb] hover:border-red-600'
                }`}
              >
                {isDark ? '🌙 Dark' : '☀️ Light'}
              </motion.button>
              
              {/* Voice Control Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsListening(!isListening)}
                className={`p-2 rounded-full magnetic ${
                  isListening 
                    ? 'bg-red-600 text-white' 
                    : isDark ? 'bg-red-900/30' : 'bg-red-100'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </motion.button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {['home', 'about', 'projects', 'skills', 'experience', 'contact'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ y: -2 }}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize px-3 py-2 text-sm font-medium transition-all magnetic ${
                    activeSection === item
                      ? 'text-red-600 border-b-2 border-red-600'
                      : isDark 
                        ? 'text-gray-400 hover:text-red-600' 
                        : 'text-[#6b7280] hover:text-red-600'
                  }`}
                >
                  {item}
                </motion.button>
              ))}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/SohibNimerCV.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-all magnetic"
              >
                <DownloadCloud size={16} />
                Download CV
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-red-600' 
                    : 'text-[#374151] hover:text-red-600'
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${
                isDark 
                  ? 'bg-black/95 border-t border-red-900/30' 
                  : 'bg-white/95 border-t border-[#e5e7eb]'
              }`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['home', 'about', 'projects', 'skills', 'experience', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`capitalize block w-full text-left px-3 py-2 text-base font-medium transition-colors ${
                      isDark 
                        ? 'text-gray-300 hover:text-red-600' 
                        : 'text-[#374151] hover:text-red-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Voice Recognition Transcript */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-full text-sm"
        >
          🎤 Listening... {transcript}
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
          isDark 
            ? 'from-red-900/10 to-transparent' 
            : 'from-red-50 to-transparent'
        }`}></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-3xl"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
          >
            Sohib Nimer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-xl md:text-3xl mb-6 ${
              isDark ? 'text-gray-300' : 'text-[#6b7280]'
            }`}
          >
            Full-Stack Developer — React · Node · ASP.NET · SQL
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`text-lg mb-8 max-w-2xl mx-auto ${
              isDark ? 'text-gray-400' : 'text-[#6b7280]'
            }`}
          >
            Building the future with code • Interactive experiences • Cutting-edge technology
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
              className="px-8 py-4 rounded-full bg-red-600 text-white hover:bg-red-700 font-semibold shadow-lg transition-all magnetic"
            >
              🚀 View Projects
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className={`px-8 py-4 rounded-full border-2 border-red-600 font-semibold transition-all magnetic ${
                isDark 
                  ? 'text-white hover:bg-red-600' 
                  : 'text-red-600 hover:bg-red-600 hover:text-white'
              }`}
            >
              💬 Contact Me
            </motion.a>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className={`mt-12 grid grid-cols-3 gap-8 text-center ${
              isDark ? 'text-gray-400' : 'text-[#6b7280]'
            }`}
          >
            <div>
              <div className="text-2xl font-bold text-red-600">50+</div>
              <div className="text-sm">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">3+</div>
              <div className="text-sm">Years XP</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">99%</div>
              <div className="text-sm">Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <User className="text-red-600" size={32} />
            <h2 className="text-4xl font-bold">About Me</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl border-2 ${
                isDark 
                  ? 'bg-black/50 border-red-900/20' 
                  : 'bg-white border-[#e5e7eb]'
              }`}
            >
              <h3 className="text-2xl font-bold text-red-600 mb-4">The Developer</h3>
              <p className={`text-lg leading-relaxed mb-6 ${
                isDark ? 'text-gray-300' : 'text-[#4b5563]'
              }`}>
                I don't just write code—I craft experiences. With expertise in modern 
                web technologies and a passion for innovation, I build applications 
                that are not only functional but unforgettable.
              </p>
              <div className="flex gap-4 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isDark 
                      ? 'bg-red-900/30 text-red-400' 
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  🎯 Problem Solver
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isDark 
                      ? 'bg-red-900/30 text-red-400' 
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  ⚡ Fast Learner
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isDark 
                      ? 'bg-red-900/30 text-red-400' 
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  🔥 Passionate
                </motion.div>
              </div>
            </motion.div>

            <div className="grid gap-6">
              {[
                { icon: GraduationCap, title: 'Education', desc: 'Computing Smart Device — Tafila Technical University (2019-2024)' },
                { icon: MapPin, title: 'Location', desc: 'Amman, Jordan' },
                { icon: User, title: 'Personal', desc: 'DOB: 09/29/2000 • Jordanian' },
                { icon: Award, title: 'Achievements', desc: `${achievements.length} Unlocked` }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isDark 
                      ? 'bg-black/50 border-red-900/20 hover:border-red-600' 
                      : 'bg-white border-[#e5e7eb] hover:border-red-600'
                  }`}
                >
                  <item.icon className="text-red-600 mb-3" size={24} />
                  <h4 className="font-semibold text-red-600 mb-2">{item.title}</h4>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-[#6b7280]'
                  }`}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-20 px-4 ${
        isDark ? 'bg-gradient-to-b from-transparent to-red-900/5' : 'bg-gradient-to-b from-transparent to-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <Code className="text-red-600" size={32} />
            <h2 className="text-4xl font-bold">Projects</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-black/50 border-red-900/20 hover:border-red-600' 
                    : 'bg-white border-[#e5e7eb] hover:border-red-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-600">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Star size={14} />
                      {project.stars}
                    </span>
                  </div>
                </div>
                
                <p className={`mb-4 ${
                  isDark ? 'text-gray-400' : 'text-[#6b7280]'
                }`}>
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2 py-1 rounded-full text-xs ${
                        isDark 
                          ? 'bg-red-900/30 text-red-400' 
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-all ${
                        isDark 
                          ? 'bg-gray-800 hover:bg-gray-700' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Github size={16} />
                    </a>
                    {project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-all ${
                          isDark 
                            ? 'bg-gray-800 hover:bg-gray-700' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Updated {project.updated}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <Code className="text-red-600" size={32} />
            <h2 className="text-4xl font-bold">Skills</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skills).map(([category, items], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 ${
                  isDark 
                    ? 'bg-black/50 border-red-900/20' 
                    : 'bg-white border-[#e5e7eb]'
                }`}
              >
                <h3 className="text-xl font-bold text-red-600 mb-4 capitalize">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isDark 
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={`py-20 px-4 ${
        isDark ? 'bg-gradient-to-b from-transparent to-red-900/5' : 'bg-gradient-to-b from-transparent to-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <Briefcase className="text-red-600" size={32} />
            <h2 className="text-4xl font-bold">Experience</h2>
          </motion.div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ x: 5 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isDark 
                    ? 'bg-black/50 border-red-900/20 hover:border-red-600' 
                    : 'bg-white border-[#e5e7eb] hover:border-red-600'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-red-600">{exp.role}</h3>
                    <p className={`text-lg ${
                      isDark ? 'text-gray-300' : 'text-[#6b7280]'
                    }`}>
                      {exp.company}
                    </p>
                  </div>
                  <div className={`text-sm mt-2 sm:mt-0 ${
                    isDark ? 'text-gray-400' : 'text-[#9ca3af]'
                  }`}>
                    {exp.period}
                  </div>
                </div>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-[#6b7280]'
                }`}>
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <Mail className="text-red-600" size={32} />
            <h2 className="text-4xl font-bold">Get In Touch</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`p-8 rounded-2xl border-2 ${
              isDark 
                ? 'bg-black/50 border-red-900/20' 
                : 'bg-white border-[#e5e7eb]'
            }`}
          >
            <form
              ref={formRef}
              onSubmit={handleContact}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-[#374151]'
                }`}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  className={`w-full p-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-black/50 border-red-900/20 text-white' 
                      : 'bg-gray-50 border-[#e5e7eb] text-[#374151]'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-[#374151]'
                }`}>
                  Your Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className={`w-full p-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-black/50 border-red-900/20 text-white' 
                      : 'bg-gray-50 border-[#e5e7eb] text-[#374151]'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-[#374151]'
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  className={`w-full p-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-black/50 border-red-900/20 text-white' 
                      : 'bg-gray-50 border-[#e5e7eb] text-[#374151]'
                  }`}
                  placeholder="Enter subject"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-[#374151]'
                }`}>
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className={`w-full p-3 rounded-lg border-2 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-black/50 border-red-900/20 text-white' 
                      : 'bg-gray-50 border-[#e5e7eb] text-[#374151]'
                  }`}
                  placeholder="Enter your message"
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="md:col-span-2 px-8 py-4 rounded-full bg-red-600 text-white font-semibold text-lg transition-all hover:bg-red-700 hover:shadow-lg magnetic"
              >
                Send Message
              </motion.button>
            </form>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.a
                href="mailto:zacksohib6@gmail.com"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ y: -3 }}
                className={`flex items-center gap-4 p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  isDark 
                    ? 'border-red-900/20 hover:border-red-600 hover:bg-red-900/10' 
                    : 'border-[#e5e7eb] hover:border-red-600 hover:bg-red-50'
                }`}
              >
                <Mail className="text-red-600" size={24} />
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-[#6b7280]'
                  }`}>Email</p>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-[#374151]'
                  }`}>zacksohib6@gmail.com</p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+962782333288"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ y: -3 }}
                className={`flex items-center gap-4 p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  isDark 
                    ? 'border-red-900/20 hover:border-red-600 hover:bg-red-900/10' 
                    : 'border-[#e5e7eb] hover:border-red-600 hover:bg-red-50'
                }`}
              >
                <Phone className="text-red-600" size={24} />
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-[#6b7280]'
                  }`}>Phone</p>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-[#374151]'
                  }`}>+962 78 233 3288</p>
                </div>
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ y: -3 }}
                className={`flex items-center gap-4 p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  isDark 
                    ? 'border-red-900/20 hover:border-red-600 hover:bg-red-900/10' 
                    : 'border-[#e5e7eb] hover:border-red-600 hover:bg-red-50'
                }`}
              >
                <MapPin className="text-red-600" size={24} />
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-[#6b7280]'
                  }`}>Location</p>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-[#374151]'
                  }`}>Amman, Jordan</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${
        isDark ? 'border-red-900/10' : 'border-[#e5e7eb]'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <div className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-[#6b7280]'
          }`}>
            © {new Date().getFullYear()} Sohib Nimer • Built with React + Tailwind + Framer Motion
          </div>
          <div className={`text-xs mt-2 ${
            isDark ? 'text-gray-500' : 'text-[#9ca3af]'
          }`}>
            Crafted with ❤️ and way too much coffee
          </div>
        </motion.div>
      </footer>

      <style jsx global>{`
        .secret-mode {
          background: linear-gradient(45deg, #ff0000, #0000ff, #00ff00, #ffff00);
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }
        
        .secret-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, transparent 20%, black 70%);
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: overlay;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .magnetic {
          transition: transform 0.3s ease;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </div>
  );
}