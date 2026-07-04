import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { submitLead } from '../utils/api';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const APPS_SCRIPT_URL = import.meta.env.VITE_BLUEPRINT_APPS_SCRIPT_URL || import.meta.env.VITE_APPS_SCRIPT_URL || '';
const STORAGE_KEY = 'tbh_blueprint_builder_v1';

const BUSINESS_TYPES = [
  {
    key: 'fashion_brand',
    label: 'Fashion Brand',
    sub: 'Lookbooks, drops, product trust, high-conversion shopping',
    recommendedMood: 'premium_ecommerce',
    sections: ['hero', 'products', 'gallery', 'testimonials', 'newsletter', 'contact'],
    features: ['ecommerce', 'payment_integration', 'whatsapp_integration', 'email_system'],
    interactions: ['sticky_navbar', 'floating_whatsapp', 'animations', 'ecommerce_cart_behavior', 'checkout_flow', 'mobile_menu_style'],
  },
  {
    key: 'ecommerce',
    label: 'Ecommerce',
    sub: 'Catalogues, cart flows, conversion-first shopping journeys',
    recommendedMood: 'modern',
    sections: ['hero', 'products', 'testimonials', 'faqs', 'payment_section', 'contact'],
    features: ['ecommerce', 'payment_integration', 'order_tracking', 'analytics', 'email_system'],
    interactions: ['sticky_navbar', 'animations', 'smooth_scroll', 'ecommerce_cart_behavior', 'checkout_flow'],
  },
  {
    key: 'restaurant',
    label: 'Restaurant',
    sub: 'Menus, reservations, delivery, WhatsApp conversion',
    recommendedMood: 'bold',
    sections: ['hero', 'services', 'gallery', 'testimonials', 'booking_forms', 'contact'],
    features: ['booking_system', 'payment_integration', 'whatsapp_integration', 'sms_notifications'],
    interactions: ['sticky_navbar', 'floating_whatsapp', 'animations', 'smooth_scroll', 'booking_experience'],
  },
  {
    key: 'school',
    label: 'School',
    sub: 'Admissions, trust, academics, portals, announcements',
    recommendedMood: 'corporate',
    sections: ['hero', 'about', 'services', 'faqs', 'signup_login', 'contact'],
    features: ['portal_access', 'user_authentication', 'email_system', 'admin_dashboard'],
    interactions: ['sticky_navbar', 'smooth_scroll', 'sidebar_navigation', 'popup_modals'],
  },
  {
    key: 'church',
    label: 'Church',
    sub: 'Events, sermons, giving, ministry structure, community',
    recommendedMood: 'elegant',
    sections: ['hero', 'about', 'video_section', 'gallery', 'newsletter_section', 'contact'],
    features: ['payment_integration', 'email_system', 'push_notifications'],
    interactions: ['sticky_navbar', 'animations', 'smooth_scroll', 'mobile_menu_style'],
  },
  {
    key: 'logistics',
    label: 'Logistics',
    sub: 'Tracking, operations, dashboards, enterprise trust',
    recommendedMood: 'modern',
    sections: ['hero', 'services', 'analytics_cards', 'admin_tables', 'faqs', 'contact'],
    features: ['order_tracking', 'inventory_management', 'admin_dashboard', 'analytics', 'sms_notifications'],
    interactions: ['sticky_navbar', 'smooth_scroll', 'dashboard_interaction_style', 'sidebar_navigation'],
  },
  {
    key: 'beauty_brand',
    label: 'Beauty Brand',
    sub: 'Bookings, service menus, before-and-after galleries, social proof',
    recommendedMood: 'luxury',
    sections: ['hero', 'services', 'gallery', 'testimonials', 'booking_forms', 'contact'],
    features: ['booking_system', 'whatsapp_integration', 'email_system', 'appointment_systems'],
    interactions: ['sticky_navbar', 'floating_whatsapp', 'animations', 'booking_experience', 'mobile_menu_style'],
  },
  {
    key: 'portfolio',
    label: 'Portfolio',
    sub: 'Case studies, visual work, credibility, contact pathways',
    recommendedMood: 'minimal',
    sections: ['hero', 'about', 'portfolios', 'video_section', 'testimonials', 'contact'],
    features: ['email_system', 'whatsapp_integration'],
    interactions: ['smooth_scroll', 'animations', 'popup_modals', 'mobile_menu_style'],
  },
  {
    key: 'real_estate',
    label: 'Real Estate',
    sub: 'Listings, agents, filters, lead capture, trust',
    recommendedMood: 'african_luxury',
    sections: ['hero', 'products', 'gallery', 'testimonials', 'booking_forms', 'contact'],
    features: ['crm', 'customer_management', 'booking_system', 'portal_access', 'whatsapp_integration'],
    interactions: ['sticky_navbar', 'floating_whatsapp', 'smooth_scroll', 'popup_modals', 'mobile_menu_style'],
  },
  {
    key: 'hotel',
    label: 'Hotel',
    sub: 'Rooms, amenities, bookings, experience-led browsing',
    recommendedMood: 'elegant',
    sections: ['hero', 'gallery', 'services', 'testimonials', 'booking_forms', 'contact'],
    features: ['booking_system', 'payment_integration', 'email_system'],
    interactions: ['sticky_navbar', 'animations', 'smooth_scroll', 'booking_experience'],
  },
  {
    key: 'booking_business',
    label: 'Booking Business',
    sub: 'Appointments, calendars, deposits, service operations',
    recommendedMood: 'clean_simple',
    sections: ['hero', 'services', 'faqs', 'booking_forms', 'signup_login', 'contact'],
    features: ['booking_system', 'payment_integration', 'appointment_systems', 'sms_notifications'],
    interactions: ['sticky_navbar', 'smooth_scroll', 'popup_modals', 'booking_experience'],
  },
  {
    key: 'media_brand',
    label: 'Media Brand',
    sub: 'Editorial feel, episodes, video, content ecosystems',
    recommendedMood: 'dark_mode',
    sections: ['hero', 'video_section', 'blogs', 'newsletter_section', 'testimonials', 'contact'],
    features: ['subscriptions', 'push_notifications', 'email_system'],
    interactions: ['sticky_navbar', 'animations', 'smooth_scroll', 'popup_modals'],
  },
  {
    key: 'online_course',
    label: 'Online Course',
    sub: 'Enrollment, lesson access, subscriptions, progress tracking',
    recommendedMood: 'tech_startup',
    sections: ['hero', 'about', 'services', 'signup_login', 'faqs', 'contact'],
    features: ['portal_access', 'subscriptions', 'user_authentication', 'email_system', 'analytics'],
    interactions: ['sticky_navbar', 'animations', 'smooth_scroll', 'sidebar_navigation'],
  },
  {
    key: 'ngo',
    label: 'NGO',
    sub: 'Storytelling, impact proof, donations, programs, volunteer flows',
    recommendedMood: 'corporate',
    sections: ['hero', 'about', 'services', 'gallery', 'newsletter_section', 'contact'],
    features: ['payment_integration', 'email_system', 'portal_access'],
    interactions: ['sticky_navbar', 'smooth_scroll', 'popup_modals', 'mobile_menu_style'],
  },
  {
    key: 'startup',
    label: 'Startup',
    sub: 'Validation, traction, conversion funnels, product clarity',
    recommendedMood: 'tech_startup',
    sections: ['hero', 'services', 'testimonials', 'faqs', 'signup_login', 'contact'],
    features: ['analytics', 'crm', 'user_authentication', 'email_system'],
    interactions: ['sticky_navbar', 'animations', 'smooth_scroll', 'popup_modals', 'mobile_menu_style'],
  },
  {
    key: 'saas',
    label: 'SaaS',
    sub: 'Product-led onboarding, dashboards, subscriptions, admin tooling',
    recommendedMood: 'futuristic',
    sections: ['hero', 'analytics_cards', 'signup_login', 'faqs', 'dashboards', 'contact'],
    features: ['subscriptions', 'user_authentication', 'admin_dashboard', 'analytics', 'portal_access'],
    interactions: ['sticky_navbar', 'animations', 'sidebar_navigation', 'dashboard_interaction_style', 'mobile_menu_style'],
  },
  {
    key: 'custom_business',
    label: 'Custom Business',
    sub: 'Build from scratch around your workflow and operations',
    recommendedMood: 'modern',
    sections: ['hero', 'about', 'services', 'faqs', 'contact'],
    features: ['crm', 'admin_dashboard', 'analytics'],
    interactions: ['sticky_navbar', 'smooth_scroll', 'animations'],
  },
];

