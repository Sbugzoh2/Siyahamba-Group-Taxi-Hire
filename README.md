# Siyahamba Group Taxi Hire

*Siyahamba* means "we are going". It's a web app for South African group taxi hire. One group leader books a minibus taxi, Sprinter or bus for the whole group, and a driver accepts the job.

- **Short trips:** in town or nearby, up to 60 km (e.g. Soweto → Sandton).
- **Long trips:** between cities and provinces (e.g. Johannesburg → Mthatha). The driver can wait and bring the group back, which suits funerals, weddings and pilgrimages.

It's a single static page (HTML, CSS and JavaScript) with no build step, so it runs on GitHub Pages.

## Features

**Passengers ("I need a taxi")**
- Pick-up, destination, group size, reason for the trip, luggage, now or later, and payment method
- Distance is worked out for about 45 South African places and can be changed by hand
- The best-fit vehicle is chosen automatically: Quantum (14), Sprinter (22), Midibus (35) or Bus (60). Bigger groups get more than one vehicle.
- The group price and the price per person show in Rand before booking
- "My trips" updates live and shows the driver's name, number and number plate once a driver accepts

**Drivers ("I'm a driver")**
- Vehicle profile: name, cellphone number, vehicle type, registration, taxi association or rank, and PrDP
- Job board of open requests, which can be filtered by short or long trips
- When two drivers tap Accept at once, only one gets the job (a Firestore transaction)
- Trip status: on my way → passengers picked up → trip complete, or give the job back

## Deploy to GitHub Pages

1. Copy every file in this folder, including the hidden `.github` folder, to the root of your `Siyahamba-Group-Taxi-Hire` repository. Then commit and push to `main`.
2. On GitHub, go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy-pages.yml` runs on every push to `main`. Your site appears at
   `https://<your-username>.github.io/Siyahamba-Group-Taxi-Hire/`

Without Firebase, the app runs in **demo mode**: each phone keeps its own requests in the browser. That's fine for trying it out, but a passenger's request won't reach a driver on another phone.

## Connect passengers and drivers (Firebase, free tier)

1. Create a project at https://console.firebase.google.com
2. **Build → Authentication → Sign-in method:** turn on **Anonymous**.
3. **Build → Firestore Database:** create a database. Choose a region close to South Africa, such as `africa-south1` (Johannesburg).
4. **Firestore → Rules:** paste the contents of `firestore.rules`, then publish.
5. **Project settings → Your apps → Web app (`</>`):** register an app and copy its `firebaseConfig`.
6. Paste that config into `config.js` as `window.SIYAHAMBA_FIREBASE = { ... }`. Then commit and push.
7. **Authentication → Settings → Authorized domains:** add `<your-username>.github.io`.

Firebase web keys are safe to put in a public repository. Access is controlled by the security rules.

## Try it on your computer

Open `index.html` in a browser, or run a small local server:

```bash
python3 -m http.server 8000
```

Then go to http://localhost:8000.

## Prices

The prices are **estimates** and should be changed to match real rates. They're set in the `RATES` object in `index.html`:

| Setting | Default |
|---|---|
| Short trip call-out | R250 |
| Short trip per km | R16 (minimum R350) |
| Night trips (20:00–05:00) | +15% |
| Long trip per km | R11 |
| Long one-way trip | × 1.5, to cover the driver's empty drive home |
| Driver waits and returns | 2 × distance, plus R1,200 per night |
| Luggage trailer | R450 |
| Vehicle size | Sprinter × 1.35, Midibus × 1.9, Bus × 2.8 |

Places and coordinates are in `PLACES`, and vehicle seats are in `VEHICLES`.

## Before real-world use

- Real payments: card payments are only a label for now. Connect a payment provider such as PayFast, Yoco or Peach Payments.
- SMS or WhatsApp alerts for new requests and status changes
- Driver vetting (PrDP, operating licence, roadworthy certificate) and passenger ratings
- A live map and GPS tracking
- Phone numbers are stored on each request so the accepted driver can call the group leader. Under the rules, any signed-in user can read requests, so review this against POPIA before launch.
