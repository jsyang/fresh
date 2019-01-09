# Fresh

Mobile-focused app to organize what to and how to clean areas of the house. With this
we can clean thoroughly and track cleaning frequency as well as surface important things 
to be cleaned which have not been cleaned in a while.

Finally, a example to-do app that's actually *USEFUL*!

Hosted at [http://jsyang.ca/fresh](http://jsyang.ca/fresh)

## End-User Features
- User auth
- Cleaning tasks by room
    - Mark task as done
    - Undo marking a task as done
    - See time of last completion
    - See user who last completed the task
    - Color coding and sorting of most urgent to least urgent tasks
    - Segregate tasks: "Quick" vs "Deep"
    - Super urgent tasks animate (blink) in the list
- Scheduled task sends SMS / Emails / Twitter DMs to users when tasks reach urgency threshold

## Todo
- admin panel
    - see history
    - CRUD tasks
    - manage users
- create room sorting based on task list
- fill out seed tasks for rooms
- users settings panel
    - opt in for SMS / twitter DMs / push notifications / emails
    - change password
- app just for push notifications

## Set up

- MLab
    - read-only account
- Heroku
    - env variables
    - [scheduler setup](https://devcenter.heroku.com/articles/scheduler)
- GHPages / static file host
    - only need to dump the built `index.html` in there!
- Twilio
    - get and set AUTH_TOKEN, ACCOUNT_SID, and NUMBER

### Environment variables

```
Name                Example value

DB_HOST             ds121471.mlab.com:49744/fresh
API_KEY             beLqdZWLAlC3_p5HZz9l2Ts8XB5ZCT_t
TWILIO_ACCOUNT_SID  AC023f588cc1d635dc5f3fd9bdeed7819a
TWILIO_AUTH_TOKEN   6ea871a51a34776b76447135cef85504
TWILIO_NUMBER       +441234567890
TARGET_NUMBER       +440123456789
```

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

Twilio                                  Free trial with $15 credit, cheap TX/RX rates                                  
(messaging service)                     Widely supported internationally, and good reliability
```

### Total client file size: 85.06 KB

## Security

> Given that nobody is keen to hack a house cleaning app DB... 

1. Single file SPA `index.html` talks to proxy API server `src/api/index.js`
through HTTPS, mongo credentials are sent via `x-username` and `x-password` headers and
are thus protected by TLS. 

2. SPA stores proxy API credentials in `localStorage`, which unless the SPA
is somehow hijacked via script injection, would require physical access to the device.
Proxy API credentials are managed by the MLab mongoDB instance, so usernames / passwords 
can be changed or write access revoked.

3. Proxy API server `src/api/index.js` also has MLab Data API access via an API key, which can be
swapped out should it be compromised.

4. Proxy API server `src/api/index.js` haves security headers (package `helmet`) and anti-DDOS (package `ddos`) middleware set up.

4. MLab mongodb for this app has a scheduled backup task (per day), so that can also be restored
if compromised. 

## Gotchas

The build in dev mode (`yarn watch`) behaves differently than in
a production build (`yarn build`): CSS-in-JS object key names can
get mangled if they are multiple words and not defined as string
literals:

```
// GOOD
{ 'min-width': '50%', ... }

// BAD: this will break in the production build
{  minWidth: '50%', ... }
}
```

## Similar apps / tools 

- [Home Routines](https://itunes.apple.com/gb/app/home-routines/id353117370?mt=8)