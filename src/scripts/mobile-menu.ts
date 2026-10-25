const dialog = document.getElementById('mobile-menu') as HTMLDialogElement | null;
const menuButton = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]');

if (dialog && menuButton) {
  const close = () => {
    if (dialog.open) dialog.close();
  };
  menuButton.addEventListener('click', () => {
    dialog.showModal();
    menuButton.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  });
  // Fires for the X button, Esc (cancel), internal links and the resize below.
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', close);
  dialog.querySelectorAll('a[href*="#"]').forEach((a) => a.addEventListener('click', close));
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) close();
  });
}
