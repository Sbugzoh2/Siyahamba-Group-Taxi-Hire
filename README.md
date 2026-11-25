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

## Languages and welcome screen

- **Languages:** a language picker in the header offers **English, isiZulu, isiXhosa, Sesotho, Setswana and Afrikaans**. It translates the screen labels, buttons, booking options, trip statuses and the welcome screen, including new trip cards as they appear, and the app remembers the choice. Longer messages that include names or amounts stay in English.
- **The translations are in `translations.js`.** Each English phrase is listed with its translation in each language. **Please have native speakers check them before launch.** You can fix any wording there directly, and add more phrases the same way.
- **Welcome screen:** shown once, on someone's first visit, except on share links and the owner page. It has three short slides (whole-taxi group hire, checked drivers and live tracking, safe payment and ratings), a language picker, and then **"How will you use Siyahamba?"** with **I need a taxi** or **I'm a driver**.
- On narrow phones, the trip progress line shows only the current step's name, so longer words never overlap.

## Price offers, owner charts and referrals

- **Price offers:** on any open trip that hasn't been paid in the app, an approved driver can tap **Offer a different price**. The offer can be between half and three times the quote, with an optional note such as "toll roads". The group sees all offers, cheapest first, with each driver's rating, vehicle and plate, and taps **Accept**. The trip's price changes to that offer, other drivers can no longer take it, and the chosen driver confirms with **Accept job**, paying 10% of the *agreed* price. The group can choose a different offer until the driver confirms. The original price is kept on the trip.
- **Business charts (owner dashboard):** Siyahamba fees per week for the last 12 weeks (hover for values, or show as a table), trips by pick-up area, and top drivers with trips, fees and rating.
- **Referral codes:** every approved driver sees **Invite drivers** with their `SH-` code and an **Invite on WhatsApp** button. New drivers can enter a friend's code when registering. Once the invited driver is approved and completes their first trip, the owner dashboard shows it under **Referral rewards**. Click **Give R50 credit**, and the reward appears in the inviting driver's credit and top-up history. Change the amount in `config.js`:

```js
window.SIYAHAMBA_REFERRAL_REWARD = 50;
```

## Driver tools, receipts and repeat bookings

- **Availability:** drivers switch **I'm available for jobs** on or off. While online, they hear a two-tone sound, feel a vibration and see a pop-up when a new job appears, if their phone allows it and the app is open. The job board shows **"Pick-up about 11 km from you"**, sorts jobs nearest first, and has a **Near me** filter for jobs within 40 km. Sound can be turned off.
- **My earnings:** this week, this month or all time, showing what the driver earned after Siyahamba's fee, trips completed, fees, and in-app payments paid out or still waiting. There's an 8-week bar chart (hover or tap a bar for details), with a table view.
- **Receipts:** passengers tap **Receipt** and drivers tap **Trip statement** on a completed trip. Either can be printed or saved as PDF. Put your business details on them in `config.js`:

```js
window.SIYAHAMBA_BUSINESS = { name: "Malita (Pty) Ltd", reg: "2020/123456/07", address: "…", email: "…", phone: "…" };
```

  Ask your accountant whether anything else is needed on receipts for your business, for example VAT details.
- **Book again / Book return trip:** on any past trip. This fills the booking form with the same details, or with pick-up and destination swapped, so the passenger only chooses a new date and time.
- **Loading placeholders:** grey placeholder cards while trips load, instead of empty boxes.

## Live tracking, sharing, SOS and WhatsApp

- **Trip progress:** every trip shows a progress line: Booked → Driver assigned → On the way → Picked up → Arrived.
- **Live map:** when the driver taps **I'm on my way**, their phone shares its location every 15 seconds, or every 100 m, until the trip is complete. The passenger sees the taxi moving on a map. The driver must allow location access and **keep Siyahamba open during the trip**, because phones pause web apps in the background. The maps are free [OpenStreetMap](https://www.openstreetmap.org) maps via Leaflet, so no Google key is needed. If you grow to thousands of trips a day, switch to a paid map tile provider.
- **Share my trip:** the passenger taps **Share my trip** and sends a private link, by WhatsApp or any app. Family can follow the taxi live **without an account**. They see the driver's name, photo, rating, vehicle and plate, but **not phone numbers**. The link stops showing the location when the trip ends.
- **SOS:** a red **SOS** button for passengers and drivers during a trip. It shows **10111** (police), **112** and **10177** (ambulance) to call, alerts the owner with the trip and location, and sends a WhatsApp message to the person's emergency contact with their location and the live trip link. Owners see alerts in a red **Emergency alerts** panel at the top of the dashboard.
- **Call and WhatsApp buttons:** passengers can call or WhatsApp their driver, and drivers their group leader, with a ready-written message. SA numbers like 082… become +27 82… automatically.

