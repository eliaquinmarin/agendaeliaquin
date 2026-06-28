import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Asegúrate de que los nombres coincidan EXACTAMENTE con los de Vercel
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  webpush.setVapidDetails(
    'mailto:eliaquinmarin@gmail.com',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
  );

  const now = new Date();
  const horaActual = `${now.getHours()}:${now.getMinutes()}:00`;

  const { data: programas } = await supabase
    .from('programas')
    .select('titulo')
    .eq('hora_inicio', horaActual)
    .single();

  if (programas) {
    const { data: subs } = await supabase.from('push_subscriptions').select('subscription_data');
    if (subs) {
      const payload = JSON.stringify({ title: '¡Al aire!', body: programas.titulo });
      await Promise.all(subs.map(s => webpush.sendNotification(s.subscription_data, payload)));
    }
    return res.status(200).json({ success: true });
  }
  res.status(200).json({ success: false });
}