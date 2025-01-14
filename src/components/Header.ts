import { APP_NAME } from "../utils/constants";

export function Header(): HTMLElement {
  const headerDiv = document.createElement('header');
  headerDiv.className = 'header';

  const title = document.createElement('h1');
  title.textContent = APP_NAME;

  headerDiv.appendChild(title);
  return headerDiv;
}