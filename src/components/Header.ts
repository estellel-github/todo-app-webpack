export function Header(): HTMLElement {
  const headerDiv = document.createElement('header');
  headerDiv.className = 'header';

  const title = document.createElement('h1');
  title.textContent = '☑️ To Do App';
  title.addEventListener('click', () => {
    location.reload();
  });

  headerDiv.appendChild(title);
  return headerDiv;
}