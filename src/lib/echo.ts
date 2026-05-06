import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';

if (typeof window !== 'undefined') {
    (window as any).Pusher = Pusher;
}

let echoInstance: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> {
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_KEY || 'sportstore-key',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || '127.0.0.1',
            wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
            wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
            forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1') + '/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token') || ''}`,
                },
            },
        });
    }
    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
