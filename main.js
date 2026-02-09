// main.js — интерактив для лендинга «Элементарные заявки»
document.addEventListener("DOMContentLoaded", () => {
  // ===== Theme toggle (robust) =====
  const themeBtn = document.getElementById("themeBtn");
  const applyThemeIcon = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (themeBtn) themeBtn.textContent = isDark ? "☀️" : "🌙";
  };

  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  applyThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    applyThemeIcon();
  });

  // ===== Animated counters =====
  function animateCount(el, to) {
    const start = 0;
    const duration = 900;
    const t0 = performance.now();

    function frame(now) {
      const p = Math.min(1, (now - t0) / duration);
      const val = Math.round(start + (to - start) * (1 - Math.pow(1 - p, 3)));
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = [...document.querySelectorAll(".kpi__num[data-count]")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        animateCount(el, Number(el.dataset.count));
        io.unobserve(el);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach((c) => io.observe(c));

  // ===== Progress slider =====
  const range = document.getElementById("progressRange");
  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");

  range?.addEventListener("input", () => {
    const v = Number(range.value);
    if (fill) fill.style.width = v + "%";
    if (text) text.textContent = v + "%";
  });

  // ===== Demo modal (opens from both "Демо" and "Запросить демонстрацию") =====
  const modal = document.getElementById("demoModal");
  const toast = document.getElementById("toast");
  const form = document.getElementById("demoModalForm");

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // focus first input for accessibility
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".js-open-demo").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e && e.preventDefault) e.preventDefault();
      openModal();
    });
  });

  modal?.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.getAttribute && target.getAttribute("data-close") === "1") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (toast) toast.textContent = `✅ Запрос принят (демо): ${company || "Компания"} • ${email || "email"}`;
    setTimeout(() => { if (toast) toast.textContent = ""; }, 3500);
    form.reset();
    closeModal();
  });

  // ===== Charts (Chart.js) =====
  // If Chart.js is blocked/offline, skip gracefully.
  if (typeof Chart === "undefined") return;

  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  };

  const c1 = document.getElementById("chartRequests");
  if (c1) {
    new Chart(c1, {
      type: "line",
      data: {
        labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
        datasets: [{ label: "Заявки", data: [120, 160, 140, 210, 260, 240], tension: 0.35 }]
      },
      options: commonOptions
    });
  }

  const c2 = document.getElementById("chartSLA");
  if (c2) {
    new Chart(c2, {
      type: "bar",
      data: {
        labels: ["1 линия", "2 линия", "3 линия"],
        datasets: [{ label: "Соблюдение SLA, %", data: [92, 86, 78] }]
      },
      options: commonOptions
    });
  }

  const c3 = document.getElementById("chartStatus");
  if (c3) {
    new Chart(c3, {
      type: "doughnut",
      data: {
        labels: ["Новые", "В работе", "Ожидание", "Закрытые"],
        datasets: [{ label: "Статусы", data: [18, 34, 12, 36] }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }
});
