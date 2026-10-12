/**
 * PROXI-PHONE - Vitré
 * Scripts JavaScript : Horaires dynamiques, Menu Mobile, Devis interactif
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStoreStatus();
  initDevisForm();
  initContactForm();
  initScrollTop();
  highlightActiveNav();
});

/* ==========================================================================
   1. MENU MOBILE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  const iconBurger = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  const iconClose = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? iconClose : iconBurger;
  });

  // Fermer le menu si clic en dehors
  document.addEventListener('click', (e) => {
    const isClickToggle = toggleBtn.contains(e.target) || (e.target.closest && e.target.closest('.menu-toggle'));
    const isClickNav = navLinks.contains(e.target) || (e.target.closest && e.target.closest('.nav-links'));

    if (!isClickToggle && !isClickNav && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = iconBurger;
    }
  });

  // Fermer le menu au clic sur un lien ou sous-lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = iconBurger;
      }
    });
  });
}

/* ==========================================================================
   2. GESTION DYNAMIQUE DES HORAIRES D'OUVERTURE
   ========================================================================== */
function initStoreStatus() {
  const statusBadges = document.querySelectorAll('.status-badge');
  const hoursTable = document.querySelector('.hours-table');

  // Planning de Proxi-Phone Vitré
  // 0 = Dimanche, 1 = Lundi, 2 = Mardi, etc.
  const schedule = {
    0: null, // Dimanche : Fermé
    1: null, // Lundi : Fermé
    2: [{ start: 10 * 60, end: 12 * 60 }, { start: 15 * 60, end: 18 * 60 }], // Mardi
    3: [{ start: 10 * 60, end: 12 * 60 }, { start: 15 * 60, end: 18 * 60 }], // Mercredi
    4: [{ start: 10 * 60, end: 12 * 60 }, { start: 15 * 60, end: 18 * 60 }], // Jeudi
    5: [{ start: 10 * 60, end: 12 * 60 }, { start: 15 * 60, end: 18 * 60 }], // Vendredi
    6: [{ start: 10 * 60, end: 12 * 60 }, { start: 15 * 60, end: 18 * 60 }], // Samedi
  };

  const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Mise en surbrillance de la ligne du jour dans le tableau s'il existe
  if (hoursTable) {
    const rows = hoursTable.querySelectorAll('tr[data-day]');
    rows.forEach(row => {
      if (parseInt(row.getAttribute('data-day'), 10) === day) {
        row.classList.add('today');
      }
    });
  }

  // Calcul du statut d'ouverture
  let isOpen = false;
  let statusText = 'Fermé actuellement';

  const todaySlots = schedule[day];

  if (todaySlots) {
    // Vérifier si dans l'un des créneaux
    for (const slot of todaySlots) {
      if (currentMinutes >= slot.start && currentMinutes < slot.end) {
        isOpen = true;
        const endHour = Math.floor(slot.end / 60);
        statusText = `Ouvert • Ferme à ${endHour}h00`;
        break;
      }
    }

    if (!isOpen) {
      if (currentMinutes < todaySlots[0].start) {
        statusText = 'Fermé • Ouvre à 10h00';
      } else if (todaySlots[1] && currentMinutes >= todaySlots[0].end && currentMinutes < todaySlots[1].start) {
        statusText = 'Fermé (pause midi) • Ouvre à 15h00';
      } else {
        // Déjà fermé pour aujourd'hui
        if (day === 6) {
          statusText = 'Fermé • Ouvre mardi à 10h00';
        } else {
          statusText = 'Fermé • Ouvre demain à 10h00';
        }
      }
    }
  } else {
    // Dimanche ou Lundi
    statusText = day === 0 ? 'Fermé • Ouvre mardi à 10h00' : 'Fermé le lundi • Ouvre mardi à 10h00';
  }

  // Mettre à jour l'affichage sur la page
  statusBadges.forEach(badge => {
    badge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
    badge.innerHTML = `<span class="status-dot"></span><span>${statusText}</span>`;
  });
}

/* ==========================================================================
   3. FORMULAIRE DE DEVIS & SIMULATEUR
   ========================================================================== */
