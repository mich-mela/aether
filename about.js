/**
 * AETHER — About the Creator (Editorial Profile Page)
 * MICHAEL MILAD SAMEER — Founder & Creator of AETHER
 */

import { copyToClipboard, refreshIcons } from './helpers.js';
import { showToast } from './components.js';

const CREATOR_EMAIL = 'michaelmelad49@gmail.com';

export function renderAboutView(container) {
  container.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <div class="page-eyebrow">Platform Founder &amp; Architect</div>
          <h1>About the Creator</h1>
          <p class="page-subtitle">The vision and engineering behind AETHER — Explore Beyond the Unknown.</p>
        </div>
      </div>

      <section class="creator-hero">
        <div class="creator-photo-frame" id="creator-photo-container">
          <img
            src="creator.jpg"
            alt="Michael Milad Sameer — Founder & Creator of AETHER"
            id="creator-photo-img"
          />
          <div class="creator-photo-placeholder hidden" id="creator-photo-fallback">
            <div class="avatar avatar-lg" style="margin:0 auto var(--space-3);">MM</div>
            <p class="text-sm font-semibold" style="color:var(--text-primary);margin-bottom:4px;">MICHAEL MILAD SAMEER</p>
            <p class="text-xs text-muted" style="margin:0;">Place creator portrait at<br /><span class="mono text-cyan">creator.jpg</span></p>
          </div>
        </div>

        <div>
          <div class="page-eyebrow">Founder &amp; Creator of AETHER</div>
          <h2 style="font-size:var(--text-3xl);margin-bottom:var(--space-2);">MICHAEL MILAD SAMEER</h2>
          <p class="text-sm text-cyan font-semibold mb-4">
            Computer Science Student &nbsp;|&nbsp; Programmer &nbsp;|&nbsp; Technology Enthusiast &nbsp;|&nbsp; Aspiring AI Engineer
          </p>
          <p class="text-secondary">
            Michael Milad Sameer is a Computer Science student, programmer, and technology enthusiast with a strong passion for artificial intelligence, software development, and scientific exploration.
          </p>
          <p class="text-secondary">
            Driven by curiosity and a desire to build meaningful technology, he created AETHER as a digital space exploration experience that brings the wonders of the universe closer to everyone.
          </p>
          <p class="text-secondary">
            His vision is to combine technology, creativity, and scientific knowledge to build innovative digital experiences.
          </p>
        </div>
      </section>

      <div class="grid-2 mb-6">
        <section class="card">
          <div class="page-eyebrow">Personal Vision</div>
          <h3 class="mb-3">Curiosity &amp; Meaningful Technology</h3>
          <blockquote class="creator-quote">
            “Curiosity is where every great discovery begins.<br />
            I believe technology is not just about writing code; it is about turning ideas into meaningful experiences and exploring possibilities beyond what we already know.”
          </blockquote>
        </section>

        <section class="card">
          <div class="page-eyebrow">Project Philosophy</div>
          <h3 class="mb-3">Why AETHER?</h3>
          <p class="text-secondary">
            AETHER was created to make space exploration more interactive, accessible, and engaging.
          </p>
          <p class="text-secondary">
            The project combines web technologies, 3D visualization, scientific information, and interactive simulations into one unified exploration experience.
          </p>
          <p class="text-secondary">
            It represents the idea that curiosity and technology can take us beyond the limits of what we already know.
          </p>
        </section>
      </div>

      <section class="card" style="border-color:var(--accent-cyan-border);">
        <div class="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div class="page-eyebrow">Direct Contact</div>
            <h2 style="margin-bottom:2px;">MICHAEL MILAD SAMEER</h2>
            <p class="text-sm text-cyan mb-2">Founder &amp; Creator of AETHER</p>
            <p class="mono text-sm" style="margin:0;">
              Email: <a href="mailto:${CREATOR_EMAIL}">${CREATOR_EMAIL}</a>
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="mailto:${CREATOR_EMAIL}" class="btn btn-primary">
              <i data-lucide="mail" style="width:16px;height:16px;"></i> Send Email
            </a>
            <button type="button" class="btn btn-secondary" id="about-copy-email-btn">
              <i data-lucide="copy" style="width:16px;height:16px;"></i> Copy Email Address
            </button>
          </div>
        </div>
      </section>
    </div>
  `;

  const img = container.querySelector('#creator-photo-img');
  const fallback = container.querySelector('#creator-photo-fallback');
  if (img && fallback) {
    img.addEventListener('error', () => {
      img.classList.add('hidden');
      fallback.classList.remove('hidden');
    });
  }

  container.querySelector('#about-copy-email-btn')?.addEventListener('click', async () => {
    try {
      await copyToClipboard(CREATOR_EMAIL);
      showToast('Email address copied to clipboard: michaelmelad49@gmail.com', 'success');
    } catch {
      showToast(`Email: ${CREATOR_EMAIL}`, 'info');
    }
  });

  refreshIcons();
}
