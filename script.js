const pages = document.querySelectorAll(".page");
const sidebarItems = document.querySelectorAll(".sidebar__item");
const nextStepButtons = document.querySelectorAll('.next-step-button');
const previousStepButtons = document.querySelectorAll('.previous-step-button');
const planCards = document.querySelectorAll('.plan__card');
const pricingToggle = document.querySelector('.toggle-area > input');
const monthlyPricingSelection = document.querySelector('.toggle-area > .monthly');
const yearlyPricingSelection = document.querySelector('.toggle-area > .yearly');
const addOns = [...document.querySelectorAll('.add-on > input')];
const summaryAddOns = document.querySelector('.options__add-ons');
const summaryHorizontalLine = document.querySelector('.summary-wrapper__options > hr');
const summaryPlan = document.querySelector('.options__plan');
const summaryPlanName = document.querySelector('.options__plan-name');
const summaryPlanPricing = summaryPlanName.querySelector('span');
const summaryPlanPrice = summaryPlan.querySelector('.price');
const summaryTotalPrice = document.querySelector('.total-price');
const submitButton = document.querySelector('[type=submit]');


let currentPage = pages[0];
let pricing = 'monthly';

function navigateToPage(pageNumber) {
  currentPage.classList.remove('active');
  currentPage = pages[pageNumber - 1];
  currentPage.classList.add("active");

  if (pageNumber === 5) return; // prevent error from missing sidebar item

  sidebarItems.forEach(item => item.classList.remove('active'));
  sidebarItems[pageNumber - 1].classList.add('active');
}

function navigateFromSidebar(e) {
  const pageNumber = parseInt(e.currentTarget.querySelector('.sidebar__button').textContent);
  navigateToPage(pageNumber);
}

function nextPage(e) {
  const button = e.currentTarget;
  const currentPageNumber = parseInt(button.dataset['pageNumber']);
  navigateToPage(currentPageNumber + 1);
}

function previousPage(e) {
  const button = e.currentTarget;
  const currentPageNumber = parseInt(button.dataset['pageNumber']);
  navigateToPage(currentPageNumber - 1);
}

function clearPlanSelection() {
  planCards.forEach(card => {
    card.classList.remove('active');
  });
}

function selectPlan(e) {
  clearPlanSelection();

  e.currentTarget.classList.add('active');
}

function changePricing() {
  monthlyPricingSelection.classList.toggle('active');
  yearlyPricingSelection.classList.toggle('active');

  pricing = pricing === 'monthly' ? 'yearly' : 'monthly';
  priceElements = document.querySelectorAll('.price');
  priceElements.forEach(element => {
    let amount = parseInt(element.textContent.replace(/\D/g, ''));
    if (pricing === 'monthly') {
      element.textContent = `$${amount/10}/mo`
    } else {
      element.textContent = `$${amount*10}/yr`
    }
  });

  summaryPlanPricing.textContent = `(${capitalizeFirstLetter(pricing)})`;
}

function activatePricingPlan(e) {
  if (pricingToggle.checked && e.currentTarget === yearlyPricingSelection ||
      !pricingToggle.checked && e.currentTarget === monthlyPricingSelection)
    return;

  pricingToggle.click();
}

function toggleAddOn(e) {
  e.stopPropagation();
  const label = e.target.parentElement;
  label.classList.toggle('active');
}

function updateSummary() {
  // remove all add ons from summary
  summaryAddOns.textContent = '';

  if (addOns.every(item => !item.checked)) {
    summaryHorizontalLine.style.display = 'none';
    return;
  } else {
    summaryHorizontalLine.style.display = 'block';
  }

  addOns.forEach(addOn => {
    if (addOn.checked) {
      const label = addOn.parentElement;
      const addOnWrapper = document.createElement('div');
      const addOnName = document.createElement('div');
      const addOnPriceWrapper = document.createElement('div');
      const addOnPrice = document.createElement('span');

      addOnWrapper.classList.add('options__add-on-wrapper');
      addOnName.classList.add('options__add-on-name');
      addOnPriceWrapper.classList.add('options__add-on-price');
      addOnPrice.classList.add('price');

      addOnName.textContent = label.querySelector('.add-on__title').textContent;
      addOnPriceWrapper.textContent = "+";
      addOnPrice.textContent = label.querySelector('.price').textContent;

      addOnPriceWrapper.appendChild(addOnPrice);
      addOnWrapper.appendChild(addOnName);
      addOnWrapper.appendChild(addOnPriceWrapper);

      summaryAddOns.appendChild(addOnWrapper);

      updateTotalPrice();
    }
  });
}

function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateSummaryPlan(e) {
  const planCard = e.currentTarget;

  summaryPlanPricing.textContent = `(${capitalizeFirstLetter(pricing)})`
  summaryPlan.querySelector('.options__plan-name').textContent = `${planCard.querySelector('.card__title').textContent} `;
  summaryPlanName.appendChild(summaryPlanPricing);
  summaryPlanPrice.textContent = `${planCard.querySelector('.card__price').textContent}`;

  updateTotalPrice();
}

function updateTotalPrice() {
  let totalCost = parseInt(summaryPlanPrice.textContent.replace(/\D/g, ''));
  summaryAddOns.querySelectorAll('.price').forEach(item => {
    totalCost += parseInt(item.textContent.replace(/\D/g, ''));
  })

  summaryTotalPrice.textContent = `$${totalCost}/${pricing === 'monthly' ? 'mo' : 'yr'}`;
}

function submitForm(e) {
  e.preventDefault();
  navigateToPage(5);
  sidebarItems.forEach(sidebarItem => sidebarItem.removeEventListener('click', navigateFromSidebar));
}


sidebarItems.forEach(sidebarItem => sidebarItem.addEventListener('click', navigateFromSidebar));
nextStepButtons.forEach(button => button.addEventListener('click', nextPage));
previousStepButtons.forEach(button => button.addEventListener('click', previousPage));
planCards.forEach(card => card.addEventListener('click', selectPlan));
pricingToggle.addEventListener('change', changePricing);
monthlyPricingSelection.addEventListener('click', activatePricingPlan);
yearlyPricingSelection.addEventListener('click', activatePricingPlan);
addOns.forEach(addOn => addOn.addEventListener('change', toggleAddOn));
addOns.forEach(addOn => addOn.addEventListener('change', updateSummary));
planCards.forEach(card => card.addEventListener('click', updateSummaryPlan));
submitButton.addEventListener('click', submitForm);
