const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Exhibition = require('../models/Exhibition');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/artgallery';

const CATEGORIES = ['painting', 'sculpture', 'photography', 'digital', 'drawing', 'mixed-media', 'print'];
const PICSUM_BASE = 'https://picsum.photos/seed';

const artworkSeeds = [
  { title: 'Whispers of the Cosmos', description: 'A celestial journey through swirling galaxies and stardust, capturing the infinite beauty of the universe.', culturalHistory: 'Inspired by ancient Mesopotamian star charts and modern astrophotography.', price: 2400, category: 'painting', medium: 'Oil on canvas', year: 2022, tags: ['abstract', 'cosmos', 'blue'], thumbnail: `${PICSUM_BASE}/cosmos/600/700` },
  { title: 'Urban Fragments', description: 'Deconstructed city landscapes reimagined as geometric poetry.', culturalHistory: 'Reflects the post-industrial transformation of metropolitan spaces.', price: 1850, category: 'photography', medium: 'Digital print', year: 2023, tags: ['urban', 'city', 'geometry'], thumbnail: `${PICSUM_BASE}/urban/600/700` },
  { title: 'Silent Bloom', description: 'Hyper-realistic petals frozen in a moment of perfect stillness.', culturalHistory: 'Part of the Neo-Romantic movement celebrating nature's fragile beauty.', price: 3200, category: 'painting', medium: 'Acrylic on board', year: 2021, tags: ['floral', 'realism', 'nature'], thumbnail: `${PICSUM_BASE}/bloom/600/700` },
  { title: 'Echoes of Terra', description: 'Sculptural forms rising from the earth, embodying geological memory.', culturalHistory: 'Draws from pre-Columbian earth sculpture traditions.', price: 5500, category: 'sculpture', medium: 'Bronze', year: 2020, tags: ['earth', 'sculpture', 'organic'], thumbnail: `${PICSUM_BASE}/terra/600/700` },
  { title: 'Digital Reverie', description: 'An AI-assisted dreamscape where code meets canvas.', culturalHistory: 'Explores the intersection of algorithmic creativity and human expression.', price: 980, category: 'digital', medium: 'Generative art print', year: 2024, tags: ['digital', 'AI', 'dreamscape'], thumbnail: `${PICSUM_BASE}/digital1/600/700` },
  { title: 'The Weight of Memory', description: 'Layered textures and muted palettes evoke collective nostalgia.', culturalHistory: 'Influenced by the memory studies movement in contemporary art theory.', price: 2100, category: 'mixed-media', medium: 'Mixed media on paper', year: 2022, tags: ['memory', 'nostalgia', 'texture'], thumbnail: `${PICSUM_BASE}/memory/600/700` },
  { title: 'Chromatic Storm', description: 'Explosive color fields collide in a symphony of controlled chaos.', culturalHistory: 'Abstract expressionism reinterpreted for the digital generation.', price: 3750, category: 'painting', medium: 'Oil on linen', year: 2023, tags: ['abstract', 'color', 'expressionism'], thumbnail: `${PICSUM_BASE}/storm/600/700` },
  { title: 'Invisible Architecture', description: 'Negative space becomes the subject in this minimalist masterpiece.', culturalHistory: 'Rooted in Bauhaus principles of form following function.', price: 1600, category: 'drawing', medium: 'Graphite on paper', year: 2021, tags: ['minimal', 'architecture', 'line'], thumbnail: `${PICSUM_BASE}/architecture/600/700` },
  { title: 'Neon Mythology', description: 'Ancient gods reimagined in electric neon hues.', culturalHistory: 'A postmodern take on Greek and Norse mythological archetypes.', price: 2900, category: 'digital', medium: 'Digital painting', year: 2024, tags: ['mythology', 'neon', 'digital'], thumbnail: `${PICSUM_BASE}/neon/600/700` },
  { title: 'Tidal Frequencies', description: 'Ocean rhythms translated into visual sound waves.', culturalHistory: 'Inspired by Pacific Island navigational traditions and wave patterns.', price: 4100, category: 'mixed-media', medium: 'Resin and pigment', year: 2022, tags: ['ocean', 'waves', 'frequency'], thumbnail: `${PICSUM_BASE}/tidal/600/700` },
  { title: 'Portrait in Fragments', description: 'A shattered self-portrait reconstructed through abstract shards.', culturalHistory: 'Responds to the fragmented identity discourse in contemporary social theory.', price: 3300, category: 'painting', medium: 'Acrylic and collage', year: 2023, tags: ['portrait', 'abstract', 'identity'], thumbnail: `${PICSUM_BASE}/portrait/600/700` },
  { title: 'Sacred Geometry I', description: 'Mathematical perfection rendered in gold leaf and sacred proportions.', culturalHistory: 'Explores the mystical geometry of Islamic architecture and Pythagorean philosophy.', price: 6800, category: 'print', medium: 'Screenprint with gold leaf', year: 2020, tags: ['geometry', 'sacred', 'gold'], thumbnail: `${PICSUM_BASE}/geometry/600/700` },
  { title: 'Between Worlds', description: 'Liminal spaces between consciousness and dream rendered in ethereal light.', culturalHistory: 'Inspired by shamanic journey traditions across multiple cultures.', price: 2750, category: 'photography', medium: 'Fine art photography', year: 2023, tags: ['liminal', 'light', 'ethereal'], thumbnail: `${PICSUM_BASE}/liminal/600/700` },
  { title: 'Iron Phoenix', description: 'Industrial materials forged into a symbol of rebirth and transformation.', culturalHistory: 'Reflects post-industrial reclaimation movements in urban Detroit.', price: 8900, category: 'sculpture', medium: 'Reclaimed steel', year: 2021, tags: ['phoenix', 'industrial', 'rebirth'], thumbnail: `${PICSUM_BASE}/phoenix/600/700` },
  { title: 'Cartography of Dreams', description: 'Hand-drawn maps of imaginary lands with real emotional terrain.', culturalHistory: 'Merges medieval cartographic aesthetics with surrealist automatic drawing.', price: 1450, category: 'drawing', medium: 'Ink on vellum', year: 2024, tags: ['map', 'fantasy', 'surreal'], thumbnail: `${PICSUM_BASE}/map/600/700` },
  { title: 'Quantum Brushstroke', description: 'Nanoscale textures magnified to reveal painting\'s hidden universe.', culturalHistory: 'At the forefront of science-art collaboration, informed by quantum physics.', price: 5200, category: 'digital', medium: 'Archival inkjet print', year: 2023, tags: ['quantum', 'science', 'macro'], thumbnail: `${PICSUM_BASE}/quantum/600/700` },
  { title: 'Mother Tongue', description: 'Text fragments from endangered languages woven into abstract tapestry.', culturalHistory: 'A tribute to over 3,000 endangered languages facing extinction.', price: 3600, category: 'mixed-media', medium: 'Textile and gold thread', year: 2022, tags: ['language', 'culture', 'textile'], thumbnail: `${PICSUM_BASE}/language/600/700` },
  { title: 'Obsidian Reverie', description: 'Dark volcanic glass surfaces reflecting distorted self-portraits.', culturalHistory: 'Draws from Aztec divination mirrors (tezcatl) and their spiritual significance.', price: 4400, category: 'sculpture', medium: 'Obsidian and mirror', year: 2021, tags: ['obsidian', 'reflection', 'aztec'], thumbnail: `${PICSUM_BASE}/obsidian/600/700` },
  { title: 'The Golden Hour', description: 'Countryside bathed in the perfect light of the last hour before sunset.', culturalHistory: 'In the tradition of the Hudson River School landscape painters.', price: 2200, category: 'photography', medium: 'C-print', year: 2023, tags: ['golden', 'landscape', 'nature'], thumbnail: `${PICSUM_BASE}/golden/600/700` },
  { title: 'Constellation Atlas', description: 'Twenty-four original prints mapping personal constellation stories.', culturalHistory: 'Each print interprets star myths from a different world culture.', price: 7200, category: 'print', medium: 'Letterpress on cotton rag', year: 2020, tags: ['constellation', 'stars', 'mythology'], thumbnail: `${PICSUM_BASE}/constellation/600/700` },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Artwork.deleteMany(),
      Exhibition.deleteMany(),
    ]);
    console.log('🧹 Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Alexandra Chen', email: 'admin@gallery.com', password: 'Admin@123', role: 'admin', avatar: `${PICSUM_BASE}/admin/100/100`, bio: 'Platform administrator and art enthusiast.' },
      { name: 'Marcus Reyes', email: 'artist@gallery.com', password: 'Artist@123', role: 'artist', avatar: `${PICSUM_BASE}/artist/100/100`, bio: 'Contemporary artist exploring the intersection of nature and technology.' },
      { name: 'Sophie Laurent', email: 'curator@gallery.com', password: 'Curator@123', role: 'curator', avatar: `${PICSUM_BASE}/curator/100/100`, bio: 'Curator specializing in 21st-century contemporary art and digital installations.' },
      { name: 'James Wilson', email: 'visitor@gallery.com', password: 'Visitor@123', role: 'visitor', avatar: `${PICSUM_BASE}/visitor/100/100`, bio: 'Art collector and gallery visitor.' },
      { name: 'Elena Vasquez', email: 'artist2@gallery.com', password: 'Artist@123', role: 'artist', avatar: `${PICSUM_BASE}/artist2/100/100`, bio: 'Sculptor working with reclaimed materials and industrial processes.' },
    ]);
    console.log(`👥 Created ${users.length} users`);

    const [admin, artist1, curator, visitor, artist2] = users;

    // Create artworks - split between 2 artists
    const artworkDocs = artworkSeeds.map((art, i) => ({
      ...art,
      artist: i % 2 === 0 ? artist1._id : artist2._id,
      status: 'approved',
      isFeatured: i < 6,
      images: [{ url: art.thumbnail }],
    }));

    const artworks = await Artwork.create(artworkDocs);
    console.log(`🖼️  Created ${artworks.length} artworks`);

    // Create exhibition
    const exhibition = await Exhibition.create({
      title: 'Visions of Tomorrow',
      description: 'A groundbreaking exhibition exploring how contemporary artists envision the future of humanity, technology, and nature.',
      theme: 'Futurism & Nature',
      curator: curator._id,
      artworks: artworks.slice(0, 8).map(a => a._id),
      coverImage: `${PICSUM_BASE}/exhibition/800/400`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      isFeatured: true,
      tags: ['contemporary', 'futurism', 'nature'],
      rooms: [
        { name: 'The Cosmic Room', description: 'Celestial wonders and universal mysteries', artworks: artworks.slice(0, 3).map(a => a._id), wallColor: '#0a0a1e' },
        { name: 'The Earth Room', description: 'Grounded in nature and materiality', artworks: artworks.slice(3, 6).map(a => a._id), wallColor: '#1a1209' },
        { name: 'The Digital Room', description: 'Code, algorithms and synthetic beauty', artworks: artworks.slice(6, 8).map(a => a._id), wallColor: '#0a1a0a' },
      ],
    });
    console.log('🏛️  Created exhibition:', exhibition.title);

    console.log('\n🎨 Seed complete! Demo credentials:');
    console.log('  Admin:   admin@gallery.com   / Admin@123');
    console.log('  Artist:  artist@gallery.com  / Artist@123');
    console.log('  Curator: curator@gallery.com / Curator@123');
    console.log('  Visitor: visitor@gallery.com / Visitor@123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
