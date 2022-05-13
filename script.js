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
//Intersection Observer API: this API allows our code to observe changes to the way that certain target element intersects another element or the way it intersects viewport

// //callback function -> will be called everytime target element intersects with root element at threshold that is defined
// const obsCallback = function (entries, observer) {
//   //observer object also gets passed into the callback function
//   entries.forEach(entry => {
//     //to see at all of the entries
//     console.log(entry); //check the entries eg. intersection ratio -> when it starts intersecting......
//   });
// };
// //object
// const obsOptions = {
//   root: null, //element it is intersecting with
//   //eitehr we could have passed an element or null will observe the entire viewport

//   threshold: [0, 0.2], //10% //%age of intersection at which this intersection will be called
//   //we can have an array of threshold here
// };
// //create new intersection observer
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1); //observing the target element

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; //destructuring
  console.log(entry);

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
//REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  //unobserve the observer
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////////
//slider: slides are overlapping. make them side by side
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
};

//position of slides at 0%, 100%, 200% and so on
goToSlide(0);

//Next slide -> basically changing tanslateX %age
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  // -100% , 0%, 100%, 200%....
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  console.log(e);
  //if (e.key === 'ArrowLeft') prevSlide();
  //using short circuiting
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});
