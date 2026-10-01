import { byId } from '../core/dom.js';

export function initModals({ document, windowObject, playClick }) {
  const modals = [...document.querySelectorAll('[data-modal]')];

  function openModal(modal) {
    if (!modal) return;
    playClick(640);
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    if (!modal || modal.classList.contains('hidden')) return;
    playClick(420);
    modal.classList.add('hidden');
  }

  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(byId(document, trigger.dataset.modalTarget)));
  });
  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.closest('[data-modal]')));
  });
  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
  windowObject.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modals.forEach((modal) => closeModal(modal));
  });

  return { openModal, closeModal };
}
