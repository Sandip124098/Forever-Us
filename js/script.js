/**
 * ==========================================================================
 * Configuration & Customization Parameters
 * ==========================================================================
 */
const RELATIONSHIP_START_DATE = new Date("2026-05-25T00:00:00"); // Edit this to your start date
const MOON_EASTER_EGG_LIMIT = 5; // Clicks required to unlock moon message
const LOVE_LETTER_TEXT = `I wasn't looking for you. I wasn't trying to get your attention—you just showed up. But when I finally worked up the nerve to message you, something about the way that conversation went felt different from how these things usually go.

It's only been a short while since then, but I don't think I've felt this pulled toward someone in a long time, maybe ever. I noticed you before I actually knew you. I saw your profile, your pictures, and something about you stuck with me before we had even said a single word. Then, once we actually started talking and I got to see who you really are, I was stunned. There is something about the way you carry yourself and the way you come across that I haven't been able to shake.

I'm not going to pretend I have this all figured out. I don't know where this goes, how fast is too fast, or whether a month is nothing or everything. People always say you can't feel something this strong this early, that it takes time to actually fall for someone. But I'm starting to think some connections just don't play by those rules. This feels like one of them.

I'll be honest, I do have my doubts sometimes. It's rare for someone to follow you out of nowhere and have it mean something real; most of the time, it leads to nothing. A part of me wonders if I'm reading into this too much, if I'm building something up in my head that isn't actually there. But then I think about how easy it is to talk to you, and the doubt gets a little quieter.

What I do know is that I'm not interested in something short. I'm not chasing a few weeks of texting that fades out and goes nowhere. If this is real—if what I'm feeling is felt on your end too, even just a little—I want to put in the effort to build something that actually lasts. Not because I need it to fill a gap in my life, but because it is genuinely rare to feel this way, and I don't want to let it pass by in silence.

I don't need constant attention. I don't need perfect timing, or for you to reply within five minutes every time. I just want honesty, and a real, fair chance to see where this could go. That's all I'm asking for.

I know we haven't met in person yet, and I think about that a lot. It's strange to feel this much for someone through a screen, to build a picture of what 'us' could look like off of texts and photos. Sometimes it makes me second-guess myself. How much of this is really you, and how much is just me filling in the gaps with what I want to see? But then I remind myself that people meet in all kinds of ways now, and where something starts doesn't define where it ends.

So this isn't me asking you to promise me forever right now. It's just me being honest about where I'm at, and asking if you'd be open to letting this become something real—going at whatever pace makes sense for both of us. It feels like a fairy tale to me. I don't expect much, but if it is real and if it is true, I can't even begin to express how much I've fallen in love with you in this short time.`;

/**
 * ==========================================================================
 * Main Application Initializer
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // Setup loading page fade out
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("fade-out");
    }, 1200); // Allow loading animation to play fully
  });

  // Load and register modules
  initAudioPlayer();
  initNavigation();
  initIntersectionObserver();
  initRelationshipCounter();
  initGalleryLightbox();
  initProposalInteractions();
  initEasterEgg();
  initCanvasAnimations();
});

/**
 * ==========================================================================
 * Navigation & Scroll Interactions
 * ==========================================================================
 */
function initNavigation() {
  const btnBegin = document.getElementById("btn-begin");
  const ourStorySec = document.getElementById("our-story");
  const backToTopBtn = document.getElementById("back-to-top");
  const progressBar = document.getElementById("scroll-progress");

  // Scroll to Story
  btnBegin.addEventListener("click", () => {
    // Attempt audio play if browser allows
    playMusicSafely();
    ourStorySec.scrollIntoView({ behavior: "smooth" });
  });

  // Track scroll for progress indicator, back-to-top visibility
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;

    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  // Back to top scroll execution
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * ==========================================================================
 * Scroll Reveal Intersection Observer
 * ==========================================================================
 */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll, .fade-in-up");
  
  const options = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        
        // Trigger Love Letter Typing effect when envelope enters screen
        if (entry.target.classList.contains("letter-envelope-container")) {
          startLoveLetterTyping();
        }
        obs.unobserve(entry.target);
      }
    });
  }, options);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * ==========================================================================
 * Love Letter Typing System
 * ==========================================================================
 */
