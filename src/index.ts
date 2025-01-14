import './styles/styles.css';

import { Header } from "./components/Header"
import { Sidebar } from './components/Sidebar';
import { TaskListContainer } from './components/TaskListContainer';
import { TaskPane } from './components/TaskPane';
import { Modal } from './components/Modal'

import { initializeServices } from './services/initializeServices';

function initializeApp() {

  initializeServices();

  const headerEl = document.getElementById('header');
  const mainModuleEl = document.getElementById('main-module');
  const modalEl = document.getElementById('modal');

  if (!headerEl || !mainModuleEl || !modalEl) {
    console.error('Missing required root elements in template.html');
    return;
  }

  const header = Header();
  headerEl.appendChild(header);

  const sidebar = Sidebar();
  mainModuleEl.appendChild(sidebar);

  const taskListContainer = TaskListContainer();
  mainModuleEl.appendChild(taskListContainer);

  const taskPane = TaskPane();
  mainModuleEl.appendChild(taskPane);

  const modal = Modal();
  mainModuleEl.appendChild(modal);

  console.log('App initialized. Check sidebar and basic layout!');
}

initializeApp();