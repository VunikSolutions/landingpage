import './style.scss';

let iconMenuHamburguer = document.querySelector('#iconMenu');
const closeBtn = document.getElementById('closeBtn');
const menu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menuOverlay');

iconMenuHamburguer.addEventListener('click', () => {
  menu.classList.add('open');
  menuOverlay.classList.add('active');
});

closeBtn.addEventListener('click', function () {
  menu.classList.remove('open');
  menuOverlay.classList.remove('active');
});

menuOverlay.addEventListener('click', function () {
  menu.classList.remove('open');
  menuOverlay.classList.remove('active');
});
