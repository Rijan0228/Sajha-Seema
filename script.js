
"use strict";

/* =========================================
   SAJHA SEEMA — FRONTEND PROTOTYPE
   Version 1.0.0
   No backend. No data transmission.
========================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* -----------------------------------------
   1. PAGE NAVIGATION
----------------------------------------- */

const sections = $$(".page-section");
const navLinks = $$(".nav-link");
const pageName = $("#pageName");
const sidebar = $("#sidebar");

const pageNames = {
  home: "Overview",
  map: "National overview",
  reports: "Public reports",
  submit: "Submit a concern",
  verification: "Verification",
  library: "Information library",
  analytics: "Analytics",
  about: "About the project",
  methodology: "Methodology"
};

function showPage(pageId, updateHash = true) {
  const target = document.getElementById(pageId);
  if (!target || !target.classList.contains("page-section")) {
    pageId = "home";
  }

  sections.forEach((section) => {
    section.classList.toggle("active", section.id === pageId);
  });

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", linkPage === pageId);
  });

  if (pageName) {
    pageName.textContent = pageNames[pageId] || "Overview";
  }

  if (updateHash && location.hash !== `#${pageId}`) {
    history.pushState(null, "", `#${pageId}`);
  }

  sidebar.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageId = link.getAttribute("href").slice(1);
    showPage(pageId);
  });
});

/* Handle links from hero cards, buttons and footer. */
$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const pageId = link.getAttribute("href").slice(1);
    const target = document.getElementById(pageId);

    if (target && target.classList.contains("page-section")) {
      event.preventDefault();
      showPage(pageId);
    }
  });
});

window.addEventListener("popstate", () => {
  const pageId = location.hash.replace("#", "") || "home";
  showPage(pageId, false);
});

const initialPage = location.hash.replace("#", "");
if (initialPage && pageNames[initialPage]) {
  showPage(initialPage, false);
} else {
  showPage("home", false);
}

/* -----------------------------------------
   2. MOBILE SIDEBAR
----------------------------------------- */

const menuToggle = $("#menuToggle");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

/* Close the mobile sidebar when clicking outside it. */
document.addEventListener("click", (event) => {
  const isInsideSidebar = sidebar.contains(event.target);
  const isMenuButton = menuToggle.contains(event.target);

  if (
    window.innerWidth <= 850 &&
    sidebar.classList.contains("open") &&
    !isInsideSidebar &&
    !isMenuButton
  ) {
    sidebar.classList.remove("open");
  }
});

/* -----------------------------------------
   3. PROVINCE DIRECTORY
----------------------------------------- */

const provinceInformation = {
  koshi: {
    number: "01",
    name: "Koshi Province",
    description:
      "Koshi Province is in eastern Nepal. This panel provides a general administrative introduction. Official statistical and geographic publications should be consulted for detailed information."
  },
  madhesh: {
    number: "02",
    name: "Madhesh Province",
    description:
      "Madhesh Province is in the southern part of Nepal. Use official provincial and national publications for current administrative and statistical information."
  },
  bagmati: {
    number: "03",
    name: "Bagmati Province",
    description:
      "Bagmati Province is in central Nepal. This prototype provides a general directory entry, not a detailed geographic or operational map."
  },
  gandaki: {
    number: "04",
    name: "Gandaki Province",
    description:
      "Gandaki Province is in western-central Nepal. Consult official publications for verified administrative, demographic and geographic information."
  },
  lumbini: {
    number: "05",
    name: "Lumbini Province",
    description:
      "Lumbini Province is in western and southern Nepal. This entry is a general administrative introduction for the prototype."
  },
  karnali: {
    number: "06",
    name: "Karnali Province",
    description:
      "Karnali Province is in north-western Nepal. Official sources should be used for current administrative and statistical details."
  },
  sudurpashchim: {
    number: "07",
    name: "Sudurpashchim Province",
    description:
      "Sudurpashchim Province is in far-western Nepal. This directory entry is general context, not a representation of border conditions."
  }
};

const provinceOptions = $$(".province-option");

provinceOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const provinceId = option.dataset.province;
    const province = provinceInformation[provinceId];

    if (!province) return;

    provinceOptions.forEach((item) => {
      item.classList.toggle("active", item === option);
    });

    $("#provinceNumber").textContent = province.number;
    $("#provinceName").textContent = province.name;
    $("#provinceDescription").textContent = province.description;
  });
});

