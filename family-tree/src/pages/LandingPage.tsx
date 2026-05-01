import { Link } from 'react-router-dom'
import { 
  Users, 
  Shield, 
  Download, 
  Share2, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
              Vanshavali
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#heritage" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Heritage</a>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login">
              <Button size="sm" className="rounded-full px-6 shadow-indigo-200 dark:shadow-indigo-900/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /> Made for Indian Families
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Preserve Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Family Legacy</span> Forever
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
              Build your digital family tree, track your Gotra and Kul heritage, and share your history with generations to come. The only family tree app built specifically for the Indian culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-indigo-500/20 w-full sm:w-auto">
                  Start Your Tree Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 justify-center sm:justify-start mt-2 sm:mt-0">
                <div className="flex -space-x-2">
                  <img src="/avatar-1.png" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 object-cover" alt="User" />
                  <img src="/avatar-2.png" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 object-cover" alt="User" />
                  <img src="/avatar-3.png" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 object-cover" alt="User" />
                </div>
                <span className="font-medium ml-2">Joined by 1,000+ Indian families</span>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-float" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-float">
              <img 
                src="/hero-illustration.png" 
                alt="Family Tree Illustration" 
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Heritage Section */}
      <section id="heritage" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Deeply Rooted in <span className="text-indigo-600">Indian Heritage</span></h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Traditional tools don't understand our culture. We built Vanshavali with features that actually matter to Indian families.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-amber-500" />,
              title: "Gotra & Kul Tracking",
              desc: "Preserve your lineage according to your community's traditions (Rajput, Brahmin, Jain, etc)."
            },
            {
              icon: <MapPin className="w-6 h-6 text-emerald-500" />,
              title: "Native Village (Mool)",
              desc: "Never lose connection to your ancestral village and roots in Bharat."
            },
            {
              icon: <Users className="w-6 h-6 text-indigo-500" />,
              title: "Joint Family Support",
              desc: "Visualize complex joint family structures with ease, from patriarchs to the newest branch."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                <Shield className="w-8 h-8 text-indigo-600 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Private & Secure</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your data is yours. Choose who sees your family secrets.</p>
              </div>
              <div className="p-6 rounded-2xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800/30 mt-8">
                <Share2 className="w-8 h-8 text-pink-600 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Share via WhatsApp</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Invite relatives to add their branches with one click.</p>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                <Download className="w-8 h-8 text-emerald-600 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">High-Res Exports</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Download your tree as a beautiful PDF to print and frame.</p>
              </div>
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 mt-8">
                <Users className="w-8 h-8 text-amber-600 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Real-time Editing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Collaborate with siblings and parents to build the full picture.</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Powerful Tools for Your <span className="text-pink-600">Family History</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Vanshavali provides a sophisticated canvas where you can map relationships, upload old photos, and record the stories of your ancestors. It's more than a tree; it's a living archive.
            </p>
            <ul className="space-y-4">
              {[
                "Unlimited generations and members",
                "Nakshatra and Rashi astrology tracking",
                "Automatic layout with Dagre algorithm",
                "Mobile-first design for all relatives"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 dark:text-slate-400">Choose the plan that fits your family's needs.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4">
          {/* Free Tier */}
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Free</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Perfect for individuals just starting out.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
              <span className="text-slate-500 text-sm">/ forever</span>
            </div>
            <ul className="space-y-4 mb-10">
              {["1 Family Tree", "Up to 15 Members", "Basic View Only", "Mobile Access"].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 text-indigo-500" /> {feat}
                </li>
              ))}
            </ul>
            <Link to="/login" className="block">
              <Button variant="secondary" className="w-full rounded-xl">Get Started</Button>
            </Link>
          </div>
          
          {/* Family Tier */}
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-xl">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Family</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Best for entire family groups.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹149</span>
              <span className="text-slate-500 text-sm">/ month</span>
            </div>
            <ul className="space-y-4 mb-10">
              {["3 Family Trees", "Up to 100 Members", "PDF & Image Export", "Photo Uploads", "WhatsApp Invitations"].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 text-indigo-500" /> {feat}
                </li>
              ))}
            </ul>
            <Link to="/login" className="block">
              <Button className="w-full rounded-xl shadow-lg shadow-indigo-500/20">Upgrade Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 to-pink-600 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start Preserving Your <br />Family History Today</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of Indian families who are digitizing their lineage. It's free to start and takes less than a minute.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg bg-white text-indigo-600 hover:bg-slate-50 border-none">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Vanshavali</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Vanshavali. Built for the modern Indian family.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
