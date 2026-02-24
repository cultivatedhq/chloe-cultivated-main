/* Remove external font imports and use system fonts */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-[#F5F5F0] text-[#2C2C2C];
  }
}

.gradient-bg {
  background: linear-gradient(
    135deg,
    rgba(244, 244, 240, 0.95) 0%,
    rgba(244, 244, 240, 0.7) 100%
  );
  backdrop-filter: blur(10px);
}

.gradient-text {
  background: linear-gradient(90deg, #2A9D8F 0%, #264653 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.grid-pattern {
  background-color: #F5F5F0;
  background-image: 
    linear-gradient(rgba(42, 157, 143, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(42, 157, 143, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  position: relative;
  overflow: hidden;
}

.grid-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(42, 157, 143, 0.08) 0%,
    rgba(245, 245, 240, 0) 70%
  );
  animation: pulse 8s ease-in-out infinite;
}

.grid-pattern::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 400px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    #F5F5F0 100%
  );
  pointer-events: none;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

.fade-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

.card-hover {
  transition: transform 0.3s ease-out, border-color 0.3s ease-out;
}

.card-hover:hover {
  transform: translateY(-5px);
}

.gradient-number {
  position: relative;
}

.gradient-number::after {
  content: '';
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle at center,
    rgba(42, 157, 143, 0.15) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 0;
}