let letterTyped = false;
function startLoveLetterTyping() {
  if (letterTyped) return;
  letterTyped = true;

  const targetText = document.getElementById("typing-text");
  const letterBody = LOVE_LETTER_TEXT;
  let index = 0;
  
  function typeChar() {
    if (index < letterBody.length) {
      targetText.innerHTML += letterBody.charAt(index) === "\n" ? "<br>" : letterBody.charAt(index);
      index++;
      // Natural typing cadence variance
      const typingSpeed = letterBody.charAt(index - 1) === "." || letterBody.charAt(index - 1) === "," ? 350 : 35 + Math.random() * 20;
      setTimeout(typeChar, typingSpeed);
    } else {
      // Hide blinking cursor after finished typing
      const cursor = document.querySelector(".typing-cursor");
      if (cursor) cursor.style.display = "none";
    }
  }
  
  setTimeout(typeChar, 800); // Soft pause before starting
}

/**
 * ==========================================================================
 * Audio Player Management Module
 * ==========================================================================
 */
function playMusicSafely() {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch(err => {
      console.log("Audio play blocked by browser sandbox.", err);
    });
  }
}

// Handle first interaction auto-play fallback across full document
window.addEventListener("click", playMusicSafely, { once: true });
window.addEventListener("touchstart", playMusicSafely, { once: true });

function initAudioPlayer() {
  const bgMusic = document.getElementById("bg-music");
  const playPauseBtn = document.getElementById("btn-play-pause");
  const playIcon = document.getElementById("icon-play");
  const pauseIcon = document.getElementById("icon-pause");
  const volumeSlider = document.getElementById("volume-slider");
  const trackStatus = document.querySelector(".track-status");
  const musicDisc = document.getElementById("music-disc");



  // Play/Pause toggle
  playPauseBtn.addEventListener("click", () => {
    toggleMusic();
  });

  volumeSlider.addEventListener("input", (e) => {
    bgMusic.volume = e.target.value;
  });

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play().catch(err => {
        console.log("Play failed:", err);
      });
    } else {
      bgMusic.pause();
    }
  }

  function updateUIState(isPlaying) {
    if (isPlaying) {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      trackStatus.textContent = "Playing";
      musicDisc.classList.add("playing");
    } else {
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
      trackStatus.textContent = "Paused";
      musicDisc.classList.remove("playing");
    }
  }

  // Keep UI in sync with native audio element state
  bgMusic.addEventListener("play", () => {
    updateUIState(true);
  });
  bgMusic.addEventListener("pause", () => {
    updateUIState(false);
  });
}

/**
 * ==========================================================================
 * Relationship Counter Calculation
 * ==========================================================================
 */
