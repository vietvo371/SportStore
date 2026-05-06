import { useEffect, useRef } from 'react';
import { getEcho } from '@/lib/echo';
import Cookies from 'js-cookie';

export function useEcho(
    channelName: string,
    event: string,
    callback: (data: any) => void,
    enabled: boolean = true
) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if (!enabled || !channelName) return;

        const token = Cookies.get('token');
        if (!token) return;

        const echo = getEcho();
        const isPrivate = channelName.startsWith('private-');
        const cleanName = channelName.replace(/^private-/, '');

        const channel = isPrivate
            ? echo.private(cleanName)
            : echo.channel(cleanName);

        channel.listen(`.${event}`, (data: any) => {
            callbackRef.current(data);
        });

        return () => {
            channel.stopListening(`.${event}`);
        };
    }, [channelName, event, enabled]);
}

export function usePrivateChannel(
    channelName: string,
    events: Record<string, (data: any) => void>,
    enabled: boolean = true
) {
    const eventsRef = useRef(events);
    eventsRef.current = events;

    useEffect(() => {
        if (!enabled || !channelName) return;

        const token = Cookies.get('token');
        if (!token) return;

        const echo = getEcho();
        const channel = echo.private(channelName);

        Object.entries(eventsRef.current).forEach(([event, handler]) => {
            channel.listen(`.${event}`, handler);
        });

        return () => {
            Object.keys(eventsRef.current).forEach((event) => {
                channel.stopListening(`.${event}`);
            });
        };
    }, [channelName, enabled]);
}