function initDevisForm() {
  const form = document.getElementById('devisForm');
  const deviceCards = document.querySelectorAll('.device-picker-item');
  const deviceInput = document.getElementById('selectedDevice');
  const successAlert = document.getElementById('formSuccess');

  // Sélecteur rapide d'appareil
  if (deviceCards.length && deviceInput) {
    deviceCards.forEach(card => {
      card.addEventListener('click', () => {
        deviceCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        deviceInput.value = card.getAttribute('data-device');
      });
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="nom"]').value.trim();
    const phone = form.querySelector('[name="telephone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const brand = form.querySelector('[name="marque"]').value.trim();
    const model = form.querySelector('[name="modele"]').value.trim();
    const problem = form.querySelector('[name="panne"]').value;
    const message = form.querySelector('[name="message"]').value.trim();
    const device = deviceInput ? deviceInput.value : 'Appareil non spécifié';

    const rgpd = (document.getElementById('devisRgpd') || {}).checked;

    if (!name || !phone) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone pour être rappelé.');
      return;
    }

    if (!rgpd) {
      alert('Veuillez accepter la politique de traitement des données pour soumettre votre demande de devis.');
      return;
    }

    // Affichage d'un message de confirmation dynamique
    if (successAlert) {
      successAlert.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px;">
          <svg style="width:24px; height:24px; color:#10b981; flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h4 style="font-weight:700; margin-bottom:4px; color:#065f46;">Demande de devis enregistrée avec succès !</h4>
            <p style="font-size:0.9rem; margin-bottom:10px;">Merci <strong>${escapeHtml(name)}</strong>. Votre demande pour la réparation de votre <strong>${escapeHtml(brand)} ${escapeHtml(model)}</strong> (${escapeHtml(problem)}) a bien été transmise à notre atelier.</p>
            <p style="font-size:0.88rem; color:#047857;">Nous vous recontactons au <strong>${escapeHtml(phone)}</strong> sous quelques heures avec une estimation précise.</p>
            <div style="margin-top:14px;">
              <a href="tel:0637981388" class="btn btn-sm btn-primary" style="text-decoration:none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Appeler directement l'atelier au 06 37 98 13 88
              </a>
            </div>
          </div>
        </div>
      `;
      successAlert.style.display = 'block';
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    }
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* ==========================================================================
   4. FORMULAIRE DE CONTACT (Page contact.html)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Envoyer mon message';

    const nom = (form.querySelector('[name="nom"]') || {}).value?.trim() || '';
    const telephone = (form.querySelector('[name="telephone"]') || {}).value?.trim() || '';
    const email = (form.querySelector('[name="email"]') || {}).value?.trim() || '';
    const message = (form.querySelector('[name="message"]') || {}).value?.trim() || '';
    const website = (form.querySelector('[name="website"]') || {}).value || '';
    const rgpd = (form.querySelector('[name="rgpd"]') || {}).checked;

    if (!nom || !telephone || !message) {
      if (alertBox) {
        alertBox.innerHTML = `
          <div style="padding:14px 18px; border-radius:var(--radius-md); background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; font-size:0.92rem;">
            Veuillez renseigner votre nom, votre numéro de téléphone et votre message.
          </div>`;
        alertBox.style.display = 'block';
      }
      return;
    }

    if (!rgpd) {
      if (alertBox) {
        alertBox.innerHTML = `
          <div style="padding:14px 18px; border-radius:var(--radius-md); background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; font-size:0.92rem;">
            Veuillez cocher la case d'acceptation de la politique de traitement des données pour continuer.
          </div>`;
        alertBox.style.display = 'block';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Envoi en cours...';
    }

    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('telephone', telephone);
      formData.append('email', email);
      formData.append('message', message);
      formData.append('website', website);
      formData.append('rgpd', '1');

      const response = await fetch('send-mail.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result && result.success) {
        if (alertBox) {
          alertBox.innerHTML = `
            <div style="padding:16px 20px; border-radius:var(--radius-md); background:#d1fae5; border:1px solid #6ee7b7; color:#065f46; font-size:0.95rem; display:flex; align-items:flex-start; gap:12px;">
              <svg style="width:24px; height:24px; color:#10b981; flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <strong>Message envoyé avec succès !</strong><br>
                ${escapeHtml(result.message || 'Merci ! Nous vous répondrons dans les plus brefs délais.')}
              </div>
            </div>`;
          alertBox.style.display = 'block';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
      } else {
        throw new Error((result && result.message) || 'Erreur lors de l\'envoi.');
      }
    } catch (err) {
      if (alertBox) {
        alertBox.innerHTML = `
          <div style="padding:16px 20px; border-radius:var(--radius-md); background:#fef3c7; border:1px solid #fde68a; color:#92400e; font-size:0.92rem;">
            <strong>Information :</strong> ${escapeHtml(err.message || 'Le serveur de messagerie est temporairement indisponible.')}<br>
            Vous pouvez nous contacter directement par téléphone au <a href="tel:0637981388" style="font-weight:700; color:#b45309;">06 37 98 13 88</a> ou par email à <a href="mailto:sas-proxiphone@outlook.com" style="font-weight:700; color:#b45309;">sas-proxiphone@outlook.com</a>.
          </div>`;
        alertBox.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

/* ==========================================================================
   4. BOUTON RETOUR EN HAUT
   ========================================================================== */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. NAVIGATION ACTIVE
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
