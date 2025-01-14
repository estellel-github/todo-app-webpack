/**
 * Creates a DOM element with optional class names and text content.
 * @param tag - The HTML tag to create.
 * @param className - The class name(s) to apply.
 * @param textContent - Optional text content for the element.
 * @returns The created HTMLElement.
 */
export function createElement(
  tag: string,
  className: string = '',
  textContent: string = ''
): HTMLElement {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

/**
 * Clears the content of an HTML element.
 * @param element - The element to clear.
 */
export function clearContent(element: HTMLElement): void {
  element.textContent = '';
}

/**
 * Safely queries an element by selector, throwing an error if not found.
 * @param selector - The CSS selector.
 * @returns The queried HTMLElement.
 */
export function safeQuerySelector(selector: string): HTMLElement {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element as HTMLElement;
}
/**
 * Creates a DOM input element with specified properties.
 * @param className - The CSS class to apply to the input.
 * @param value - The default value of the input.
 * @param type - The type of the input (default: "text").
 * @returns The created input element.
 */
export function createInputField(className: string, value: string, type: string = "text"): HTMLInputElement {
  const input = document.createElement("input");
  input.className = className;
  input.type = type;
  input.value = value;
  return input;
}

/**
 * Creates a DOM select element with specified options and a selected value.
 * @param className - The CSS class to apply to the select element.
 * @param options - An array of option values.
 * @param selectedValue - The default selected value.
 * @param onChange - Optional callback for when the value changes.
 * @returns The created select element.
 */
export function createSelectField(
  className: string,
  options: string[],
  selectedValue: string,
  onChange?: (value: string) => void
): HTMLSelectElement {
  const select = document.createElement("select");
  select.className = className;

  options.forEach((option) => {
    const optEl = document.createElement("option");
    optEl.value = option;
    optEl.textContent = option;
    select.appendChild(optEl);
  });

  select.value = selectedValue;

  if (onChange) {
    select.addEventListener("change", () => onChange(select.value));
  }

  return select;
}

/**
 * Creates a DOM textarea element with specified properties.
 * @param className - The CSS class to apply to the textarea.
 * @param value - The default value of the textarea.
 * @returns The created textarea element.
 */
export function createTextareaField(className: string, value: string): HTMLTextAreaElement {
  const textarea = document.createElement("textarea");
  textarea.className = className;
  textarea.value = value;
  return textarea;
}

export const createLabeledField = (labelText: string, field: HTMLElement): HTMLElement => {
  const container = createElement('div', 'field-container', '');
  const label = createElement('label', 'field-label', labelText);
  container.appendChild(label);
  container.appendChild(field);
  return container;
};