const PROJECT_TYPES = [
  { key: 'website', label: 'Website', sub: 'Marketing or service website', min: 350, max: 650, complexity: 2, sections: ['hero', 'about', 'services', 'testimonials', 'contact'], features: ['email_system'] },
  { key: 'ecommerce_store', label: 'Ecommerce Store', sub: 'Catalogue, cart, checkout, conversion', min: 650, max: 1100, complexity: 4, sections: ['hero', 'products', 'payment_section', 'faqs', 'contact'], features: ['ecommerce', 'payment_integration', 'order_tracking'] },
  { key: 'portal', label: 'Portal', sub: 'Member or customer access environment', min: 800, max: 1400, complexity: 5, sections: ['hero', 'signup_login', 'dashboards', 'faqs', 'contact'], features: ['portal_access', 'user_authentication', 'admin_dashboard'] },
  { key: 'crm', label: 'CRM', sub: 'Customer management and operational tooling', min: 1000, max: 1800, complexity: 6, sections: ['hero', 'analytics_cards', 'admin_tables', 'signup_login', 'contact'], features: ['crm', 'customer_management', 'admin_dashboard', 'analytics'] },
  { key: 'management_system', label: 'Management System', sub: 'Internal operations, roles, records, control', min: 1200, max: 2200, complexity: 7, sections: ['hero', 'dashboards', 'admin_tables', 'analytics_cards', 'contact'], features: ['staff_management', 'admin_dashboard', 'analytics', 'portal_access'] },
  { key: 'booking_system', label: 'Booking System', sub: 'Scheduling, calendars, availability, confirmations', min: 700, max: 1200, complexity: 4, sections: ['hero', 'services', 'booking_forms', 'faqs', 'contact'], features: ['booking_system', 'appointment_systems', 'email_system'] },
  { key: 'mobile_app_concept', label: 'Mobile App Concept', sub: 'Blueprint-only product concept and flow', min: 600, max: 1000, complexity: 4, sections: ['hero', 'about', 'signup_login', 'portfolios', 'contact'], features: ['push_notifications', 'user_authentication'] },
  { key: 'dashboard', label: 'Dashboard', sub: 'Analytics, reporting, and decision-making interface', min: 800, max: 1300, complexity: 5, sections: ['hero', 'analytics_cards', 'dashboards', 'admin_tables', 'contact'], features: ['analytics', 'admin_dashboard'] },
  { key: 'admin_system', label: 'Admin System', sub: 'Staff-facing controls, approvals, and management', min: 900, max: 1500, complexity: 5, sections: ['hero', 'signup_login', 'admin_tables', 'analytics_cards', 'contact'], features: ['staff_management', 'admin_dashboard', 'user_authentication'] },
  { key: 'online_learning_platform', label: 'Online Learning Platform', sub: 'Lessons, accounts, progress, enrollment', min: 950, max: 1700, complexity: 6, sections: ['hero', 'services', 'signup_login', 'faqs', 'contact'], features: ['portal_access', 'subscriptions', 'user_authentication', 'email_system'] },
  { key: 'inventory_tracker', label: 'Inventory Tracker', sub: 'Stock, movements, operations, reporting', min: 1000, max: 1800, complexity: 6, sections: ['hero', 'dashboards', 'analytics_cards', 'admin_tables', 'contact'], features: ['inventory_management', 'admin_dashboard', 'analytics'] },
  { key: 'custom_platform', label: 'Custom Platform', sub: 'Mixed workflows and custom business logic', min: 1200, max: 2500, complexity: 7, sections: ['hero', 'services', 'dashboards', 'faqs', 'contact'], features: ['crm', 'portal_access', 'analytics', 'admin_dashboard'] },
];

const MOOD_OPTIONS = [
  { key: 'luxury', label: 'Luxury', sub: 'Rich, polished, elevated' },
  { key: 'modern', label: 'Modern', sub: 'Clean, current, balanced' },
  { key: 'minimal', label: 'Minimal', sub: 'Quiet, focused, spacious' },
  { key: 'corporate', label: 'Corporate', sub: 'Professional, structured, credible' },
  { key: 'bold', label: 'Bold', sub: 'High-contrast, assertive, energetic' },
  { key: 'elegant', label: 'Elegant', sub: 'Soft, premium, refined' },
  { key: 'playful', label: 'Playful', sub: 'Friendly, light, expressive' },
  { key: 'dark_mode', label: 'Dark Mode', sub: 'Cinematic, contrast-heavy, moody' },
  { key: 'african_luxury', label: 'African Luxury', sub: 'Warm, premium, culturally grounded' },
  { key: 'tech_startup', label: 'Tech Startup', sub: 'Sharp, future-facing, product-led' },
  { key: 'clean_simple', label: 'Clean / Simple', sub: 'Accessible, practical, calm' },
  { key: 'futuristic', label: 'Futuristic', sub: 'Sleek, immersive, high-tech' },
  { key: 'premium_ecommerce', label: 'Premium Ecommerce', sub: 'Conversion-led with polish and trust' },
];

const TYPOGRAPHY_OPTIONS = [
  { key: 'editorial', label: 'Editorial Contrast', sub: 'Best for luxury, fashion, premium brands' },
  { key: 'geometric', label: 'Geometric Sans', sub: 'Modern, startup, dashboard-friendly' },
  { key: 'humanist', label: 'Humanist Sans', sub: 'Warm, approachable, service-led' },
  { key: 'compact', label: 'Compact Corporate', sub: 'Structured, neat, enterprise-leaning' },
];

const BUTTON_OPTIONS = [
  { key: 'pill', label: 'Pill Buttons', sub: 'Rounded, friendly, mobile-first' },
  { key: 'square', label: 'Squared Buttons', sub: 'Sharp, sturdy, confident' },
  { key: 'soft_shadow', label: 'Soft Shadow', sub: 'Layered, premium, slightly tactile' },
  { key: 'outline', label: 'Outline Buttons', sub: 'Lightweight, minimal, elegant' },
];

const CARD_OPTIONS = [
  { key: 'glass', label: 'Glass Cards', sub: 'Layered, shiny, premium depth' },
  { key: 'solid', label: 'Solid Cards', sub: 'Bold and high-contrast' },
  { key: 'bordered', label: 'Bordered Cards', sub: 'Structured, editorial, clean' },
  { key: 'soft', label: 'Soft Cards', sub: 'Rounded, welcoming, subtle' },
];

const SPACING_OPTIONS = [
  { key: 'compact', label: 'Compact', sub: 'Denser layout, faster scanning' },
  { key: 'balanced', label: 'Balanced', sub: 'Comfortable all-round spacing' },
  { key: 'airy', label: 'Airy', sub: 'Premium breathing room and whitespace' },
  { key: 'showcase', label: 'Showcase', sub: 'Large sections for visual storytelling' },
];

const ANIMATION_OPTIONS = [
  { key: 'none', label: 'None', sub: 'Static, simple, low-motion' },
  { key: 'subtle', label: 'Subtle', sub: 'Small fades and shifts' },
  { key: 'polished', label: 'Polished', sub: 'Smooth reveals and hover states' },
  { key: 'expressive', label: 'Expressive', sub: 'More motion and visual drama' },
];

