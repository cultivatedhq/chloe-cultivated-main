import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle, PartyPopper } from 'lucide-react';

function BootcampWelcome() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
    });

    document.querySelectorAll('.fade-up').forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleContinue = () => {
    window.location.href = 'https://share-ap1.hsforms.com/1Gy4_fLT0Tl62Lw-FfoS7Cg7b5o2s';
  };

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>
            <div className="flex space-x-6 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition hidden md:block">Home</a>
              <a href="/bootcamp" className="text-beige-500 hover:text-primary transition hidden md:block">Back to Bootcamp</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-poppins gradient-text">
              Welcome to the Bootcamp!
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-beige-800 mb-4">
              You're in and I'm bloody excited to have you on board.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl mb-8 fade-up border-2 border-beige-200">
              <p className="text-lg md:text-xl text-beige-700 leading-relaxed mb-6">
                You've just taken a big step toward becoming the kind of leader your team brags about - the kind who gets sh*t done, earns trust, builds high performance, and still keeps it human.
              </p>

              <p className="text-lg md:text-xl text-beige-700 leading-relaxed mb-6">
                <strong>This isn't another fluffy leadership course.</strong>
              </p>

              <p className="text-lg md:text-xl text-beige-700 leading-relaxed">
                The Leadership Bootcamp is built for real leaders doing real work and we're about to level it up.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary p-8 md:p-12 rounded-3xl shadow-2xl text-white mb-10 fade-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Drop your details below</h2>

                <p className="text-lg md:text-xl leading-relaxed mb-6">
                  So I can personally welcome you and send over:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-lg">Your official Bootcamp onboarding</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-lg">Access dates + call schedule</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-lg">Workbook + session prep</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-lg">Bonus content to get you ahead of the game</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center fade-up">
              <button
                onClick={handleContinue}
                className="inline-flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white px-12 py-6 rounded-full font-bold text-xl hover:shadow-2xl transition border-2 border-white transform hover:scale-105"
              >
                Drop Your Details Here
                <ArrowRight className="ml-3 w-6 h-6" />
              </button>
            </div>

            <div className="text-center mt-8 fade-up">
              <p className="text-beige-500 text-sm">
                Have questions? Email me at{' '}
                <a href="mailto:chloe@cultivatedhq.com.au" className="text-primary hover:text-secondary transition">
                  chloe@cultivatedhq.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-beige-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-2xl font-bold gradient-text mb-2 font-poppins">Cultivated HQ</h4>
              <p className="text-beige-600">From Chaos to Clarity: Leadership That Lasts</p>
            </div>
            <div className="text-center md:text-right">
              <a href="mailto:chloe@cultivatedhq.com.au" className="text-primary hover:text-secondary transition text-lg">
                chloe@cultivatedhq.com.au
              </a>
              <p className="text-beige-500 text-sm mt-2">© 2024 All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BootcampWelcome;
