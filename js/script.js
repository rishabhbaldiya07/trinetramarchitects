/* =========================================================
   TRINETRAM GROUP — SHARED SITE SCRIPT
   Used on every page (index, about, services, projects, gallery, contact).
   Every feature below checks that its elements exist before
   wiring up listeners, so this single file is safe to include
   on pages that don't have every section.
   ========================================================= */

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 900);
  }
});

/* ===== HEADER SCROLL STATE + SCROLL PROGRESS BAR ===== */
const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 700);
  if (progressBar) {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = pct + '%';
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== RIGHT-SIDE SIDEBAR NAVIGATION =====
   Single burger -> single sidebar system, used on every page.
   Opens on burger click, closes on: X button, overlay click, ESC key.
*/
const burger = document.getElementById('burger');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  if (!mobileSidebar || !sidebarOverlay) return;
  mobileSidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
  if (burger) burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; /* lock background scroll */
}

function closeSidebar() {
  if (!mobileSidebar || !sidebarOverlay) return;
  mobileSidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
  if (burger) burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = ''; /* restore scroll */
}

if (burger) burger.addEventListener('click', openSidebar);
if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileSidebar && mobileSidebar.classList.contains('open')) {
    closeSidebar();
  }
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.fade-in, .stagger');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

/* ===== ANIMATED COUNTERS (Stats section — index & about pages) ===== */
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const duration = 1800;
        const stepTime = Math.max(Math.floor(duration / target), 12);
        const step = () => {
          count += Math.ceil(target / (duration / stepTime));
          if (count >= target) { el.textContent = target; }
          else { el.textContent = count; setTimeout(step, stepTime); }
        };
        step();
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));
}

/* ===== PROJECT FILTER (Projects page) ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ===== LIGHTBOX GALLERY (Gallery page) ===== */
const galleryImgs = Array.from(document.querySelectorAll('.masonry-item img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentIdx = 0;

function openLightbox(idx) {
  if (!lightbox || !lightboxImg || !galleryImgs.length) return;
  currentIdx = idx;
  lightboxImg.src = galleryImgs[idx].src;
  lightbox.classList.add('open');
}

if (galleryImgs.length && lightbox) {
  galleryImgs.forEach((img, idx) => img.parentElement.addEventListener('click', () => openLightbox(idx)));

  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxPrev = document.getElementById('lightboxPrev');

  if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox((currentIdx + 1) % galleryImgs.length));
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox((currentIdx - 1 + galleryImgs.length) % galleryImgs.length));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowRight') openLightbox((currentIdx + 1) % galleryImgs.length);
    if (e.key === 'ArrowLeft') openLightbox((currentIdx - 1 + galleryImgs.length) % galleryImgs.length);
  });
}

/* ===== TESTIMONIAL SLIDER (Index page) ===== */
const testiTrack = document.getElementById('testiTrack');
const testiCards = document.querySelectorAll('.testi-card');
let testiIdx = 0;

function getVisible() { return window.innerWidth <= 860 ? 1 : window.innerWidth <= 1100 ? 2 : 3; }

function updateTesti() {
  if (!testiTrack || !testiCards.length) return;
  const visible = getVisible();
  const max = testiCards.length - visible;
  testiIdx = Math.max(0, Math.min(testiIdx, max));
  const cardWidth = testiCards[0].offsetWidth + 30;
  testiTrack.style.transform = `translateX(-${testiIdx * cardWidth}px)`;
}

const testiNext = document.getElementById('testiNext');
const testiPrev = document.getElementById('testiPrev');
if (testiNext) testiNext.addEventListener('click', () => { testiIdx++; updateTesti(); });
if (testiPrev) testiPrev.addEventListener('click', () => { testiIdx--; updateTesti(); });
if (testiTrack) window.addEventListener('resize', updateTesti);

