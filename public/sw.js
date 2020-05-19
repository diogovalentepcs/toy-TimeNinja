const staticCacheName = 'site-static-v0';
const dynamicCache = 'site-dynamic-v0';
const assets = [
    '/', //its a request for index page
    '/index.html', //its also a request for index page
    '/pages/fallback.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNaIhQ8tQ.woff',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://kit.fontawesome.com/c41e248913.js',
    
  ];


//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}


//install event service worker
self.addEventListener('install', evt => {
    //console.log('service worker has been installed')
    evt.waitUntil( //waits to add all assets before stopping installation
    caches.open(staticCacheName).then(cache => {
        console.log('caching assets')
        cache.addAll(assets) //adds responses for assets requests
    })
    );
})

//activate event service worker
self.addEventListener('activate', evt => {
    //console.log('service worker has been activated')
    evt.waitUntil(
        caches.keys().then(keys =>{
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key!==staticCacheName && key !== dynamicCache)
                .map(key => caches.delete(key))) //deletes differernt caches
        })
    )
})


// fetch event - fetches changes on files 
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt)
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {    
                    // the || are 'if empty then return
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCache, 50);
                        return fetchRes;
                    })
                });  
            }).catch(() => {
                // conditional cahcing (only falback html not cached)
                if(evt.request.url.indexOf('.html') > -1){  
                    return caches.match('pages/fallback.html')
                }
            })
        );
    }
});