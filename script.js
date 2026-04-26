'use strict';
/* jshint esversion: 6 */

const productsSection = document.getElementById('products_section');

// fetch data from JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.json')
        .then((response) =>{
            if(!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
           /*  localStorage.setItem('data', JSON.stringify(data)); */
            populateData(data);
        })
        .catch((error) => {
            console.log('There was a problem with the fetch operation ' + error);
       });
});

function populateData(data) {
    const allCards = data.map((product, index) => `
        <div class="grid gap-4 w-full h-88" data-index="${index}">
            <div class="relative flex flex-col items-center">
                <picture class="block w-full"> 
                    <source media="(max-width: 767px)" srcset="${product.image.mobile}"> 
                    <source media="(max-width: 1023px)" srcset="${product.image.tablet}"> 
                    <img class="w-full h-55 object-cover rounded-md bg-cover" src="${product.image.desktop}" alt="${product.name}"> 
                </picture>
                <button class="add-to-cart-btn group absolute bottom-0 flex gap-2 border-2 border-rose-400 hover:border-brand-red w-40 h-11 rounded-full p-3 bg-white justify-center items-center cursor-pointer" aria-label="Add ${product.name} to cart">
                    <img src="./assets/images/icon-add-to-cart.svg" alt="" aria-hidden="true">
                    <span class="text-rose-900 transition-colors group-hover:text-brand-red text-sm font-semibold">Add to Cart</span>
                </button>
                <div class="dish hidden absolute bottom-0 gap-2 border-2 border-brand-red w-40 h-11 rounded-full p-3 bg-brand-red justify-between items-center">
                        <button class="dec group flex justify-center items-center border-2 border-white hover:border-brand-red bg-brand-red hover:bg-white rounded-full w-5 h-5 cursor-pointer" aria-label="Decrease ${product.name} quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                               <path class="fill-white transition-colors group-hover:fill-brand-red" d="M0 .375h10v1.25H0V.375Z"/>
                            </svg>
                        </button>
                        <p class="quantity text-white text-sm font-semibold">0</p>
                        <button class="inc group flex justify-center items-center border-2 border-white hover:border-brand-red bg-brand-red hover:bg-white rounded-full w-5 h-5 cursor-pointer" aria-label="Increase ${product.name} quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                <path class="fill-white transition-colors group-hover:fill-brand-red" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                            </svg>
                        </button>   
                </div>
            </div>
            <div class="flex flex-col gap-1 w-full">
                <p class="text-rose-500 text-sm font-normal">${product.category}</p>
                <p class="text-rose-900 text-base font-semibold truncate max-w-40">${product.name}</p>
                <p class="text-brand-red text-base font-semibold"><span>$</span><span>${product.price.toFixed(2)}</span></p>
            </div>
        </div>
    `).join('');                
    
    productsSection.innerHTML = allCards;

/* console.log(`${product.name}`); */

    /* Quantity dishes */
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach((button) => {
        const card = button.closest('.grid');
        const dish = card.querySelector('.dish');
        const incBtn = dish.querySelector('.inc');
        const decBtn = dish.querySelector('.dec');

        button.addEventListener('click', () => {
            button.classList.add('hidden');
            dish.classList.remove('hidden');
            dish.classList.add('flex');
        });

        incBtn.addEventListener('click', () => {
            const quantElement = dish.querySelector('.quantity');
            quantElement.innerHTML = parseInt(quantElement.innerText) + 1;
            const productsNumber = +(quantElement.innerText);
            console.log(productsNumber);

            const details = document.querySelector('.details');
            details.classList.add('hidden');

            const cartSection = document.querySelector('#cart_section');

            const card = button.closest('.grid');
            console.log(card);

            const index = Number(card.dataset.index);
            console.log(index);

            const product = data[index];
            console.log(product);

            const cartItemsContainer = cartSection.querySelector('.cart-items') || (() => {
                const container = document.createElement('div');
                container.className = 'cart-items overflow-y-auto';
                container.style.maxHeight = window.innerWidth >= 768 ? '40dvh' : '65dvh';
                cartSection.appendChild(container);
                return container;
            })();

            const existingOrder = cartItemsContainer.querySelector(`[data-cart-index="${index}"]`);
            if (existingOrder) existingOrder.remove();
                
            const orderList = `
                <div data-cart-index="${index}" class="flex items-center justify-between border-b border-rose-100 pb-4 mb-4">
                    <div class="min-w-0">
                        <p class="text-rose-900 text-base font-semibold pb-2 truncate max-w-40">${product.name}</p>
                        <p>
                            <span class="orderedDishes text-brand-red text-base font-semibold">${productsNumber}</span><span class="text-brand-red text-base font-semibold">x</span>&ensp;
                            <span class="text-rose-500 text-base font-normal">@ $</span><span class="text-rose-500 text-base font-normal">${(product.price).toFixed(2)}</span>
                            <span class="text-base font-semibold text-rose-500">&emsp;$</span><span class="totalPrice text-base font-semibold text-rose-500">${(productsNumber * product.price).toFixed(2)}</span>
                        </p>
                    </div>
                    <button class="removeDish flex justify-center items-center w-5 h-5 border-2 border-rose-300 rounded-full cursor-pointer" aria-label="Remove ${product.name} from cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                        </svg>
                    </button>
                </div>
            `
            cartItemsContainer.insertAdjacentHTML('beforeend', orderList);

            let totalRow = cartSection.querySelector('.order-total-row');
            let note = cartSection.querySelector('.note');
            let confBtn = cartSection.querySelector('.confirm-btn');
            
            if (!totalRow && !note && !confBtn ) {
                totalRow = document.createElement('p');
                totalRow.className = 'order-total-row flex justify-between items-center py-6 text-base font-normal text-rose-900';
                totalRow.innerHTML = 'Order Total <span class="text-2xl font-bold text-rose-900">$<span class="totalSum">0.00</span></span>';
                cartSection.appendChild(totalRow);
                note = document.createElement('p');
                note.className = 'note mt-auto p-4 bg-rose-50 rounded-md flex items-center gap-2 text-sm text-rose-500';
                note.innerHTML = '<img src="./assets/images/icon-carbon-neutral.svg" alt="" aria-hidden="true"><span class="font-normal">This is a <span class="font-semibold">carbon-neutral</span> delivery</span>';
                cartSection.appendChild(note);
                confBtn = document.createElement('button');
                confBtn.className = 'confirm-btn flex justify-center items-center w-full h-13.25 border-2 border-brand-red rounded-full bg-brand-red py-6 px-4 mt-6 text-white text-base font-semibold cursor-pointer hover:bg-[linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)),linear-gradient(#C73B0F,#C73B0F)]';
                confBtn.innerText = 'Confirm Order';
                cartSection.appendChild(confBtn);
                exec(confBtn);
            }

            const orderedDish = cartSection.querySelectorAll('.orderedDishes');
            const totalDisch = [...orderedDish].reduce((acc, dish) => acc + parseInt(dish.innerText), 0);
            const totalDisches = document.querySelector('.totalDishes');
            totalDisches.innerHTML = totalDisch;

            const totalPrice = cartSection.querySelectorAll('.totalPrice');
            const total = [...totalPrice].reduce((acc, dish) => acc + parseFloat(dish.innerText), 0);
            const totalSum = totalRow.querySelector('.totalSum');
            totalSum.innerHTML = total.toFixed(2);
        });

            

        decBtn.addEventListener('click', () => {
            const quantElement = dish.querySelector('.quantity');
            const current = parseInt(quantElement.innerText);
            if (current > 1) {
                quantElement.innerHTML = current - 1;

                const productsNumber = +(quantElement.innerText);
                const cartSection = document.querySelector('#cart_section');

                const card = button.closest('.grid');
                const index = Number(card.dataset.index);
                const product = data[index];
                const existingOrder = cartSection.querySelector(`[data-cart-index="${index}"]`);

                if (existingOrder) {
                    const quantityElement = existingOrder.querySelector('.orderedDishes');
                    quantityElement.innerText = productsNumber;
                    const totalPriceElement = existingOrder.querySelector('.totalPrice');
                    totalPriceElement.innerText = (productsNumber * product.price).toFixed(2);
                }
                    
                const totalPrice = cartSection.querySelectorAll('.totalPrice');
                const total = [...totalPrice].reduce((acc, dish) => acc + parseFloat(dish.innerText), 0);
                const totalRow = cartSection.querySelector('.order-total-row');
                const totalSum = totalRow.querySelector('.totalSum');
                totalSum.innerHTML = total.toFixed(2);                  

            }
        });


        function exec(confBtn) {
            confBtn.addEventListener('click', () => {
                const previousFocus = document.activeElement;
                // Get all cart item elements
                const cartItems = document.querySelectorAll('[data-cart-index]');
    
                // Build HTML for all items
                let itemsHTML = '';

                cartItems.forEach((item, i) => {
                    const isLast = i ===  cartItems.length - 1;
                    const index = item.getAttribute('data-cart-index');
                    const name = item.querySelector('p').innerText; // product name
                    const qty = item.querySelector('.orderedDishes').innerText;
                    const price = item.querySelector('.totalPrice').innerText; // line total

                    console.log(item);
        
                    itemsHTML += `
                        <div class="flex items-center justify-between py-4 first:pt-0 ${isLast ? 'pb-6' : ''} border-b border-rose-100">
                        <div class="flex items-center gap-4 min-w-0 flex-1">
                            <img class="w-12 h-12 object-cover rounded-md bg-cover" src="${data[index].image.desktop}" alt="${data[index].name}"> 
                            <div class="flex flex-col gap-2 text-sm min-w-0 flex-1 w-0">
                                <p class="text-rose-900 font-semibold truncate block w-40">${name}</p>
                                <p>
                                    <span class="text-brand-red font-semibold">${qty}x</span>&ensp;
                                    <span class="text-rose-500 font-normal">@ $${data[index].price}</span>
                                </p>
                            </div>
                            </div>
                            <p class="text-rose-900 font-semibold">$${price}</p>
                        </div>
                    `;
                });
    
                // Get order total from DOM
                const orderTotal = document.querySelector('.totalSum').innerText;
    
                // Create ONE modal with all items
                const wrapper = document.createElement('div');
                wrapper.className = 'flex items-center justify-center md:p-10 fixed inset-0 z-50 bg-black/50';
                const modal = document.createElement('div');
                modal.className = 'bg-white flex flex-col rounded-lg px-6 pt-10 pb-6 w-full lg:w-148 gap-8 h-fit';
                modal.setAttribute('role', 'dialog');
                modal.setAttribute('aria-modal', 'true');
                modal.setAttribute('aria-labelledby', 'order-confirmed-title');
                modal.innerHTML = `
                    <div class="flex flex-col items-start justify-start">
                        <img class="mb-6" src="./assets/images/icon-order-confirmed.svg" alt="Order confirmed">
                        <h2 id="order-confirmed-title" class="text-[2.5rem] leading-[1.2] tracking-normal text-rose-900 font-bold">Order Confirmed</h2>
                        <p class="text-base text-rose-500 font-normal pt-2" >We hope you enjoy your food!</p>
                    </div>
                    <div class="bg-rose-50 rounded-lg p-6 overflow-y-auto max-h-[40dvh]">
                        ${itemsHTML}
                        <div class="flex justify-between items-center text-sm text-rose-900 font-normal pt-6"><span>Order Total</span><span class="text-2xl font-bold">$${orderTotal}</span></div>
                    </div>
                    <button class="start-new-order-btn flex justify-center items-center w-full h-13.25 border-2 border-brand-red rounded-full bg-brand-red py-6 px-4 mt-6 text-white text-base font-semibold cursor-pointer hover:bg-[linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)),linear-gradient(#C73B0F,#C73B0F)]">Start New Order</button>
                `;
                wrapper.appendChild(modal);
                document.body.appendChild(wrapper);

                const startNewOrderBtn = wrapper.querySelector('.start-new-order-btn');
                const focusableElements = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (firstFocusable) {
                    firstFocusable.focus();
                }

                const handleModalKeys = (event) => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        startNewOrderBtn.click();
                    }

                    if (event.key !== 'Tab' || !firstFocusable || !lastFocusable) {
                        return;
                    }

                    if (event.shiftKey && document.activeElement === firstFocusable) {
                        event.preventDefault();
                        lastFocusable.focus();
                    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                        event.preventDefault();
                        firstFocusable.focus();
                    }
                };

                wrapper.addEventListener('keydown', handleModalKeys);

                startNewOrderBtn.addEventListener('click', () => {
                    wrapper.removeEventListener('keydown', handleModalKeys);
                    wrapper.remove();

                    if (previousFocus && typeof previousFocus.focus === 'function') {
                        previousFocus.focus();
                    }

                    window.location.reload();
                })

            });
        }

    });

    const cartSection = document.querySelector('#cart_section');
    cartSection.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.removeDish');
        if (!removeBtn) return;

        const orderItem = removeBtn.closest('[data-cart-index]');
        if (!orderItem) return;

        orderItem.remove();

        const totalPrice = cartSection.querySelectorAll('.totalPrice');
        const total = [...totalPrice].reduce((acc, dish) => acc + parseFloat(dish.innerText), 0);
        const totalRow = cartSection.querySelector('.order-total-row');
        if (totalRow) {
            const totalSum = totalRow.querySelector('.totalSum');
            totalSum.innerHTML = total.toFixed(2);
        }

        const orderedDish = cartSection.querySelectorAll('.orderedDishes');
        const totalDisch = [...orderedDish].reduce((acc, dish) => acc + parseInt(dish.innerText), 0);
        const totalDisches = document.querySelector('.totalDishes');
        totalDisches.innerHTML = totalDisch;

        const ind = orderItem.getAttribute('data-cart-index');
        const card = document.querySelector(`.grid[data-index="${ind}"]`);
        if (!card) return;

        const cardDish = card.querySelector('.dish');
        const addButton = card.querySelector('.add-to-cart-btn');
        const quant = card.querySelector('.quantity');

        cardDish.classList.add('hidden');
        cardDish.classList.remove('flex');
        addButton.classList.remove('hidden');
        quant.innerHTML = 0;
    });

    
      
}


