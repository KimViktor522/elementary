(function(){
  // Gallery
  const main = document.getElementById('galleryMain');
  document.querySelectorAll('.thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach(x => x.classList.remove('is-active'));
      btn.classList.add('is-active');
      const src = btn.getAttribute('data-src');
      const alt = btn.getAttribute('data-alt') || 'Скриншот';
      if (main){ main.src = src; main.alt = alt; }
    });
  });

  // Modal open from any .js-open-demo
  const modal = document.getElementById('demoModal');
  const toast = document.getElementById('toast');
  const form = document.getElementById('demoForm');

  function openModal(){
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-open-demo').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modal){
    modal.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-close') === '1') closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const company = (fd.get('company') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      if (toast){
        toast.textContent = `✅ Запрос принят (демо): ${company || 'Компания'} • ${email || 'email'}`;
        setTimeout(() => toast.textContent = '', 3000);
      }
      form.reset();
      setTimeout(closeModal, 350);
    });
  }
})();
