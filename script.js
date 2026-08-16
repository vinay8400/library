/* =========================================================
   SILENT PAGES LIBRARY
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body = document.body;
    const siteHeader = document.querySelector(".site-header");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    const backToTop = document.getElementById("backToTop");

    const contactForm = document.getElementById("contactForm");
    const currentYear = document.getElementById("currentYear");


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const openMobileMenu = () => {
        if (!menuToggle || !navMenu) return;

        menuToggle.classList.add("active");
        navMenu.classList.add("open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        body.classList.add("menu-open");
    };


    const closeMobileMenu = () => {
        if (!menuToggle || !navMenu) return;

        menuToggle.classList.remove("active");
        navMenu.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        body.classList.remove("menu-open");
    };


    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navMenu.classList.contains("open");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        });


        /* Close menu when clicking a navigation link */

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {
                closeMobileMenu();
            });

        });


        /* Close menu when pressing Escape */

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        });


        /* Close menu when clicking outside */

        document.addEventListener("click", (event) => {

            if (
                navMenu.classList.contains("open") &&
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }

        });

    }


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    const handleHeaderScroll = () => {

        if (!siteHeader) return;

        if (window.scrollY > 20) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }

    };


    handleHeaderScroll();

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    navLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = siteHeader
                ? siteHeader.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections = document.querySelectorAll("main section[id]");

    const updateActiveNavigation = () => {

        if (!sections.length) return;

        const scrollPosition =
            window.scrollY +
            (siteHeader ? siteHeader.offsetHeight : 0) +
            120;

        let currentSection = "home";

        sections.forEach((section) => {

            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }

        });

        navLinks.forEach((link) => {

            const linkTarget = link.getAttribute("href");

            link.classList.toggle(
                "active",
                linkTarget === `#${currentSection}`
            );

        });

    };


    updateActiveNavigation();

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    /* =====================================================
       SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".feature-card, " +
        ".facility-card, " +
        ".environment-point, " +
        ".timing-card, " +
        ".contact-item, " +
        ".about-content, " +
        ".about-highlight, " +
        ".membership-card, " +
        ".location-content"
    );


    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const handleBackToTop = () => {

        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    };


    handleBackToTop();

    window.addEventListener(
        "scroll",
        handleBackToTop,
        { passive: true }
    );


    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       CONTACT FORM VALIDATION
    ===================================================== */

    if (contactForm) {

        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const messageInput = document.getElementById("message");

        const nameError = document.getElementById("nameError");
        const phoneError = document.getElementById("phoneError");
        const messageError = document.getElementById("messageError");

        const formStatus = document.getElementById("formStatus");


        const clearError = (input, errorElement) => {

            if (input) {
                input.closest(".form-group")?.classList.remove("has-error");
            }

            if (errorElement) {
                errorElement.textContent = "";
            }

        };


        const showError = (input, errorElement, message) => {

            if (input) {
                input.closest(".form-group")?.classList.add("has-error");
            }

            if (errorElement) {
                errorElement.textContent = message;
            }

        };


        const validateName = () => {

            if (!nameInput) return true;

            const name = nameInput.value.trim();

            if (!name) {

                showError(
                    nameInput,
                    nameError,
                    "Please enter your name."
                );

                return false;
            }

            if (name.length < 2) {

                showError(
                    nameInput,
                    nameError,
                    "Name must contain at least 2 characters."
                );

                return false;
            }

            clearError(nameInput, nameError);

            return true;
        };


        const validatePhone = () => {

            if (!phoneInput) return true;

            const phone = phoneInput.value.trim();

            /* Phone is optional */

            if (!phone) {

                clearError(phoneInput, phoneError);

                return true;
            }


            const phonePattern = /^[0-9+\-\s()]{7,20}$/;

            if (!phonePattern.test(phone)) {

                showError(
                    phoneInput,
                    phoneError,
                    "Please enter a valid phone number."
                );

                return false;
            }

            clearError(phoneInput, phoneError);

            return true;
        };


        const validateMessage = () => {

            if (!messageInput) return true;

            const message = messageInput.value.trim();

            if (!message) {

                showError(
                    messageInput,
                    messageError,
                    "Please enter your message."
                );

                return false;
            }

            if (message.length < 5) {

                showError(
                    messageInput,
                    messageError,
                    "Message must contain at least 5 characters."
                );

                return false;
            }

            clearError(messageInput, messageError);

            return true;
        };


        if (nameInput) {
            nameInput.addEventListener("input", validateName);
        }

        if (phoneInput) {
            phoneInput.addEventListener("input", validatePhone);
        }

        if (messageInput) {
            messageInput.addEventListener("input", validateMessage);
        }


        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isMessageValid = validateMessage();

            if (
                !isNameValid ||
                !isPhoneValid ||
                !isMessageValid
            ) {

                if (formStatus) {
                    formStatus.textContent =
                        "Please correct the highlighted fields.";

                    formStatus.className =
                        "form-status error";
                }

                return;
            }


            /*
             * This is frontend-only.
             * No backend or real message delivery is connected yet.
             */

            if (formStatus) {

                formStatus.textContent =
                    "Your enquiry has been prepared successfully. Contact delivery will be connected later.";

                formStatus.className =
                    "form-status success";

            }


            contactForm.reset();

        });

    }


    /* =====================================================
       HANDLE RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 820) {
            closeMobileMenu();
        }

    });


    /* =====================================================
       FINAL INITIALIZATION
    ===================================================== */

    console.log(
        "Silent Pages Library website initialized successfully."
    );

});