/* -----------------------------------------
   4. PUBLIC REPORT SEARCH AND FILTERS
----------------------------------------- */

const reportSearch = $("#reportSearch");
const statusFilter = $("#statusFilter");
const provinceFilter = $("#provinceFilter");
const reportTableBody = $("#reportTableBody");
const emptyState = $("#emptyState");
const resultCount = $("#resultCount");

function filterReports() {
  const searchTerm = reportSearch.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedProvince = provinceFilter.value;

  const rows = Array.from(reportTableBody.querySelectorAll("tr"));
  let visibleCount = 0;

  rows.forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    const statusBadge = row.querySelector(".status-badge");

    const matchesSearch = rowText.includes(searchTerm);
    const matchesStatus =
      selectedStatus === "all" ||
      (statusBadge && statusBadge.classList.contains(selectedStatus));

    const matchesProvince =
      selectedProvince === "all" ||
      rowText.includes(selectedProvince.toLowerCase());

    const visible = matchesSearch && matchesStatus && matchesProvince;

    row.hidden = !visible;

    if (visible) visibleCount++;
  });

  resultCount.textContent =
    `Showing ${visibleCount} example ${visibleCount === 1 ? "record" : "records"}`;

  emptyState.hidden = visibleCount !== 0;
}

reportSearch.addEventListener("input", filterReports);
statusFilter.addEventListener("change", filterReports);
provinceFilter.addEventListener("change", filterReports);

/* -----------------------------------------
   5. COMMUNITY FORM DEMONSTRATION
----------------------------------------- */

const concernForm = $("#concernForm");
const concernMessage = $("#concernMessage");
const charCount = $("#charCount");
const formSuccess = $("#formSuccess");
const successMessage = $("#successMessage");

concernMessage.addEventListener("input", () => {
  charCount.textContent = concernMessage.value.length;
});

concernForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!concernForm.checkValidity()) {
    concernForm.reportValidity();
    return;
  }

  const category = $("#concernCategory").value;
  const province = $("#concernProvince").value;
  const message = concernMessage.value.trim();
  const confirmedSafe = $("#safeConfirm").checked;

  if (!category || !province || !message || !confirmedSafe) {
    showToast("Please complete the required fields.");
    return;
  }

  /*
    This is intentionally a local-only demonstration.

    The message is not:
    - sent to a server;
    - sent to GitHub;
    - sent to a government agency;
    - stored in localStorage;
    - published in the public registry.

    A real submission system requires a secure backend,
    privacy policy, moderation and access controls.
  */

  const demoReference =
    "SS-PREVIEW-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  successMessage.textContent =
    `${demoReference} — ${category}, ${province}. Your browser generated this preview only.`;

  formSuccess.hidden = false;

  concernForm.reset();
  charCount.textContent = "0";

  formSuccess.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

  showToast("Local demonstration preview created.");
});

/* -----------------------------------------
   6. INFORMATION LIBRARY SEARCH
----------------------------------------- */

const librarySearch = $("#librarySearch");
const libraryCards = $$(".library-card");
const libraryEmpty = $("#libraryEmpty");

librarySearch.addEventListener("input", () => {
  const searchTerm = librarySearch.value.trim().toLowerCase();
  let visibleCount = 0;

  libraryCards.forEach((card) => {
    const searchableText =
      (card.dataset.search || "") + " " + card.textContent;

    const matches = searchableText.toLowerCase().includes(searchTerm);

    card.hidden = !matches;

    if (matches) visibleCount++;
  });

  libraryEmpty.hidden = visibleCount !== 0;
});

/* -----------------------------------------
   7. TOAST NOTIFICATION
----------------------------------------- */

let toastTimeout;

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* -----------------------------------------
   8. FOOTER YEAR
----------------------------------------- */

$("#year").textContent = new Date().getFullYear();

/* -----------------------------------------
   9. EXTERNAL LINK SAFETY
----------------------------------------- */

$$('a[target="_blank"]').forEach((link) => {
  link.setAttribute("rel", "noopener noreferrer");
});

/* -----------------------------------------
   10. INITIAL FILTER STATE
----------------------------------------- */

filterReports();

console.info(
  "Sajha Seema v1.0.0 loaded. This is a static demonstration website."
);
