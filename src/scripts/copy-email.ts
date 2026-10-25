document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach((btn) => {
  const live = document.getElementById('copy-status')!; // <p id="copy-status" class="sr-only" aria-live="polite">
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copyEmail!); } catch { return; }
    btn.dataset.state = 'copied';           // CSS: oculta el icono copy y muestra check
    live.textContent = btn.dataset.copiedLabel!;
    setTimeout(() => { btn.dataset.state = ''; live.textContent = ''; }, 2000);
  });
});
