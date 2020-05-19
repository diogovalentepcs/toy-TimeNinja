if('serviceWorker' in navigator){  //if browser supports service workers
    navigator.serviceWorker.register('/sw.js')  //this is a promise syntax
    .then((reg) => console.log('service worker registerd', reg))
    .catch((err) => console.log('service worker not regitered', err))
}