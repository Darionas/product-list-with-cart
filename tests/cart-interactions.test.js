/* @vitest-environment jsdom */

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockProducts = [
    {
        name: 'Waffle with Berries',
        category: 'Waffle',
        price: 6.5,
        image: {
            mobile: './assets/images/image-waffle-mobile.jpg',
            tablet: './assets/images/image-waffle-tablet.jpg',
            desktop: './assets/images/image-waffle-desktop.jpg'
        }
    }
];

const baseMarkup = `
    <section id="products_section" class="grid"></section>
    <aside id="cart_section" class="bg-white rounded-lg p-6 h-fit w-full">
        <h2>Your Cart (<span class="totalDishes">0</span>)</h2>
        <div class="details">Your added items will appear here</div>
    </aside>
`;

async function bootApp() {
    const scriptPath = path.resolve(process.cwd(), 'script.js');
    const scriptUrl = `${pathToFileURL(scriptPath).href}?t=${Date.now()}-${Math.random()}`;

    await import(scriptUrl);
    document.dispatchEvent(new Event('DOMContentLoaded'));
}

async function waitForElement(selector, retries = 30) {
    for (let i = 0; i < retries; i += 1) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return null;
}

describe('cart interactions', () => {
    beforeEach(() => {
        if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText')) {
            Object.defineProperty(HTMLElement.prototype, 'innerText', {
                get() {
                    return this.textContent;
                },
                set(value) {
                    this.textContent = value;
                }
            });
        }

        document.body.innerHTML = baseMarkup;

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockProducts
            })
        );

        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('adds, updates, and removes a cart item', async () => {
        await bootApp();

        const addButton = await waitForElement('.add-to-cart-btn');
        expect(addButton).not.toBeNull();

        addButton.click();

        const dishControls = document.querySelector('.dish');
        const incButton = dishControls.querySelector('.inc');
        const decButton = dishControls.querySelector('.dec');

        incButton.click();
        incButton.click();

        const cartItem = document.querySelector('[data-cart-index="0"]');
        expect(cartItem).not.toBeNull();
        expect(cartItem.querySelector('.orderedDishes').textContent.trim()).toBe('2');
        expect(document.querySelector('.totalDishes').textContent.trim()).toBe('2');

        decButton.click();
        expect(cartItem.querySelector('.orderedDishes').textContent.trim()).toBe('1');

        const removeButton = cartItem.querySelector('.removeDish');
        removeButton.click();

        expect(document.querySelector('[data-cart-index="0"]')).toBeNull();
        expect(document.querySelector('.totalDishes').textContent.trim()).toBe('0');
        expect(addButton.classList.contains('hidden')).toBe(false);
    });

    it('opens confirm modal after confirming order', async () => {
        await bootApp();

        const addButton = await waitForElement('.add-to-cart-btn');
        expect(addButton).not.toBeNull();

        addButton.click();

        const incButton = document.querySelector('.inc');
        incButton.click();

        const confirmBtn = await waitForElement('.confirm-btn');
        expect(confirmBtn).not.toBeNull();

        confirmBtn.click();

        const modal = await waitForElement('[role="dialog"]');
        expect(modal).not.toBeNull();
        expect(modal.querySelector('#order-confirmed-title').textContent.trim()).toBe('Order Confirmed');

        const startNewOrderBtn = modal.querySelector('.start-new-order-btn');
        expect(startNewOrderBtn).not.toBeNull();
        expect(document.activeElement).toBe(startNewOrderBtn);
    });
});
