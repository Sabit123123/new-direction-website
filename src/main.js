import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────
   LENIS  smooth scroll
───────────────────────────────────────── */
const isMobile = window.matchMedia('(hover:none)').matches
const lenis = new Lenis({
  duration: isMobile ? 0.7 : 1.15,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.6,
})
lenis.stop()   // hold until loader exits

gsap.ticker.add(time => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)
lenis.on('scroll', ScrollTrigger.update)

// Start after loader exits
const startLenis = () => lenis.start()
const loader = document.getElementById('loader')
if (loader) loader.addEventListener('transitionend', startLenis, { once: true })
else setTimeout(startLenis, 50)  // no loader on service pages — start quickly

/* ─────────────────────────────────────────
   THREE.JS  WebGL particle field on #hero-canvas
───────────────────────────────────────── */
function initHeroGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.getElementById('hero-canvas')
  if (!canvas) return

  const W = canvas.offsetWidth
  const H = canvas.offsetHeight
  const PR = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setPixelRatio(PR)
  renderer.setSize(W, H, false)
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const aspect = W / H
  const HALF = 1
  const camera = new THREE.OrthographicCamera(-HALF * aspect, HALF * aspect, HALF, -HALF, 0.1, 10)
  camera.position.z = 2

  /* ── Particle system A — floating dust field ── */
  const COUNT = isMobile ? 600 : 1200
  const posArr   = new Float32Array(COUNT * 3)
  const colArr   = new Float32Array(COUNT * 3)
  const sizeArr  = new Float32Array(COUNT)
  const alphaArr = new Float32Array(COUNT)
  const vyArr    = new Float32Array(COUNT)
  const vxArr    = new Float32Array(COUNT)
  const seedArr  = new Float32Array(COUNT)

  const GOLD = new THREE.Color(0xC9A227)
  const RED  = new THREE.Color(0xFF2D20)

  function spawnParticle(i, randomY) {
    const i3 = i * 3
    posArr[i3]     = (Math.random() - 0.5) * 2 * aspect
    posArr[i3 + 1] = randomY ? (Math.random() - 0.5) * 2 : -HALF - 0.05
    posArr[i3 + 2] = 0
    vyArr[i]   = 0.0004 + Math.random() * 0.0007
    vxArr[i]   = (Math.random() - 0.5) * 0.0003
    sizeArr[i] = 1.5 + Math.random() * 3.5
    alphaArr[i] = 0.08 + Math.random() * 0.55
    seedArr[i]  = Math.random() * Math.PI * 2
    const useGold = Math.random() < 0.82
    const c = useGold ? GOLD : RED
    colArr[i3]     = c.r
    colArr[i3 + 1] = c.g
    colArr[i3 + 2] = c.b
  }

  for (let i = 0; i < COUNT; i++) spawnParticle(i, true)

  const geoA = new THREE.BufferGeometry()
  const posAttr   = new THREE.BufferAttribute(posArr,   3).setUsage(THREE.DynamicDrawUsage)
  const colAttr   = new THREE.BufferAttribute(colArr,   3)
  const alphaAttr = new THREE.BufferAttribute(alphaArr, 1).setUsage(THREE.DynamicDrawUsage)
  geoA.setAttribute('position', posAttr)
  geoA.setAttribute('color',    colAttr)
  geoA.setAttribute('aAlpha',   alphaAttr)
  geoA.setAttribute('aSize',    new THREE.BufferAttribute(sizeArr, 1))

  const matA = new THREE.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: PR },
      uRepel:      { value: new THREE.Vector2(-9, -9) },
    },
    vertexShader: /* glsl */`
      attribute float aAlpha;
      attribute float aSize;
      uniform float uPixelRatio;
      uniform vec2  uRepel;
      varying float vAlpha;
      varying vec3  vCol;

      void main() {
        vCol   = color;
        vAlpha = aAlpha;

        vec3 pos = position;
        vec2 diff = pos.xy - uRepel;
        float d   = length(diff);
        float R   = 0.32;
        if (d < R && d > 0.0) {
          float str = (1.0 - d / R) * 0.028;
          pos.xy += normalize(diff) * str;
        }

        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position  = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * 180.0;
      }
    `,
    fragmentShader: /* glsl */`
      varying float vAlpha;
      varying vec3  vCol;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.05, d) * vAlpha;
        gl_FragColor = vec4(vCol, a);
      }
    `,
  })

  const pointsA = new THREE.Points(geoA, matA)
  scene.add(pointsA)

  /* ── Particle system B — large bokeh glints ── */
  const GLINT = isMobile ? 12 : 24
  const gPosArr  = new Float32Array(GLINT * 3)
  const gColArr  = new Float32Array(GLINT * 3)
  const gSizeArr = new Float32Array(GLINT)
  const gAlpArr  = new Float32Array(GLINT)
  const gVyArr   = new Float32Array(GLINT)
  const gSeed    = new Float32Array(GLINT)
  for (let i = 0; i < GLINT; i++) {
    const i3 = i * 3
    gPosArr[i3]     = (Math.random() - 0.5) * 2 * aspect
    gPosArr[i3 + 1] = (Math.random() - 0.5) * 2
    gPosArr[i3 + 2] = 0
    gColArr[i3] = GOLD.r; gColArr[i3+1] = GOLD.g; gColArr[i3+2] = GOLD.b
    gSizeArr[i] = 8 + Math.random() * 10
    gAlpArr[i]  = 0.06 + Math.random() * 0.12
    gVyArr[i]   = 0.0001 + Math.random() * 0.00005
    gSeed[i]    = Math.random() * Math.PI * 2
  }
  const geoB = new THREE.BufferGeometry()
  const gPosAttr = new THREE.BufferAttribute(gPosArr, 3).setUsage(THREE.DynamicDrawUsage)
  const gAlpAttr = new THREE.BufferAttribute(gAlpArr, 1)
  geoB.setAttribute('position', gPosAttr)
  geoB.setAttribute('color',    new THREE.BufferAttribute(gColArr,  3))
  geoB.setAttribute('aAlpha',   gAlpAttr)
  geoB.setAttribute('aSize',    new THREE.BufferAttribute(gSizeArr, 1))
  const pointsB = new THREE.Points(geoB, matA) // reuse same shader
  scene.add(pointsB)

  /* ── Wireframe icosahedra — angular depth elements ── */
  const icoMat = new THREE.MeshBasicMaterial({ color: 0xC9A227, wireframe: true, transparent: true, opacity: 0.055 })
  const ico1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 1), icoMat)
  ico1.position.set(aspect * 0.62, -0.18, -0.5)
  scene.add(ico1)

  const ico2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.16, 1),
    new THREE.MeshBasicMaterial({ color: 0xF0C94A, wireframe: true, transparent: true, opacity: 0.08 })
  )
  ico2.position.set(-aspect * 0.7, 0.22, -0.3)
  scene.add(ico2)

  /* ── Connection lines (desktop only) ── */
  let linesMesh = null
  const MAX_SEGS = 600
  if (!isMobile) {
    const linePosArr = new Float32Array(MAX_SEGS * 2 * 3)
    const lineGeo = new THREE.BufferGeometry()
    const lineAttr = new THREE.BufferAttribute(linePosArr, 3).setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', lineAttr)
    lineGeo.setDrawRange(0, 0)
    linesMesh = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0xC9A227, transparent: true, opacity: 0.055
    }))
    scene.add(linesMesh)
  }

  /* ── Mouse repel ── */
  const rawMouse  = new THREE.Vector2(-9, -9)
  const repelVec  = new THREE.Vector2(-9, -9)

  const hero = document.getElementById('hero')
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect()
      rawMouse.x = ((e.clientX - r.left) / r.width)  * 2 * aspect - aspect
      rawMouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }, { passive: true })
    hero.addEventListener('mouseleave', () => { rawMouse.set(-9, -9) })
  }

  /* ── Resize ── */
  const onResize = () => {
    const nW = canvas.offsetWidth, nH = canvas.offsetHeight
    const nA = nW / nH
    renderer.setSize(nW, nH, false)
    camera.left  = -HALF * nA; camera.right = HALF * nA
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize, { passive: true })

  /* ── IntersectionObserver — pause when hero is offscreen ── */
  let visible = true
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting }, { threshold: 0 })
      .observe(canvas)
  }

  /* ── Render loop ── */
  let frameId
  let t = 0
  renderer.setAnimationLoop(ts => {
    if (!visible) return
    t = ts * 0.001

    // Lerp repel toward raw mouse
    repelVec.x += (rawMouse.x - repelVec.x) * 0.1
    repelVec.y += (rawMouse.y - repelVec.y) * 0.1
    matA.uniforms.uRepel.value.copy(repelVec)

    // Update dust particles
    let lineSeg = 0
    const linePosData = linesMesh ? linesMesh.geometry.attributes.position.array : null
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      posArr[i3]     += vxArr[i] + Math.sin(t * 0.4 + seedArr[i]) * 0.00015
      posArr[i3 + 1] += vyArr[i]
      alphaArr[i]    -= 0.00045
      if (posArr[i3 + 1] > HALF + 0.05 || alphaArr[i] <= 0) spawnParticle(i, false)

      // Connection lines — sample every 3rd particle for performance
      if (linePosData && i % 3 === 0 && lineSeg < MAX_SEGS) {
        for (let j = i + 3; j < Math.min(i + 60, COUNT); j += 3) {
          const j3 = j * 3
          const dx = posArr[i3] - posArr[j3]
          const dy = posArr[i3+1] - posArr[j3+1]
          if (dx*dx + dy*dy < 0.028) {
            const ls = lineSeg * 6
            linePosData[ls]   = posArr[i3];   linePosData[ls+1] = posArr[i3+1]; linePosData[ls+2] = 0
            linePosData[ls+3] = posArr[j3];   linePosData[ls+4] = posArr[j3+1]; linePosData[ls+5] = 0
            lineSeg++
            if (lineSeg >= MAX_SEGS) break
          }
        }
      }
    }
    posAttr.needsUpdate   = true
    alphaAttr.needsUpdate = true

    if (linesMesh) {
      linesMesh.geometry.attributes.position.needsUpdate = true
      linesMesh.geometry.setDrawRange(0, lineSeg * 2)
    }

    // Update bokeh glints
    for (let i = 0; i < GLINT; i++) {
      const i3 = i * 3
      gPosArr[i3]     += Math.sin(t * 0.3 + gSeed[i]) * 0.00018
      gPosArr[i3 + 1] += gVyArr[i]
      if (gPosArr[i3 + 1] > HALF + 0.1) gPosArr[i3 + 1] = -HALF - 0.1
    }
    gPosAttr.needsUpdate = true

    // Rotate wireframes
    ico1.rotation.x = t * 0.12; ico1.rotation.y = t * 0.08
    ico2.rotation.x = -t * 0.09; ico2.rotation.z = t * 0.13

    renderer.render(scene, camera)
  })
}

