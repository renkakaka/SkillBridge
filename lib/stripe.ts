import Stripe from 'stripe';

let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (cachedStripe) return cachedStripe;

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not set. Stripe functionality is disabled.');
  }

  cachedStripe = new Stripe(apiKey);
  return cachedStripe;
}

export default getStripe;
