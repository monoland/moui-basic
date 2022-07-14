import {Workbox} from 'workbox-window';

export default function registerWorker() {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    
    if ('serviceWorker' in navigator ) {
        const wb = new Workbox('/service-worker.js');

        wb.addEventListener('activated', (event) => {
            const urlsToCache = [
                location.href,
                ...performance.getEntriesByType('resource').map((r) => r.name),
            ];

            wb.messageSW({
                type: 'CACHE_URLS',
                payload: {urlsToCache},
            });

            if (event.isUpdate) {
                window.location.reload();
            }
        });

        wb.addEventListener('message', (event) => {
            if (event.data.type === 'CACHE_UPDATED') {
                // const {updatedURL} = event.data.payload;
            }
        });
    
        wb.register();
    }
}