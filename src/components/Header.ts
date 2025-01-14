import { APP_NAME } from "../utils/constants";
import { createElement } from "../utils/domUtils";

export function Header(): HTMLElement {
  const headerTitle = createElement('h1', 'title');
  headerTitle.textContent = APP_NAME;

  return headerTitle;
}