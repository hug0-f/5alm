import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} from 'baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

let sock = null;
let ready = false;

export function isReady() {
  return ready;
}

export async function sendMessage(phoneE164, text) {
  if (!ready) throw new Error('WhatsApp non connecte');

  const number = phoneE164.replace(/^\+/, '');

  const [result] = await sock.onWhatsApp(number);
  if (!result?.exists) throw new Error('Ce numero n est pas sur WhatsApp');

  await sock.sendMessage(result.jid, { text });
}

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const logger = pino({ level: 'silent' });

  sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    logger: pino({ level: 'warn' }),
    browser: ['Lebontroc', 'Chrome', '1.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\nScanner ce QR code avec WhatsApp (Appareils lies) :\n');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') {
      ready = true;
      console.log('WhatsApp connecte');
    }
    if (connection === 'close') {
      ready = false;
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('Reconnexion WhatsApp...');
        connect();
      } else {
        console.log('Deconnecte. Rescanner le QR code et redemarrer.');
      }
    }
  });
}