const SECTION_OPTIONS = [
  { key: 'hero', label: 'Hero Section', sub: 'First impression, promise, CTA', price: 0, score: 0.2 },
  { key: 'about', label: 'About Section', sub: 'Story, values, trust', price: 20, score: 0.2 },
  { key: 'services', label: 'Services', sub: 'Offerings or capabilities', price: 30, score: 0.3 },
  { key: 'products', label: 'Products', sub: 'Catalogues, cards, SKUs', price: 60, score: 0.5 },
  { key: 'testimonials', label: 'Testimonials', sub: 'Social proof and trust', price: 20, score: 0.2 },
  { key: 'faqs', label: 'FAQs', sub: 'Expectation-setting and objection handling', price: 15, score: 0.2 },
  { key: 'contact', label: 'Contact Section', sub: 'Lead capture and next steps', price: 20, score: 0.2 },
  { key: 'whatsapp_section', label: 'WhatsApp Integration Block', sub: 'Conversion via direct chat', price: 15, score: 0.1 },
  { key: 'booking_forms', label: 'Booking Forms', sub: 'Service selection and dates', price: 60, score: 0.5 },
  { key: 'payment_section', label: 'Payment Section', sub: 'Trust, checkout cues, payment explanation', price: 40, score: 0.3 },
  { key: 'gallery', label: 'Gallery', sub: 'Visual proof, lookbooks, snapshots', price: 30, score: 0.3 },
  { key: 'blogs', label: 'Blogs', sub: 'Content, authority, SEO foundation', price: 50, score: 0.4 },
  { key: 'dashboards', label: 'Dashboard Panels', sub: 'Operational or user-facing cards', price: 90, score: 0.7 },
  { key: 'admin_tables', label: 'Admin Tables', sub: 'Records, filters, approvals, actions', price: 90, score: 0.7 },
  { key: 'analytics_cards', label: 'Analytics Cards', sub: 'KPIs, charts, summaries', price: 70, score: 0.6 },
  { key: 'signup_login', label: 'Signup / Login', sub: 'Authentication entry points', price: 50, score: 0.5 },
  { key: 'portfolios', label: 'Portfolios', sub: 'Case studies or project showcase', price: 30, score: 0.3 },
  { key: 'video_section', label: 'Video Section', sub: 'Rich media storytelling', price: 20, score: 0.2 },
  { key: 'newsletter_section', label: 'Newsletter Section', sub: 'Email capture and retention', price: 15, score: 0.1 },
];

const INTERACTION_OPTIONS = [
  { key: 'sticky_navbar', label: 'Sticky Navbar', sub: 'Navigation stays visible while scrolling', price: 20, score: 0.2 },
  { key: 'floating_whatsapp', label: 'Floating WhatsApp Button', sub: 'Persistent conversion shortcut', price: 15, score: 0.1 },
  { key: 'animations', label: 'Animations', sub: 'Motion-driven entrance and reveal effects', price: 40, score: 0.3 },
  { key: 'transitions', label: 'Transitions', sub: 'Smooth state changes between UI actions', price: 20, score: 0.2 },
  { key: 'smooth_scroll', label: 'Smooth Scroll', sub: 'Polished movement between sections', price: 10, score: 0.1 },
  { key: 'sidebar_navigation', label: 'Sidebar Navigation', sub: 'Persistent side navigation for systems', price: 40, score: 0.4 },
  { key: 'popup_modals', label: 'Popup Modals', sub: 'Lightboxes, quick views, extra steps', price: 30, score: 0.3 },
  { key: 'ecommerce_cart_behavior', label: 'Ecommerce Cart Behavior', sub: 'Drawer, mini-cart, sticky cart interactions', price: 40, score: 0.4 },
  { key: 'checkout_flow', label: 'Checkout Flow', sub: 'Streamlined checkout logic and UX', price: 50, score: 0.4 },
  { key: 'dashboard_interaction_style', label: 'Dashboard Interaction Style', sub: 'Tabs, cards, status states, controls', price: 55, score: 0.4 },
  { key: 'booking_experience', label: 'Booking Experience', sub: 'Step-by-step or instant scheduling feel', price: 35, score: 0.3 },
  { key: 'mobile_menu_style', label: 'Mobile Menu Style', sub: 'Fullscreen, drawer, or compact mobile nav', price: 20, score: 0.2 },
];

const FEATURE_OPTIONS = [
  { key: 'ecommerce', label: 'Ecommerce', sub: 'Storefront, product management, shopping flow', price: 160, score: 1 },
  { key: 'payment_integration', label: 'Payment Integration', sub: 'Card, bank, or mobile money collection', price: 130, score: 0.8 },
  { key: 'booking_system', label: 'Booking System', sub: 'Appointments, calendars, reservations', price: 120, score: 0.8 },
  { key: 'crm', label: 'CRM', sub: 'Customer records and pipeline logic', price: 280, score: 1.2 },
  { key: 'customer_management', label: 'Customer Management', sub: 'Profiles, segmentation, support context', price: 140, score: 0.7 },
  { key: 'order_tracking', label: 'Order Tracking', sub: 'Status visibility for customer or admin', price: 120, score: 0.7 },
  { key: 'inventory_management', label: 'Inventory Management', sub: 'Stock control and operational records', price: 180, score: 1 },
  { key: 'admin_dashboard', label: 'Admin Dashboard', sub: 'Private controls, actions, reports', price: 180, score: 0.9 },
  { key: 'analytics', label: 'Analytics', sub: 'KPIs, reports, metrics, charts', price: 90, score: 0.6 },
  { key: 'email_system', label: 'Email System', sub: 'Notifications, forms, user updates', price: 70, score: 0.4 },
  { key: 'sms_notifications', label: 'SMS Notifications', sub: 'Alerts, confirmations, reminders', price: 60, score: 0.4 },
  { key: 'whatsapp_integration', label: 'WhatsApp Integration', sub: 'Direct messaging or conversion handoff', price: 50, score: 0.3 },
  { key: 'push_notifications', label: 'Push Notifications', sub: 'Browser or app-style updates', price: 90, score: 0.6 },
  { key: 'user_authentication', label: 'User Authentication', sub: 'Login, signup, access control', price: 120, score: 0.8 },
  { key: 'staff_management', label: 'Staff Management', sub: 'Roles, permissions, workflows', price: 120, score: 0.7 },
  { key: 'portal_access', label: 'Portal Access', sub: 'Private user area or member portal', price: 160, score: 0.9 },
  { key: 'subscriptions', label: 'Subscriptions', sub: 'Recurring billing or gated access', price: 110, score: 0.7 },
  { key: 'appointment_systems', label: 'Appointment Systems', sub: 'Availability, confirmations, staff slots', price: 90, score: 0.6 },
];

const DELIVERY_PACES = [
  { key: 'patient', label: 'Flexible Pace', sub: 'Save a bit and build in phases', multiplier: 0.92 },
  { key: 'standard', label: 'Standard Pace', sub: 'Balanced delivery timeline', multiplier: 1 },
  { key: 'priority', label: 'Priority Pace', sub: 'Faster turnaround and tighter scheduling', multiplier: 1.18 },
];

const NEGOTIATION_OPTIONS = [
  { key: 'proceed', label: 'Proceed With Estimate', sub: 'Use this as the starting agreement range' },
  { key: 'negotiate', label: 'Request Negotiation', sub: 'Ask for a revised budget conversation' },
  { key: 'phased', label: 'Request Phased Build', sub: 'Split delivery into paid stages' },
];

const STEP_TITLES = [
  'Business Type',
  'Brand Mood',
  'Sections',
  'Interactions',
  'Features',
  'Estimate',
  'Summary',
];

const DEFAULT_FORM = {
  clientName: '',
  businessName: '',
  email: '',
  phone: '',
  businessGoal: '',
  businessType: 'fashion_brand',
  projectType: 'ecommerce_store',
  mood: 'premium_ecommerce',
  palette: ['#17121b', '#cb8d2f', '#f6efe5'],
  typography: 'editorial',
  buttonStyle: 'pill',
  cardStyle: 'glass',
  spacing: 'airy',
  animationIntensity: 'polished',
  logoName: '',
  inspirationNames: [],
  sections: ['hero', 'products', 'gallery', 'testimonials', 'newsletter_section', 'contact'],
  interactions: ['sticky_navbar', 'floating_whatsapp', 'animations', 'smooth_scroll', 'ecommerce_cart_behavior', 'checkout_flow', 'mobile_menu_style'],
  features: ['ecommerce', 'payment_integration', 'whatsapp_integration', 'email_system', 'analytics'],
  deliveryPace: 'standard',
  negotiationMode: 'proceed',
  budgetNote: '',
  phaseRequest: '',
  extraNotes: '',
};

function formatMoney(value) {
  return '$' + Math.round(value).toLocaleString();
}

function unique(list) {
  return [...new Set(list)];
}

function roundToTen(value) {
  return Math.round(value / 10) * 10;
}

function weeksToLabel(weeks) {
  if (weeks <= 1.5) return '1 week';
  if (weeks <= 2.5) return '2 weeks';
  if (weeks <= 4.5) return '3-4 weeks';
  if (weeks <= 6.5) return '1-1.5 months';
  if (weeks <= 8.5) return '1.5-2 months';
  return '2-3 months';
}

function toBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function fromBase64(value) {
  const binary = window.atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function reorder(items, key, direction) {
  const index = items.indexOf(key);
  if (index === -1) return items;
  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const clone = [...items];
  const swap = clone[nextIndex];
  clone[nextIndex] = clone[index];
  clone[index] = swap;
  return clone;
}

function getBusiness(key) {
  return BUSINESS_TYPES.find((item) => item.key === key) || BUSINESS_TYPES[0];
}

function getProject(key) {
  return PROJECT_TYPES.find((item) => item.key === key) || PROJECT_TYPES[0];
}

function getMood(key) {
  return MOOD_OPTIONS.find((item) => item.key === key) || MOOD_OPTIONS[0];
}

function getTheme(moodKey, palette) {
  const themes = {
    luxury: { canvas: '#120f13', surface: 'rgba(255,255,255,0.08)', ink: '#fff8ef', muted: '#dfd5c8', edge: 'rgba(255,255,255,0.12)' },
    modern: { canvas: '#0f172a', surface: 'rgba(255,255,255,0.08)', ink: '#f8fafc', muted: '#cbd5e1', edge: 'rgba(148,163,184,0.25)' },
    minimal: { canvas: '#f4f0ea', surface: 'rgba(255,255,255,0.78)', ink: '#171717', muted: '#5f5f5f', edge: 'rgba(23,23,23,0.08)' },
    corporate: { canvas: '#111827', surface: 'rgba(255,255,255,0.08)', ink: '#f9fafb', muted: '#cbd5e1', edge: 'rgba(255,255,255,0.14)' },
    bold: { canvas: '#1c1010', surface: 'rgba(255,255,255,0.08)', ink: '#fff4f1', muted: '#f8d2cb', edge: 'rgba(255,255,255,0.14)' },
    elegant: { canvas: '#1b1620', surface: 'rgba(255,255,255,0.08)', ink: '#fff8fb', muted: '#e6d7e9', edge: 'rgba(255,255,255,0.16)' },
    playful: { canvas: '#20133a', surface: 'rgba(255,255,255,0.1)', ink: '#fbf8ff', muted: '#ddd6fe', edge: 'rgba(255,255,255,0.16)' },
    dark_mode: { canvas: '#09090b', surface: 'rgba(255,255,255,0.08)', ink: '#fafafa', muted: '#a1a1aa', edge: 'rgba(255,255,255,0.14)' },
    african_luxury: { canvas: '#1a130d', surface: 'rgba(255,255,255,0.08)', ink: '#fff7ed', muted: '#fed7aa', edge: 'rgba(255,255,255,0.16)' },
    tech_startup: { canvas: '#071124', surface: 'rgba(255,255,255,0.07)', ink: '#eff6ff', muted: '#bfdbfe', edge: 'rgba(125,211,252,0.16)' },
    clean_simple: { canvas: '#eef3f7', surface: 'rgba(255,255,255,0.84)', ink: '#0f172a', muted: '#475569', edge: 'rgba(15,23,42,0.08)' },
    futuristic: { canvas: '#06091d', surface: 'rgba(255,255,255,0.07)', ink: '#ecfeff', muted: '#a5f3fc', edge: 'rgba(34,211,238,0.18)' },
    premium_ecommerce: { canvas: '#170f16', surface: 'rgba(255,255,255,0.08)', ink: '#fff7f0', muted: '#fcd9c6', edge: 'rgba(255,255,255,0.16)' },
  };

  const theme = themes[moodKey] || themes.modern;

  return {
    ...theme,
    primary: palette[0],
    accent: palette[1],
    soft: palette[2],
  };
}

function buildEstimate(form) {
  const project = getProject(form.projectType);
  const moodMultipliers = {
    luxury: 1.08,
    modern: 1,
    minimal: 0.96,
    corporate: 1.02,
    bold: 1.05,
    elegant: 1.06,
    playful: 1.03,
    dark_mode: 1.03,
    african_luxury: 1.1,
    tech_startup: 1.06,
    clean_simple: 0.95,
    futuristic: 1.08,
    premium_ecommerce: 1.09,
  };

  const sectionTotal = form.sections.reduce((total, key) => {
    const section = SECTION_OPTIONS.find((item) => item.key === key);
    return total + (section?.price || 0);
  }, 0);

  const interactionTotal = form.interactions.reduce((total, key) => {
    const interaction = INTERACTION_OPTIONS.find((item) => item.key === key);
    return total + (interaction?.price || 0);
  }, 0);

  const featureTotal = form.features.reduce((total, key) => {
    const feature = FEATURE_OPTIONS.find((item) => item.key === key);
    return total + (feature?.price || 0);
  }, 0);

  const score =
    project.complexity +
    form.sections.reduce((total, key) => {
      const section = SECTION_OPTIONS.find((item) => item.key === key);
      return total + (section?.score || 0);
    }, 0) +
    form.interactions.reduce((total, key) => {
      const interaction = INTERACTION_OPTIONS.find((item) => item.key === key);
      return total + (interaction?.score || 0);
    }, 0) +
    form.features.reduce((total, key) => {
      const feature = FEATURE_OPTIONS.find((item) => item.key === key);
      return total + (feature?.score || 0);
    }, 0);

  const moodMultiplier = moodMultipliers[form.mood] || 1;
  const pace = DELIVERY_PACES.find((item) => item.key === form.deliveryPace) || DELIVERY_PACES[1];
  const baseMin = project.min + sectionTotal + interactionTotal + featureTotal;
  const baseMax = project.max + sectionTotal + interactionTotal + featureTotal;
  const min = roundToTen(baseMin * moodMultiplier * pace.multiplier);
  const max = roundToTen(baseMax * moodMultiplier * pace.multiplier);
  const deposit = roundToTen(((min + max) / 2) * 0.4);

  let complexity = 'Lean build';
  if (score >= 7) complexity = 'Balanced build';
  if (score >= 10) complexity = 'Advanced build';
  if (score >= 13) complexity = 'System-heavy build';

  const speedMultiplier = pace.key === 'priority' ? 0.78 : pace.key === 'patient' ? 1.15 : 1;
  const earlyWeeks = Math.max(1, Math.round((score * 0.55) * speedMultiplier));
  const lateWeeks = Math.max(earlyWeeks + 1, Math.round((score * 0.8 + 1) * speedMultiplier));

  return {
    project,
    pace,
    sectionTotal,
    interactionTotal,
    featureTotal,
    min,
    max,
    deposit,
    score,
    complexity,
    timeline: `${weeksToLabel(earlyWeeks)} to ${weeksToLabel(lateWeeks)}`,
    lineItems: [
      { label: `${project.label} base`, value: `${formatMoney(project.min)}-${formatMoney(project.max)}` },
      { label: 'Selected sections', value: formatMoney(sectionTotal) },
      { label: 'Interaction polish', value: formatMoney(interactionTotal) },
      { label: 'Feature engine', value: formatMoney(featureTotal) },
      { label: `${getMood(form.mood).label} styling`, value: `${Math.round((moodMultiplier - 1) * 100)}%` },
      { label: `${pace.label} multiplier`, value: `${Math.round((pace.multiplier - 1) * 100)}%` },
    ],
  };
}

function buildNarration(form, estimate) {
  const business = getBusiness(form.businessType);
  const project = getProject(form.projectType);
  const mood = getMood(form.mood);
  const topSections = form.sections
    .map((key) => SECTION_OPTIONS.find((item) => item.key === key)?.label)
    .filter(Boolean)
    .slice(0, 5);
  const topFeatures = form.features
    .map((key) => FEATURE_OPTIONS.find((item) => item.key === key)?.label)
    .filter(Boolean)
    .slice(0, 5);
  const topInteractions = form.interactions
    .map((key) => INTERACTION_OPTIONS.find((item) => item.key === key)?.label)
    .filter(Boolean)
    .slice(0, 4);
  const deviceBehavior = project.key.includes('dashboard') || ['crm', 'management_system', 'admin_system', 'inventory_tracker', 'portal'].includes(project.key)
    ? 'Desktop behavior should prioritize clarity, while tablet and mobile views keep key controls accessible without pretending to be a finished production system.'
    : 'The experience should feel mobile-first, then expand gracefully into tablet and desktop with clear spacing, visible calls to action, and fast scanning.';

  const negotiationNote =
    form.negotiationMode === 'negotiate'
      ? `The client would like to review the current estimate against a target budget of "${form.budgetNote || 'to be discussed'}".`
      : form.negotiationMode === 'phased'
        ? `The client is open to phased delivery, starting with "${form.phaseRequest || 'the most important first release'}".`
        : 'The client is comfortable using the estimate range as the starting point for scope confirmation.';

  return [
    `This blueprint describes a ${mood.label.toLowerCase()} ${project.label.toLowerCase()} concept for a ${business.label.toLowerCase()}. It is a visual planning prototype for The Brand Helper, not a live or hosted website.`,
    `The proposed structure highlights ${topSections.join(', ') || 'core sections'} so the business can communicate its value clearly before development begins. The design direction leans on ${form.typography.replace('_', ' ')} typography, ${form.buttonStyle.replace('_', ' ')} buttons, ${form.cardStyle.replace('_', ' ')} cards, ${form.spacing} spacing, and ${form.animationIntensity} motion.`,
    `Interaction expectations centre on ${topInteractions.join(', ') || 'clean, guided navigation'}, while the feature set focuses on ${topFeatures.join(', ') || 'the required project logic'}. This should help the developer team understand the intended user journey, conversion path, and expected business behavior without long back-and-forth clarification.`,
    `${deviceBehavior} The current build sits in an estimated ${formatMoney(estimate.min)}-${formatMoney(estimate.max)} range with ${estimate.complexity.toLowerCase()} complexity and an indicative timeline of ${estimate.timeline}. ${negotiationNote}`,
  ].join(' ');
}

function buildSummary(form, estimate, narration) {
  const business = getBusiness(form.businessType);
  const project = getProject(form.projectType);
  const mood = getMood(form.mood);

  return [
    'THE BRAND HELPER — INTERACTIVE BLUEPRINT SUMMARY',
    '',
    'IMPORTANT:',
    'This is a visual blueprint / planning mockup and not a hosted, published, or live website.',
    '',
    'CLIENT DETAILS',
    `Name: ${form.clientName || 'Not provided'}`,
    `Business: ${form.businessName || 'Not provided'}`,
    `Email: ${form.email || 'Not provided'}`,
    `Phone: ${form.phone || 'Not provided'}`,
    '',
    'PROJECT SUMMARY',
    `Business Type: ${business.label}`,
    `Project Type: ${project.label}`,
    `Design Feel: ${mood.label}`,
    `Typography: ${TYPOGRAPHY_OPTIONS.find((item) => item.key === form.typography)?.label}`,
    `Button Style: ${BUTTON_OPTIONS.find((item) => item.key === form.buttonStyle)?.label}`,
    `Card Style: ${CARD_OPTIONS.find((item) => item.key === form.cardStyle)?.label}`,
    `Section Spacing: ${SPACING_OPTIONS.find((item) => item.key === form.spacing)?.label}`,
    `Animation Intensity: ${ANIMATION_OPTIONS.find((item) => item.key === form.animationIntensity)?.label}`,
    `Brand Colors: ${form.palette.join(' · ')}`,
    `Logo Upload: ${form.logoName || 'Not provided'}`,
    `Inspiration Files: ${form.inspirationNames.join(', ') || 'Not provided'}`,
    '',
    'SELECTED SECTIONS',
    ...form.sections.map((key, index) => `${index + 1}. ${SECTION_OPTIONS.find((item) => item.key === key)?.label || key}`),
    '',
    'INTERACTIONS',
    ...form.interactions.map((key) => `- ${INTERACTION_OPTIONS.find((item) => item.key === key)?.label || key}`),
    '',
    'FEATURES',
    ...form.features.map((key) => `- ${FEATURE_OPTIONS.find((item) => item.key === key)?.label || key}`),
    '',
    'PRICE + TIMELINE',
    `Estimated Range: ${formatMoney(estimate.min)}-${formatMoney(estimate.max)}`,
    `Required Upfront Payment: ${formatMoney(estimate.deposit)}`,
    `Complexity: ${estimate.complexity}`,
    `Delivery Pace: ${estimate.pace.label}`,
    `Timeline: ${estimate.timeline}`,
    '',
    'NEGOTIATION MODE',
    `${NEGOTIATION_OPTIONS.find((item) => item.key === form.negotiationMode)?.label || form.negotiationMode}`,
    form.budgetNote ? `Budget Note: ${form.budgetNote}` : '',
    form.phaseRequest ? `Phase Request: ${form.phaseRequest}` : '',
    '',
    'BUSINESS PURPOSE',
    form.businessGoal || 'Not provided',
    '',
    'ADDITIONAL NOTES',
    form.extraNotes || 'None provided',
    '',
    'GENERATED NARRATION',
    narration,
  ].filter(Boolean).join('\n');
}

function BadgePill({ children, tone = 'dark' }) {
  const tones = {
    dark: 'bg-black text-white',
    accent: 'bg-red-600 text-white',
    subtle: 'bg-white/10 text-white',
    soft: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

function ChoiceCard({ selected, label, sub, onClick, accent = '#e11d48' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] border p-4 text-left transition-all ${selected ? 'shadow-lg' : 'hover:-translate-y-0.5 hover:shadow-md'}`}
      style={{
        borderColor: selected ? accent : 'rgba(17,24,39,0.08)',
        background: selected ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-gray-950">{label}</div>
          <div className="mt-1 text-xs leading-relaxed text-gray-500">{sub}</div>
        </div>
        <span
          className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-black"
          style={{
            borderColor: selected ? accent : 'rgba(17,24,39,0.12)',
            background: selected ? accent : 'transparent',
            color: selected ? '#fff' : 'rgba(17,24,39,0.32)',
          }}
        >
          {selected ? '✓' : '+'}
        </span>
      </div>
    </button>
  );
}

function ToggleChip({ selected, label, sub, onClick, accent = '#e11d48' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[20px] border px-4 py-3 text-left transition-all"
      style={{
        borderColor: selected ? accent : 'rgba(17,24,39,0.08)',
        background: selected ? 'rgba(225,29,72,0.08)' : '#fff',
      }}
    >
      <div className="text-sm font-bold text-gray-900">{label}</div>
      <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
    </button>
  );
}

function DevicePreview({ label, scale, form, theme, previews }) {
  const dashboardLike = ['crm', 'management_system', 'dashboard', 'admin_system', 'inventory_tracker', 'portal'].includes(form.projectType);
  const sectionData = form.sections
    .map((key) => SECTION_OPTIONS.find((item) => item.key === key))
    .filter(Boolean)
    .slice(0, dashboardLike ? 5 : 6);
  const logoText = form.businessName ? form.businessName.slice(0, 2).toUpperCase() : 'TB';

  const buttonRadius = {
    pill: '999px',
    square: '14px',
    soft_shadow: '18px',
    outline: '999px',
  }[form.buttonStyle];

  const cardRadius = {
    glass: '22px',
    solid: '20px',
    bordered: '18px',
    soft: '26px',
  }[form.cardStyle];

  const cardBackground = {
    glass: 'rgba(255,255,255,0.12)',
    solid: 'rgba(0,0,0,0.22)',
    bordered: 'rgba(255,255,255,0.03)',
    soft: 'rgba(255,255,255,0.18)',
  }[form.cardStyle];

  const spacing = {
    compact: 'gap-2',
    balanced: 'gap-3',
    airy: 'gap-4',
    showcase: 'gap-5',
  }[form.spacing];

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/20 p-3 shadow-2xl blueprint-float" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      <div className="overflow-hidden rounded-[26px] border" style={{ borderColor: theme.edge, background: theme.canvas }}>
        <div className="flex items-center justify-between border-b px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: theme.edge, color: theme.muted }}>
          <span>{label}</span>
          <span>Prototype Only</span>
        </div>
        <div className={`relative flex h-[280px] flex-col overflow-hidden p-3 ${spacing}`}>
          <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at top right, ${theme.accent}55, transparent 35%), radial-gradient(circle at bottom left, ${theme.soft}55, transparent 28%)` }} />
          <div className="relative flex items-center justify-between rounded-[18px] px-3 py-2 text-[10px]" style={{ background: 'rgba(255,255,255,0.06)', color: theme.ink }}>
            <div className="flex items-center gap-2">
              {previews.logoPreview ? (
                <img src={previews.logoPreview} alt="Logo preview" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black" style={{ background: theme.accent, color: '#111' }}>
                  {logoText}
                </div>
              )}
              <span>{form.businessName || 'Your Brand'}</span>
            </div>
            <div className="flex items-center gap-2">
              {form.interactions.includes('sticky_navbar') && <span className="rounded-full px-2 py-1" style={{ background: 'rgba(255,255,255,0.08)' }}>Sticky</span>}
              {form.features.includes('ecommerce') && <span className="rounded-full px-2 py-1" style={{ background: 'rgba(255,255,255,0.08)' }}>Cart</span>}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[24px] border px-4 py-4"
            style={{
              borderColor: theme.edge,
              background: `linear-gradient(135deg, ${form.palette[0]}, ${form.palette[1]})`,
              color: theme.ink,
            }}
          >
            <div className="max-w-[80%]">
              <div className="text-[9px] uppercase tracking-[0.24em] opacity-80">{getBusiness(form.businessType).label}</div>
              <div className="mt-2 text-sm font-black leading-tight">{getProject(form.projectType).label} blueprint with {getMood(form.mood).label.toLowerCase()} energy.</div>
              <div className="mt-2 text-[10px] leading-relaxed opacity-85">
                Responsive concept only. Previewing feel, structure, feature mix, and interaction direction.
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="px-3 py-2 text-[10px] font-bold" style={{ borderRadius: buttonRadius, background: '#111111', color: '#ffffff' }}>
                Primary CTA
              </span>
              <span className="px-3 py-2 text-[10px] font-bold" style={{ borderRadius: buttonRadius, border: '1px solid rgba(255,255,255,0.25)' }}>
                Explore
              </span>
            </div>
          </div>

          {dashboardLike ? (
            <div className={`relative grid flex-1 grid-cols-2 ${spacing}`}>
              <div className="rounded-[22px] border p-3" style={{ borderColor: theme.edge, background: cardBackground, borderRadius: cardRadius }}>
                <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.muted }}>Overview</div>
                <div className="mt-2 text-xl font-black" style={{ color: theme.ink }}>84%</div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: '72%', background: theme.accent }} />
                </div>
                <div className="mt-2 text-[10px]" style={{ color: theme.muted }}>Healthy engagement</div>
              </div>
              <div className="rounded-[22px] border p-3" style={{ borderColor: theme.edge, background: cardBackground, borderRadius: cardRadius }}>
                <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.muted }}>Active panels</div>
                <div className="mt-3 space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl px-2 py-2 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <span style={{ color: theme.ink }}>Module {item}</span>
                      <span style={{ color: theme.muted }}>Live</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`relative grid flex-1 grid-cols-2 ${spacing}`}>
              {sectionData.map((section) => (
                <div
                  key={section.key}
                  className="border p-3"
                  style={{
                    borderColor: theme.edge,
                    background: cardBackground,
                    borderRadius: cardRadius,
                    color: theme.ink,
                  }}
                >
                  <div className="text-[9px] uppercase tracking-[0.22em]" style={{ color: theme.muted }}>{section.label}</div>
                  <div className="mt-2 text-[10px] leading-relaxed">
                    {section.sub}
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full blueprint-shine" style={{ width: `${Math.min(92, 28 + section.price)}%`, background: theme.accent }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {form.interactions.includes('floating_whatsapp') && (
            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-sm font-black text-white shadow-xl">
              W
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlueprintBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [previewAssets, setPreviewAssets] = useState({ logoPreview: '', inspirationPreviews: [] });
  const [restoredMessage, setRestoredMessage] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('blueprint');

    if (shared) {
      try {
        const decoded = JSON.parse(fromBase64(shared));
        setForm((prev) => ({ ...prev, ...decoded }));
        setRestoredMessage('Loaded a shared blueprint configuration.');
        return;
      } catch (_) {
        setRestoredMessage('We could not fully read that shared blueprint link, so the default starter was loaded instead.');
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setForm((prev) => ({ ...prev, ...parsed }));
        setRestoredMessage('Restored your last saved blueprint progress from this device.');
      }
    } catch (_) {
      setRestoredMessage('');
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (_) {
      setSavedAt('');
    }
  }, [form]);

  const theme = getTheme(form.mood, form.palette);
  const estimate = buildEstimate(form);
  const narration = buildNarration(form, estimate);
  const summary = buildSummary(form, estimate, narration);
  const activeBusiness = getBusiness(form.businessType);
  const activeProject = getProject(form.projectType);
  const shareLink = `${window.location.origin}/blueprint?blueprint=${encodeURIComponent(toBase64(JSON.stringify(form)))}`;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }));
  };

  const applySuggestedStarter = () => {
    const mergedSections = unique([...activeProject.sections, ...activeBusiness.sections]).slice(0, 8);
    const mergedFeatures = unique([...activeProject.features, ...activeBusiness.features]);
    const mergedInteractions = unique([...activeBusiness.interactions]);

    setForm((prev) => ({
      ...prev,
      mood: activeBusiness.recommendedMood,
      sections: mergedSections,
      features: mergedFeatures,
      interactions: mergedInteractions,
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setField('logoName', file.name);
    try {
      const logoPreview = await readFileAsDataUrl(file);
      setPreviewAssets((prev) => ({ ...prev, logoPreview }));
    } catch (_) {
      setPreviewAssets((prev) => ({ ...prev, logoPreview: '' }));
    }
  };

  const handleInspirationUpload = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    setField('inspirationNames', files.map((file) => file.name));
    try {
      const previews = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setPreviewAssets((prev) => ({ ...prev, inspirationPreviews: previews }));
    } catch (_) {
      setPreviewAssets((prev) => ({ ...prev, inspirationPreviews: [] }));
    }
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2200);
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2200);
  };

  const exportSummary = () => {
    const safeName = (form.businessName || 'brand-helper-blueprint').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(`${safeName}-blueprint.txt`, summary);
  };

  const clearSaved = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm(DEFAULT_FORM);
    setPreviewAssets({ logoPreview: '', inspirationPreviews: [] });
    setSubmitted(false);
    setRestoredMessage('Saved progress cleared. Starter blueprint loaded.');
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = {
      to_email: 'davida@thebrandhelper.com',
      to_name: 'The BrandHelper Team',
      from_name: form.clientName || form.businessName || 'Blueprint Lead',
      reply_to: form.email || 'noreply@thebrandhelper.com',
      subject: `New Interactive Blueprint — ${form.businessName || activeBusiness.label}`,
      form_type: 'Interactive Blueprint Builder',
      client_name: form.clientName || form.businessName || 'Blueprint Lead',
      business_name: form.businessName || '',
      industry: activeBusiness.label,
      email: form.email || '',
      phone: form.phone || '',
      service: activeProject.label,
      tier: estimate.complexity,
      budget: `${formatMoney(estimate.min)}-${formatMoney(estimate.max)}`,
      timeline: estimate.timeline,
      message: `${NEGOTIATION_OPTIONS.find((item) => item.key === form.negotiationMode)?.label || form.negotiationMode} · Share link: ${shareLink}`,
      full_brief: summary,
      submitted_at: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' }),
    };

    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY);
      }
    } catch (error) {
      console.warn('EmailJS:', error);
    }

    try {
      if (APPS_SCRIPT_URL) {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (error) {
      console.warn('Sheets:', error);
    }

    try {
      await submitLead(payload);
    } catch (error) {
      console.warn('Server:', error);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const canAdvance = [
    Boolean(form.businessType && form.projectType),
    Boolean(form.mood),
    form.sections.length >= 3,
    true,
    form.features.length > 0,
    true,
    true,
  ][step];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Helmet>
        <title>The Brand Helper Blueprint Builder</title>
        <meta
          name="description"
          content="Interactive website blueprint builder for planning the feel, structure, features, pricing, and submission of your next digital project."
        />
      </Helmet>

      <section className="relative overflow-hidden border-b border-white/10 bg-black px-6 pb-14 pt-14 md:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.22),transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <BadgePill tone="accent">Blueprint Builder</BadgePill>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              Plan the exact feel of your project before development starts.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
              This builder helps you shape the mood, structure, interactions, features, and expected user journey for your website, store, portal, dashboard, CRM, or management system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BadgePill tone="subtle">Live responsive preview</BadgePill>
              <BadgePill tone="subtle">Auto narration</BadgePill>
              <BadgePill tone="subtle">Dynamic pricing</BadgePill>
              <BadgePill tone="subtle">Shareable blueprint link</BadgePill>
            </div>
            <div className="mt-8 rounded-[28px] border border-amber-300/20 bg-amber-300/10 p-5">
              <div className="text-sm font-extrabold text-amber-200">Important system rule</div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-amber-100/90">
                This is a visual blueprint, prototype, and planning system only. It does not publish, host, deploy, connect domains, or go live. Every preview here is for alignment, pricing, and development briefing.
              </p>
            </div>
            {restoredMessage && (
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                {restoredMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-6 py-4">
          <div className="flex min-w-max gap-2">
            {STEP_TITLES.map((title, index) => (
              <button
                key={title}
                type="button"
                onClick={() => index <= step && setStep(index)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${index === step ? 'bg-white text-black' : index < step ? 'bg-red-600 text-white' : 'bg-white/10 text-white/60'}`}
              >
                {index + 1}. {title}
              </button>
            ))}
          </div>
          <div className="shrink-0 text-right text-xs text-gray-400">
            <div>Auto-saved {savedAt ? `at ${savedAt}` : 'locally'}</div>
            <div>{formatMoney(estimate.min)}-{formatMoney(estimate.max)}</div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
            {step === 0 && (
              <div>
                <div className="max-w-3xl">
                  <BadgePill tone="soft">Step 1</BadgePill>
                  <h2 className="mt-4 text-3xl font-extrabold">Choose the business and project context.</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    These two choices shape the suggested layout, baseline pricing, recommended features, and how the narration explains the user journey.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Business type</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {BUSINESS_TYPES.map((option) => (
                      <ChoiceCard
                        key={option.key}
                        selected={form.businessType === option.key}
                        label={option.label}
                        sub={option.sub}
                        onClick={() => setField('businessType', option.key)}
                        accent={theme.accent}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Project type</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {PROJECT_TYPES.map((option) => (
                      <ChoiceCard
                        key={option.key}
                        selected={form.projectType === option.key}
                        label={option.label}
                        sub={`${option.sub} · ${formatMoney(option.min)}-${formatMoney(option.max)}`}
                        onClick={() => setField('projectType', option.key)}
                        accent={theme.accent}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Business purpose</div>
                    <textarea
                      value={form.businessGoal}
                      onChange={(event) => setField('businessGoal', event.target.value)}
                      rows={4}
                      className="mt-3 w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-white/30"
                      placeholder="What should this project help the business do? Example: increase direct orders, look more premium, reduce WhatsApp confusion, or give staff a better dashboard."
                    />
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Suggested starter</div>
                    <div className="mt-3 text-xl font-extrabold">{activeBusiness.label} + {activeProject.label}</div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      Recommended mood: {getMood(activeBusiness.recommendedMood).label}. Suggested sections and features are already mapped and ready to apply.
                    </p>
                    <button
                      type="button"
                      onClick={applySuggestedStarter}
                      className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-black transition hover:opacity-90"
                    >
                      Use Suggested Starter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <BadgePill tone="soft">Step 2</BadgePill>
                <h2 className="mt-4 text-3xl font-extrabold">Define the brand mood and visual direction.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  The preview updates instantly across desktop, tablet, and mobile so you can communicate taste, polish, spacing, and perceived value before development begins.
                </p>

                <div className="mt-8">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Design feel</div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {MOOD_OPTIONS.map((option) => (
                      <ChoiceCard
                        key={option.key}
                        selected={form.mood === option.key}
                        label={option.label}
                        sub={option.sub}
                        onClick={() => setField('mood', option.key)}
                        accent={theme.accent}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {form.palette.map((color, index) => (
                    <label key={index} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                        {index === 0 ? 'Primary' : index === 1 ? 'Accent' : 'Soft tone'}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(event) => {
                            const next = [...form.palette];
                            next[index] = event.target.value;
                            setField('palette', next);
                          }}
                          className="h-14 w-14 cursor-pointer rounded-2xl border border-white/10 bg-transparent"
                        />
                        <div className="text-sm font-bold">{color}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Typography</div>
                    <div className="grid gap-4">
                      {TYPOGRAPHY_OPTIONS.map((option) => (
                        <ChoiceCard
                          key={option.key}
                          selected={form.typography === option.key}
                          label={option.label}
                          sub={option.sub}
                          onClick={() => setField('typography', option.key)}
                          accent={theme.accent}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Button style</div>
                      <div className="grid gap-4">
                        {BUTTON_OPTIONS.map((option) => (
                          <ChoiceCard
                            key={option.key}
                            selected={form.buttonStyle === option.key}
                            label={option.label}
                            sub={option.sub}
                            onClick={() => setField('buttonStyle', option.key)}
                            accent={theme.accent}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Card style</div>
                      <div className="grid gap-4">
                        {CARD_OPTIONS.map((option) => (
                          <ChoiceCard
                            key={option.key}
                            selected={form.cardStyle === option.key}
                            label={option.label}
                            sub={option.sub}
                            onClick={() => setField('cardStyle', option.key)}
                            accent={theme.accent}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Section spacing</div>
                    <div className="grid gap-4">
                      {SPACING_OPTIONS.map((option) => (
                        <ChoiceCard
                          key={option.key}
                          selected={form.spacing === option.key}
                          label={option.label}
                          sub={option.sub}
                          onClick={() => setField('spacing', option.key)}
                          accent={theme.accent}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Animation intensity</div>
                    <div className="grid gap-4">
                      {ANIMATION_OPTIONS.map((option) => (
                        <ChoiceCard
                          key={option.key}
                          selected={form.animationIntensity === option.key}
                          label={option.label}
                          sub={option.sub}
                          onClick={() => setField('animationIntensity', option.key)}
                          accent={theme.accent}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <label className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Upload logo</div>
                    <div className="mt-3 rounded-[22px] border border-dashed border-white/15 px-4 py-6 text-sm text-gray-300">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="mb-3 block w-full text-xs text-gray-400" />
                      <div>{form.logoName || 'No logo uploaded yet'}</div>
                      <div className="mt-2 text-xs text-gray-500">Logo preview is used only inside this blueprint session.</div>
                    </div>
                  </label>
                  <label className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Upload inspiration screenshots</div>
                    <div className="mt-3 rounded-[22px] border border-dashed border-white/15 px-4 py-6 text-sm text-gray-300">
                      <input type="file" accept="image/*" multiple onChange={handleInspirationUpload} className="mb-3 block w-full text-xs text-gray-400" />
                      <div>{form.inspirationNames.join(', ') || 'No inspiration files uploaded yet'}</div>
                      <div className="mt-2 text-xs text-gray-500">We keep the file names in the brief and use previews only on this device.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <BadgePill tone="soft">Step 3</BadgePill>
                <h2 className="mt-4 text-3xl font-extrabold">Build the page or product structure.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  Select the sections that should exist in the blueprint, then arrange them in order. Drag-and-drop can come later, but you can already control the structure now.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {SECTION_OPTIONS.map((option) => (
                    <ToggleChip
                      key={option.key}
                      selected={form.sections.includes(option.key)}
                      label={option.label}
                      sub={`${option.sub} · +${formatMoney(option.price)}`}
                      onClick={() => toggleArrayValue('sections', option.key)}
                      accent={theme.accent}
                    />
                  ))}
                </div>

                <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Current section order</div>
                      <div className="mt-1 text-sm text-gray-400">Move sections up or down to shape the user journey.</div>
                    </div>
                    <BadgePill tone="subtle">{form.sections.length} sections</BadgePill>
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    {form.sections.map((key, index) => {
                      const section = SECTION_OPTIONS.find((item) => item.key === key);
                      return (
                        <div key={key} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white">{index + 1}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold">{section?.label || key}</div>
                            <div className="text-xs text-gray-500">{section?.sub}</div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setField('sections', reorder(form.sections, key, 'up'))} className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-white/30">↑</button>
                            <button type="button" onClick={() => setField('sections', reorder(form.sections, key, 'down'))} className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-white/30">↓</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <BadgePill tone="soft">Step 4</BadgePill>
                <h2 className="mt-4 text-3xl font-extrabold">Define the interaction behavior.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  This is where the blueprint stops being a static moodboard and starts describing how the experience should feel to the end user.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {INTERACTION_OPTIONS.map((option) => (
                    <ToggleChip
                      key={option.key}
                      selected={form.interactions.includes(option.key)}
                      label={option.label}
                      sub={`${option.sub} · +${formatMoney(option.price)}`}
                      onClick={() => toggleArrayValue('interactions', option.key)}
                      accent={theme.accent}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <BadgePill tone="soft">Step 5</BadgePill>
                <h2 className="mt-4 text-3xl font-extrabold">Select the feature engine.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  Each feature updates the narration, pricing, developer expectations, and timeline estimate. Pick the business logic you actually need.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {FEATURE_OPTIONS.map((option) => (
                    <ToggleChip
                      key={option.key}
                      selected={form.features.includes(option.key)}
                      label={option.label}
                      sub={`${option.sub} · +${formatMoney(option.price)}`}
                      onClick={() => toggleArrayValue('features', option.key)}
                      accent={theme.accent}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <BadgePill tone="soft">Step 6</BadgePill>
                <h2 className="mt-4 text-3xl font-extrabold">Review pricing, timeline, and negotiation path.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  The estimate responds to structure, features, interaction depth, mood direction, and delivery pace. Upfront payment is always required before work begins.
                </p>

                <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Estimated investment</div>
                    <div className="mt-3 text-4xl font-extrabold">{formatMoney(estimate.min)}-{formatMoney(estimate.max)}</div>
                    <div className="mt-2 text-sm text-gray-400">Required upfront payment: {formatMoney(estimate.deposit)}</div>
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Complexity</div>
                        <div className="mt-2 text-lg font-extrabold">{estimate.complexity}</div>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Timeline</div>
                        <div className="mt-2 text-lg font-extrabold">{estimate.timeline}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Breakdown</div>
                    <div className="mt-4 flex flex-col gap-3">
                      {estimate.lineItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="font-bold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Delivery pace</div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {DELIVERY_PACES.map((option) => (
                      <ChoiceCard
                        key={option.key}
                        selected={form.deliveryPace === option.key}
                        label={option.label}
                        sub={option.sub}
                        onClick={() => setField('deliveryPace', option.key)}
                        accent={theme.accent}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Negotiation or bid path</div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {NEGOTIATION_OPTIONS.map((option) => (
                      <ChoiceCard
                        key={option.key}
                        selected={form.negotiationMode === option.key}
                        label={option.label}
                        sub={option.sub}
                        onClick={() => setField('negotiationMode', option.key)}
                        accent={theme.accent}
                      />
                    ))}
                  </div>
                </div>

                {form.negotiationMode === 'negotiate' && (
                  <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Target budget or negotiation note</div>
                    <textarea
                      value={form.budgetNote}
                      onChange={(event) => setField('budgetNote', event.target.value)}
                      rows={3}
                      className="mt-3 w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                      placeholder="Example: We are trying to stay near $1,200 if phase one can cover homepage, store, and checkout."
                    />
                  </div>
                )}

                {form.negotiationMode === 'phased' && (
                  <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Preferred phase one scope</div>
                    <textarea
                      value={form.phaseRequest}
                      onChange={(event) => setField('phaseRequest', event.target.value)}
                      rows={3}
                      className="mt-3 w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                      placeholder="Example: Phase one should include the public marketing site, WhatsApp conversion, and booking form. Admin dashboard can come later."
                    />
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div>
                <BadgePill tone="soft">Step 7</BadgePill>
                <h2 className="mt-4 text-3xl font-extrabold">Finalize the blueprint and submit it to the team.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                  The summary below becomes the visual agreement, narration, estimate, and onboarding brief for The Brand Helper development team.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Client details</div>
                    <div className="mt-4 grid gap-4">
                      <input
                        value={form.clientName}
                        onChange={(event) => setField('clientName', event.target.value)}
                        className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                        placeholder="Your name"
                      />
                      <input
                        value={form.businessName}
                        onChange={(event) => setField('businessName', event.target.value)}
                        className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                        placeholder="Business name"
                      />
                      <input
                        value={form.email}
                        onChange={(event) => setField('email', event.target.value)}
                        className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                        placeholder="Email address"
                        type="email"
                      />
                      <input
                        value={form.phone}
                        onChange={(event) => setField('phone', event.target.value)}
                        className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                        placeholder="Phone / WhatsApp"
                      />
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Extra notes for the team</div>
                    <textarea
                      value={form.extraNotes}
                      onChange={(event) => setField('extraNotes', event.target.value)}
                      rows={7}
                      className="mt-4 w-full rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/30"
                      placeholder="Anything that should not be missed? Example: must feel trustworthy, mobile users matter most, team prefers WhatsApp handoff, admin should stay simple, etc."
                    />
                  </div>
                </div>

                <div className="mt-8 rounded-[30px] border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Blueprint summary actions</div>
                      <div className="mt-1 text-sm text-gray-400">Save, export, share, or print before submission.</div>
                    </div>
                    <BadgePill tone="green">Prototype Only</BadgePill>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={copyShareLink} className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-black transition hover:opacity-90">
                      {shareCopied ? 'Share Link Copied' : 'Copy Share Link'}
                    </button>
                    <button type="button" onClick={copySummary} className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35">
                      {summaryCopied ? 'Summary Copied' : 'Copy Summary'}
                    </button>
                    <button type="button" onClick={exportSummary} className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35">
                      Export Brief
                    </button>
                    <button type="button" onClick={() => window.print()} className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35">
                      Print / Save PDF
                    </button>
                  </div>

                  {!submitted ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-full bg-red-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? 'Submitting Blueprint...' : 'Submit Blueprint to The Brand Helper'}
                      </button>
                      <Link to="/contact/requirements" className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35">
                        Use Full Project Brief Instead
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] border border-green-400/20 bg-green-400/10 p-5">
                      <div className="text-lg font-extrabold text-green-200">Blueprint received.</div>
                      <p className="mt-2 text-sm leading-relaxed text-green-100/90">
                        Your blueprint has been sent into the email + CRM intake flow. You can now share the link, export the brief, or message the summary on WhatsApp for faster alignment.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={`https://wa.me/233501657205?text=${encodeURIComponent(summary)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-green-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-green-600"
                        >
                          Send Summary on WhatsApp
                        </a>
                        <a
                          href="https://calendly.com/blackbird77ad/free-consultation"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35"
                        >
                          Book Free Consultation
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearSaved}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/35"
              >
                Reset Blueprint
              </button>
              {step < STEP_TITLES.length - 1 && (
                <button
                  type="button"
                  onClick={() => canAdvance && setStep(step + 1)}
                  disabled={!canAdvance}
                  className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Live responsive preview</div>
                <div className="mt-1 text-sm text-gray-400">A visual prototype, not a live website.</div>
              </div>
              <BadgePill tone="subtle">{activeProject.label}</BadgePill>
            </div>
            <div className="mt-5 grid gap-6 xl:grid-cols-3 xl:items-start">
              <div className="xl:col-span-2">
                <DevicePreview label="Desktop" scale={1} form={form} theme={theme} previews={previewAssets} />
              </div>
              <div className="space-y-5">
                <DevicePreview label="Tablet" scale={0.82} form={form} theme={theme} previews={previewAssets} />
                <DevicePreview label="Mobile" scale={0.72} form={form} theme={theme} previews={previewAssets} />
              </div>
            </div>
            {previewAssets.inspirationPreviews.length > 0 && (
              <div className="mt-5">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Inspiration snapshots</div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {previewAssets.inspirationPreviews.map((preview) => (
                    <div key={preview} className="overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
                      <img src={preview} alt="Inspiration preview" className="h-24 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Live narration</div>
                <div className="mt-1 text-sm text-gray-400">Generated from the selections you make.</div>
              </div>
              <BadgePill tone="soft">{estimate.complexity}</BadgePill>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-200">{narration}</p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/20 p-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Blueprint snapshot</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-gray-500">Business</div>
                <div className="mt-1 text-sm font-extrabold">{activeBusiness.label}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-gray-500">Project</div>
                <div className="mt-1 text-sm font-extrabold">{activeProject.label}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-gray-500">Sections</div>
                <div className="mt-1 text-sm font-extrabold">{form.sections.length}</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-gray-500">Features</div>
                <div className="mt-1 text-sm font-extrabold">{form.features.length}</div>
              </div>
            </div>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Current estimate</div>
              <div className="mt-2 text-3xl font-extrabold">{formatMoney(estimate.min)}-{formatMoney(estimate.max)}</div>
              <div className="mt-2 text-sm text-gray-400">{estimate.timeline} · {estimate.pace.label}</div>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full blueprint-shine" style={{ width: `${Math.min(96, estimate.score * 7)}%`, background: theme.accent }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlueprintBuilder;
