# Running this fork against your own HumanLayer backend

This fork's mobile UI can talk to your real HumanLayer backend, signed in as you, without any
server-side change on HumanLayer's part — **if** the sign-in service accepts a refresh from your
fork's origin (see the caveat at the end). This is your own account and your own credential, on a
device you control.

Two things are involved: point the build at production, and seed your sign-in once.

## 1. Point the build at production

The backend accepts requests from any origin (the API and the sync proxy both use open CORS), so the
only thing that makes the fork "production" is a handful of build-time public values. They are not
secrets — they ship in the real app's bundle.

Set these in the repo-root `.env` (that is where `bun --bun` loads env from):

```
VITE_PUBLIC_WORKOS_CLIENT_ID=client_...        # the WorkOS client id (see below)
VITE_PUBLIC_RIPTIDE_API_ORIGIN=https://...     # the API origin
VITE_PUBLIC_SYNC_ORIGIN=https://...            # the Electric sync proxy origin
# optional, for deep links / artifact URLs:
VITE_PUBLIC_APP_ORIGIN=https://...
VITE_PUBLIC_CLOUD_ORIGIN=https://...
```

How to read the real values from the production app (on a computer, signed in):

- **Client id** — run the console snippet in step 2 below; it prints `clientId`.
- **API / sync origins** — open the Network tab and look at where requests go: the API origin is the
  host serving `/rpc/api/v1/...`; the sync origin is the host serving the Electric/`/v1/shape`
  traffic.

Then build:

```
cd apps/riptide-ui && bun --bun run build
```

Auth already runs in dev mode (`integrations/workos/AuthProvider.tsx`), which is what makes the next
step possible — in dev mode the SDK keeps the session's refresh token in `localStorage` instead of a
host-locked cookie.

## 2. Seed your sign-in

Only the **refresh token** is needed; the app exchanges it for a fresh access token on every load, so
the session sustains itself rather than expiring in an hour.

1. Sign in to the real HumanLayer web app on a computer.
2. Open the console and run:

   ```js
   (() => {
     const k = Object.keys(localStorage).find(k => k.startsWith('workos:refresh-token:'));
     return k ? { clientId: k.split(':').pop(), refreshToken: localStorage.getItem(k) } : 'not found';
   })()
   ```

3. Get the `clientId` and `refreshToken` to your phone (message them to yourself, a notes app, etc.).
4. On your phone, open your fork at **`/dev-session.html`**, paste both, and tap **Seed and open app**.

That writes `workos:refresh-token:<clientId>` for your fork's origin — the exact key the SDK reads on
load — and opens the app, which refreshes into a signed-in session.

Treat the refresh token like a password: only on your own devices, only over HTTPS. `dev-session.html`
can also clear the stored session. **Do not ship `dev-session.html` in a real/public deployment, and
do not merge it upstream.**

## Caveat (the one unknown)

The refresh request posts the refresh token to WorkOS's token endpoint directly. Whether WorkOS
rejects that call based on the origin / allowed-redirect list is enforced on WorkOS's side and can't
be verified from this repo. Dev-mode public clients are generally permissive about this, but if after
seeding the app still shows you signed out (the refresh was rejected), the fallback is to ask
HumanLayer to add your fork's web address to their WorkOS allowed origins — a small change for them.
