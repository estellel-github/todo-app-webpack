import './styles/styles.css';

import { Header } from "./components/Header"
import { Sidebar } from './components/Sidebar';
import { TaskListContainer } from './components/TaskListContainer';
import { TaskPane } from './components/TaskPane';
import { Modal } from './components/Modal'
import { safeQuerySelector } from './utils/domUtils';

import { initializeServices } from './services/initializeServices';

function initializeApp() {

  initializeServices();
  const mainEl = safeQuerySelector('#main');
  const headerEl = safeQuerySelector('#header');
  const mainModuleEl = safeQuerySelector('#main-module');
  const modalEl = safeQuerySelector('#modal');

  if (!headerEl || !mainModuleEl || !modalEl || !mainEl) {
    console.error('Missing required root elements in template.html');
    return;
  }

  const headerTitle = Header();
  headerEl.appendChild(headerTitle);

  const sidebar = Sidebar();
  mainModuleEl.appendChild(sidebar);

  const taskListContainer = TaskListContainer();
  mainModuleEl.appendChild(taskListContainer);

  const taskPane = TaskPane();
  mainModuleEl.appendChild(taskPane);

  const modal = Modal();
  modalEl.appendChild(modal);

  console.log('App initialized. Check sidebar and basic layout!');
}

initializeApp();