function initRelationshipCounter() {
  const elements = {
    years: document.getElementById("years"),
    months: document.getElementById("months"),
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function updateCounter() {
    const now = new Date();
    const start = RELATIONSHIP_START_DATE;
    
    // Total difference in milliseconds
    let diff = now - start;
    if (diff < 0) diff = 0; // Guard for future dates

    // Approximate date increments
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    // Re-adjust negative second offsets
    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    // Re-adjust negative minute offsets
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    // Re-adjust negative hour offsets
    if (hours < 0) {
      hours += 24;
      days--;
    }
    // Re-adjust negative day offsets
    if (days < 0) {
      // Days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    // Re-adjust negative month offsets
    if (months < 0) {
      months += 12;
      years--;
    }

    // Format helper adding double digits
    const format = num => String(num).padStart(2, '0');

    elements.years.textContent = format(years);
    elements.months.textContent = format(months);
    elements.days.textContent = format(days);
    elements.hours.textContent = format(hours);
    elements.minutes.textContent = format(minutes);
    elements.seconds.textContent = format(seconds);
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

/**
 * ==========================================================================
 * Polaroid Lightbox Viewer & Slider
 * ==========================================================================
 */
function initGalleryLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  const galleryItems = document.querySelectorAll(".gallery-item");

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = itemsArray[currentIndex];
    const img = item.querySelector("img");
    const caption = item.querySelector(".polaroid-caption");

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption.textContent;
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    openLightbox(currentIndex);
  }

  // Register Event Handlers
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // Close lightbox on click outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation support
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/**
 * ==========================================================================
 * Moon Click Easter Egg Logic
 * ==========================================================================
 */
function initEasterEgg() {
  const moon = document.getElementById("moon");
  const banner = document.getElementById("easter-egg-banner");
  let clicks = 0;

  moon.addEventListener("click", () => {
    clicks++;
    
    // Add micro rotation on click
    moon.style.transform = `scale(0.95) rotate(${clicks * 15}deg)`;
    setTimeout(() => {
      moon.style.transform = `scale(1) rotate(${clicks * 15}deg)`;
    }, 150);

    if (clicks === MOON_EASTER_EGG_LIMIT) {
      banner.classList.remove("hidden");
      banner.classList.add("show");
      
      // Auto hide after 8 seconds
      setTimeout(() => {
        banner.classList.remove("show");
        setTimeout(() => banner.classList.add("hidden"), 500);
        clicks = 0; // Reset
      }, 8000);
    }
  });
}

/**
 * ==========================================================================
 * Proposal runaway NO Button & YES Success Climax
 * ==========================================================================
 */
function initProposalInteractions() {
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const celebration = document.getElementById("celebration-overlay");
  const closeCelBtn = document.getElementById("btn-close-celebration");

  // Runaway NO button algorithm
  function escapeButton(e) {
    // Get button dimensions
    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Viewport dimensions
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;

    // Set maximum offset bounds inside the viewport margin
    const maxX = vWidth - btnWidth - 40;
    const maxY = vHeight - btnHeight - 40;

    // Compute random coordinates inside constraints
    let newX = Math.random() * maxX + 20;
    let newY = Math.random() * maxY + 20;

    // Ensure button jumps at least 150px away from cursor/finger position
    let clientX = 0;
    let clientY = 0;
    
    if (e) {
      clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    }

    if (clientX && clientY) {
      const dist = Math.hypot(newX - clientX, newY - clientY);
      if (dist < 180) {
        newX = (newX + 250) % maxX;
        newY = (newY + 250) % maxY;
      }
    }

    // Apply inline fixed position escape
    btnNo.style.position = "fixed";
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.zIndex = "999";
  }

  // Proximity sensor: runs away if cursor gets within 120px
  window.addEventListener("mousemove", (e) => {
    const btnRect = btnNo.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    if (dist < 120) {
      escapeButton(e);
    }
  });

  // Trigger escape on hover, touch, keyboard focus, and click attempts
  btnNo.addEventListener("mouseenter", escapeButton);
  btnNo.addEventListener("focus", escapeButton);
  btnNo.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    escapeButton(e);
  });
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
    escapeButton(e);
  });

  // YES Climax Activation
  btnYes.addEventListener("click", () => {
    celebration.classList.remove("hidden");
    setTimeout(() => {
      celebration.classList.add("active");
      // Trigger Celebration Fireworks Loop
      isCelebrativeState = true;
      triggerConfettiExplosion();
    }, 50);
  });

  // Close celebration overlay
  closeCelBtn.addEventListener("click", () => {
    celebration.classList.remove("active");
    setTimeout(() => {
      celebration.classList.add("hidden");
      isCelebrativeState = false;
    }, 1000);
  });
}

/**
 * ==========================================================================
 * Canvas Performance Particle Animation Systems
 * ==========================================================================
 */
let isCelebrativeState = false;

