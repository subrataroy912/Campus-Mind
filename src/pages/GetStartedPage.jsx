import { Link } from 'react-router';
import { ArrowRight, BookOpen, Users, Target, Zap, Shield } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';
import BrandLogo from '../components/common/BrandLogo.jsx';
import Button from '../components/common/Button.jsx';

const features = [
  {
    icon: BookOpen,
    title: 'Practice Hub',
    description: 'Access curated practice problems, mock tests, and coding challenges to sharpen your skills.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with peers, join study groups, and participate in discussions to learn together.',
  },
  {
    icon: Target,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics, streaks, and achievement badges.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant notifications on assignments, class updates, and community activities.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy controls.',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access a vast collection of study materials, notes, and reference guides.',
  },
];

export default function GetStartedPage() {
  const magneticButtonRef = useRef(null);
  const scrollY = useMotionValue(0);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const floatingY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 20]), { stiffness: 100, damping: 30 });

  // Magnetic button effect
  useEffect(() => {
    const button = magneticButtonRef.current;
    if (!button) return;

    let xTo = 0;
    let yTo = 0;
    let xPos = 0;
    let yPos = 0;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      xTo = x * 0.15;
      yTo = y * 0.15;
    };

    const handleMouseLeave = () => {
      xTo = 0;
      yTo = 0;
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      xPos += (xTo - xPos) * 0.15;
      yPos += (yTo - yPos) * 0.15;
      if (Math.abs(xPos) > 0.01 || Math.abs(yPos) > 0.01 || Math.abs(xTo) > 0.01 || Math.abs(yTo) > 0.01) {
        button.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Scroll listener for parallax
  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-linear-to-br from-canvas via-surface to-canvas relative overflow-x-hidden">
      {/* Fixed Background Video Layer - Z-0 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{
            opacity: 0.8,
            filter: 'grayscale(100%) contrast(1.1) brightness(0.6)'
          }}
        >
          <source src="/hero_bg_animation_hand.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-text-heading/10 via-transparent to-text-heading/10" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,color-mix(in_srgb,var(--color-text-heading)_15%,transparent)_100%)]" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-linear-to-br from-primary/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            borderRadius: ["50%", "30%", "50%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-linear-to-br from-primary/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-linear-to-br from-primary/15 to-primary/15 rounded-full blur-2xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Scrollable Content - Z-10 */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-canvas/50 via-transparent to-canvas/50" />

          {/* Parallax floating elements in hero */}
          <motion.div
            style={{ y: floatingY }}
            className="absolute top-1/4 right-10 w-40 h-40 bg-linear-to-br from-primary/10 to-primary/10 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 1 }}
          />
          <motion.div
            style={{ y: floatingY }}
            className="absolute bottom-1/4 left-10 w-24 h-24 bg-linear-to-br from-primary/10 to-primary/10 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2, duration: 1 }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <BrandLogo className="mx-auto mb-8" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.03em] leading-[0.9] text-text-heading"
              style={{ fontFamily: '"Calisto MT", "Book Antiqua", Georgia, serif', fontWeight: 500, letterSpacing: '-0.03em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Welcome to <span className="bg-linear-to-r from-primary to-primary bg-clip-text text-transparent">CampusMind</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg sm:text-xl text-text-main max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: '"Calisto MT", "Book Antiqua", Georgia, serif', letterSpacing: '-0.01em', lineHeight: 1.7 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Your all-in-one platform for academic excellence. Practice, collaborate, and grow with a community of learners.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link to="/dashboard">
                <Button
                  ref={magneticButtonRef}
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 text-lg flex items-center gap-2 magnetic-btn relative overflow-hidden group"
                  style={{ background: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'var(--color-surface)' }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-surface/10 scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button
                  ref={magneticButtonRef}
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 text-lg flex items-center gap-2 magnetic-btn relative overflow-hidden group"
                  style={{ background: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'var(--color-surface)' }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-surface/10 scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                  Sign In
                </Button>
              </Link>

            </motion.div>

            {/* Scroll indicator - smaller and closer to buttons */}
            <motion.div
              className="mt-8 flex flex-col items-center gap-1.5 text-text-muted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                className="w-5 h-9 border-2 border-current rounded-full flex justify-center pt-2 group"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="w-1 h-1 bg-current rounded-full"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                />
              </motion.div>
              <motion.span
                className="text-[10px] font-medium tracking-wider uppercase text-text-muted"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Scroll
              </motion.span>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.span
                className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                Key Features
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-text-heading tracking-[-0.02em] leading-[1.1]"
                style={{ fontFamily: '"Calisto MT", "Book Antiqua", Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' }}>
                Everything you need to <span className="text-primary">succeed</span>
              </h2>
              <p className="mt-4 text-lg text-text-main max-w-2xl mx-auto">
                Powerful features designed to help you learn faster and achieve your academic goals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-6 bg-surface rounded-2xl shadow-sm border border-border hover:shadow-xl hover:border-border transition-all duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-canvas to-canvas rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-text-heading mb-2" style={{ fontFamily: '"Calisto MT", "Book Antiqua", Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {feature.title}
                  </h3>
                  <p className="text-text-main leading-relaxed">{feature.description}</p>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/10 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas" />
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              className="relative bg-gradient-to-r from-primary to-primary rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"
                animate={{ x: [0, -60], y: [0, -60] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Floating sparkles */}
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-surface/50 rounded-full"
                  style={{
                    top: `${15 + i * 15}%`,
                    left: `${10 + i * 18}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}

              <div className="relative z-10">
                <motion.h2
                  className="text-3xl sm:text-4xl font-semibold text-surface mb-4"
                  style={{ fontFamily: '"Calisto MT", "Book Antiqua", Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Ready to start your journey?
                </motion.h2>
                <motion.p
                  className="text-canvas text-lg mb-8 max-w-2xl mx-auto"
                  style={{ fontFamily: '"Calisto MT", "Book Antiqua", Georgia, serif', letterSpacing: '-0.01em', lineHeight: 1.7 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Join thousands of students who are already improving their skills with CampusMind.
                  Create your free account today and unlock your potential.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/auth/register">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-3 text-lg bg-surface text-primary hover:bg-canvas flex items-center gap-2 group relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Create Free Account</span>
                      <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
                      <motion.span
                        className="absolute inset-0 bg-primary scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 0 }}
                      />
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-3 text-lg border-surface text-surface hover:bg-surface/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Already have an account? Sign In
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-transparent text-text-main py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <BrandLogo className="mb-4" />
                <p className="text-text-main max-w-xs">
                  CampusMind - Empowering students to achieve academic excellence through
                  practice, collaboration, and smart learning tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-heading mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/practics" className="hover:text-primary transition-colors text-text-main">Practice Hub</Link></li>
                  <li><Link to="/dashboard" className="hover:text-primary transition-colors text-text-main">Dashboard</Link></li>
                  <li><Link to="/dashboard/community" className="hover:text-primary transition-colors text-text-main">Community</Link></li>
                  <li><Link to="/profile" className="hover:text-primary transition-colors text-text-main">Profile</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-heading mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-primary transition-colors text-text-main">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors text-text-main">Contact Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors text-text-main">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors text-text-main">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm">
              <p className="text-text-muted">© 2027 CampusMind. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}