import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serviceService } from '../services/serviceService';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [dbServices, setDbServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const revealRefs = useRef([]);

  // Scroll handler for nav + parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setNavScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loadingServices]);

  // Cleanup stale booking intents (older than 30 minutes)
  useEffect(() => {
    const bookingIntent = localStorage.getItem('bookingIntent');
    if (bookingIntent) {
      try {
        const { timestamp } = JSON.parse(bookingIntent);
        const now = Date.now();
        const thirtyMinutesInMs = 30 * 60 * 1000;
        if (now - timestamp > thirtyMinutesInMs) {
          localStorage.removeItem('bookingIntent');
        }
      } catch (err) {
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
      navigate(`/client/booking/${serviceId}`);
    } else {
      localStorage.setItem('bookingIntent', JSON.stringify({
        serviceId,
        serviceName,
        timestamp: Date.now()
      }));
      navigate('/register?redirect=booking');
    }
  };

  // Portfolio showcase images
  const portfolioImages = [
    {
      title: 'Portrait Photography',
      description: 'Professional studio portraits',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80'
    },
    {
      title: 'Wedding Photography',
      description: 'Timeless wedding moments',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
    },
    {
      title: 'Creative Portraits',
      description: 'Artistic portrait sessions',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ============ NAVIGATION ============ */}
      <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Left Nav Links */}
          <div style={{ display: 'flex', gap: '2.5rem', position: 'absolute', left: 0 }}>
            <a href="#about" className="nav-link">About</a>
            <a href="#portfolio" className="nav-link">Portfolio</a>
            <a href="#services" className="nav-link">Services</a>
          </div>

          {/* Center Logo */}
          <Link to="/" className="nav-logo">
            L&nbsp;&nbsp;I&nbsp;&nbsp;G&nbsp;&nbsp;H&nbsp;&nbsp;T
          </Link>

          {/* Right Nav Links */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'absolute', right: 0 }}>
            <a href="#featured" className="nav-link">Gallery</a>
            <a href="#contact" className="nav-link">Contact</a>
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'}
                className="nav-link"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link
                  to="/register"
                  className="nav-link"
                  style={{
                    border: `1px solid ${navScrolled ? 'rgba(45,45,45,0.3)' : 'rgba(255,255,255,0.4)'}`,
                    padding: '0.5rem 1.5rem'
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="hero-section">
        <img
          src="/images/studio-hero.png"
          alt="LIGHT Photography Studio"
          className="hero-bg-image"
          style={{ transform: `scale(1.1) translateY(${scrollY * 0.15}px)` }}
        />
        <div className="hero-content">
          <h1 className="hero-title">
            Capturing<br />Perfect Moments
          </h1>
          <p className="hero-description">
            Professional photography services that tell your story through stunning visuals.
            From intimate portraits to grand celebrations, we bring your vision to life
            with artistry and passion.
          </p>
          <Link to="/register" className="hero-btn">
            Book a Session
          </Link>
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section id="about" className="about-section">
        <div className="about-grid">
          <div className="about-image-wrapper reveal">
            <img
              src="/images/about-photographer.png"
              alt="About LIGHT Studio"
            />
          </div>
          <div className="reveal reveal-delay-1">
            <h2 className="about-heading">ABOUT OUR STUDIO</h2>
            <p className="about-text">
              LIGHT Photography Studio is dedicated to creating timeless images that capture
              the essence of every moment. We believe that photography is more than just
              taking pictures — it's about telling stories and preserving emotions.
            </p>
            <p className="about-text">
              Our team of experienced photographers combines technical expertise with creative
              vision, using state-of-the-art equipment and a keen eye for detail to deliver
              images that exceed expectations. Whether it's a portrait session, a wedding
              celebration, or a corporate event, we approach every project with passion
              and professionalism.
            </p>
            <p className="about-tagline">Discover our world.</p>
            <div className="about-buttons">
              <a href="#portfolio" className="about-btn about-btn-primary">Portfolio</a>
              <a href="#services" className="about-btn about-btn-secondary">Services</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES SECTION (Portfolio Preview) ============ */}
      <section id="portfolio" className="services-section">
        <h2 className="services-title reveal">Portfolio</h2>
        <div className="services-grid">
          {portfolioImages.map((item, index) => (
            <div
              key={index}
              className={`service-card reveal reveal-delay-${index + 1}`}
              style={{ overflow: 'hidden' }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="service-card-image"
              />
              <div className="service-card-overlay">
                <h3 className="service-card-title">{item.title}</h3>
                <div className="service-card-line"></div>
                <p className="service-card-meta">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ DB SERVICES WITH PRICES ============ */}
      <section id="services" className="db-services-section">
        <h2 className="services-title reveal" style={{ marginTop: '3rem' }}>Our Services</h2>

        {loadingServices ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)'
            }}>Loading services...</p>
          </div>
        ) : dbServices.length > 0 ? (
          <div className="db-services-grid">
            {dbServices.map((service, index) => (
              <div
                key={service.id}
                className={`db-service-card reveal reveal-delay-${(index % 3) + 1}`}
              >
                <h3 className="db-service-name">{service.name}</h3>
                <p className="db-service-category">{service.category}</p>
                <p className="db-service-desc">{service.description}</p>

                <div className="db-service-details">
                  <span className="db-service-price">
                    ₱{parseFloat(service.price).toFixed(0)}
                  </span>
                  <span className="db-service-duration">
                    {service.duration} min
                  </span>
                </div>

                <button
                  onClick={() => handleBookNow(service.id, service.name)}
                  className="book-now-btn"
                >
                  {user ? 'Book Now →' : 'Book Now → Sign Up'}
                </button>

                {!user && (
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    marginTop: '0.75rem',
                    letterSpacing: '0.1em'
                  }}>
                    Sign up to proceed with booking
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.6)'
            }}>
              No services available at the moment. Please check back soon!
            </p>
          </div>
        )}
      </section>

      {/* ============ FEATURED WORK SECTION ============ */}
      <section id="featured" className="featured-section">
        <div className="featured-image-wrapper corner-brackets corner-brackets-bottom">
          <img
            src="/images/featured-work.png"
            alt="Featured Photography Work"
          />
        </div>
        <div className="featured-content reveal">
          <h2 className="featured-heading">Featured Work</h2>
          <p className="featured-text">
            Every session at LIGHT Studio is a unique creative journey. We specialize
            in capturing authentic emotions and creating stunning visual narratives
            that you'll treasure forever. From intimate portraits to grand celebrations,
            our portfolio showcases the artistry and passion we bring to every project.
          </p>
          <Link to="/register" className="featured-btn">
            View Portfolio →
          </Link>
        </div>
      </section>

      {/* ============ BOOKING CTA SECTION ============ */}
      <section className="cta-section">
        <h2 className="cta-title reveal">Book Your Session</h2>
        <p className="cta-subtitle reveal reveal-delay-1">
          Ready to create something beautiful? Whether you're looking for a portrait
          session, event coverage, or creative photography, we'd love to work with you.
        </p>
        <Link to="/register" className="hero-btn reveal reveal-delay-2" style={{ color: '#fff' }}>
          Get Started →
        </Link>
      </section>

      {/* ============ FOOTER ============ */}
      <footer id="contact" className="landing-footer">
        <div className="footer-content">
          <div className="footer-top">
            {/* Brand */}
            <div>
              <div className="footer-brand">LIGHT</div>
              <p className="footer-brand-text">
                Capturing moments that last a lifetime. Professional photography
                services for every occasion.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <p className="footer-heading" style={{ marginBottom: '0.75rem' }}>Newsletter</p>
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="newsletter-input"
                  />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><a href="#about">About</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#services">Services</a></li>
                <li><Link to="/register">Book Now</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-links">
                <li><span style={{ color: '#777' }}>Butuan City, Agusan Del Norte</span></li>
                <li><a href="mailto:info@lightstudio.com">Jayson@lightstudio.com</a></li>
                <li><a href="tel:+6328123456">() 09685728496</a></li>
              </ul>
              <h4 className="footer-heading" style={{ marginTop: '2rem' }}>Hours</h4>
              <ul className="footer-links">
                <li><span style={{ color: '#777' }}>Mon – Fri: 9:00 AM – 6:00 PM</span></li>
                <li><span style={{ color: '#777' }}>Sat: 10:00 AM – 4:00 PM</span></li>
                <li><span style={{ color: '#777' }}>Sun: By appointment</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} LIGHT Photography Studio. All rights reserved.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Pinterest">Pinterest</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
