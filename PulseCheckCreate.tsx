import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Clock, Shield, Users, Brain, MessageSquare, Calendar, Download, Target, Zap, TrendingUp } from 'lucide-react';
import HeroWithGallery from './components/HeroWithGallery';

function LeadershipBootcamp() {
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

  const handleEnroll = () => {
    window.location.href = '/bootcamp-welcome';
  };

  const handleChat = () => {
    window.location.href = 'https://calendly.com/chloe-cultivatedhq/30min?month=2025-10';
  };

  const handleSponsorshipPack = () => {
    window.location.href = 'mailto:chloe@cultivatedhq.com.au?subject=Leadership Bootcamp Sponsorship Pack Request&body=Hi Chloe,%0D%0A%0D%0AI would like to receive the Leadership Bootcamp sponsorship pack to present to my company.%0D%0A%0D%0AThank you!';
  };

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>
            <div className="flex space-x-4 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition hidden md:block">Home</a>
              <button
                onClick={handleChat}
                className="text-primary hover:text-secondary transition font-medium hidden md:block"
              >
                Let's Chat
              </button>
              <button
                onClick={handleEnroll}
                className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-secondary transition"
              >
                Enrol Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      <HeroWithGallery />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <p className="text-xl text-beige-700 mb-8">
              This bootcamp is for new and emerging leaders who are ready to <strong>stop winging it</strong> and <strong>start leading with confidence</strong>.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-poppins">In just 6 weeks, you'll go from unsure to unstoppable:</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              'Lead with clarity instead of self-doubt',
              'Handle difficult conversations like a leader',
              'Hold people accountable without being a micromanager',
              'Build trust fast',
              'Delegate like a boss and stop doing everything yourself',
              'Regulate your emotions (even on the hard days)',
              'Build a culture people actually want to be a part of',
              'Feel confident leading people who used to be your peers'
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-beige-50 p-6 rounded-xl fade-up">
                <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                <p className="text-beige-800 text-lg">{item}</p>
              </div>
            ))}
          </div>

          <div className="text-center fade-up">
            <p className="text-xl text-beige-700 leading-relaxed">
              And no, you don't need 10 years of experience.
              <br />You need <strong>the right tools, frameworks and support</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-beige-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">Let's get specific. This bootcamp is for you if:</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "You've just stepped into your first leadership role",
              "You've been in leadership for 1 to 3 years and still feel like you're figuring it out",
              "You were promoted internally and now you're managing people who used to be your peers",
              "You've never been taught how to lead people, just how to do the job",
              "You're avoiding tricky convos or second-guessing yourself constantly",
              "You want to lead well, build trust and feel confident in the way you show up"
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-white p-6 rounded-xl shadow-md fade-up">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <p className="text-beige-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center fade-up">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">The Guarantee</h2>
            <p className="text-xl leading-relaxed mb-6">
              You'll walk away with the tools, confidence and clarity to lead a team - without the burnout, guesswork or second-guessing.
            </p>
            <p className="text-xl leading-relaxed font-semibold">
              You'll have a leadership style that actually works and still feels like you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Here's how it works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-beige-50 to-beige-100 p-8 rounded-2xl border-2 border-beige-200 fade-up">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">6 Weeks of Training</h3>
              <p className="text-beige-700">Each week, you'll unlock short, high-impact videos. Watch them on your schedule.</p>
            </div>

            <div className="bg-gradient-to-br from-beige-50 to-beige-100 p-8 rounded-2xl border-2 border-beige-200 fade-up">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Workbook & Tools</h3>
              <p className="text-beige-700">Weekly practical exercises, scripts, templates and reflection prompts. No fluff, just things you'll actually use.</p>
            </div>

            <div className="bg-gradient-to-br from-beige-50 to-beige-100 p-8 rounded-2xl border-2 border-beige-200 fade-up">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Coaching Calls</h3>
              <p className="text-beige-700">Weekly 60-minute group sessions with hot-seat coaching, real talk and support.</p>
            </div>

            <div className="bg-gradient-to-br from-beige-50 to-beige-100 p-8 rounded-2xl border-2 border-beige-200 fade-up">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Slack Community Access</h3>
              <p className="text-beige-700">Ask questions, share wins and get feedback from Chloe and the crew.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-beige-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">The Topics We Cover</h2>
          </div>

          <div className="space-y-4">
            {[
              { week: 1, title: 'From Peer to Leader', desc: 'Navigate the transition and establish your leadership presence' },
              { week: 2, title: 'Emotional Intelligence and Communication', desc: 'Master self-awareness and effective communication' },
              { week: 3, title: 'Difficult Conversations and Feedback', desc: 'Handle challenging discussions with confidence' },
              { week: 4, title: 'Delegation and Time Management', desc: 'Free up your time and empower your team' },
              { week: 5, title: 'Performance and Accountability', desc: 'Drive results without micromanaging' },
              { week: 6, title: 'Confidence, Imposter Syndrome and Leadership Growth', desc: 'Build lasting confidence and plan your leadership journey' }
            ].map((week, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary fade-up">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mr-6 flex-shrink-0 text-lg">
                    {week.week}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{week.title}</h3>
                    <p className="text-beige-600">{week.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">What Changes After 6 Weeks?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, text: 'You lead conversations, not avoid them' },
              { icon: Users, text: 'You delegate properly, not just dump tasks' },
              { icon: TrendingUp, text: 'You get buy-in from your team, even the tricky ones' },
              { icon: Shield, text: 'You lead with calm, not chaos' },
              { icon: CheckCircle, text: 'You build real trust and people follow' },
              { icon: Zap, text: 'You stop second-guessing and start owning your decisions' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-beige-50 p-6 rounded-xl fade-up text-center">
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-beige-800 font-medium">{item.text}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 fade-up">
            <p className="text-xl text-beige-700 leading-relaxed">
              This is leadership that sticks. <strong>Not just for now, but for your whole career.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-beige-100 to-beige-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl fade-up">
            <div className="text-center mb-8">
              <Download className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Want your boss to pay for it?</h2>
              <p className="text-xl text-beige-700 mb-6">We'll make that easy. You'll get:</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-beige-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-beige-800 text-lg font-bold mb-2">A ready to send sponsorship letter</p>
                    <p className="text-beige-600">No awkward email writing. Just drop in your details and send it straight to your manager or HR.</p>
                  </div>
                </div>
              </div>

              <div className="bg-beige-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-beige-800 text-lg font-bold mb-2">Clear talking points for the conversation</p>
                    <p className="text-beige-600">So you can walk in with confidence and back yourself - without over explaining.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-beige-50 p-6 rounded-xl border-2 border-primary/20">
              <p className="text-beige-700 text-center">
                Most companies have budget for leadership development - they're just waiting for someone to ask. <strong>That someone is you.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Investment</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl shadow-xl text-white fade-up border-4 border-white">
              <div className="text-center mb-6">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Company Sponsored</h3>
                <div className="text-5xl font-bold mb-2">$2,400</div>
                <p className="text-lg opacity-90">AUD + GST</p>
              </div>
              <p className="text-center opacity-90">If your company is covering it</p>
            </div>

            <div className="bg-gradient-to-br from-secondary to-primary p-8 rounded-2xl shadow-xl text-white fade-up border-4 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full">
                SAVE 50%
              </div>
              <div className="text-center mb-6">
                <Brain className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Self-Funded</h3>
                <div className="text-5xl font-bold mb-2">$1,200</div>
                <p className="text-lg opacity-90">AUD + GST</p>
              </div>
              <p className="text-center opacity-90">Because we want every new leader to have access</p>
            </div>
          </div>

          <div className="mt-12 text-center fade-up">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary mr-3" />
                <p className="text-beige-800 text-lg">Payment plans available</p>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary mr-3" />
                <p className="text-beige-800 text-lg">Sponsorship support included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary via-secondary to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">
              Ready to Lead With Clarity, Confidence and Results?
            </h2>
            <p className="text-xl mb-4 opacity-95">
              This isn't your average leadership course.
            </p>
            <p className="text-xl mb-12 opacity-95">
              It's a reset, a toolkit, and a growth accelerator built by someone who's walked the same path.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleEnroll}
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-beige-50 transition inline-flex items-center shadow-2xl"
              >
                Enrol Now
                <ArrowRight className="ml-3 w-6 h-6" />
              </button>

              <button
                onClick={handleChat}
                className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition inline-flex items-center"
              >
                Let's Chat
                <MessageSquare className="ml-3 w-6 h-6" />
              </button>

              <button
                onClick={handleSponsorshipPack}
                className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition inline-flex items-center"
              >
                Download Sponsorship Pack
                <Download className="ml-3 w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-beige-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="fade-up">
            <p className="text-2xl md:text-3xl text-beige-700 mb-6 leading-relaxed">
              Let's turn <span className="text-primary font-semibold">"I don't know how to lead"</span> into <span className="text-primary font-semibold">"I've got this."</span>
            </p>
            <p className="text-xl text-beige-600 mb-8">
              Become the kind of leader people trust, follow and remember.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
              <p className="text-2xl font-bold text-beige-800 mb-2">Leadership doesn't have to be awkward.</p>
              <p className="text-lg text-beige-600">You just need the right tools.</p>
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

export default LeadershipBootcamp;
