# TikTok developer portal: Psyoc submission guide

Operator checklist for registering the Psyoc app and passing the Content
Posting API audit. Every string below is load-bearing: the reviewer compares
them literally across the portal, https://psyoc.com, and this app's UI.

## 1. Create a NEW app (do not reuse or resubmit the rejected one)

Portal: https://developers.tiktok.com/apps

| Field | Value |
| --- | --- |
| App name | `Psyoc` (exactly, no suffix) |
| App icon | `branding/psyoc-icon-1024.png` from this repo (same artwork as the site favicon and in-app logo; never upload a variant) |
| Category | Productivity (or closest to content tools) |
| Description | `Psyoc is a scheduling tool for TikTok creators. Creators queue videos and Psyoc publishes them to their own TikTok account at the scheduled time through the Content Posting API, as direct posts or inbox drafts. Public web product with free signup at https://psyoc.com.` |
| Website URL | `https://psyoc.com` |
| Terms of Service URL | `https://psyoc.com/terms-of-service/` |
| Privacy Policy URL | `https://psyoc.com/privacy-policy/` |
| Platform | Web |

## 2. Verify the domain

Choose Domain verification (DNS TXT) for `psyoc.com`, NOT URL prefix. A
verified domain covers `app.psyoc.com`, which is where the redirect URI
lives. The portal issues a `tiktok-developers-site-verification=...` value;
add it as a TXT record in `dns/dnsconfig.js` in the infra repo (there is a
commented placeholder in the psyoc.com zone) and push.

## 3. Products and scopes

Add products: **Login Kit** and **Content Posting API**.

| Scope | Justification (one line for the form) |
| --- | --- |
| `user.info.basic` | Show the connected creator's nickname and avatar in the composer, as the Content Sharing Guidelines require. |
| `video.publish` | Direct Post: publish the user's scheduled videos to their own account at the scheduled time. |
| `video.upload` | Inbox upload: send scheduled videos to the user's TikTok inbox as drafts when they prefer to publish manually. |

Redirect URI (Login Kit, Web): `https://app.psyoc.com/integrations/social/tiktok`

Expected usage estimate: fewer than 10 creators in year one. Say so; it is
truthful and small numbers are fine.

## 4. Wire the keys

Sandbox first: create a sandbox in the portal, put its client key/secret in
sops `postiz/env` (`TIKTOK_CLIENT_ID` / `TIKTOK_CLIENT_SECRET`), deploy, and
walk the full flow yourself. Swap in the production pair before recording
the demo video (production unaudited = posts forced SELF_ONLY, which the
audit expects to see).

## 5. Demo video shot list

One continuous screen recording, normal speed, no cuts inside a flow. Use a
real TikTok account and a real video file.

1. Open https://psyoc.com : homepage shows the Psyoc name, icon, browser-tab
   favicon, and footer links to Terms of Service and Privacy Policy. Click
   each legal link briefly so the reviewer sees they load and name Psyoc.
2. Click Sign up, create a fresh account at app.psyoc.com, land in the app.
3. Connect TikTok: full OAuth consent screen (shows the Psyoc name and the
   requested scopes), approve, return to the app with the account connected.
4. Open the composer with a real video: show the creator context rendered
   from creator_info (avatar + nickname), the privacy selector with NO
   preselection, and actively choose a privacy level.
5. Toggle interaction settings (comment/duet/stitch); show any greyed-out
   option if the creator account disables one.
6. Open the commercial content disclosure: master toggle off by default,
   switch it on, show Your brand / Branded content checkboxes and the
   compliance declaration text changing (Music Usage Confirmation vs Branded
   Content Policy), then switch it back off for this post.
7. Show the AI-generated content label toggle.
8. Schedule (or post now) as Direct Post. Show the success state, then open
   TikTok and show the video actually posted (SELF_ONLY visibility before
   audit approval is expected; show it anyway).
9. Repeat briefly with inbox mode (`video.upload`): schedule a draft, show
   the "check your TikTok inbox" notification inside the TikTok app.

## 6. After approval

Nothing changes in code. Privacy options for direct post simply stop being
restricted to SELF_ONLY. Then:

1. Flip the account approval gate ON (`REQUIRE_ACCOUNT_APPROVAL=true` in
   sops `postiz/env`, redeploy) so new signups wait for operator approval.
2. Reconnect any accounts that were connected against the sandbox keys.
