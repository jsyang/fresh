# Fresh

Mobile-focused app to organize what to and how to clean areas of the house. With this
we can clean thoroughly and track cleaning frequency as well as surface important things to be cleaned which
have not been cleaned in a while.

Hosted at [http://jsyang.ca/fresh](http://jsyang.ca/fresh)

## Todo
- create room sorting based on task list
- fill out seed tasks for rooms
- send twitter DMs when stuff gets urgent
- admin panel
- better mobile UI

## Tech choices

```
App feature / technology                Why
-------------------------------------------------------------------------------
Non-isomorphic Single Page App          Don't care about SEO, UX comes first                         
(structure)

Baked in JS                             Fastest loading time possible, since
(build result)                          the whole app is just 1 file
                                        
CSS-in-JS                               All the benefits of a real language,
(style system)                          no cascading or crazy inheritance
                                        
TypeScript                              Type-safety where needed, smarter code
(language)                              completion

Preact                                  React compatible, small size, has JSX
(render library)

Preact-Router                           Simplest router, small size
(router)

Unistore                                Easily persist to localStorage , etc.
(state management)                      Small size, simplest data store

mongoDB via MLab                        Minimal setup, free hosting, NoSQL
(database)                              Tried Firebase, bundle was > 1 MB with
                                        the SDK, too much config hassle.

Express                                 Needed a gateway to MLab, simplest proxy API                                 
(HTTP server)
```

## Security

> Given that nobody is keen to hack a house cleaning app DB... 

1. Single file SPA `index.html` talks to proxy API server `mongoproxy.js`
through HTTPS, mongo credentials are sent via `x-username` and `x-password` headers and
are thus protected by TLS. 

2. SPA stores proxy API credentials in `localStorage`, which unless the SPA
is somehow hijacked via script injection, would require physical access to the device.
Proxy API credentials are managed by the MLab mongoDB instance, so usernames / passwords 
can be changed or write access revoked.

3. Proxy API server `mongoproxy.js` also has MLab Data API access via an API key, which can be
swapped out should it be compromised.

4. MLab mongodb for this app has a scheduled backup task (per day), so that can also be restored
if compromised. 

## Gotchas

The build in dev mode (`yarn watch`) behaves differently than in
a production build (`yarn build`): CSS-in-JS object key names can
get mangled if they are multiple words and not defined as string
literals:

```
// GOOD
{
    'min-width': '50%'
    ...
}

// BAD: this will break in the production build
{
    minWidth: '50%'
    ...
}
```

## Similar apps / tools 

- [Home Routines](https://itunes.apple.com/gb/app/home-routines/id353117370?mt=8)