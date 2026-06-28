import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configura web-push
webpush.setVapidDetails(
  'mailto:eliaquinmarin@gmail.com',
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

export default async function handler(req, res) {
  // CORRECTO: Usar nombres de variables de entorno
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  const now = new Date();
  // Ajuste de zona horaria para Venezuela (UTC-4)
  const horaLocal = new Date(now.getTime() - (4 * 60 * 60 * 1000));
  const horaActual = horaLocal.toTimeString().split(' ')[0]; // Formato HH:MM:SS

  const { data: programas } = await supabase
    .from('programas')
    .select('titulo')
    .eq('hora_inicio', horaActual)
    .single();

  if (programas) {
    const { data: subs } = await supabase.from('push_subscriptions').select('subscription_data');
    
    if (subs) {
      const payload = JSON.stringify({ 
        title: '¡Al aire en Radio FE!', 
        body: `Programa: ${programas.titulo}` 
      });
      await Promise.all(subs.map(s => webpush.sendNotification(s.subscription_data, payload)));
    }
    return res.status(200).json({ success: true, programa: programas.titulo });
  }

  res.status(200).json({ success: false, message: 'No hay programa ahora' });
}