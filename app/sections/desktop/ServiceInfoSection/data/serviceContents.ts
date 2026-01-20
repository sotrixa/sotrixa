import { ServiceContent } from '@/app/types/services';

/**
 * Service content definitions
 * Contains titles and descriptions for each service offering
 */
export const serviceContents: Record<string, ServiceContent> = {
  RESEARCH: {
    title: 'Deep research, nuanced insight, and future–facing signals that shape powerful strategies',
    description: [
      'At Sotrixa, research is a journey of co–discovery–driven by curiosity, shaped by context, and grounded in your vision.​',
      'Together, we listen between the lines, observe subtle patterns, and trace emerging signals that guide strategic decisions.​',
      'By blending human stories with data–driven insights, we craft nuanced research journeys–through in–depth interviews, thoughtful surveys, cultural listening, and pattern–sensing.​',
      '',
      'What we uncover together:​',
      '• Category Analysis – Understand the shifts and undercurrents defining your space.​',
      '• Competitive Analysis – Gain a clear view of your landscape and your distinction.​',
      '• Consumer Behavior Insights – Explore the drivers, desires, and needs of your audience.​',
      "• Trend Scanning & Forecasting – Anticipate what's next and move ahead of the current.​",
      '• Audience Segmentation – Map real people with real stories and needs–not just numbers.​',
      '',
      'Our findings become a living compass for everything we build together.',
    ],
  },
  'BUSINESS ARCHITECTURE': {
    title: 'Turning vision into a structured, evolving business–ready for real–world growth',
    description: [
      'Every idea holds immense potential, but to thrive, it needs form, coherence, and a structure that sustains growth.​',
      'At Sotrixa, we shape the fundamental elements of your business–what you offer, how you function, and the role you are meant to play.​',
      'Through co–creation, we translate concepts into frameworks and possibilities into actionable plans.​',
      '',
      'What we shape together:​',
      '• Business Model Design – Create a structure that sustains value creation and growth.​',
      '• Offer Design & Positioning – Shape your offerings with clarity, meaning, and distinction.​',
      '• Operational Frameworks – Map systems and processes for consistency and focus.​',
      '• Mission, Vision & Values – Define the deeper truths that guide your evolution.​',
      '• Growth Pathways – Strategize how to expand, shift, or scale intentionally over time.​',
      '',
      'This is where your business becomes an aligned, living structure–ready for strategy and movement.',
    ],
  },
  'BESPOKE STRATEGY CREATION': {
    title: 'Precision–crafted roadmaps that move your vision forward with clarity, coherence, and purpose',
    description: [
      'No two businesses move at the same rhythm.​',
      'At Sotrixa, strategy honors your unique goals, capacity, and context–designing roadmaps that are intelligent, flexible, and fully aligned with your evolution.​',
      'Whether you are launching something new, expanding reach, refining an offer, or exploring partnerships, each strategic layer moves vision into structured, sustainable momentum.​',
      'From go–to–market approaches and visibility plans to audience engagement, growth models, and positioning strategies–every element is crafted to create meaningful forward motion.',
    ],
  },
  'BRAND STORYTELLING': {
    title: "Bringing your business's true story to life–visually, verbally, and emotionally",
    description: [
      'A brand is the memory, the feeling, the story people carry after they meet you.​',
      'At Sotrixa, branding is an act of alignment: we listen deeply to what your business is becoming and translate that into visual and verbal identities that feel alive and true.​',
      'We create logos, color palettes, typography, design elements, and voice and tone guidelines–crafted with precision and emotional resonance.​',
      'More than an aesthetic, your brand becomes an invitation: a true reflection of your story, ready to connect and inspire.',
    ],
  },
  MARKETING: {
    title: 'Expanding your presence with soulful marketing strategies that resonate and move',
    description: [
      'Marketing is the movement of your story into the world–the choreography of voice, vision, and presence.​',
      'At Sotrixa, we craft marketing strategies that are intelligent, soulful, and grounded in authenticity.​',
      'From channel strategies and campaign direction to content pillars, creative activations, and collaborations, every element amplifies your voice and expands your reach with coherence, clarity, and impact.​',
      "Your story doesn't just travel–it moves, it resonates, it builds momentum.",
    ],
  },
  'WEBSITE DEVELOPMENT': {
    title: 'Crafting websites where form meets feeling, and strategy becomes tangible experience',
    description: [
      'Your website is the home of your vision–where strategy meets experience and form meets feeling.​',
      "At Sotrixa, we design digital spaces that are not only beautiful but deeply functional–reflecting your brand's essence while guiding your audience into connection and action.​",
      'Rooted in clarity, crafted with care, your website becomes a living, evolving expression of everything you stand for.​',
      "It's where presence becomes tangible–and impact begins.",
    ],
  },
};

/**
 * Service items with icons for navigation
 */
export const serviceItems = [
  { name: 'RESEARCH', icon: '🔍' },
  { name: 'BUSINESS ARCHITECTURE', icon: '🏛️' },
  { name: 'BESPOKE STRATEGY CREATION', icon: '🧩' },
  { name: 'BRAND STORYTELLING', icon: '✨' },
  { name: 'MARKETING', icon: '📊' },
  { name: 'WEBSITE DEVELOPMENT', icon: '💻' },
];
