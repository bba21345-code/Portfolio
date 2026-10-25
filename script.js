(() => {
  "use strict";

  // Terminal prompt simulator: local, safe responses based on resume content.
  const terminalForm = document.getElementById("terminalForm");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");
  const commands = {
    help: "Available commands: about, skills, projects, education, certificates, contact, clear",
    about: "I'm Bevara Neeraja, a B.Tech Computer Science & Engineering student interested in AI, computer vision, and practical software projects.",
    skills: "Programming: Python, Java, C\\nWeb: HTML, CSS, JavaScript\\nStrengths: communication, teamwork, problem solving, time management, quick learner.",
    projects: "01 Vision-Based Image Question Answering System\\n02 AI-Based Chess Piece Detection Using YOLO\\n03 AI-Powered Question Answering Using Google Gemini\\n04 Invisible Cloak Using Python and OpenCV",
    education: "B.Tech CSE — Dhanekula Institute of Engineering and Technology (2024–present), CGPA 8.75.\\nIntermediate MPC — Narayana Junior College (2022–2024), 905 marks.\\nSSC — Ideal High School (2022), 513 marks.",
    certificates: "Oracle Cloud Infrastructure 2025 AI Foundations Associate; Palo Alto Cybersecurity (EduSkills); Java Developer (Infosys Springboard); Advanced Robotics Using AI and IoT; Generative AI: Prompt Engineering Basics; Google Cloud — Introduction to Generative AI.",
    contact: "Email: bba21345@gmail.com\\nPhone: +91 93472 85331\\nUse the Contact section below to email or call."
  };

  function typeOutput(text) {
    terminalOutput.textContent = "";
    let i = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { terminalOutput.textContent = text; return; }
    const timer = window.setInterval(() => {
      terminalOutput.textContent += text.charAt(i);
      i += 1;
      if (i >= text.length) window.clearInterval(timer);
    }, 9);
  }
  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = terminalInput.value.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") terminalOutput.textContent = "Terminal cleared. Type 'help' to see available commands.";
    else typeOutput(commands[command] || `Command not found: "${command}"\\nType "help" to see available commands.`);
    terminalInput.value = "";
  });

  // Responsive navigation.
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "CLOSE ×" : "MENU ☰";
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "MENU ☰";
  }));

  // Reveal content only as it enters the viewport.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Active section navigation and scroll progress.
  const progress = document.getElementById("scrollProgress");
  const sectionLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = [...document.querySelectorAll("main section[id]")];
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + "%";
    let current = "home";
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 150) current = section.id; });
    sectionLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Custom cursor is enabled only on devices with a precise pointer.
  if (window.matchMedia("(pointer:fine)").matches) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; });
    function moveRing() {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(moveRing);
    }
    moveRing();
    document.querySelectorAll("a, button, input").forEach(el => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  // Lightweight canvas particles connected by faint lines, gently attracted to pointer.
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0, height = 0, particles = [], pointer = { x: -1000, y: -1000 };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(65, Math.max(24, Math.floor(width / 20)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.5 + .5
    }));
  }
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!reduceMotion) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, distance = Math.hypot(dx, dy);
        if (distance < 115 && distance > 0) { p.x += dx / distance * .18; p.y += dy / distance * .18; }
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(227,75,72,.48)"; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 105) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(163,28,27,${(1 - d / 105) * .16})`;
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawParticles);
  }
  resizeCanvas(); drawParticles();

  // Contact helpers.
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("copyEmail").addEventListener("click", async () => {
    const message = document.getElementById("copyMessage");
    try {
      await navigator.clipboard.writeText("bba21345@gmail.com");
      message.textContent = "Email address copied to clipboard.";
    } catch {
      message.textContent = "Email: bba21345@gmail.com";
    }
  });
})();
