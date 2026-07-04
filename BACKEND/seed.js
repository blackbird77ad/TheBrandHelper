/**
 * seed.js — Seeds the portfolio with real projects
 * Run once from BACKEND folder: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connect, Portfolio } = require('./db');

const PROJECTS = [
  {
    title:       "Belle Kreyashon — Ghana's One-Stop Lifestyle Store",
    category:    "Website Design",
    featured:    true,
    image:       "/images/og-image.jpg.svg",
    link:        "https://bellekreyashon.com",
    tags:        ["E-commerce", "React", "Node.js", "MongoDB", "Paystack", "Cloudinary", "Ghana"],
    description: `We built Belle Kreyashon — Ghana's boldest lifestyle e-commerce platform. Hair, beauty, fashion, skincare, health and gadgets — all in one place, built to move beyond WhatsApp selling and into a fully professional online store.

Customers browse a rich product catalogue, pay instantly with MoMo or card via Paystack, and get delivered nationwide or internationally. Vendors and partners can feature their products directly on the platform, and the business owner manages everything from a powerful admin dashboard — orders, invoices, customers, stock.

What's under the hood:
→ Full e-commerce with cart, checkout & order history
→ Paystack payments (MoMo + card)
→ WhatsApp order alerts for instant notifications
→ Training & consultation booking system
→ Partner product featuring
→ Admin dashboard with invoice generator
→ SEO optimised for West African search traffic

Stack: React · Node.js · MongoDB · Cloudflare · Render · Cloudinary · Paystack

Built for hair vendors, beauty brands, fashion stores, skill trainers, and any West African business ready to stop selling via WhatsApp and start operating like a proper brand.

Running a product-based business in Ghana or West Africa? This is what's possible. Let's build yours.`,
  },
  {
    title:       "Faith & Grace Catering — Full Food Ordering Platform",
    category:    "Website Design",
    featured:    true,
    image:       "/images/Screenshot 2026-03-25 164016.png",
    link:        "https://faithandgracecatering.com",
    tags:        ["Food & Restaurant", "React", "Order Management", "New Jersey", "Catering"],
    description: `We built Faith & Grace Catering a complete online ordering platform for their New Jersey-based catering business — serving individual meals and large party orders with zero friction.

Customers browse a full digital menu, place orders online, and track them in real time. The kitchen gets instant order tickets. The business owner sees everything from a clean management dashboard — no missed orders, no WhatsApp chaos.

What the platform includes:
→ Full menu system with categories and item management
→ Online ordering for individuals and party-size events
→ Real-time order tracking for customers
→ Kitchen order management dashboard
→ Contact & booking for event catering enquiries

📞 862-212-9328 · ✉️ gnigriel@yahoo.com · 📍 New Jersey, USA

Built for catering businesses, restaurants, food vendors, cloud kitchens, and event caterers who want to stop taking orders over the phone and start running a proper digital food business.

Running a food business? View the site — then tell us how you want yours built.`,
  },
];

async function seed() {
  try {
    await connect();

    // Check if already seeded
    const existing = await Portfolio.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} portfolio items.`);
      
      console.log('   Run: node seed.js --force to re-seed');

      if (!process.argv.includes('--force')) {
        process.exit(0);
      }

      console.log('   --force flag detected, clearing and re-seeding...');
      await Portfolio.deleteMany({});
    }

    const inserted = await Portfolio.insertMany(PROJECTS);
    console.log(`\n✅ Seeded ${inserted.length} projects:\n`);
    inserted.forEach(p => console.log(`   → ${p.title}`));
    console.log('\nDone. Visit /portfolio to see them live.\n');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();