import React from 'react';
import { Target } from 'lucide-react';

const IMAGES = [
  {
    src: '/bootcamp-hero-2.jpg',
    alt: 'Leadership coach presenting to engaged team in a workshop setting'
  },
  {
    src: '/bootcamp-hero-3.jpg',
    alt: 'Workshop participants taking notes and actively learning leadership skills'
  },
  {
    src: '/bootcamp-hero-4.jpg',
    alt: 'Leadership facilitator presenting high-performing team concepts'
  },
  {
    src: '/bootcamp-hero-5.jpg',
    alt: 'Participants engaged in practical leadership exercises'
  },
  {
    src: '/bootcamp-hero-9.jpg',
    alt: 'Leadership development session with team collaboration'
  },
  {
    src: '/bootcamp-hero-1 copy.jpg',
    alt: 'Interactive leadership training workshop'
  }
];

function HeroWithGallery() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-12 fade-up">
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary text-primary text-sm font-semibold mb-6">
            <Target className="w-4 h-4 mr-2" />
            6-Week Leadership Transformation
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-poppins">
            The Leadership <span className="gradient-text">Bootcamp</span>
          </h1>
          <p className="text-2xl md:text-3xl text-beige-700 font-medium mb-4">
            For new leaders who got the title but never got the tools.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 fade-up">
          {IMAGES.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                index === 0 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 md:h-72 object-cover"
                loading={index > 2 ? 'lazy' : 'eager'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-beige-900/40 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl fade-up max-w-3xl mx-auto">
          <p className="text-xl text-beige-700 leading-relaxed mb-6">
            You've been promoted. You're managing people.
          </p>
          <p className="text-xl text-beige-700 leading-relaxed mb-6">
            <strong>But no one gave you a playbook.</strong>
          </p>
          <p className="text-lg text-beige-600 leading-relaxed">
            You're great at your job. You deliver. You get sh*t done.
            <br />But leading a team? <strong>That's a whole different game.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroWithGallery;