/* ===== CONTACT FORM (Contact page) ===== */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIjsliJ1hfqyW-FKC1_sDPzwY7g2E-lkGXevMOTrDyjaPE-abbeNbU_dksHiPCZI5J7Q/exec";
 
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
 
    e.preventDefault();
 
    const form = this;
    const btn = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
 
    const originalText = span.textContent;
 
    span.textContent = "Sending...";
    btn.disabled = true;
 
    const data = {
      name: document.getElementById("fname").value.trim(),
      phone: document.getElementById("fphone").value.trim(),
      email: document.getElementById("femail").value.trim(),
      service: document.getElementById("fservice").value,
      message: document.getElementById("fmsg").value.trim()
    };
 
    try {
 
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });
 
      span.textContent = "Enquiry Sent ✓";
 
      form.reset();
 
      setTimeout(() => {
        span.textContent = originalText;
        btn.disabled = false;
      }, 2500);
 
    } catch (error) {
 
      console.error("Enquiry error:", error);
 
      span.textContent = "Try Again";
      btn.disabled = false;
    }
 
  });
}
/* =====================================================
   PROJECT DETAILS GALLERY
   ===================================================== */

const projectModal = document.getElementById('projectModal');

if (projectModal) {

  const projectModalClose =
    document.getElementById('projectModalClose');

  const projectModalOverlay =
    document.getElementById('projectModalOverlay');

  const projectMainImage =
    document.getElementById('projectMainImage');

  const projectPrev =
    document.getElementById('projectPrev');

  const projectNext =
    document.getElementById('projectNext');

  const projectGalleryThumbnails =
    document.getElementById('projectGalleryThumbnails');

  const projectDetailsTitle =
    document.getElementById('projectDetailsTitle');

  const projectDetailsCategory =
    document.getElementById('projectDetailsCategory');

  const projectDetailsLocation =
    document.getElementById('projectDetailsLocation');

  const projectDetailsDescription =
    document.getElementById('projectDetailsDescription');


  /* ===== PROJECT DATA ===== */

  const projectData = {

    "villa-meridian": {
      title: 'Villa Meridian',
      category: 'Residential',
      location: 'Alibaug, Maharashtra',

      description:
        'A contemporary residential villa designed with modern architecture, spacious interiors and natural light.',

      images: [
        'trinetramdeepak/deepak1.png',
        'trinetramdeepak/deepak2.png',
        'trinetramdeepak/deepak3.png',
        'trinetramdeepak/deepak4.png',
        'trinetramdeepak/deepak6.png',
      ]
    },


    "orion-business-park" : {
      title: 'Orion Business Park',
      category: 'Commercial',
      location: 'Pune, Maharashtra',

      description:
        'A modern commercial development combining functional workspaces with a refined architectural identity.',

      images: [
        'trinetrambuty/buty1.png',
        'trinetrambuty/buty3.png',
        'trinetrambuty/buty4.png',
        'trinetrambuty/buty2.png',
        'trinetrambuty/buty1.png',
      ]
    },


    "penthouse-aurelia": {
      title: 'Penthouse Aurelia',
      category: 'Interior',
      location: 'Bandra, Mumbai',

      description:
        'A sophisticated penthouse interior created with contemporary materials, elegant finishes and carefully planned spaces.',

      images: [
        'trinetramlaxmi/laxmi1.png',
        'trinetramlaxmi/laxmi2.png',
        'trinetramlaxmi/laxmi3.png',
        'trinetramlaxmi/laxmi4.png',
        'trinetramlaxmi/laxmi5.png',
      ]
    },


    "the-amaranth-hotel": {
      title: 'The Amaranth Hotel',
      category: 'Hospitality',
      location: 'Udaipur, Rajasthan',

      description:
        'A hospitality project combining timeless design, comfortable spaces and a distinctive architectural character.',

      images: [
        'trinetramhotel/hospitality1.png',
        'trinetramhotel/hospitality2.png',
        'trinetramhotel/hospitality3.png',
        'trinetramhotel/hospitality4.png',
        'trinetramhotel/hospitality5.png'
      ]
    },


    "casa-solitude": {
      title: 'Casa Solitude',
      category: 'Residential',
      location: 'Lonavala, Maharashtra',

      description:
        'A peaceful residential retreat designed around openness, natural surroundings and contemporary living.',

      images: [
        'trinetramelevation/elevation10.png',
        'trinetramelevation/elevation13.png',
        'trinetramelevation/elevation4.png',
        'trinetramelevation/elevation11.png',
        'trinetramelevation/elevation12.png',
      ]
    },


    "zenith-corporate-tower": {
      title: 'Zenith Corporate Tower',
      category: 'Our Crafted Spaces, Lasting Impression',
      location: 'Gurugram, Haryana',

      description:
        'A contemporary corporate development designed to create an efficient, professional and visually distinctive workplace.',

      images: [
        'trinetrammandir/mandir1.png',
        'trinetrammandir/mandir2.png',
        'trinetrammandir/mandir3.jpg',
        'trinetrammandir/mandir4.jpg',
        'trinetrammandir/mandir5.png'
      ]
    }

  };


  let currentProject = null;
  let currentImageIndex = 0;


  /* ===== OPEN PROJECT ===== */

  document.querySelectorAll('.project-view').forEach(button => {

    button.addEventListener('click', function(e) {

      e.preventDefault();

      const projectName = this.dataset.project;

      const project = projectData[projectName];

      if (!project) {
        console.log('Project not found:', projectName);
        return;
      }

      currentProject = project;
      currentImageIndex = 0;


      /* DETAILS */

      if (projectDetailsTitle)
        projectDetailsTitle.textContent = project.title;

      if (projectDetailsCategory)
        projectDetailsCategory.textContent = project.category;

      if (projectDetailsLocation)
        projectDetailsLocation.textContent = project.location;

      if (projectDetailsDescription)
        projectDetailsDescription.textContent = project.description;


      /* GALLERY */

      createProjectGallery();


      /* OPEN MODAL */

      projectModal.classList.add('active');

      document.body.style.overflow = 'hidden';

    });

  });


  /* ===== CREATE GALLERY ===== */

  function createProjectGallery() {

    if (!currentProject || !projectMainImage) return;

    projectMainImage.src =
      currentProject.images[currentImageIndex];


    if (!projectGalleryThumbnails) return;

    projectGalleryThumbnails.innerHTML = '';


    currentProject.images.forEach((image, index) => {

      const thumbnail =
        document.createElement('img');

      thumbnail.src = image;

      thumbnail.alt =
        currentProject.title + ' image ' + (index + 1);

      thumbnail.className =
        'project-gallery-thumbnail';


      if (index === currentImageIndex) {
        thumbnail.classList.add('active');
      }


      thumbnail.addEventListener('click', function() {

        currentImageIndex = index;

        updateProjectGallery();

      });


      projectGalleryThumbnails.appendChild(thumbnail);

    });

  }


  /* ===== UPDATE IMAGE ===== */

  function updateProjectGallery() {

    if (!currentProject || !projectMainImage) return;

    projectMainImage.src =
      currentProject.images[currentImageIndex];


    if (!projectGalleryThumbnails) return;

    const thumbnails =
      projectGalleryThumbnails.querySelectorAll(
        '.project-gallery-thumbnail'
      );


    thumbnails.forEach((thumbnail, index) => {

      thumbnail.classList.toggle(
        'active',
        index === currentImageIndex
      );

    });

  }


  /* ===== NEXT ===== */

  if (projectNext) {

    projectNext.addEventListener('click', function() {

      if (!currentProject) return;

      currentImageIndex++;

      if (
        currentImageIndex >=
        currentProject.images.length
      ) {
        currentImageIndex = 0;
      }

      updateProjectGallery();

    });

  }


  /* ===== PREVIOUS ===== */

  if (projectPrev) {

    projectPrev.addEventListener('click', function() {

      if (!currentProject) return;

      currentImageIndex--;

      if (currentImageIndex < 0) {

        currentImageIndex =
          currentProject.images.length - 1;

      }

      updateProjectGallery();

    });

  }


  /* ===== CLOSE FUNCTION ===== */

  function closeProjectModal() {

    projectModal.classList.remove('active');

    document.body.style.overflow = '';

    currentProject = null;

  }


  /* ===== CLOSE BUTTON ===== */

  if (projectModalClose) {

    projectModalClose.addEventListener(
      'click',
      closeProjectModal
    );

  }


  /* ===== CLICK OUTSIDE ===== */

  if (projectModalOverlay) {

    projectModalOverlay.addEventListener(
      'click',
      closeProjectModal
    );

  }


  /* ===== ESC KEY ===== */

  document.addEventListener('keydown', function(e) {

    if (!projectModal.classList.contains('active')) {
      return;
    }

    if (e.key === 'Escape') {
      closeProjectModal();
    }

    if (e.key === 'ArrowRight' && projectNext) {
      projectNext.click();
    }

    if (e.key === 'ArrowLeft' && projectPrev) {
      projectPrev.click();
    }

  });

}
// ================================
// PAYMENT MODAL
// ================================

