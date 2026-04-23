import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serviceService } from '../services/serviceService';
import { bookingService } from '../services/bookingService';
import { portfolioService } from '../services/portfolioService';
import Chatbot from '../components/common/Chatbot';
import LocationPickerMap from '../components/common/LocationPickerMap';
import NotificationBell from '../components/common/NotificationBell';
import { resolveImageUrl, resolveServiceImageUrl } from '../utils/imageUrl';

const NavLink = ({ id, label, path, onClick, active }) => (
  <a href={`#${id}`} onClick={(e) => onClick(e, id)} className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-all ${active ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>{label}</a>
);

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  
  // Booking Modal States
  const [bookingServiceDetail, setBookingServiceDetail] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    location: '',
    specialRequests: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Contact Form States
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
  const [highlightedBookingId, setHighlightedBookingId] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Refs for ScrollSpy
  const sectionRefs = {
    hero: useRef(null),
    about: useRef(null),
    registry: useRef(null),
    gallery: useRef(null),
    services: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setNavScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial Scroll based on URL Path
  useEffect(() => {
    if (loading) return;

    const pathToId = {
      '/client/Packages': 'services',
      '/client/Portfolio': 'gallery',
      '/client/MyBookings': 'registry',
      '/client/contact': 'contact'
    };

    const sectionId = pathToId[location.pathname];
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [loading, location.pathname]);

  useEffect(() => {
    if (loading || !user || user.role !== 'client') return;

    const params = new URLSearchParams(location.search);
    const bookingId = params.get('booking');

    if (!bookingId) return;

    setHighlightedBookingId(bookingId);

    const scrollToBooking = () => {
      const bookingElement = document.querySelector(`[data-booking-id="${bookingId}"]`);

      if (bookingElement) {
        bookingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const registryElement = document.getElementById('registry');
      if (registryElement) {
        window.scrollTo({
          top: registryElement.offsetTop - 80,
          behavior: 'smooth',
        });
      }
    };

    const timer = setTimeout(scrollToBooking, 300);
    const clearHighlightTimer = setTimeout(() => setHighlightedBookingId(''), 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(clearHighlightTimer);
    };
  }, [loading, location.search, user, bookings]);

  // ScrollSpy - Update URL as user scrolls
  useEffect(() => {
    if (!user || user.role !== 'client') return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const idToPath = {
      'services': '/client/Packages',
      'gallery': '/client/Portfolio',
      'registry': '/client/MyBookings',
      'contact': '/client/contact',
      'hero': '/'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const path = idToPath[entry.target.id];
          if (path && location.pathname !== path) {
            window.history.replaceState(null, '', path);
          }
        }
      });
    }, observerOptions);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [user, location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => { 
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, bookingsRes, portfolioRes] = await Promise.all([
          serviceService.getServices(),
          user?.role === 'client' ? bookingService.getMyBookings() : Promise.resolve({ data: [] }),
          portfolioService.getPortfolio()
        ]);
        setDbServices(servicesRes.data || []);
        
        // Sort bookings by date descending (Newest/Latest first)
        const sortedBookings = (bookingsRes.data || []).sort((a, b) => 
          new Date(b.booking_date) - new Date(a.booking_date)
        );
        setBookings(sortedBookings);
        
        setPortfolio(portfolioRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleBookNow = (service) => {
    if (user) {
      setBookingServiceDetail(service);
      setBookingError('');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    if (!bookingFormData.bookingDate || !bookingFormData.bookingTime) {
      setBookingError('Please select both date and time');
      return;
    }
    setBookingSubmitting(true);
    try {
      const payload = {
        service_id: bookingServiceDetail.id,
        booking_date: bookingFormData.bookingDate,
        booking_time: bookingFormData.bookingTime,
        location: bookingFormData.location,
        special_requests: bookingFormData.specialRequests,
        total_amount: typeof bookingServiceDetail.price === 'string' ? parseFloat(bookingServiceDetail.price.replace(/,/g, '')) : bookingServiceDetail.price,
        add_on_ids: [],
      };
      const response = await bookingService.createBooking(payload);
      const nextBookings = [...bookings, response.data].sort((a, b) =>
        new Date(b.booking_date) - new Date(a.booking_date)
      );
      setBookings(nextBookings);
      setBookingServiceDetail(null);
      setBookingFormData({ bookingDate: '', bookingTime: '', location: '', specialRequests: '' });
      navigate(`/client/MyBookings?booking=${response.data.id}&highlight=1`);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const handleMapLocationPick = ({ lat, lng, address }) => {
    const coordinateSuffix = `(${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    const locationValue = address ? `${address} ${coordinateSuffix}` : coordinateSuffix;

    setBookingFormData((prev) => ({
      ...prev,
      location: locationValue,
    }));
  };

  const getServiceImageUrl = (serviceOrImagePath) => {
    return resolveServiceImageUrl(serviceOrImagePath);
  };

  const getPortfolioImageUrl = (imagePath) => resolveImageUrl(imagePath);

  const setImageFallback = (event, fallbackSrc) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === '1') return;
    target.dataset.fallbackApplied = '1';
    target.src = fallbackSrc;
  };

  const getStatusConfig = (status, payment) => {
    // If there is a pending payment, show a "Verifying" state even if the booking status is still "awaiting_payment"
    if (payment && payment.payment_status === 'pending') {
      return { label: 'Verifying Transaction', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' };
    }

    switch (status) {
      case 'approved':
      case 'confirmed':
        return { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'awaiting_payment': return { label: 'Payment Required', bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' };
      case 'paid': return { label: 'Confirmed & Paid', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'rejected':
      case 'cancelled':
        return { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' };
      case 'finished':
        return { label: 'Completed', bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-500' };
      case 'pending':
      default:
        return { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' };
    }
  };

  const categories = ['all', ...new Set(portfolio.map(item => item.category).filter(Boolean))];
  const filteredPortfolio = selectedCategory === 'all' ? portfolio : portfolio.filter(item => item.category === selectedCategory);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      
      const idToPath = {
      'services': '/client/Packages',
      'gallery': '/client/Portfolio',
      'registry': '/client/MyBookings',
      'contact': '/client/contact',
        'hero': '/'
      };
      const path = idToPath[id];
      if (path) window.history.replaceState(null, '', path);
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen selection:bg-[#E8734A] selection:text-white font-sans overflow-x-hidden">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-5 ${navScrolled ? 'bg-white/90 backdrop-blur-xl py-3 border-b border-[#F1F5F9] shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          <div className="hidden lg:flex gap-8 items-center justify-start">
            <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/Packages' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Packages</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/Portfolio' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Gallery</a>
          </div>
          <div className="flex justify-center">
            <Link to="/" onClick={(e) => handleNavClick(e, 'hero')} className="text-2xl font-serif text-[#1E293B] tracking-[0.2em] hover:text-[#E8734A] transition-all duration-500">LIGHT</Link>
          </div>
          <div className="flex gap-4 md:gap-6 items-center justify-end">
            {user ? (
              <>
                <a href="#registry" onClick={(e) => handleNavClick(e, 'registry')} className={`hidden lg:block text-[9px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/MyBookings' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>My Bookings</a>
                <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`hidden sm:block text-[9px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/contact' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Contact</a>
                <NotificationBell />
                <button onClick={handleLogout} className="bg-[#1E293B] text-white px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] transition-all whitespace-nowrap">Logout</button>
              </>
            ) : (
              <>
                <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.3em] text-[#1E293B] hover:text-[#E8734A] transition-all">About Us</a>
                <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.3em] text-[#1E293B] hover:text-[#E8734A] transition-all">Contact</a>
                <Link to="/login" className="bg-[#1E293B] text-white px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] transition-all whitespace-nowrap">Join</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" ref={sectionRefs.hero} className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          {heroVideoFailed ? (
            <img src={user ? '/images/studio-hero.png' : '/images/featured-work.png'} className="w-full h-full object-cover opacity-80" style={{ transform: `scale(1.05) translateY(${scrollY * 0.1}px)` }} alt="Background" />
          ) : (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" style={{ transform: `scale(1.1) translateY(${scrollY * 0.1}px)` }} poster={user ? '/images/studio-hero.png' : '/images/featured-work.png'} onError={() => setHeroVideoFailed(true)}>
              <source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-[#F0F2F5]"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6 space-y-6">
          {user ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] animate-fadeIn">WELCOME BACK, {user.name.toUpperCase()}</p>
              <h1 className="text-5xl md:text-7xl font-serif leading-[1.2] reveal tracking-tight"><span className="text-[#1E293B]">Manage Your</span> <br /><span className="text-[#E8734A]">Visual Story.</span></h1>
              <div className="flex justify-center reveal delay-300 pt-6"><button onClick={(e) => handleNavClick(e, 'registry')} className="bg-[#1E293B] text-white py-4 px-12 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] hover:translate-y-[-2px] transition-all duration-700 shadow-xl">ACCESS REGISTRY</button></div>
            </>
          ) : (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E8734A] animate-fadeIn">Premium On-Call Photography</p>
              <h1 className="text-4xl md:text-7xl font-serif text-[#1E293B] leading-[1.2] reveal tracking-tight">Capturing Life <br /><span className="text-[#E8734A]">At Your Place.</span></h1>
              <div className="flex justify-center reveal delay-300 pt-6"><button onClick={(e) => handleNavClick(e, 'services')} className="bg-[#1E293B] text-white py-5 px-12 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] transition-all shadow-xl">RESERVE A SESSION</button></div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={sectionRefs.about} className="py-24 md:py-32 px-6 md:px-12 bg-[#F0F2F5] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative reveal">
            <div className="bg-white p-3 rounded-[2rem] shadow-premium relative z-10"><img src="/images/about-photographer.png" alt="Photographer" className="w-full h-auto rounded-[1.5rem] grayscale hover:grayscale-0 transition-all duration-1000" /></div>
            <div className="absolute -bottom-6 -right-6 bg-[#1E293B] p-8 rounded-[1.5rem] shadow-2xl hidden lg:block z-20"><p className="text-4xl font-serif text-[#E8734A] mb-1">15+</p><p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Years of Masterful Vision</p></div>
          </div>
          <div className="space-y-8 reveal delay-300">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">On-Call Excellence</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1E293B] leading-tight">We Bring the Studio <br /><span className="italic">To Your Location.</span></h2>
            <p className="text-sm text-[#64748B] leading-[1.8] max-w-md font-medium italic">"At LIGHT Photography, we believe every moment is unique. We specialize in on-call services, bringing our masterful vision directly to your chosen venue or home."</p>
          </div>
        </div>
      </section>

      {/* Registry Section */}
      {user && (
        <section id="registry" ref={sectionRefs.registry} className="py-24 md:py-32 px-6 md:px-12 bg-white relative overflow-hidden rounded-[3rem] shadow-premium z-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4 reveal">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Your Registry</p>
              <h2 className="text-4xl font-serif text-[#1E293B]">Active Sessions</h2>
              <div className="w-12 h-0.5 bg-[#E8734A] mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {bookings.length > 0 ? bookings.map((booking, idx) => {
                const status = getStatusConfig(booking.status, booking.payment);
                const hasPendingPayment = booking.payment && booking.payment.payment_status === 'pending';

                return (
                  <div
                    key={booking.id}
                    data-booking-id={booking.id}
                    className={`reveal rounded-[2.5rem] p-8 md:p-12 border flex flex-col lg:flex-row gap-10 items-center transition-all duration-500 ${highlightedBookingId === booking.id ? 'bg-[#FFF7ED] border-[#FDBA74] shadow-[0_0_0_3px_rgba(251,146,60,0.25)]' : 'bg-[#F8F9FB] border-[#F1F5F9]'}`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="w-full lg:w-1/4 aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-white shadow-sm"><img src={getServiceImageUrl(booking.service)} alt="Service" className="w-full h-full object-cover" onError={(e) => setImageFallback(e, '/images/studio-hero.png')} /></div>
                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div><h3 className="text-2xl font-serif text-[#1E293B] mb-1">{booking.service?.name}</h3><p className="text-[12px] text-[#64748B] italic">Session on {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p></div>
                        <div className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${status.bg} ${status.text} flex items-center gap-2`}><span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>{status.label}</div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                         <div className="space-y-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Time</p><p className="text-xs font-bold text-[#1E293B]">{booking.booking_time}</p></div>
                         <div className="space-y-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Investment</p><p className="text-xs font-bold text-[#1E293B]">₱{parseFloat(booking.total_amount).toLocaleString()}</p></div>
                         <div className="space-y-1 col-span-2 md:col-span-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Location</p><p className="text-xs font-bold text-[#1E293B] truncate">📍 {booking.location}</p></div>
                      </div>
                      {booking.admin_notes && (
                        <div className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Admin Notes</p>
                          <p className="text-xs text-[#1E293B] leading-relaxed">{booking.admin_notes}</p>
                        </div>
                      )}
                      <div className="pt-6 border-t border-[#F1F5F9] flex gap-3">
                         {booking.status === 'awaiting_payment' && !hasPendingPayment && (
                            <button onClick={() => navigate('/client/checkout', { state: { booking } })} className="bg-[#E8734A] text-white px-8 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:shadow-lg transition-all shadow-md">Proceed to Payment</button>
                         )}
                         <button onClick={() => setSelectedBookingDetail(booking)} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm hover:bg-[#E8734A] transition-all">Details</button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="reveal py-24 text-center bg-[#F8F9FB] rounded-[2.5rem] border border-[#E2E8F0]"><p className="text-base font-serif italic text-[#94A3B8]">Your session registry is currently empty.</p></div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section id="gallery" ref={sectionRefs.gallery} className="py-24 md:py-32 px-6 md:px-12 bg-[#F0F2F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4 reveal">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">The Collection</p>
            <h2 className="text-4xl font-serif text-[#1E293B]">Masterpiece Gallery</h2>
            <div className="w-12 h-0.5 bg-[#E8734A] mx-auto rounded-full mb-8"></div>
            <div className="flex justify-center gap-2 flex-wrap bg-white p-1.5 rounded-xl shadow-sm border border-[#F1F5F9] w-fit mx-auto mt-6 reveal">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 text-[9px] font-bold uppercase tracking-[0.1em] transition-all rounded-lg ${selectedCategory === cat ? 'bg-[#1E293B] text-white shadow-md' : 'text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8F9FB]'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item, idx) => (
              <div key={item.id} className="group cursor-pointer bg-white rounded-2xl p-3 shadow-sm hover:shadow-card-hover border border-[#F1F5F9] transition-all duration-700 reveal" style={{ transitionDelay: `${idx * 100}ms` }} onClick={() => setSelectedImage(item)}>
                <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-[#F8F9FB] mb-5"><img src={getPortfolioImageUrl(item.image_url)} alt="Art" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => setImageFallback(e, '/images/featured-work.png')} /><div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"><p className="text-white text-[9px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">View Masterpiece</p></div></div>
                <div className="text-center px-2 pb-1"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8734A] mb-1">{item.category || 'Editorial'}</p><h3 className="text-lg font-serif text-[#1E293B] group-hover:text-[#E8734A] transition-colors">{item.title}</h3></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="services" ref={sectionRefs.services} className="py-24 md:py-32 px-6 md:px-12 bg-white rounded-[3rem] shadow-premium relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4 reveal">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Signature Collections</p>
            <h2 className="text-4xl font-serif text-[#1E293B]">Available Packages</h2>
            <div className="w-12 h-0.5 bg-[#E8734A] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {dbServices.map((service, index) => {
              const serviceImageUrl = getServiceImageUrl(service);
              return (
              <div
                key={service.id}
                className="group bg-white border border-[#F1F5F9] rounded-[2rem] p-3.5 transition-all duration-700 hover:shadow-card-hover flex flex-col reveal cursor-pointer"
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => handleBookNow(service)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBookNow(service);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/5] mb-6 bg-[#F8F9FB]"><img src={serviceImageUrl} alt="Pkg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => setImageFallback(e, '/images/studio-hero.png')} /></div>
                <div className="px-5 pb-5 flex-1 flex flex-col space-y-5">
                  <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8734A] mb-2">{service.category}</p><h3 className="text-xl font-serif text-[#1E293B] group-hover:text-[#E8734A] transition-colors">{service.name}</h3></div>
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 italic font-medium">"{service.description}"</p>
                  <div className="flex justify-between items-center pt-5 border-t border-[#F1F5F9] mt-auto"><span className="text-xl font-serif font-bold text-[#1E293B]">₱{parseFloat(service.price).toLocaleString()}</span><button onClick={(e) => { e.stopPropagation(); handleBookNow(service); }} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] transition-all duration-500 shadow-md">Book Now</button></div>
                </div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={sectionRefs.contact} className="py-24 md:py-32 px-6 md:px-12 bg-[#F0F2F5] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           <div className="space-y-8 reveal">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-3">Connect With Us</p>
                <h2 className="text-4xl font-serif text-[#1E293B] leading-tight">Masterful Vision, <br /><span className="italic">Delivered Anywhere.</span></h2>
              </div>
              <div className="space-y-8">
                  <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:bg-[#E8734A] group-hover:text-white transition-all duration-500">📍</div>
                      <div><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] mb-0.5">Service Area</p><p className="text-sm font-bold text-[#1E293B]">Butuan City & Surrounding Regions</p></div>
                  </div>
                  <div className="flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:bg-[#E8734A] group-hover:text-white transition-all duration-500">✉️</div>
                      <div><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] mb-0.5">Inquiries</p><p className="text-sm font-bold text-[#1E293B]">concierge@lightphotography.com</p></div>
                  </div>
              </div>
           </div>
           <div className="bg-white rounded-[2rem] shadow-premium p-8 md:p-12 border border-[#F1F5F9] reveal delay-300">
              {contactSubmitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl mx-auto animate-bounce">✓</div>
                  <h3 className="text-2xl font-serif text-[#1E293B]">Message Received</h3>
                  <p className="text-xs text-[#64748B] italic">Our team will reach out within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Name</label>
                        <input type="text" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-xs outline-none focus:border-[#E8734A] transition-all" placeholder="Full Name" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Email</label>
                        <input type="email" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-xs outline-none focus:border-[#E8734A] transition-all" placeholder="email@address.com" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Message</label>
                      <textarea rows={4} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-xs outline-none focus:border-[#E8734A] transition-all resize-none" placeholder="How can we help capture your story?"></textarea>
                   </div>
                   <button type="submit" className="w-full bg-[#1E293B] text-white py-4.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] shadow-lg transition-all">Send Message →</button>
                </form>
              )}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-24 px-6 md:px-12 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16 text-center lg:text-left">
          <div className="lg:col-span-2 space-y-8"><Link to="/" onClick={(e) => handleNavClick(e, 'hero')} className="text-2xl font-serif text-[#1E293B] tracking-[0.2em]">LIGHT</Link><p className="text-sm text-[#64748B] leading-[1.6] max-w-xs mx-auto lg:mx-0 font-medium italic">"A premium on-call photography service dedicated to the art of visual storytelling."</p></div>
          <div className="space-y-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A]">Concierge</p>
            <div className="space-y-4 text-xs text-[#64748B] font-medium"><p>Butuan City & Regions</p><p className="text-[#1E293B] font-bold">concierge@lightphotography.com</p></div>
          </div>
          <div className="space-y-8"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A]">Newsletter</p><p className="text-[9px] text-[#94A3B8] font-bold tracking-widest uppercase">SUBSCRIBE FOR EXCLUSIVE UPDATES.</p></div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-[#F1F5F9] text-center"><p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#94A3B8]">© {new Date().getFullYear()} LIGHT STUDIO EXPERIENCE • ART DIRECTION BY ANTIGRAVITY</p></div>
      </footer>

      {/* Modals */}
      {selectedImage && (
        <div className="fixed inset-0 bg-[#F0F2F5]/98 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto animate-fadeIn" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="fixed top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1E293B] text-lg shadow-premium border border-[#E2E8F0] hover:bg-[#E8734A] hover:text-white transition-all z-[210]">✕</button>
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-10 lg:gap-16 items-center" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-[50%]"><div className="bg-white p-3 rounded-2xl shadow-premium border border-[#F1F5F9]"><img src={getPortfolioImageUrl(selectedImage.image_url)} alt="P" className="w-full h-auto rounded-xl" onError={(e) => setImageFallback(e, '/images/featured-work.png')} /></div></div>
            <div className="w-full md:w-[50%] text-left space-y-6">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A] mb-3">Perspective • {selectedImage.category}</p><h2 className="text-4xl font-serif text-[#1E293B] leading-[1.2]">{selectedImage.title}</h2></div>
                <div className="w-16 h-0.5 bg-[#E8734A] rounded-full"></div>
                <p className="text-sm text-[#64748B] leading-relaxed italic font-medium">"{selectedImage.description}"</p>
                <div className="pt-6"><button onClick={() => setSelectedImage(null)} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all shadow-md">Close Masterpiece</button></div>
            </div>
          </div>
        </div>
      )}

      {selectedBookingDetail && (
        <div className="fixed inset-0 bg-[#F0F2F5]/98 backdrop-blur-xl z-[300] flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fadeIn" onClick={() => setSelectedBookingDetail(null)}>
          <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-premium border border-[#F1F5F9] p-8 md:p-12 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedBookingDetail(null)} className="absolute top-6 right-6 w-9 h-9 bg-[#F8F9FB] rounded-full flex items-center justify-center text-[#1E293B] hover:bg-[#E8734A] hover:text-white transition-all">✕</button>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-sm"><img src={getServiceImageUrl(selectedBookingDetail.service)} alt="S" className="w-full h-full object-cover" onError={(e) => setImageFallback(e, '/images/studio-hero.png')} /></div>
              <div className="flex-1 space-y-6">
                <div><p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-2">Registry Details</p><h2 className="text-3xl font-serif text-[#1E293B] leading-tight">{selectedBookingDetail.service?.name}</h2></div>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#F1F5F9]">
                    <div className="space-y-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Status</p><p className="text-xs font-bold text-[#1E293B] capitalize">{selectedBookingDetail.status.replace('_', ' ')}</p></div>
                    <div className="space-y-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Investment</p><p className="text-xs font-bold text-[#1E293B]">₱{parseFloat(selectedBookingDetail.total_amount).toLocaleString()}</p></div>
                    <div className="space-y-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Date</p><p className="text-xs font-bold text-[#1E293B]">{new Date(selectedBookingDetail.booking_date).toLocaleDateString()}</p></div>
                    <div className="space-y-1"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Time</p><p className="text-xs font-bold text-[#1E293B]">{selectedBookingDetail.booking_time}</p></div>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#F1F5F9]"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Venue / Location</p><p className="text-xs font-medium text-[#1E293B] leading-relaxed">📍 {selectedBookingDetail.location}</p></div>
                {selectedBookingDetail.special_requests && (<div className="space-y-1 pt-4 border-t border-[#F1F5F9]"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Special Requests</p><p className="text-xs text-[#64748B] italic leading-relaxed">"{selectedBookingDetail.special_requests}"</p></div>)}
                {selectedBookingDetail.admin_notes && (<div className="space-y-1 pt-4 border-t border-[#F1F5F9]"><p className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8]">Admin Notes</p><p className="text-xs text-[#1E293B] leading-relaxed">{selectedBookingDetail.admin_notes}</p></div>)}
                <div className="pt-6"><button onClick={() => setSelectedBookingDetail(null)} className="w-full bg-[#1E293B] text-white py-4 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] transition-all">Close Registry</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingServiceDetail && (
        <div className="fixed inset-0 bg-[#F0F2F5]/98 backdrop-blur-xl z-[300] flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fadeIn" onClick={() => setBookingServiceDetail(null)}>
          <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-premium border border-[#F1F5F9] p-8 md:p-10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setBookingServiceDetail(null)} className="absolute top-6 right-6 w-9 h-9 bg-[#F8F9FB] rounded-full flex items-center justify-center text-[#1E293B] hover:bg-[#E8734A] hover:text-white transition-all">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div className="space-y-6">
                <div><p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E8734A] mb-2">Concierge Registry</p><h2 className="text-3xl font-serif text-[#1E293B] leading-tight">Reserve <br /> {bookingServiceDetail.name}</h2></div>
                <div className="bg-[#F8F9FB] p-5 rounded-xl border border-[#F1F5F9]">
                  <p className="text-[10px] text-[#64748B] leading-relaxed italic">"{bookingServiceDetail.description}"</p>
                  <p className="text-xl font-serif text-[#1E293B] mt-4">₱{parseFloat(bookingServiceDetail.price).toLocaleString()}</p>
                </div>
                {bookingError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-50 p-3 rounded-lg border border-red-100">{bookingError}</p>}
              </div>
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="space-y-1.5"><label className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Preferred Date</label><input type="date" min={minDate} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#E8734A] transition-all" value={bookingFormData.bookingDate} onChange={e => setBookingFormData({...bookingFormData, bookingDate: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Session Time</label><input type="time" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#E8734A] transition-all" value={bookingFormData.bookingTime} onChange={e => setBookingFormData({...bookingFormData, bookingTime: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Event Location</label><input type="text" placeholder="Venue or Address" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#E8734A] transition-all" value={bookingFormData.location} onChange={e => setBookingFormData({...bookingFormData, location: e.target.value})} /></div>
                <LocationPickerMap locationText={bookingFormData.location} onLocationSelect={handleMapLocationPick} height="200px" />
                <div className="space-y-1.5"><label className="text-[8px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Special Requests</label><textarea rows={2} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#E8734A] transition-all resize-none" placeholder="Notes for the photographer..." value={bookingFormData.specialRequests} onChange={e => setBookingFormData({...bookingFormData, specialRequests: e.target.value})}></textarea></div>
                <button type="submit" disabled={bookingSubmitting} className="w-full bg-[#1E293B] text-white py-4 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] transition-all">{bookingSubmitting ? 'Processing...' : 'Book Now'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Chatbot />

      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.2, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out forwards; }
        .shadow-premium { box-shadow: 0 40px 80px -15px rgba(0,0,0,0.04), 0 20px 40px -20px rgba(0,0,0,0.04); }
      `}</style>
    </div>
  );
}