function initCanvasAnimations() {
  const bgCanvas = document.getElementById("particles-canvas");
  const bgCtx = bgCanvas.getContext("2d");

  const celCanvas = document.getElementById("fireworks-canvas");
  const celCtx = celCanvas.getContext("2d");

  // Track screen size changes
  function resizeCanvases() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    celCanvas.width = window.innerWidth;
    celCanvas.height = window.innerHeight;
  }
  resizeCanvases();
  window.addEventListener("resize", resizeCanvases);

  // Sparkles container triggered by mouse pointer
  const cursorSparkles = [];
  window.addEventListener("mousemove", (e) => {
    // limit sparkles density
    if (Math.random() < 0.25) {
      cursorSparkles.push(new Sparkle(e.clientX, e.clientY));
    }
  });
  window.addEventListener("touchmove", (e) => {
    if (Math.random() < 0.25) {
      cursorSparkles.push(new Sparkle(e.touches[0].clientX, e.touches[0].clientY));
    }
  });

  // Background twinklers initialization
  const starfield = [];
  const starCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 9000));
  for (let i = 0; i < starCount; i++) {
    starfield.push(new TwinklingStar(bgCanvas.width, bgCanvas.height));
  }

  // Shooting Stars
  const shootingStars = [];

  // Rose Petals & Floating Hearts Container
  const floatingPetals = [];
  const maxPetals = Math.min(40, Math.floor(window.innerWidth / 30));

  function spawnPetal(initialY = false) {
    return new FloatingPetal(bgCanvas.width, bgCanvas.height, initialY);
  }

  // Pre-populate petals on screen initial bounds
  for (let i = 0; i < maxPetals; i++) {
    floatingPetals.push(spawnPetal(true));
  }

  // Celebrative structures
  const fireworks = [];
  const fireworksParticles = [];
  const confettiParticles = [];

  // Background Animation Loop
  function animateBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // 1. Draw Twinkling Stars
    starfield.forEach(star => {
      star.update();
      star.draw(bgCtx);
    });

    // 2. Draw & Update Shooting stars randomly
    if (Math.random() < 0.008 && shootingStars.length < 3) {
      shootingStars.push(new ShootingStar(bgCanvas.width, bgCanvas.height));
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.update();
      ss.draw(bgCtx);
      if (!ss.active) {
        shootingStars.splice(i, 1);
      }
    }

    // 3. Draw & Update Sparkles
    for (let i = cursorSparkles.length - 1; i >= 0; i--) {
      const sp = cursorSparkles[i];
      sp.update();
      sp.draw(bgCtx);
      if (sp.opacity <= 0) {
        cursorSparkles.splice(i, 1);
      }
    }

    // 4. Draw & Update floating rose petals & hearts
    for (let i = 0; i < floatingPetals.length; i++) {
      const p = floatingPetals[i];
      p.update(bgCanvas.width, bgCanvas.height);
      p.draw(bgCtx);
      // Recycle out of screen bounds
      if (p.y > bgCanvas.height + 20 || p.x < -20 || p.x > bgCanvas.width + 20) {
        floatingPetals[i] = spawnPetal();
      }
    }

    requestAnimationFrame(animateBackground);
  }

  // Celebration Fireworks loop
  function animateCelebration() {
    if (!isCelebrativeState) {
      celCtx.clearRect(0, 0, celCanvas.width, celCanvas.height);
      requestAnimationFrame(animateCelebration);
      return;
    }

    // Soft visual trace effect for moving fireworks
    celCtx.fillStyle = 'rgba(3, 3, 12, 0.2)';
    celCtx.fillRect(0, 0, celCanvas.width, celCanvas.height);

    // 1. Spawn Fireworks randomly
    if (Math.random() < 0.04 && fireworks.length < 5) {
      const startX = celCanvas.width / 2 + (Math.random() - 0.5) * (celCanvas.width * 0.4);
      const targetX = Math.random() * celCanvas.width;
      const targetY = Math.random() * (celCanvas.height * 0.5) + 50;
      fireworks.push(new Firework(startX, celCanvas.height, targetX, targetY));
    }

    // Update fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i];
      fw.update();
      fw.draw(celCtx);
      if (fw.exploded) {
        spawnFireworkExplosion(fw.x, fw.y);
        fireworks.splice(i, 1);
      }
    }

    // Update firework particles
    for (let i = fireworksParticles.length - 1; i >= 0; i--) {
      const p = fireworksParticles[i];
      p.update();
      p.draw(celCtx);
      if (p.alpha <= 0) {
        fireworksParticles.splice(i, 1);
      }
    }

    // Update Confetti
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const c = confettiParticles[i];
      c.update(celCanvas.width, celCanvas.height);
      c.draw(celCtx);
      if (c.y > celCanvas.height) {
        // Recycle back to top
        c.y = -20;
        c.x = Math.random() * celCanvas.width;
      }
    }

    requestAnimationFrame(animateCelebration);
  }

  // Register Explosion particles
  function spawnFireworkExplosion(x, y) {
    const particleCount = 60 + Math.floor(Math.random() * 40);
    const baseHue = Math.random() * 360;
    for (let i = 0; i < particleCount; i++) {
      fireworksParticles.push(new FireworkParticle(x, y, baseHue));
    }
  }

  // Register Confetti particles
  window.triggerConfettiExplosion = function() {
    confettiParticles.length = 0; // Clear
    const count = Math.min(120, Math.floor(celCanvas.width / 8));
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new Confetti(celCanvas.width, celCanvas.height));
    }
  };

  // Launch Loops
  animateBackground();
  animateCelebration();
}

/**
 * ==========================================================================
 * Particle System Classes & Prototypes
 * ==========================================================================
 */

