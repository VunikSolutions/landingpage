import './style.scss';
import { inject } from '@vercel/analytics';

inject();

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

const buttonActions = document.querySelectorAll('.buttonAction');

buttonActions.forEach((item) => {
  item.addEventListener('click', () => {
    window.open('https://wa.me/5571992432321?text=Olá!%20Quero%20Impulsionar%20Meu%20Negócio!%20');
  });
});
