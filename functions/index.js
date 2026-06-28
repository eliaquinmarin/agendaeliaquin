const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Esta función se dispara cuando creas un nuevo documento en 'publicaciones'
exports.notificarNuevaPublicacion = functions.firestore
    .document('publicaciones/{pubId}')
    .onCreate(async (snap, context) => {
        const nuevaPublicacion = snap.data();

        // 1. Obtener todos los tokens de los usuarios suscritos
        const tokensSnapshot = await admin.firestore().collection('tokens_usuarios').get();
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

        if (tokens.length === 0) {
            console.log("No hay usuarios suscritos para recibir notificaciones.");
            return null;
        }

        // 2. Preparar el mensaje
        const mensaje = {
            notification: {
                title: '¡Nueva entrada en la Agenda!',
                body: nuevaPublicacion.titulo || 'Hay un evento nuevo esperando por ti.'
            },
            tokens: tokens // Envia a todos los tokens encontrados
        };

        // 3. Enviar la notificación
        try {
            const response = await admin.messaging().sendMulticast(mensaje);
            console.log(`${response.successCount} mensajes enviados con éxito.`);
        } catch (error) {
            console.error('Error al enviar notificaciones:', error);
        }
    });