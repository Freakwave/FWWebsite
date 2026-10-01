export function createToast(document) {
  const notification = document.getElementById('toastNotification');
  const message = document.getElementById('toastMessage');
  let timeoutId;

  return function showToast(text) {
    if (!notification || !message) return;
    message.textContent = text;
    notification.classList.remove('opacity-0');
    notification.classList.add('opacity-100');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      notification.classList.remove('opacity-100');
      notification.classList.add('opacity-0');
    }, 2800);
  };
}
