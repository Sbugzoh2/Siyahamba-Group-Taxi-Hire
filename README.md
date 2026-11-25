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

## Accounts that follow people to any phone

Passengers and drivers sign in with **Google** or **email and password**, using the **Sign in** button in the header. Their account then works on any phone:

- **Drivers** keep their profile, approval, credit, `SH-` reference and jobs.
- **Passengers** keep their trips, and their name and cellphone number are filled in automatically.

Anyone can browse without signing in. **Booking a trip, registering as a driver and accepting jobs need an account.** The database rules enforce this, so it can't be skipped. A passenger asked to sign in while booking keeps everything they've filled in.

**Nobody loses anything when they first sign in.** The first time someone signs in on a phone they already used, that phone's account is upgraded in place. A driver who already had credit keeps it, along with the same reference and approval. Drivers who haven't signed in yet see **Keep your account safe** until they do.

Turn on both sign-in methods in Firebase, under **Authentication → Sign-in method**:
- **Google** (already on)
- **Email/Password**: **Add new provider → Email/Password → Enable → Save**

Keep **Anonymous** turned on. It lets people browse before they sign in.

## Ratings and badges

When a trip is complete, the **passenger rates the driver** and the **driver rates the group leader**. Each gives 1 to 5 stars and an optional comment of up to 300 characters. Each side rates a trip **once**, and ratings can't be changed afterwards.

Everyone's average and number of ratings show on their profile, with a badge:

| Badge | Average |
|---|---|
| Gold | 4.8 and above |
| Silver | 4.5–4.79 |
| Bronze | 4.0–4.49 |
| Rated | 3.0–3.99 |
| Low rating | below 3.0 |
| New | fewer than 3 ratings |

- **Passengers** see the driver's rating and badge once a driver is assigned.
- **Drivers** see the group leader's rating on the job board before accepting.
- **Your dashboard** has a Rating column for every driver.

The database rules make sure only people on a completed trip can rate it, and that averages only change by real ratings. As owner, you can delete an abusive rating under **Firestore → Data → ratings**. If you do, adjust that person's total under `ratingStats` too.

## Your earnings: 10% commission from driver credit

Siyahamba takes **10% of each trip's price** from the driver's prepaid credit when they accept a job. Passengers pay drivers directly, as before.

- **Drivers** see their balance under **I'm a driver → My credit**, along with your bank details and their own reference, like `SH-AB12CD`. Each job on the board shows the fee and what the driver will receive. A driver with too little credit can't accept a job until they top up.
- **Giving a job back** automatically returns the fee to the driver.
- **If a group cancels after a driver accepts**, the job shows on your dashboard. You choose **Refund** or **Keep fee**.
- **Security:** the database rules (`firestore.rules`) make it impossible for a driver to accept without paying the exact 10%, or to add credit themselves.

### Owner dashboard: `https://sbugzoh2.github.io/Siyahamba-Group-Taxi-Hire/#admin`

Set it up once:
1. In Firebase, go to **Authentication → Sign-in method → Add new provider → Google**, and enable it.
2. Open the `#admin` link and click **Sign in with Google**. The page shows your account ID.
3. In Firebase, go to **Firestore → Data → Start collection**. Name the collection `admins`, use your account ID as the **Document ID**, and add a field `role` with the value `owner`. Then reload the page.

When a driver pays you by EFT, choose them under **Add credit for a driver** (match their `SH-` reference), enter the amount, and click **Add credit**. Their balance updates on their phone straight away.

Put your bank details in `config.js`, for example:

```js
window.SIYAHAMBA_TOPUP_INFO = "FNB Business\nAccount: 62xxxxxxxxx\nBranch: 250655";
```

To change the 10%, edit `COMMISSION_PCT` in `index.html` **and** `feeFor()` in `firestore.rules`. They must match.

## Driver vetting

Drivers can only accept jobs once you approve them. Their registration under **I'm a driver → My driver profile** asks for:

- a **profile photo**, which passengers see
- full names and surname **exactly as on their ID**, their **SA ID or passport number** (SA ID numbers are checked automatically), nationality, and cellphone number
- **race**, which is optional ("Prefer not to say" is allowed) and only for B-BBEE reporting, because race is special personal information under POPIA
- uploads of a **certified ID or passport copy**, their **driver's licence** and their **PrDP**
- vehicle type, registration and a **vehicle photo with the number plate readable**
- **bank details** for payouts
- a POPIA consent tick

Photos are shrunk on the phone and stored in Firestore, so you stay on the free plan. A PDF must be under 700 KB. ID numbers and documents are readable **only by the driver and owners**. Passengers only see the driver's name, photo, vehicle photo and registration.

On the owner dashboard, open **Drivers to approve → Review** to see everything, then click **Approve driver** or **Don't approve** with a reason, which the driver sees. If an approved driver changes their name, ID, documents, photos, vehicle or bank details, they go back to review automatically.

## Paying in the app (held until the trip is done)

Passengers can choose **Pay in the app**. The money goes to your company account, and you pay the driver once the trip is done:

