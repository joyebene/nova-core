// Initialize Lucide Icons cleanly
try {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
} catch (e) {
    console.warn("Lucide Icons did not load fully. System falling back cleanly.");
}

// DOM elements selectors
const cursor = document.getElementById('cursor');
const header = document.getElementById('main-header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const selectTrigger = document.getElementById('custom-select-trigger');
const selectOptions = document.getElementById('custom-select-options');
const selectCaret = document.getElementById('custom-select-caret');
const selectValueText = document.getElementById('custom-select-value');
const hiddenInput = document.getElementById('service');
const optionButtons = document.querySelectorAll('.custom-option');
const filterBtns = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('.project-card');

let selectOpen = false;

// --- 1. Custom Interactive Cursor outline (Desktop only) ---
let cursorInitialized = false;
document.addEventListener('mousemove', (e) => {
    if (!cursorInitialized && cursor) {
        cursor.style.display = 'block';
        cursorInitialized = true;
    }
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Hover target expansion feedback
document.querySelectorAll('.hover-target, button, a, input, textarea, .faq-card button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.width = '48px';
            cursor.style.height = '48px';
            cursor.style.backgroundColor = 'rgba(14, 14, 16, 0.05)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        }
    });
});

// --- 2. Floating Navbar Scroll effects ---
window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 40) {
            header.classList.add('bg-[#FDFBF7]/90', 'backdrop-blur-md', 'shadow-sm', 'border-neutral-200');
            header.classList.remove('border-transparent');
        } else {
            header.classList.remove('bg-[#FDFBF7]/90', 'backdrop-blur-md', 'shadow-sm', 'border-neutral-200');
            header.classList.add('border-transparent');
        }
    }
});

// --- 3. Mobile Navigation Drawer Panel Interactions ---
// --- 3. Mobile Navigation Drawer Panel Interactions ---
function openMenu() {
    if (mobileMenu) mobileMenu.classList.remove('translate-x-full');
    // Add this line to prevent the page from scrolling
    document.body.classList.add('overflow-hidden');
}
function closeMenu() {
    if (mobileMenu) mobileMenu.classList.add('translate-x-full');
    // Add this line to allow the page to scroll again
    document.body.classList.remove('overflow-hidden');
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// --- 4. Custom Select Dropdown Mechanics ---
if (selectTrigger) {
    selectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOpen = !selectOpen;
        if (selectOpen) {
            if (selectOptions) selectOptions.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
            if (selectCaret) selectCaret.style.transform = 'rotate(180deg)';
        } else {
            closeDropdown();
        }
    });
}

function closeDropdown() {
    selectOpen = false;
    if (selectOptions) selectOptions.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    if (selectCaret) selectCaret.style.transform = 'rotate(0deg)';
}

optionButtons.forEach(opt => {
    opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.getAttribute('data-value');
        const label = opt.querySelector('span').innerText;

        if (selectValueText) {
            selectValueText.innerText = label;
            selectValueText.classList.remove('text-neutral-400');
            selectValueText.classList.add('text-[#FDFBF7]');
        }
        if (hiddenInput) hiddenInput.value = value;

        optionButtons.forEach(btn => {
            const check = btn.querySelector('.check-icon');
            if (check) {
                if (btn === opt) {
                    check.classList.remove('opacity-0');
                    check.classList.add('opacity-100');
                } else {
                    check.classList.add('opacity-0');
                    check.classList.remove('opacity-100');
                }
            }
        });
        closeDropdown();
    });
});

document.addEventListener('click', closeDropdown);

// --- 5. Project Card Tag Filter System ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-[#FDFBF7]', 'text-[#0E0E10]');
            b.classList.add('border-neutral-700', 'hover:border-[#FDFBF7]');
        });
        btn.classList.add('bg-[#FDFBF7]', 'text-[#0E0E10]');
        btn.classList.remove('border-neutral-700', 'hover:border-[#FDFBF7]');

        const targetFilter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (targetFilter === 'all' || category === targetFilter) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => { card.style.display = 'none'; }, 200);
            }
        });
    });
});

// --- 6. FAQ Accordion Click handlers ---
function toggleFaq(btn) {
    const card = btn.closest('.faq-card');
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');

    const allContents = document.querySelectorAll('.faq-content');
    const allIcons = document.querySelectorAll('.faq-icon');
    const allCards = document.querySelectorAll('.faq-card');

    allContents.forEach((c, index) => {
        if (c !== content) {
            c.style.maxHeight = null;
            if (allIcons[index]) allIcons[index].style.transform = 'rotate(0deg)';
            if (allCards[index]) {
                allCards[index].classList.remove('bg-[#F6F3EB]/40', 'border-[#0E0E10]', 'shadow-md');
                allCards[index].classList.add('bg-neutral-50/50', 'border-neutral-200/80');
            }
        }
    });

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        if (icon) icon.style.transform = 'rotate(0deg)';
        if (card) {
            card.classList.remove('bg-[#F6F3EB]/40', 'border-[#0E0E10]', 'shadow-md');
            card.classList.add('bg-neutral-50/50', 'border-neutral-200/80');
        }
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(45deg)';
        if (card) {
            card.classList.add('bg-[#F6F3EB]/40', 'border-[#0E0E10]', 'shadow-md');
            card.classList.remove('bg-neutral-50/50', 'border-neutral-200/80');
        }
    }
}

// --- 7. Interactive Message Submit Drawer Handler ---
function handleFormSubmit(event) {
    event.preventDefault();
    const nameVal = document.getElementById('name') ? document.getElementById('name').value : "Friend";
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    if (toastMsg) {
        toastMsg.innerText = `Thanks for reaching out, ${nameVal}! We will get back to you within 24 hours. 😊`;
    }
    if (toast) {
        toast.classList.remove('opacity-0', 'translate-y-20');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-20');
            toast.classList.remove('opacity-100', 'translate-y-0');
        }, 4000);
    }

    const formObj = document.getElementById('contact-form');
    if (formObj) formObj.reset();
    if (hiddenInput) hiddenInput.value = 'website';
    if (selectValueText) {
        selectValueText.innerText = "I need a beautiful website";
        selectValueText.classList.add('text-neutral-400');
    }
}

// --- 8. Double-Safeguard Intersection Observer & Force Reveal Engine ---
let observerInitialized = false;

function runRevealObserver() {
    if (!('IntersectionObserver' in window)) {
        forceAllVisible();
        return;
    }

    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
    observerInitialized = true;
}

function forceAllVisible() {
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-revealed');
    });
}

// --- BOOT PROCESS ---
// Safety timeout: If JS takes too long or gets blocked, force render within 300ms!
const safetyRevealTimer = setTimeout(() => {
    if (!observerInitialized) {
        forceAllVisible();
    }
}, 300);

document.addEventListener('DOMContentLoaded', () => {
    runRevealObserver();
});

// Run immediately if DOM is already active
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    runRevealObserver();
}