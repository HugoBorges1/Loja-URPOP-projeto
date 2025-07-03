import Stripe from "stripe";
import dotenv from "dotenv";

//Conexão com a API de pagamentos STRIPE.

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
