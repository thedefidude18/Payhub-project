import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Globe, Shield, MessageSquare, CreditCard, BarChart3, Users, Crown, Star, CheckCircle } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Globe,
      title: "Custom Subdomains",
      description: "Get your own branded subdomain like yourname.payhub.com. Build your professional presence with a custom URL.",
      color: "bg-primary",
    },
    {
      icon: Shield,
      title: "Secure Previews",
      description: "Share watermarked previews that clients can't download until payment. Support for video, audio, images, and PDFs.",
      color: "bg-orange-500",
    },
    {
      icon: MessageSquare,
      title: "Timeline Feedback",
      description: "Clients can comment on specific moments in videos, sections in documents, or areas in images for precise feedback.",
      color: "bg-blue-500",
    },
    {
      icon: CreditCard,
      title: "Automated Payments",
      description: "Secure payment processing with Stripe. Automatic file delivery after payment confirmation with commission tracking.",
      color: "bg-green-600",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track preview views, client engagement, drop-off points, and conversion rates to optimize your sales process.",
      color: "bg-yellow-500",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize projects, manage client communications, and track payment status all from your personalized dashboard.",
      color: "bg-slate-600",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Upload Your Work",
      description: "Upload your files and create secure previews with watermarks or time limits.",
      color: "bg-primary",
    },
    {
      number: 2,
      title: "Share Preview Link",
      description: "Send your custom subdomain link to clients for secure preview access.",
      color: "bg-orange-500",
    },
    {
      number: 3,
      title: "Get Feedback & Approval",
      description: "Clients review, comment, and approve your work through the timeline interface.",
      color: "bg-blue-500",
    },
    {
      number: 4,
      title: "Receive Payment",
      description: "Automatic payment processing and secure file delivery via email.",
      color: "bg-green-600",
    },
  ];

  const testimonials = [
    {
      content: "PayHub transformed how I share my video projects. The timeline commenting feature is a game-changer for client feedback!",
      author: "Sarah Chen",
      role: "Video Editor",
      rating: 5,
    },
    {
      content: "The secure payment system gives me peace of mind. My clients love the professional experience, and I get paid faster.",
      author: "Marcus Rodriguez",
      role: "Graphic Designer",
      rating: 5,
    },
    {
      content: "Having my own branded subdomain makes me look so much more professional. My client conversion rate has doubled!",
      author: "Emma Thompson",
      role: "Music Producer",
      rating: 5,
    },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Custom subdomain",
        "5 projects per month",
        "Basic analytics",
        "10% commission",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing freelancers",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Custom branding",
        "5% commission",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and agencies",
      features: [
        "White-label solution",
        "Team management",
        "API access",
        "Custom commission rates",
        "Dedicated support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-primary rounded-lg p-2 mr-3">
                  <Play className="text-white h-6 w-6" />
                </div>
                <span className="font-bold text-2xl text-slate-800">PayHub</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">Features</a>
                <a href="#how-it-works" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">How It Works</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">Pricing</a>
                <a href="/api/login" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">Sign In</a>
                <Button>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-slate-800 leading-tight mb-6">
                Secure File Previews <span className="text-primary">Made Simple</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Share your creative work securely with clients. Get approval, receive payment, and deliver files automatically. 
                Perfect for freelancers, designers, and digital creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg">
                  Start Your Subdomain
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-8 mt-12">
                <div className="text-center">
                  <div className="font-bold text-2xl text-slate-800">1000+</div>
                  <div className="text-sm text-slate-600">Active Freelancers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-slate-800">$2M+</div>
                  <div className="text-sm text-slate-600">Processed Safely</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-slate-800">99.9%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800" 
                  alt="PayHub dashboard interface showing file preview and payment workflow" 
                  className="rounded-2xl shadow-2xl" 
                />
                
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 animate-bounce-gentle">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-800">Payment Received</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-blue-500 h-4 w-4" />
                    <span className="text-sm font-medium text-slate-800">12 views today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl md:text-4xl text-slate-800 mb-4">
              Everything You Need to Sell Securely
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From custom subdomains to secure payments, PayHub provides all the tools freelancers need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className={`${feature.color} rounded-lg w-12 h-12 flex items-center justify-center mb-6`}>
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl md:text-4xl text-slate-800 mb-4">
              Simple Process, Powerful Results
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From upload to payment in just four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`${step.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-white font-bold text-xl">{step.number}</span>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-4">{step.title}</h3>
                <p className="text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SuperFreelancer Tier */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-12 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-6 py-3 mb-6">
                <Crown className="text-yellow-300 mr-2 h-5 w-5" />
                <span className="font-semibold">SuperFreelancer Tier</span>
              </div>
              
              <h2 className="font-bold text-3xl md:text-4xl mb-6">
                Unlock Premium Benefits
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join our elite SuperFreelancer program and get verified badges, priority listing, reduced commissions, and exclusive beta access.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                    <Badge className="text-3xl text-yellow-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Verified Badge</h3>
                  <p className="opacity-80">Stand out with official verification</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                    <BarChart3 className="text-3xl text-yellow-300 mx-auto h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Advanced Analytics</h3>
                  <p className="opacity-80">Deep insights into client behavior</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                    <CreditCard className="text-3xl text-yellow-300 mx-auto h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Reduced Commissions</h3>
                  <p className="opacity-80">Keep more of what you earn</p>
                </div>
              </div>

              <Button variant="secondary" size="lg">
                Apply for SuperFreelancer Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl md:text-4xl text-slate-800 mb-4">
              Trusted by Freelancers Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what our community has to say about PayHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.author}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl md:text-4xl text-slate-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Only pay when you earn. No hidden fees, no monthly subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="font-bold text-2xl text-slate-800 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-slate-800 mb-4">
                      {plan.price !== "Custom" && <span className="text-lg">$</span>}
                      {plan.price}
                      <span className="text-lg text-slate-600">{plan.period}</span>
                    </div>
                    <p className="text-slate-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-6">
            Ready to Secure Your Creative Process?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers who trust PayHub to protect their work and streamline their payment process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-green-700">
              Start Your Free Account
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-800">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm opacity-75 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-primary rounded-lg p-2 mr-3">
                  <Play className="text-white h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-slate-800">PayHub</span>
              </div>
              <p className="text-slate-600 mb-4">
                Secure file preview and payment platform for creative professionals.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Security</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Tutorials</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors duration-200">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-slate-600">
              © 2024 PayHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
