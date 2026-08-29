import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Target, Zap, Shield } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo.jsx';
import Button from '../components/common/Button.jsx';

export default function GetStartedPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-purple-100/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BrandLogo className="mx-auto mb-8" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CampusMind</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one platform for academic excellence. Practice, collaborate, and grow with a community of learners.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg flex items-center gap-2">
                Get Started Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Cancel anytime • 14-day free trial
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to <span className="text-indigo-600">succeed</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you learn faster and achieve your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to start your journey?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already improving their skills with CampusMind. 
                Create your free account today and unlock your potential.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/register">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="w-full sm:w-auto px-8 py-3 text-lg bg-white text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                  >
                    Create Free Account
                    <ArrowRight size={20} className="text-white" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto px-8 py-3 text-lg border-white text-white hover:bg-white/10"
                  >
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <BrandLogo className="mb-4" />
              <p className="text-gray-500 max-w-xs">
                CampusMind - Empowering students to achieve academic excellence through 
                practice, collaboration, and smart learning tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/practics" className="hover:text-white transition-colors">Practice Hub</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/dashboard/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2027 CampusMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}