import { useState } from 'react';
import { Link } from 'react-router-dom';
import navlogo from '../../../assets/logo/navlogo.png';
import {
    FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaFacebookMessenger,
    FaShieldAlt, FaTruck, FaBookOpen, FaBoxOpen,
} from 'react-icons/fa';
import { showSuccessToast, showWarningToast } from '../../../utils/toast';

const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'All Books' },
    { to: '/search', label: 'Search' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Sign Up' },
];

const highlights = [
    { icon: FaShieldAlt, label: 'Authenticity Guarantee' },
    { icon: FaTruck, label: 'Nationwide Delivery' },
    { icon: FaBoxOpen, label: 'Easy Pre-Orders' },
    { icon: FaBookOpen, label: 'Diverse Collection' },
];

const socialLinks = [
    { href: 'https://www.facebook.com/bookoceanbd/', icon: FaFacebookF, label: 'Facebook' },
    { href: 'https://www.instagram.com/bookoceanbd/', icon: FaInstagram, label: 'Instagram' },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [newsletterEmail, setNewsletterEmail] = useState('');

    // NOTE: nothing collects/stores these emails yet - this just confirms
    // intent client-side. Wire up a real backend endpoint before relying on
    // this for an actual mailing list.
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail) {
            showWarningToast('Enter your email', 'Type your email address to subscribe.');
            return;
        }
        showSuccessToast('Thanks for your interest!', "We'll be in touch with updates soon.");
        setNewsletterEmail('');
    };

    return (
        <footer className='pt-16 bg-slate-950 text-white/[.8]'>
            <div className='container mx-auto px-4'>
                {/* newsletter */}
                <div className='text-center max-w-xl mx-auto mb-14'>
                    <h2 className='text-2xl font-bold text-white mb-2'>Subscribe to our newsletter</h2>
                    <p className='text-white/60 mb-6'>Be the first to know about new arrivals, promotions and more.</p>
                    <form onSubmit={handleNewsletterSubmit} className='flex flex-col sm:flex-row gap-3'>
                        <input
                            type='email'
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder='Your email address'
                            className='flex-1 px-4 py-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-400'
                        />
                        <button className='px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold duration-300'>
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* main grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 pb-14 border-t border-white/10 pt-14'>
                    {/* brand */}
                    <div className='col-span-2 md:col-span-1'>
                        <img src={navlogo} alt='Book Ocean BD' className='w-40 mb-4' />
                        <p className='text-sm text-white/60 leading-relaxed mb-4'>
                            {"Bangladesh's"} trusted source for authentic, original print books - delivered to your doorstep nationwide.
                        </p>
                        <div className='flex gap-3'>
                            {socialLinks.map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target='_blank'
                                    rel='noreferrer'
                                    aria-label={label}
                                    className='w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-blue-500 duration-300'
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* quick links */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Quick Links</h3>
                        <ul className='flex flex-col gap-y-2 text-sm text-white/60'>
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className='hover:text-blue-400 duration-300'>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* why choose us */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Why Choose Us</h3>
                        <ul className='flex flex-col gap-y-3 text-sm text-white/60'>
                            {highlights.map(({ icon: Icon, label }) => (
                                <li key={label} className='flex items-center gap-2'>
                                    <Icon className='text-blue-400 shrink-0' size={14} />
                                    <span>{label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* contact */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Need Help?</h3>
                        <ul className='flex flex-col gap-y-3 text-sm text-white/60'>
                            <li className='flex items-center gap-2'>
                                <FaPhoneAlt className='text-blue-400 shrink-0' size={13} />
                                <a href='tel:+8801568175528' className='hover:text-blue-400 duration-300'>+88 01568175528</a>
                            </li>
                            <li className='flex items-center gap-2'>
                                <FaEnvelope className='text-blue-400 shrink-0' size={13} />
                                <a href='mailto:info@bookoceanbd.com' className='hover:text-blue-400 duration-300'>info@bookoceanbd.com</a>
                            </li>
                            <li className='flex items-center gap-2'>
                                <FaFacebookMessenger className='text-blue-400 shrink-0' size={13} />
                                <a href='https://m.me/bookoceanbd' target='_blank' rel='noreferrer' className='hover:text-blue-400 duration-300'>m.me/bookoceanbd</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* copyright */}
            <div className='py-6 border-t border-white/10'>
                <div className='container mx-auto px-4 text-center text-xs text-white/50'>
                    &copy; {currentYear} Book Ocean BD. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
