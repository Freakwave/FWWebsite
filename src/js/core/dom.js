export const byId = (document, id) => document.getElementById(id);

export function setText(element, value) {
  if (element) element.textContent = value;
}
