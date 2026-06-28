import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configura web-push con tus llaves
webpush.setVapidDetails(
  'mailto:eliaquinmarin@gmail.com',
  'BD-zeyWbNzlT9RftIN2bM_V0_ccR6mr6F05HqrAemNDQ4vMg3ScpB2pii4ucNrGw3rwJf0Dc2EdBHpKcCZqe6ZM',
  'jcRAFh8LUoDpNx1bTghYD0OZkcibdP5aowiyYH_VveU'
);

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  // 1. Obtener todos los suscriptores
  const { data: subs } = await supabase.from('push_subscriptions').select('subscription_data');
  
  // 2. Enviar a cada uno
  const payload = JSON.stringify({ title: '¡Hora de la Radio!', body: 'Tu programa va a comenzar' });
  
  const promises = subs.map(s => webpush.sendNotification(s.subscription_data, payload));
  await Promise.all(promises);
  
  res.status(200).json({ success: true });
}