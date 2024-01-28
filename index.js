import {TelegramChatId, TelegramToken} from "./config/env.js";
import {setupTelegram} from "./services/telegram.js";

if (!TelegramToken) {
    console.error('TELEGRAM_TOKEN is not set');
    process.exit(1);
}

if (!TelegramChatId) {
    console.error('TELEGRAM_CHAT_ID is not set');
    process.exit(1);
}

console.log('Starting...');

console.log('Setup telegram...');
await setupTelegram(TelegramToken);