/* ─────────────────────────────────────────
   GSAP  scroll-triggered animations
───────────────────────────────────────── */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  /* ── Hero bg parallax ── */
  gsap.to('.hero-bg', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  })
  gsap.to('.hero-content', {
    yPercent: -12, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '40% top', scrub: true },
  })
  gsap.to('#hero-canvas', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: '20% top', end: '70% top', scrub: true },
  })

  /* ── Navbar entrance (after loader) ── */
  const navDelay = document.getElementById('loader') ? 1.85 : 0.2
  gsap.from('#navbar', { y: -28, opacity: 0, duration: 0.7, ease: 'power3.out', delay: navDelay })

  /* ── Stats ── */
  gsap.from('.stat-item, .stat-block', {
    opacity: 0, y: 36, duration: 0.65, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '#stats', start: 'top 82%', once: true },
  })
  ScrollTrigger.create({
    trigger: '#stats', start: 'top 80%', once: true,
    onEnter() {
      document.querySelectorAll('.counter').forEach(el => {
        const target = parseInt(el.dataset.target, 10)
        gsap.to({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.floor(this.targets()[0].val) },
        })
      })
    },
  })

  /* ── Event types ── */
  gsap.from('.etype-card', {
    opacity: 0, y: 44, scale: 0.95, duration: 0.55, ease: 'back.out(1.4)',
    stagger: { each: 0.09, from: 'start' },
    scrollTrigger: { trigger: '.etypes-grid, .etype-grid', start: 'top 80%', once: true },
  })

  /* ── Process — pin + sequential reveal ── */
  const processSteps = gsap.utils.toArray('.process-step')
  if (processSteps.length) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#process',
        start: 'top top',
        end: '+=380',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    })
    .from(processSteps, { opacity: 0, x: -52, duration: 1, ease: 'power2.out', stagger: 0.3 })
    .from('.process-step .process-num, .process-step .step-num', {
      opacity: 0, scale: 1.5, duration: 0.5, ease: 'power3.out', stagger: 0.3,
    }, '<0.1')
  }

  /* ── Services grid ── */
  gsap.from('.service-card', {
    opacity: 0, y: 58, skewY: 1.5, duration: 0.72, ease: 'expo.out',
    stagger: { each: 0.08, grid: [2, 3], from: 'start' },
    scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true },
  })

  /* ── Why us ── */
  gsap.from('.why-item', {
    opacity: 0, x: -44, duration: 0.62, ease: 'power3.out', stagger: 0.14,
    scrollTrigger: { trigger: '#why', start: 'top 78%', once: true },
  })
  gsap.from('.why-image-wrap', {
    opacity: 0, scale: 0.92, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#why', start: 'top 78%', once: true },
  })
  gsap.to('.why-image-wrap img', {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '#why', start: 'top bottom', end: 'bottom top', scrub: true },
  })

  /* ── Testimonials ── */
  gsap.from('.review-card', {
    opacity: 0, y: 50, rotateX: 8, transformOrigin: 'bottom center',
    duration: 0.72, ease: 'power3.out',
    stagger: { each: 0.13, from: 'start' },
    scrollTrigger: { trigger: '#testimonials', start: 'top 80%', once: true },
  })

  /* ── Portfolio ── */
  gsap.from('.portfolio-item', {
    opacity: 0, scale: 0.92, duration: 0.7, ease: 'power2.out',
    stagger: { each: 0.09, from: 'random' },
    scrollTrigger: { trigger: '#portfolio', start: 'top 80%', once: true },
  })

  /* ── Equipment ── */
  gsap.from('.equip-track-wrap', {
    opacity: 0, x: -64, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#equipment', start: 'top 78%', once: true },
  })
  ScrollTrigger.create({
    trigger: '#equipment', start: 'top bottom', end: 'bottom top',
    onUpdate(self) {
      const track = document.querySelector('.equip-track')
      if (track) {
        const v = Math.abs(self.getVelocity())
        track.style.animationDuration = gsap.utils.clamp(14, 44, 30 - v * 0.01) + 's'
      }
    },
  })

  /* ── Clients ── */
  gsap.from('.client-item', {
    opacity: 0, x: -20, duration: 0.5, ease: 'power2.out', stagger: 0.07,
    scrollTrigger: { trigger: '#clients', start: 'top 83%', once: true },
  })

  /* ── Planner promo ── */
  gsap.from('.planner-promo, .planner-banner', {
    opacity: 0, scale: 0.96, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '.planner-promo, .planner-banner', start: 'top 80%', once: true },
  })
  gsap.from('.planner-icon', {
    scale: 0, rotation: -22, duration: 0.7, ease: 'back.out(2)', delay: 0.3,
    scrollTrigger: { trigger: '.planner-promo, .planner-banner', start: 'top 80%', once: true },
  })

  /* ── FAQ ── */
  gsap.from('.faq-item', {
    opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.07,
    scrollTrigger: { trigger: '#faq', start: 'top 82%', once: true },
  })

  /* ── Contact ── */
  gsap.from('.contact-card, .contact-left > *, .contact-form > *, .contact-item', {
    opacity: 0, y: 40, duration: 0.75, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '#contact', start: 'top 78%', once: true },
  })

  /* ── Footer ── */
  gsap.from('footer > *', {
    opacity: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: 'footer', start: 'top 92%', once: true },
  })

  /* ── Service detail page sections ── */
  gsap.from('.svc-hero-title', {
    opacity: 0, y: 40, duration: 0.85, ease: 'power3.out', delay: 0.15,
  })
  gsap.from('.svc-hero-sub', {
    opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', delay: 0.38,
  })
  gsap.from('.feat', {
    opacity: 0, y: 44, duration: 0.6, ease: 'power3.out',
    stagger: { each: 0.1 },
    scrollTrigger: { trigger: '.features-grid', start: 'top 82%', once: true },
  })
  gsap.from('.role-card', {
    opacity: 0, y: 40, duration: 0.6, ease: 'power2.out',
    stagger: { each: 0.1 },
    scrollTrigger: { trigger: '.roles-grid', start: 'top 82%', once: true },
  })
  gsap.from('.pstep', {
    opacity: 0, y: 30, scale: 0.96, duration: 0.5, ease: 'power2.out',
    stagger: { each: 0.12 },
    scrollTrigger: { trigger: '.process-steps', start: 'top 82%', once: true },
  })
  gsap.from('.gal-img', {
    opacity: 0, scale: 0.93, duration: 0.65, ease: 'power2.out',
    stagger: { each: 0.1 },
    scrollTrigger: { trigger: '.gallery', start: 'top 82%', once: true },
  })
  gsap.from('.cta-banner', {
    opacity: 0, y: 36, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-banner', start: 'top 82%', once: true },
  })

  /* ── Generic .reveal fallback (for any section not covered) ── */
  gsap.utils.toArray('.reveal').forEach(el => {
    if (gsap.getProperty(el, 'opacity') < 0.1) return // already handled above
    gsap.fromTo(el,
      { y: 44, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    )
  })

  /* ── Ambient orbs parallax ── */
  document.querySelectorAll('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: `-${(0.12 + i * 0.06) * 100}vh`, ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    })
  })
}

