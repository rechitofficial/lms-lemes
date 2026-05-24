import Stripe from 'stripe';

export const stripe = new Stripe('', {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
});