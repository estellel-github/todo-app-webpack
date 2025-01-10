export function Header(): HTMLElement {
  const headerDiv = document.createElement('header');
  headerDiv.className = 'header';

  const title = document.createElement('h1');
  title.textContent = '☑️ To Do App';
  title.addEventListener('click', () => {
    location.reload(); // Reset the app when the title is clicked
  });

  headerDiv.appendChild(title);
  return headerDiv;
}