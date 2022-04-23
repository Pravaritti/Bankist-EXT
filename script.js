'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window (effects on open account button)

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SMOOTH SCROLLING (on learn button)

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  //coordinates of target = s1coords and e.target = btnScrollTo
  // console.log(s1coords, e.target.getBoundingClientRect());
  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  //make it more smooth by passing object instead of one arguement
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  //});
  //new way to do it (you dont need to calculate distances manuallu)
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////////////////////////
//PAGE NAVIGATION
//1. smooth navigation on menu tabs
//using event delegation for all the links
//menu tabs
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //prevent default which is directly going to the link (from HTML)
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    //as href is a non-standard attribute we have to use getAttribute
    //console.log(e.target)
    const id = e.target.getAttribute('href');
    //   console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////////////
//TAB ACTIVATE (3 colorful tabs)
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  //1.find which button was clicked
  const clicked = e.target.closest('.operations__tab'); //bcoz if we click the number in the button it gives <span>
  //finds closest parent with this class name "operations__tab" which could be the button itself
  console.log(clicked);

  //guard clause: when clicked on the container elsewhere other than the button, it returns clicked = null as it has no parent
  //so to prevent it, we ignore the clicks anywhere else
  if (!clicked) return;

  //TAB ACTIVE
  //activate tab (first deactivate all the other tabs and then activate the clicked tab)
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //ACTIVATE TAB CONTENT
  console.log(clicked.dataset.tab);
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////////////////
//MENU FADE NAVIGATION
//using event delegation on entire menu logo+tags
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //go to closest parent and then find links or logo
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //fade all siblings
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//mouseenter does not bubble
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
//use bind method
//handler function can only take 1 arguement
nav.addEventListener('mouseover', handleHover.bind(0.5));
//go back to opacity = 1
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////////////////////////
//sticky navigation (using sticky class) to stick menu

// const initialCoords = section1.getBoundingClientRect();
// //console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   //vertical distance from top
//   //console.log(window.scrollY);

//   // if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   // else nav.classList.remove('sticky');
//   nav.classList.add('sticky');
// });
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// ////////////////////////////////////////////////////////////////////
// //REVEALING ELEMENTS ON SCROLL

// //achieved by simply adding classes to each section

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //mouse enter event

// /*const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function (e) {
//   alert('you are hovering over heading via event handler');
// });
// //older method to listen to events listeners using properties
// h1.onmouseenter = function () {
//   alert('you are hovering over heading via property');
// };
// //advantages of addeventLsiteniers()
// //1.you can add multiple functions
// //2.we can remove an event handler if we dont need it anymore
// const alterH1 = function (e) {
//   alert('you are hovering over heading via event handler and removing it.');

//   h1.removeEventListener('mouseenter', alterH1);
// };
// h1.addEventListener('mouseenter', alterH1);
// //you can remove it anytime yout want
// setTimeout(() => h1.removeEventListener('mouseenter', alterH1), 3000);*/

// /////////////////////////////////////////////////////////////////////
// //event bubbling and capturing
// /*
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1 + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // .nav -> .nav__links -> .nav__link
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   //   console.log('clicked');

//   //e.target is the target that generated the event (where click happened) and not where the handler was attached
//   //e.current handler is where the handler is attached
//   console.log('link', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //stop propagation
//   e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('clicked');
//   console.log('container', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('clicked');
//   console.log('link', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });
// */

// /*Sticky navi
// this API allows our code to  basically observes changes  to the way a certain taregt  element intersects anotehr element or the way it intersects the view port

// how intersection of APIs work without sticky navigation

// */
// //create new intersection observer

// // const obsCallback = function (entries, observer) {
// //   entries.forEach(entry => {
// //     console.log(entry);
// //   });
// // };

// // //threshold means it should be 10% visible for intersect to be true
// // const obsOptions = {
// //   root: null,
// //   //threshold: 0.1, //10%
// //   //0 threshold means callback will be triggered each time that the target element moves completely out of the view or as soon as it enters the view
// //   //another one at 20% either entring or leaving
// //   threshold: [0, 0.2],
// // };

// // const observer = new IntersectionObserver(obsCallback, obsOptions);
// // observer.observe(section1);

// //sticky navigation
// // const header = document.querySelector('.header');
// // const navHeight = nav.getBoundingClientRect().height;

// // const stickyNav = function (entries) {
// //   const [entry] = entries;
// //   // console.log(entry);

// //   if (!entry.isIntersecting) nav.classList.add('sticky');
// //   else nav.classList.remove('sticky');
// // };

// // const headerObserver = new IntersectionObserver(stickyNav, {
// //   root: null,
// //   threshold: 0,
// //   rootMargin: `-${navHeight}px`,
// // });

// // headerObserver.observe(header);