function openPaymentModal() {

    const modal = document.getElementById("paymentModal");

    if (modal) {
        modal.classList.add("active");
    }

}

function closePaymentModal() {
    const modal = document.getElementById("paymentModal");

    if (modal) {
        modal.classList.remove("active");
    }

    // Clear payment form
    const nameInput = document.getElementById("customerName");
    const mobileInput = document.getElementById("customerMobile");
    const amountInput = document.getElementById("paymentAmount");

    if (nameInput) nameInput.value = "";
    if (mobileInput) mobileInput.value = "";
    if (amountInput) amountInput.value = "";

    // Hide payment methods again
    const paymentMethods = document.getElementById("paymentMethods");

    if (paymentMethods) {
        paymentMethods.classList.remove("active");
    }
}

// Close modal when clicking outside
document.addEventListener("click", function(event) {

    const modal = document.getElementById("paymentModal");

    if (
        modal &&
        event.target === modal
    ) {
        closePaymentModal();
    }

});


function continuePayment() {

    const name = document
        .getElementById("customerName")
        .value
        .trim();

    const mobile = document
        .getElementById("customerMobile")
        .value
        .trim();

    const amount = document
        .getElementById("paymentAmount")
        .value
        .trim();

    if (!name || !mobile || !amount) {

        alert("Please fill in all details.");

        return;
    }

    const paymentMethods =
        document.getElementById("paymentMethods");

    if (paymentMethods) {

        paymentMethods.classList.add("active");

        paymentMethods.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }
}
// ================================
// PAYMENT METHOD SELECTION
// ================================