Only the passenger, the driver, owners and people with the share link can see where the taxi is, and the database rules enforce it.

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

## Payments: the passenger wallet

**Every trip is paid in the app, before any driver sees it.** There is no cash or EFT to the driver.

1. **Top up:** passengers pay into your account by EFT using their wallet reference (`SP-…`), then tap **I've sent this amount**. It appears on your dashboard immediately, under **Wallet top-ups to confirm**, with their name, phone and email. When the money is in your bank, click **Money received**, and their wallet updates on their phone straight away. To take card payments, add a PayFast or Yoco payment link as `SIYAHAMBA_CARD_PAY_URL` in `config.js`. Card payments that confirm themselves automatically need a payment provider plus server code (Firebase's paid plan).
2. **Book:** the **final amount** comes off the wallet in the same database write that creates the trip. The database rules refuse a booking that isn't fully paid. Drivers only ever see paid trips, marked "Paid: R… is held by Siyahamba".
3. **Price offers:** if the passenger accepts a higher offer, the difference comes off the wallet. If they accept a lower one, the difference goes back.
4. **Cancelling:** before a driver accepts, the full amount goes back to the wallet automatically. After a driver accepts, the trip appears under **Problems and refunds**, where you click **Refund to their wallet** or pay the driver.
5. **After the trip:** the driver marks it complete and the passenger taps **Yes, pay the driver**. The trip then shows under **Ready to pay the driver**, with the driver's bank details. Pay them and click **I've paid the driver**. If an issue is open, the payout waits until you resolve it.

`config.js`:

```js
window.SIYAHAMBA_PAYMENT_INFO = "Capitec Business\nAccount: …\nBranch: …";  // shown for wallet top-ups; defaults to SIYAHAMBA_TOPUP_INFO
window.SIYAHAMBA_CARD_PAY_URL = "https://…";                               // optional PayFast or Yoco link
```

Before taking passengers' money at scale, check with your bank or payment provider whether holding money on behalf of drivers requires registration as a Third Party Payment Provider (PASA).

## Addresses and the final amount

- Passengers must give the **pick-up street address** and the **destination street address**, as well as the area. The distance, and so the price, is measured **between the two addresses**. Exact street-level distances need the Google Maps key (see *Google Maps*). Without it, the app measures to the suburb named in each address, and drivers still see the exact addresses.
- The passenger sees one **Final amount for the group**. It includes the driver, fuel, the drive back on long trips, a **toll allowance** (R0.55 per km driven on long trips), any luggage trailer, and Siyahamba's fee, with "Nothing more to pay".
- **Return trips:** the driver waits for the group, but **the driver pays for their own accommodation**. It isn't charged to passengers.

## Emails, issues and owner totals

- **Email:** passengers give an email for receipts when booking, and drivers give one when registering. Emails are kept in each person's private profile, not on trips.
- **Receipts by email:** when the driver marks a trip complete, the passenger's receipt and the driver's statement are queued in the `mail` collection. To actually send them, install Firebase's free **Trigger Email from Firestore** extension. It needs the paid (Blaze) plan, plus an email service such as SendGrid or Gmail. In its settings, set **Email documents collection** to `mail`, **Users collection** to `profiles`, and **email field** to `email`. Until then, emails wait in the `mail` collection.
- **Issues:** a passenger or driver taps **Report a problem** on a trip and describes it. It appears on your dashboard under **Issues**, with the conversation. Reply to the passenger, the driver or both; they see your reply on the trip and get it by email. You can **add a credit to the passenger's wallet** there, then **Mark resolved**. Payouts wait while an issue is open.
- **Owner totals:** trips completed, paid out to drivers, owed to drivers (trips done but not yet paid out), money held for booked trips, and the total in passenger wallets.

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
| Toll allowance (long trips) | R0.55 per km driven |
| Driver waits and returns | no extra charge; the driver pays their own accommodation |
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
