import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configura web-push con tus llaves
webpush.setVapidDetails(
  'mailto:eliaquinmarin@gmail.com',
  'BD-zeyWbNzlT9RftIN2bM_V0_ccR6mr6F05HqrAemNDQ4vMg3ScpB2pii4ucNrGw3rwJf0Dc2EdBHpKcCZqe6ZM',
  'jcRAFh8LUoDpNx1bTghYD0OZkcibdP5aowiyYH_VveU'
);

export default async function handler(req, res) {
  const supabase = createClient(process.env.https://ubmdovhsavezwjphdzfe.supabase.co, process.env.sb_publishable_Gncx0KIad4u8nyC4SJ4Cqw_-Ts_XU8p);

  // 1. Obtener la hora actual (ajustada a tu zona horaria)
  const now = new Date();
  const horaActual = `${now.getHours()}:${now.getMinutes()}:00`;

  // 2. Buscar si hay un programa que empiece AHORA
  const { data: programas } = await supabase
    .from('programas')
    .select('titulo')
    .eq('hora_inicio', horaActual)
    .single(); // Trae solo un programa

  if (programas) {
    // 3. Obtener suscriptores y enviar mensaje personalizado
    const { data: subs } = await supabase.from('push_subscriptions').select('subscription_data');
    
    const payload = JSON.stringify({ 
      title: '¡Al aire en Radio FE!', 
      body: `Programa: ${programas.titulo}` 
    });
    
    await Promise.all(subs.map(s => webpush.sendNotification(s.subscription_data, payload)));
    return res.status(200).json({ success: true, programa: programas.titulo });
  }

  res.status(200).json({ success: false, message: 'No hay programa a esta hora' });
}