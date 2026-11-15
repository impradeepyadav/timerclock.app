'use strict';

/* ============================================================
   HEADER & NAVIGATION LOGIC — FULLY FIXED
   ============================================================ */

(function () {
    let previousBodyOverflow = null;

    /* ---------- Helpers ---------- */
    function getEl(id) {
        return document.getElementById(id);
    }

    function setChevronRotation(button, isOpen) {
        if (!button) return;
        const chevron = button.querySelector('.chevron-icon');
        if (chevron) {
            chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }

    function closeLangDropdown() {
        const langBtn = getEl('langBtn');
        const langDropdown = getEl('langDropdown');

        if (!langDropdown) return;

        langDropdown.classList.remove('show');

        if (langBtn) {
            langBtn.setAttribute('aria-expanded', 'false');
            setChevronRotation(langBtn, false);
        }
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    /* ---------- Mobile Sidebar Functions ---------- */
    window.openSidebar = function () {
        const mobileSidebar = getEl('mobileSidebar');
        const sidebarOverlay = getEl('sidebarOverlay');

        if (mobileSidebar) mobileSidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');

        if (document.body.style.overflow !== 'hidden') {
            previousBodyOverflow = document.body.style.overflow;
        }
        document.body.style.overflow = 'hidden';
    };

    window.closeSidebar = function () {
        const mobileSidebar = getEl('mobileSidebar');
        const sidebarOverlay = getEl('sidebarOverlay');

        if (mobileSidebar) mobileSidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');

        document.body.style.overflow = previousBodyOverflow || '';
        previousBodyOverflow = null;
    };

    window.toggleSidebarLang = function (e) {
        const sidebarLangList = getEl('sidebarLangList');
        const sidebarLangChevron = getEl('sidebarLangChevron');

        if (!sidebarLangList) return;

        const isOpen = sidebarLangList.classList.toggle('show');

        if (sidebarLangChevron) {
            sidebarLangChevron.style.transform = isOpen
                ? 'rotate(180deg)'
                : 'rotate(0deg)';
        }

        const trigger = e && e.currentTarget instanceof Element
            ? e.currentTarget
            : null;

        if (trigger) {
            trigger.setAttribute('aria-expanded', String(isOpen));
        }
    };

    /* ---------- Desktop Language Dropdown Functions ---------- */
    window.toggleLangDropdown = function () {
        const langBtn = getEl('langBtn');
        const langDropdown = getEl('langDropdown');

        if (!langDropdown) return;

        const isOpen = langDropdown.classList.toggle('show');

        if (langBtn) {
            langBtn.setAttribute('aria-expanded', String(isOpen));
            setChevronRotation(langBtn, isOpen);
        }
    };

    window.switchLang = function (e, baseUrl) {
        if (e) e.preventDefault();
        if (!baseUrl) return;

        let url;
        try {
            url = new URL(baseUrl, window.location.href);
        } catch (err) {
            return;
        }

        url.search = window.location.search;
        url.hash = window.location.hash;

        window.location.href = url.href;
    };

    /* ---------- Global Event Listeners ---------- */
    onReady(function () {
        // Close Language Dropdown if clicked outside
        document.addEventListener('click', function (e) {
            const langBtn = getEl('langBtn');
            const langDropdown = getEl('langDropdown');

            if (
                langBtn &&
                langDropdown &&
                !langBtn.contains(e.target) &&
                !langDropdown.contains(e.target)
            ) {
                closeLangDropdown();
            }
        });

        // Blur buttons after clicking (fixes sticky hover states on mobile)
        document.addEventListener('click', function (e) {
            if (e.detail > 0 && e.target instanceof Element) {
                const btn = e.target.closest('button');
                if (btn) btn.blur();
            }
        });

        // Keyboard shortcuts for header
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;

            const mobileSidebar = getEl('mobileSidebar');
            if (mobileSidebar && mobileSidebar.classList.contains('open')) {
                window.closeSidebar();
            }

            const langDropdown = getEl('langDropdown');
            if (langDropdown && langDropdown.classList.contains('show')) {
                closeLangDropdown();
            }
        });
    });
})();