// 1. Twinkling Background Star
class TwinklingStar {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = 0.5 + Math.random() * 1.5;
    this.maxOpacity = 0.3 + Math.random() * 0.7;
    this.opacity = Math.random() * this.maxOpacity;
    this.twinkleSpeed = 0.005 + Math.random() * 0.015;
    this.increasing = Math.random() > 0.5;
  }

  update() {
    if (this.increasing) {
      this.opacity += this.twinkleSpeed;
      if (this.opacity >= this.maxOpacity) this.increasing = false;
    } else {
      this.opacity -= this.twinkleSpeed;
      if (this.opacity <= 0.05) this.increasing = true;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// 2. Shooting Star with tail
class ShootingStar {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * (canvasWidth * 0.8);
    this.y = Math.random() * (canvasHeight * 0.4);
    this.length = 60 + Math.random() * 80;
    this.speed = 8 + Math.random() * 6;
    this.angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // ~30-45 degrees down-left
    this.dx = Math.cos(this.angle) * this.speed;
    this.dy = Math.sin(this.angle) * this.speed;
    this.opacity = 1.0;
    this.decay = 0.015 + Math.random() * 0.015;
    this.active = true;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= this.decay;
    if (this.opacity <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    const tailX = this.x - Math.cos(this.angle) * this.length;
    const tailY = this.y - Math.sin(this.angle) * this.length;

    const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255, 253, 235, ${this.opacity})`);
    grad.addColorStop(0.1, `rgba(230, 194, 128, ${this.opacity * 0.8})`);
    grad.addColorStop(1, 'rgba(230, 194, 128, 0)');

    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = grad;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }
}

// 3. Falling Rose Petal or Heart particle
class FloatingPetal {
  constructor(canvasWidth, canvasHeight, initialY = false) {
    this.x = Math.random() * canvasWidth;
    this.y = initialY ? Math.random() * canvasHeight : -20;
    this.size = 6 + Math.random() * 10;
    this.type = Math.random() > 0.35 ? "petal" : "heart"; // Mix petals & hearts
    this.speedY = 0.5 + Math.random() * 1.0;
    this.speedX = -(0.2 + Math.random() * 0.6); // drift left
    this.oscillationSpeed = 0.01 + Math.random() * 0.02;
    this.oscillationWidth = 10 + Math.random() * 20;
    this.angle = Math.random() * Math.PI;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = 0.4 + Math.random() * 0.4;
    this.phase = Math.random() * Math.PI;
  }

  update(canvasWidth, canvasHeight) {
    this.y += this.speedY;
    this.phase += this.oscillationSpeed;
    this.x += this.speedX + Math.sin(this.phase) * 0.5;
    this.angle += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;

    if (this.type === "petal") {
      // Draw organic leaf petal shapes
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(this.size / 2, -this.size / 2, this.size, 0);
      ctx.quadraticCurveTo(this.size / 2, this.size / 2, 0, 0);
      ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;
      ctx.fill();
    } else {
      // Draw smooth SVG-like canvas hearts
      ctx.beginPath();
      const hs = this.size / 2.2;
      ctx.moveTo(0, hs / 2);
      ctx.bezierCurveTo(-hs, -hs, -hs * 2.2, hs / 2, 0, hs * 2.2);
      ctx.bezierCurveTo(hs * 2.2, hs / 2, hs, -hs, 0, hs / 2);
      ctx.fillStyle = `rgba(201, 24, 74, ${this.opacity * 0.9})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// 4. Cursor Sparkle Particle
class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 2 + Math.random() * 3;
    this.opacity = 1.0;
    this.decay = 0.02 + Math.random() * 0.02;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5 - 0.5; // slight upward drift
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= this.decay;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 194, 128, ${this.opacity})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(230, 194, 128, 0.8)";
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }
}

// 5. Firework Ascent Node
class Firework {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
    this.distanceTraveled = 0;
    this.speed = 2;
    this.acceleration = 1.03;
    this.angle = Math.atan2(targetY - startY, targetX - startX);
    this.exploded = false;
  }

  update() {
    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    this.distanceTraveled = Math.hypot(vx, vy);

    const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    if (dist < this.speed || dist < 10) {
      this.exploded = true;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
  }
}

// 6. Burst Particle of Firework
class FireworkParticle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 1 + Math.random() * 8;
    this.friction = 0.95;
    this.gravity = 0.15;
    this.hue = hue + (Math.random() - 0.5) * 40;
    this.alpha = 1;
    this.decay = 0.01 + Math.random() * 0.02;
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 1)`;
    ctx.fill();
    ctx.restore();
  }
}

// 7. Confetti Particle
class Confetti {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight - canvasHeight;
    this.size = 6 + Math.random() * 6;
    this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
    this.speedY = 1.5 + Math.random() * 3;
    this.speedX = (Math.random() - 0.5) * 2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.shape = Math.random() > 0.5 ? "rect" : "circle";
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();

    if (this.shape === "rect") {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