1. The passenger pays by EFT with their trip reference (`TR-…`) and taps **I've paid**.
2. Under **Passenger payments → Payments to check**, you check your bank and click **Money received**. The passenger and driver now see the money as **held**.
3. The driver completes the trip. The passenger taps **Yes, pay the driver**, or **Report a problem**.
4. The trip moves to **Ready to pay the driver**, showing the driver's bank details. Pay them by EFT and click **I've paid the driver**.
5. Cancellations after paying, and reported problems, show under **Problems and refunds**.

Optional settings in `config.js`:

```js
window.SIYAHAMBA_PAYMENT_INFO = "FNB Business\nAccount: 62xxxxxxxxx\nBranch: 250655";  // defaults to SIYAHAMBA_TOPUP_INFO
window.SIYAHAMBA_CARD_PAY_URL = "https://payf.st/xxxxx";  // a PayFast or Yoco payment link, if you have one
```

Before taking passengers' money at scale, check with your bank or payment provider whether collecting money on behalf of drivers requires registration as a Third Party Payment Provider (PASA).

## Google Maps (place search, driving distance, route map)

With a Google Maps key, passengers can search any address, suburb or taxi rank. The app measures the real driving distance and shows the route on a map. The **Exact pick-up spot** field searches Google Maps too. When it's filled in, the distance and price are measured from that exact spot, not from the middle of the pick-up area. Drivers also get **Directions to pick-up** and **Trip route** buttons that open Google Maps on their phone.

The directions buttons work even without a key. Without a key, distances are estimated from the built-in list of about 200 places.

1. Open https://console.cloud.google.com and select your Firebase project (`siyahamba-group-taxi`).
2. **Billing:** Google Maps needs a billing account linked to the project, even though you'll stay inside the free monthly usage. Go to **Billing** and link or create one.
3. Go to **APIs & Services → Library** and enable these three APIs:
   - **Places API (New)**: place search
   - **Routes API**: driving distance and time
   - **Maps Embed API**: the route map. It's free with no usage limit.
4. Go to **APIs & Services → Credentials → Create credentials → API key**. Then edit the key:
   - Under **Application restrictions**, choose **Websites** and add `https://sbugzoh2.github.io/*`
   - Under **API restrictions**, choose **Restrict key** and tick only the three APIs above.
5. Paste the key into `config.js` as `window.SIYAHAMBA_GOOGLE_MAPS_KEY = "AIza...";`, then commit and push.

**Costs:** each Google product has a free monthly allowance, about 10,000 place searches and 10,000 route lookups, which is plenty for a small launch. To be safe, set a **budget alert** under **Billing → Budgets & alerts**.

## Mobile app

Siyahamba is an installable web app (a PWA). People open the site on their phone and install it. It gets its own icon on the home screen, opens full screen, and its screens load even with no signal.

- **Android (Chrome):** an **Install app** card appears at the top of the page. Tap it. Chrome's menu (⋮) also has **Install app**.
- **iPhone (Safari):** tap **Share**, then **Add to Home Screen**. The page shows this tip on iPhones.

Files: `manifest.webmanifest` (name, colours, icons), `sw.js` (offline support) and `icons/`.

### Google Play Store

1. Go to https://www.pwabuilder.com and enter `https://sbugzoh2.github.io/Siyahamba-Group-Taxi-Hire/`
2. Click **Package for stores → Android → Generate**. Download the zip. It contains:
   - an `.aab` file, which is what you upload to Google Play
   - a **signing key**. Keep it safe and backed up: without it you can never update the app.
   - an `assetlinks.json` file
3. **Remove the address bar.** Create a GitHub repository named exactly `Sbugzoh2.github.io`. Add an empty `.nojekyll` file and put `assetlinks.json` in a folder named `.well-known`. Without this step the app still works, but shows a browser address bar at the top.
4. In **Google Play Console** (https://play.google.com/console), create the app, upload the `.aab`, and complete the store listing, screenshots, content rating and **Data safety** form. Google Play also needs a **privacy policy** link, because the app collects names and phone numbers. A new developer account costs a once-off US$25.

### Apple App Store

This needs a Mac, an Apple Developer account (US$99 a year) and a native wrapper. Apple often rejects apps that are mainly a website. Until there's demand, iPhone users can use **Add to Home Screen**.

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
| Short trip call-out | R300 |
| Short trip per km | R18 (minimum R450) |
| Night trips (20:00–05:00) | +15% |
| Long trip per km driven | R9.50, charged for the drive there and back (minimum R2,000) |
| Driver waits and returns | + R1,500 per night |
| Cross-border trip | + R1,500 per vehicle |
| Luggage trailer | R300 short, R800 long |
| Vehicle size | Sprinter × 1.4, Midibus × 1.9, Bus × 2.6 |

Places and coordinates are in `PLACE_GROUPS`, and vehicle seats are in `VEHICLES`.

## Before real-world use

- Real payments: card payments are only a label for now. Connect a payment provider such as PayFast, Yoco or Peach Payments.
- SMS or WhatsApp alerts for new requests and status changes
- Driver vetting (PrDP, operating licence, roadworthy certificate) and passenger ratings
- A live map and GPS tracking
- Phone numbers are stored on each request so the accepted driver can call the group leader. Under the rules, any signed-in user can read requests, so review this against POPIA before launch.
