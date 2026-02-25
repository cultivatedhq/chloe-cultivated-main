import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

function BootcampEnrollment() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';

    script.onload = () => {
      if (window.hbspt && formContainerRef.current) {
        window.hbspt.forms.create({
          region: 'ap1',
          portalId: '145915098',
          formId: 'Gy4_fLT0Tl62Lw-FfoS7Cg7b5o2s',
          target: '#hubspot-form-container'
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);


  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>
            <div className="flex space-x-6 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition hidden md:block">Home</a>
              <a href="/bootcamp-welcome" className="text-beige-500 hover:text-primary transition hidden md:block">Back</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary text-primary text-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Leadership Bootcamp Enrollment
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-poppins gradient-text">
              Welcome to Bootcamp!
            </h1>
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary to-secondary p-8 md:p-12 rounded-3xl shadow-xl text-white mb-12">
              <p className="text-lg md:text-xl leading-relaxed">
                You've just stepped into the first move toward leveling up your leadership. Drop your details below, nothing is locked in yet. Once you hit submit, I'll personally reach out to chat dates, answer your questions, and make sure you're set up for success. I'm genuinely excited to welcome you into the Bootcamp journey!
              </p>
            </div>
          </div>

          <div
            ref={formContainerRef}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 fade-up"
          >
            <div id="hubspot-form-container"></div>
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

      <style>{`
        #hubspot-form-container .hs-form {
          font-family: inherit;
        }

        #hubspot-form-container .hs-form-field {
          margin-bottom: 1.5rem;
        }

        #hubspot-form-container .hs-form-field label {
          display: block;
          color: #3d3029;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        #hubspot-form-container .hs-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e8dfd6;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        #hubspot-form-container .hs-input:focus {
          outline: none;
          border-color: #2A9D8F;
        }

        #hubspot-form-container textarea.hs-input {
          resize: vertical;
          min-height: 100px;
        }

        #hubspot-form-container select.hs-input {
          background-color: white;
          cursor: pointer;
        }

        #hubspot-form-container .hs-error-msgs {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0 0;
        }

        #hubspot-form-container .hs-error-msg {
          color: #dc2626;
          font-size: 0.875rem;
        }

        #hubspot-form-container .hs-submit {
          margin-top: 2rem;
        }

        #hubspot-form-container .hs-button {
          width: 100%;
          background: linear-gradient(135deg, #2A9D8F 0%, #E76F51 100%);
          color: white;
          padding: 1rem 2rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1.125rem;
          border: 2px solid white;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        #hubspot-form-container .hs-button:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: translateY(-1px);
        }

        #hubspot-form-container .hs-button:active {
          transform: translateY(0);
        }

        #hubspot-form-container .hs-richtext {
          color: #6b5a4a;
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
        }

        #hubspot-form-container .hs-dependent-field {
          margin-top: 1rem;
        }

        #hubspot-form-container .inputs-list {
          list-style: none;
          padding: 0;
        }

        #hubspot-form-container .hs-form-radio,
        #hubspot-form-container .hs-form-checkbox {
          margin-bottom: 0.5rem;
        }

        #hubspot-form-container .hs-form-radio label,
        #hubspot-form-container .hs-form-checkbox label {
          display: inline;
          font-weight: 400;
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default BootcampEnrollment;
