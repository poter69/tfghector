diff --git a//dev/null b/index.js
index 0000000000000000000000000000000000000000..fb450a259c5b7fe12981e4177be622f70bb91be7 100644
--- a//dev/null
+++ b/index.js
@@ -0,0 +1,162 @@
+document.addEventListener("DOMContentLoaded", () => {
+  const toggleBtn = document.getElementById("themeToggle");
+  const themeIcon = toggleBtn.querySelector("i");
+  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
+  const yearSpan = document.getElementById("year");
+
+  // Año dinámico para el footer
+  if (yearSpan) {
+    yearSpan.textContent = new Date().getFullYear();
+  }
+
+  // Función para aplicar tema
+  const setTheme = mode => {
+    document.documentElement.setAttribute("data-theme", mode);
+    themeIcon.className = mode === "dark" ? "fas fa-moon" : "fas fa-sun";
+  };
+
+  // Inicializa según sistema
+  setTheme(prefersDark.matches ? "dark" : "light");
+
+  // Reacciona a cambios del SO
+  prefersDark.addEventListener("change", e => setTheme(e.matches ? "dark" : "light"));
+
+  // Toggle manual (temporal) al hacer clic
+  toggleBtn.addEventListener("click", () => {
+    const current = document.documentElement.getAttribute("data-theme");
+    setTheme(current === "dark" ? "light" : "dark");
+    toggleBtn.classList.add("animate");
+    setTimeout(() => toggleBtn.classList.remove("animate"), 600);
+  });
+  // Inicializa según sistema
+  setTheme(prefersDark.matches ? "dark" : "light");
+  // Reacciona a cambios del SO
+  prefersDark.addEventListener("change", e => setTheme(e.matches ? "dark" : "light"));
+
+  // === 2. Lenis scroll (solo escritorio) ===
+  if (window.Lenis && window.innerWidth >= 768) {
+    const lenis = new Lenis({ smooth: true, lerp: 0.1 });
+    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
+    requestAnimationFrame(raf);
+  }
+  // === 3. Menú hamburguesa ===
+  const hamburger = document.querySelector('.hamburger');
+  const sidebar = document.querySelector('nav.sidebar');
+  hamburger.addEventListener("click", () => {
+    sidebar.classList.toggle("open");
+    const barIcon = hamburger.querySelector("i");
+    barIcon.classList.toggle("fa-bars");
+    barIcon.classList.toggle("fa-times");
+  });
+
+  // Cerrar menú al hacer clic fuera o en enlace
+  document.addEventListener("click", e => {
+    if (
+      e.target.closest(".hamburger") ||
+      e.target.closest("nav.sidebar") ||
+      e.target.closest(".doc-block button") ||
+      e.target.closest("#doc-details")
+    ) return;
+    if (sidebar.classList.contains("open")) {
+      sidebar.classList.remove("open", "submenu");
+      const barIcon = hamburger.querySelector("i");
+      barIcon.classList.add("fa-bars");
+      barIcon.classList.remove("fa-times");
+    }
+  });
+
+// === 4) Scroll suave interno + cierre de menú en móvil ===
+const links = document.querySelectorAll('a[href^="#"]');
+links.forEach(a =>
+  a.addEventListener('click', e => {
+    e.preventDefault();
+    const tgt = document.querySelector(a.getAttribute('href'));
+    if (tgt) tgt.scrollIntoView({ behavior: 'smooth' });
+
+    // cerrar menú si está abierto (móvil)
+    if (sidebar.classList.contains('open')) {
+      sidebar.classList.remove('open');
+      const barIcon = hamburger.querySelector('i');
+      barIcon.classList.add('fa-bars');
+      barIcon.classList.remove('fa-times');
+    }
+  })
+);
+  // === 5. Ver detalles de documentos (submenu) ===
+  window.displayDetails = (title, data) => {
+    sidebar.classList.add('open', 'submenu');
+    const barIcon = hamburger.querySelector('i');
+    barIcon.classList.remove('fa-bars');
+    barIcon.classList.add('fa-times');
+    const d = document.getElementById('doc-details');
+    d.innerHTML = `
+      <button class="close-btn">Cerrar</button>
+      <h4>${title}</h4>
+      <p><strong>Palabras:</strong> ${data.words}</p>
+      <p><strong>Páginas:</strong> ${data.pages}</p>
+      <p><strong>Edición:</strong> ${data.edit}</p>
+      <p><strong>Lectura:</strong> ${data.read}</p>
+      <p><strong>Progreso:</strong> ${data.percent}%</p>
+      <a href="${data.link}" class="btn" target="_blank">
+        <i class="fas fa-download"></i> Descargar PDF
+      </a>
+    `;
+    // Cerrar submenu
+    d.querySelector('.close-btn').addEventListener('click', () => {
+      sidebar.classList.remove('submenu');
+      d.innerHTML = '';
+      barIcon.classList.remove('fa-times');
+      barIcon.classList.add('fa-bars');
+    });
+  };
+// === 6. Partículas dinámicas según tema ===
+(function(){
+  const canvasEl = document.getElementById('particles');
+  if (!canvasEl) return;
+  const ctx = canvasEl.getContext('2d');
+  let width = window.innerWidth, height = window.innerHeight;
+  canvasEl.width = width; canvasEl.height = height;
+class Particle {
+  constructor() { this.reset(); }
+  reset() {
+    this.x = Math.random() * width;
+    this.y = Math.random() * height;
+    this.size = Math.random() * 1.5 + 0.5; // Pequeñas pero visibles
+    this.speed = Math.random() * 2 + 1;    // Más rápidas
+    this.angle = Math.random() * Math.PI * 2;
+    this.life = Math.random() * 100 + 50; // Vida de la partícula (iteraciones)
+    this.initialLife = this.life;
+  }
+  update() {
+    this.x += Math.cos(this.angle) * this.speed;
+    this.y += Math.sin(this.angle) * this.speed;
+    this.life--;
+    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.life <= 0) {
+      this.reset();
+    }
+  }
+  draw() {
+    const theme = document.documentElement.getAttribute('data-theme');
+    const color = theme === 'light' ? '0,123,255' : '217,4,41';
+    // Opacidad que disminuye con la vida
+    const opacity = (this.life / this.initialLife) * (this.size / 2.5); // Ajusta el divisor 2.5 según necesites
+    ctx.fillStyle = `rgba(<span class="math-inline">\{color\},</span>{Math.max(0, opacity)})`; // Asegura que la opacidad no sea negativa
+    ctx.beginPath();
+    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
+    ctx.fill();
+  }
+}
+
+const particles = Array.from({ length: 15 }, () => new Particle()); // Pocas "estrellas fugaces", ej. 15
+    function animate() {
+      ctx.clearRect(0,0,width,height);
+      particles.forEach(p => { p.update(); p.draw(); });
+      requestAnimationFrame(animate);
+    }
+    window.addEventListener('resize', () => {
+      width = window.innerWidth; height = window.innerHeight;
+      canvasEl.width = width; canvasEl.height = height;
+    });
+    animate();
+  })();
+});