/* ─────────────────────────────────────────
   FAQ  smooth GSAP accordion (monkey-patch)
───────────────────────────────────────── */
function initFaqGSAP() {
  // Override the existing toggleFaq function with GSAP-animated version
  window.toggleFaq = function(btn) {
    const item   = btn.closest('.faq-item')
    const answer = item.querySelector('.faq-a')
    const isOpen = item.classList.contains('open')

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open')
      const a = openItem.querySelector('.faq-a')
      gsap.to(a, {
        height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0,
        duration: 0.3, ease: 'power2.in',
        onComplete() { a.style.display = 'none' },
      })
    })

    if (!isOpen) {
      item.classList.add('open')
      answer.style.cssText = 'display:block;height:auto;overflow:hidden'
      const h = answer.scrollHeight
      gsap.fromTo(answer,
        { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 },
        { height: h, opacity: 1, paddingTop: 16, paddingBottom: 24, duration: 0.38, ease: 'power2.out' }
      )
    }
  }
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTONS  (GSAP elastic release)
───────────────────────────────────────── */
function initMagnetic() {
  if (isMobile) return
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .btn-p, .btn-s').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width  / 2) * 0.3
      const y = (e.clientY - r.top  - r.height / 2) * 0.3
      gsap.to(btn, { x, y, duration: 0.25, ease: 'power2.out', overwrite: true })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)', overwrite: true })
    })
  })
}

/* ─────────────────────────────────────────
   CURSOR  enhanced with GSAP
───────────────────────────────────────── */
function initCursor() {
  if (isMobile) return
  const dot  = document.getElementById('curDot')
  const ring = document.getElementById('curRing')
  if (!dot || !ring) return

  const hoverEls = document.querySelectorAll('a, button, .service-card, .etype-card, .portfolio-item, .equip-card, .faq-q, .feat, .role-card')
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('on-link')
      gsap.to(ring, { scale: 1.9, duration: 0.28, ease: 'power2.out' })
    })
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('on-link')
      gsap.to(ring, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' })
    })
  })
}

/* ─────────────────────────────────────────
   BOOT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeroGL()
  initScrollAnimations()
  initFaqGSAP()
  initMagnetic()
  initCursor()
})
