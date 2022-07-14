import {clientsClaim} from 'workbox-core';
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

clientsClaim();

self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({url}) => url.pathname.startsWith('/scripts/'),
    new StaleWhileRevalidate({
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    })
);

registerRoute(
    ({url}) => url.pathname.startsWith('/styles/'),
    new StaleWhileRevalidate({
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    })
);

registerRoute(
    ({url}) => url.pathname.startsWith('/fonts/'),
    new CacheFirst({
        cacheName: 'asset',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    })
);