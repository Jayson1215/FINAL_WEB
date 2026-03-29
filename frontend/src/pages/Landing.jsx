import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serviceService } from '../services/serviceService';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [dbServices, setDbServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup stale booking intents (older than 30 minutes)
  useEffect(() => {
    const bookingIntent = localStorage.getItem('bookingIntent');
    if (bookingIntent) {
      try {
        const { timestamp } = JSON.parse(bookingIntent);
        const now = Date.now();
        const thirtyMinutesInMs = 30 * 60 * 1000;
        
        // If intent is older than 30 minutes, clear it
        if (now - timestamp > thirtyMinutesInMs) {
          localStorage.removeItem('bookingIntent');
        }
      } catch (err) {
        // If parsing fails, remove it
        localStorage.removeItem('bookingIntent');
      }
    }
  }, []);

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Use public endpoint for landing page instead of admin endpoint
      const response = await serviceService.getServices();
      setDbServices(response.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setDbServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleBookNow = (serviceId, serviceName) => {
    if (user) {
      // Already logged in - go directly to booking
      navigate(`/client/booking/${serviceId}`);
    } else {
      // Not logged in - save intent and redirect to signup
      localStorage.setItem('bookingIntent', JSON.stringify({
        serviceId,
        serviceName,
        timestamp: Date.now()
      }));
      navigate('/register?redirect=booking');
    }
  };

  const features = [
    {
      title: 'Premium Quality',
      description: 'Professional equipment and expert photographers for stunning results.',
      icon: '📸'
    },
    {
      title: 'Easy Booking',
      description: 'Book your preferred date and time online with our simple scheduling system.',
      icon: '📅'
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options with secure transaction processing.',
      icon: '🔒'
    }
  ];

  const services = [
    {
      title: 'Portrait Photography',
      description: 'Capturing Your Perfect Moments',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80'
    },
    {
      title: 'Wedding Photography',
      description: 'Timeless Wedding Photography',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'
    },
    {
      title: 'Creative Portraits',
      description: 'Creative Portrait Sessions',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80'
    },
    {
      title: 'Event Coverage',
      description: 'Stunning Event Coverage',
      image: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1920&q=80'
    },
    {
      title: 'Product Photography',
      description: 'Product Photography Excellence',
      image: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=1920&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white bg-opacity-95 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-display font-bold text-black">LIGHT</div>
          </div>
          <div className="flex gap-8 items-center">
            <Link to="/" className="text-black font-semibold hover:text-gray-600 transition">
              Home
            </Link>
            <a href="#portfolio" className="text-gray-700 hover:text-gray-600 transition">
              Portfolio
            </a>
            <a href="#services" className="text-gray-700 hover:text-gray-600 transition">
              Services
            </a>
            <Link to="/login" className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 border border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white opacity-50"></div>
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"
            style={{ transform: `translateY(${-scrollY * 0.5}px)` }}
          ></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full">
            <span className="text-gray-800 text-sm font-semibold uppercase tracking-widest">Welcome to LIGHT Studio</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-display font-bold text-black mb-6 leading-tight">
            Capturing Your Perfect Moments
          </h1>

          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional photography services for portraits, events, products, and more. Let us capture your special moments with our expert approach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-gray-400/50 transition-all duration-300 text-lg"
            >
              Book a Session
            </Link>
            <a
              href="#portfolio"
              className="px-8 py-4 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300 text-lg"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-300 rounded-lg p-8 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-display font-bold text-black mb-3 group-hover:text-gray-700 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section id="portfolio" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-display font-bold text-black mb-4">Our Portfolio</h2>
            <p className="text-xl text-gray-700">Explore our diverse collection of professional photography work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg h-64 cursor-pointer"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-200">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-gray-400/50 transition-all duration-300"
            >
              View Full Portfolio →
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section with Prices */}
      <section id="services" className="py-20 px-6 bg-gray-50 border-y border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-display font-bold text-black mb-4">Our Services</h2>
            <p className="text-xl text-gray-700">Professional photography packages tailored to your needs</p>
          </div>

          {loadingServices ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600 text-lg">Loading services...</div>
            </div>
          ) : dbServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbServices.map((service) => (
                <div 
                  key={service.id} 
                  className="group bg-white border border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 hover:shadow-lg transition-all duration-300"
                >
                  {/* Service Card */}
                  <div className="p-8">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-black mb-2">{service.name}</h3>
                        <p className="text-sm text-gray-600 uppercase tracking-widest">{service.category}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6 min-h-12">{service.description}</p>

                    {/* Service Details */}
                    <div className="mb-6 space-y-3 pb-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Duration:</span>
                        <span className="text-gray-900 font-semibold">{service.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Package Type:</span>
                        <span className="text-gray-900 font-semibold capitalize">{service.category}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <p className="text-gray-600 text-sm mb-2">Starting Price</p>
                      <p className="text-4xl font-display font-bold text-gray-900">
                        ₱{parseFloat(service.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={() => handleBookNow(service.id, service.name)}
                      className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 group-hover:shadow-md"
                    >
                      {user ? '📅 Book Now' : '📅 Book Now → Sign Up'}
                    </button>

                    {!user && (
                      <p className="text-xs text-gray-600 text-center mt-3">Sign up to proceed with booking</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">No services available at the moment. Please check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gray-100 border border-gray-300 rounded-xl p-12 text-center">
          <h2 className="text-4xl font-display font-bold text-black mb-4">
            Ready to Book Your Session?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Let us capture your special moments with our professional photography services. Start your booking today!
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-gray-400/50 transition-all duration-300 text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-display font-bold text-black mb-4">LIGHT</div>
              <p className="text-gray-700">Capturing moments that last a lifetime. Professional photography services for every occasion.</p>
            </div>
            <div>
              <h4 className="font-display font-bold text-black mb-4">QUICK LINKS</h4>
              <ul className="space-y-2 text-gray-700">
                <li><Link to="/" className="hover:text-gray-900 transition">Home</Link></li>
                <li><a href="#portfolio" className="hover:text-gray-900 transition">Portfolio</a></li>
                <li><a href="#services" className="hover:text-gray-900 transition">Services</a></li>
                <li><Link to="/register" className="hover:text-gray-900 transition">Book Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-black mb-4">SERVICES</h4>
              <ul className="space-y-2 text-gray-700">
                <li>Portrait Photography</li>
                <li>Wedding Photography</li>
                <li>Event Coverage</li>
                <li>Product Photography</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-black mb-4">CONTACT</h4>
              <p className="text-gray-700 text-sm">
                123 Photography Lane, Manila<br/>
                <span className="text-gray-800">info@lightstudio.com</span><br/>
                <span className="text-gray-800">(02) 8123-4567</span>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-8 text-center text-gray-600 text-sm">
            © 2026 LIGHT Photography Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