function selectPaymentMethod(button, method) {

    // Remove previous selection
    const options =
        document.querySelectorAll(".payment-method-option");

    options.forEach(function(option) {
        option.classList.remove("selected");
    });


    // Select current option
    button.classList.add("selected");


    // Enable Pay button
    const payButton =
        document.getElementById("finalPayButton");

    if (payButton) {
        payButton.disabled = false;

        const amountInput =
            document.getElementById("paymentAmount");

        const amount =
            amountInput ? amountInput.value.trim() : "";

        if (amount) {
            payButton.innerHTML =
                `Pay ₹${amount} <span>→</span>`;
        }
    }

    console.log("Selected payment method:", method);
}


// ================================
// START PAYMENT
// ================================

function startPayment() {

    const amountInput =
        document.getElementById("paymentAmount");

    const amount =
        amountInput ? amountInput.value.trim() : "";

    if (!amount) {
        alert("Please enter the payment amount.");
        return;
    }

    // Temporary frontend message
    alert(
        "Payment gateway will be connected here.\n\n" +
        "Amount: ₹" + amount
    );
}

// =================================
// COPY UPI ID
// =================================

function copyUPI() {

    const upiElement =
        document.getElementById("upiId");

    const copyButton =
        document.getElementById("copyUpiButton");

    const copyText =
        copyButton?.querySelector(".copy-text");

    const copyIcon =
        copyButton?.querySelector(".copy-icon");

    const message =
        document.getElementById("copyMessage");

    if (!upiElement || !copyButton) return;

    const upiId =
        upiElement.textContent.trim();

    navigator.clipboard.writeText(upiId)
        .then(function () {

            copyButton.classList.add("copied");

            if (copyIcon) {
                copyIcon.textContent = "✓";
            }

            if (copyText) {
                copyText.textContent = "Copied";
            }

            if (message) {
                message.classList.add("show");
            }

            setTimeout(function () {

                copyButton.classList.remove("copied");

                if (copyIcon) {
                    copyIcon.textContent = "📋";
                }

                if (copyText) {
                    copyText.textContent = "Copy";
                }

                if (message) {
                    message.classList.remove("show");
                }

            }, 2000);

        })
        .catch(function () {

            alert("Unable to copy UPI ID.");

        });
}


// =================================
// WHATSAPP PAYMENT SCREENSHOT
// =================================

function sendPaymentScreenshot() {

    const whatsappNumber =
        "919179163688";

    const message =
        "Hello, I have completed the payment. " +
        "I am sending the payment screenshot " +
        "for confirmation.";

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

    window.open(
        whatsappURL,
        "_blank"
    );

}
/* =========================================================
   ADD THIS BLOCK TO THE END OF YOUR EXISTING js/script.js
   Powers: faq.html accordion open/close
   Guarded with .length / element checks, so it safely does
   nothing on pages that don't have a FAQ section.
   ========================================================= */

/* ===== FAQ ACCORDION (FAQ page) ===== */
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length) {
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
}
