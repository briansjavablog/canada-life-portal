# Canada Life Europe — customer portal prototype

A mobile customer portal for a two-day internal hackathon. It shows how policy data can become a clear journey: understand what you hold, explore a retirement projection, and act on a relevant next step.

The management demo runs entirely on **mock data**. Internal APIs are not required.

## Prerequisites

- Node.js 20 or newer
- npm
- For a device: the Expo Go app on iPhone or Android
- For the laptop demo: a current desktop browser

## Installation

```bash
cd C:\dev\canada-life-portal
npm install
```

Optional environment file (defaults already match the demo):

```bash
copy .env.example .env
```

## Run Expo

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android. iOS simulation needs macOS.

## Run Expo Web

```bash
npx expo start --web
```

On a wide browser window the app stays in a phone-width column so it still reads as a mobile portal.

## Mock mode

Mock mode is the default and the path to use in the management demo.

```bash
EXPO_PUBLIC_DATA_SOURCE=mock
```

Leave `EXPO_PUBLIC_API_BASE_URL` empty. Nothing is fetched from a network for customer, policy, projection, notification, or guidance data.

You can also switch **Mock / API** at runtime from Demo Controls. Switch back to Mock if an API call fails — the demo does not depend on an internal service being up.

## Where mock data lives

| What | Where |
| --- | --- |
| Alex Morgan | `data/mockCustomer.ts` |
| Retirement Plan and Investment Bond, including history | `data/mockPolicies.ts` |
| Notification centre items | `data/mockNotifications.ts` |
| Cautious / Balanced / Growth assumptions | `data/scenarios.ts` |
| Projection maths | `utils/projectionMath.ts`, used by `services/projection/localProjectionService.ts` |
| Guidance copy | `services/recommendations/buildNextBestActions.ts` |

Screens do not hard-code portfolio or policy values. They read domain objects from the repositories.

The balanced growth rate is an illustrative assumption chosen so a €500 monthly contribution projects to **€612,000** at age 65. It is not a Canada Life pricing basis. Figures in the app are labelled illustrative.

## Demo notifications

1. Sign in (the form is prefilled; any password works, or use the biometrics button).
2. Open **Profile**.
3. Tap **Portal prototype · 1.0.0** five times.
4. On Demo Controls:
   - **Trigger retirement notification** — title “Canada Life”, body “Alex, see how a small increase in contributions could affect your retirement.” Tapping it opens the projection.
   - **Trigger cross-sell notification** — opens Protection.
   - **Reset demo** — restores Alex’s starting notifications, the balanced scenario, and the configured data source.
   - **Projection scenario** — Cautious, Balanced, or Growth.
   - **Data source** — Mock or API.

On a phone, Expo schedules a local notification (permission is requested from the button). On the web demo, the browser may show a system notification if permission is allowed. Either way, the message is also added to the in-app notification centre and a banner you can tap. Remote push is intentionally not implemented.

## Repository abstraction

UI code talks to repository interfaces in `services/repositories/types.ts`:

- `CustomerRepository`
- `PolicyRepository`
- `ProjectionRepository`
- `NotificationRepository`
- `NextBestActionRepository`

`services/repositories/createRepositories.ts` chooses the implementation:

- `DATA_SOURCE=mock` → `MockCustomerRepository`, `MockPolicyRepository`, `MockProjectionRepository`, and the other mock classes
- `DATA_SOURCE=api` → the API classes in `services/api/apiRepositories.ts`

`MockProjectionRepository` delegates the calculation to `LocalProjectionService`. Swap that service later without rewriting the slider screen.

Guidance is built in `buildNextBestActions`. The components only render `NextBestAction` objects, so a rules engine or model can replace that function later.

## Replacing mocks with an internal API

1. Set `EXPO_PUBLIC_DATA_SOURCE=api`.
2. Set `EXPO_PUBLIC_API_BASE_URL` to the real base URL. Do not commit secrets.
3. Replace the paths in `services/api/placeholders.ts`. Those paths are **not** Canada Life contracts.
4. Map responses onto the types in `models/`. The API repositories already check for an obvious shape mismatch, and `ApiClient` handles non-OK responses and timeouts (`EXPO_PUBLIC_API_TIMEOUT_MS`, default 8 seconds).
5. Keep mock mode working. Presenters can return to it from Demo Controls or by setting `EXPO_PUBLIC_DATA_SOURCE=mock`.

Loading and error states are on the customer screens. If API mode cannot reach a service, use **Continue with demo data** on Home.

## Branding

Colours and type live in `theme/brand.ts` and `theme/index.ts`. The mark in `components/BrandMark.tsx` is a hackathon stand-in. Replace those two places with approved corporate assets later.

## Project layout

```text
app/          screens and navigation (Expo Router)
components/   shared UI
context/      auth, demo state, loaded data
data/         deterministic mock data
hooks/
models/
services/     repositories, API client, projection, notifications
theme/
utils/
```
