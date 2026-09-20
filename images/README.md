# InkBlood Studio — Image Upload Guide

This site is wired to show a real photo the moment you drop a correctly-named
file into the matching folder below. Until a file exists, that spot shows a
themed icon (or, for a person's photo, their initials in a colored circle)
instead — nothing breaks, nothing looks empty.

**Format:** every file must be a **`.png`**.

**Every real person on the team gets exactly one photo file, named after
them — and that one file is reused everywhere they appear on the site.**
For example, Marisol Reyes shows up on the Artists page, in the "Meet the
Team" preview on the home page, in the Home 2 spotlight carousel, and as the
byline photo on three blog articles she wrote — upload
`images/artists/marisol-reyes.png` **once** and it appears correctly in all
five places automatically. You never have to save the same headshot under
multiple different file names again.

Testimonial clients (people who left a review, not staff) still get their
own individually-named file each, since they only ever appear once.

Recommended size: roughly 1000×1000px (square) for artist/portrait shots,
1600×1000px (landscape) for hero/banner/gallery shots. Keep files under ~2MB
each for fast page loads.

Each row below also has a short **search term** (1–3 words) — paste it into
Google Images, Unsplash, Pexels or your own photo library to find a matching
shot for that slot.

Total: **54 image slots** across 7 folders. Drop files in, refresh the page
— that's it.

**Profile / avatar photos work the same way, with one difference:** instead
of falling back to an icon, an empty avatar slot falls back to the person's
initials in a colored circle (like "JR" or "GC") — so nothing ever looks
broken there either, it just shows initials until you add a real photo.
Recommended size for every avatar slot: roughly 300×300px (square).

**Blog article covers are the other place a file is reused on purpose:**
each article page (`blog-post.html#post-N`) shows the exact same cover photo
as its thumbnail on the Blog listing page — so `post-1.png`, for example, is
both the grid thumbnail **and** that article's own cover image. Same story,
same photo, one upload.

---

## `images/artists/` — every staff member's photo, reused site-wide — 12 files

Upload each person **once** here. The same file automatically shows up on
the Artists page, the home page's "Meet the Team" preview (first 4 artists
only), the Home 2 "One Artist, Up Close" spotlight carousel (same first 4),
and as the author photo on any blog post they wrote.

| File | Artist | Also appears as | Search term |
|---|---|---|---|
| `marisol-reyes.png` | Marisol Reyes — Realism & Portraiture | Artists page · Home team preview · Home 2 spotlight (default) — **not** currently used for her 3 blog byline avatars, see note below | realism tattoo artist |
| `dae-ho-kim.png` | Dae-Ho Kim — Blackwork & Ornamental | Home team preview · Home 2 spotlight · Home 2 pull-quote avatar · 1 blog author photo | blackwork tattoo artist |
| `wren-halloway.png` | Wren Halloway — American Traditional | Home team preview · Home 2 spotlight · 1 blog author photo | traditional tattoo artist |
| `priya-nandan.png` | Priya Nandan — Fine Line & Botanical | Home team preview · Home 2 spotlight · 2 blog author photos of her own **+ 3 borrowed for Marisol's blog byline**, see note below | fine line tattoo artist |
| `theo-marchetti.png` | Theo Marchetti — Neo-Traditional | — | neo traditional tattoo artist |
| `sasha-okafor.png` | Sasha Okafor — Piercing Specialist | 1 blog author photo | piercing artist portrait |
| `owen-bricks.png` | Owen Bricks — Black & Grey Realism | — | tattoo artist portrait |
| `isla-fontaine.png` | Isla Fontaine — Fine Line & Script | — | fine line tattoo artist |
| `kofi-adeyemi.png` | Kofi Adeyemi — Blackwork & Geometric | — | blackwork tattoo artist |
| `ruben-castillo.png` | Ruben Castillo — Bold Traditional | — | traditional tattoo artist |
| `noor-haddad.png` | Noor Haddad — Piercing & Jewelry | — | piercing artist portrait |
| `freya-lindqvist.png` | Freya Lindqvist — Color Neo-Traditional | — | color tattoo artist |

**Why Marisol's blog byline currently borrows Priya's photo:** the uploaded
`marisol-reyes.png` is an action shot of her mid-tattoo (hands, gloves, an
iPad reference sketch) with no one's face actually in frame — it works fine
as a large photo (Artists page, home previews, spotlight), but cropped down
to a small circular avatar it just shows an unreadable close-up. Until a
proper headshot of Marisol is uploaded, her 3 blog articles ("How Long Does
A Tattoo Really Take To Heal?", "The 5 Aftercare Mistakes", "Sun, Sweat &
Swimming") show Priya Nandan's photo for the byline avatar only — the
byline text still correctly says "Marisol Reyes". Upload a real headshot to
`images/artists/marisol-reyes.png` and swap those 3 `aimg`/`avatar` fields
in `partials/content-blog.html` and `partials/content-blog-post.html` back
to `images/artists/marisol-reyes.png` to give her back her own photo.

## `images/home/` — Home page (index.html) — 9 files

| File | Where it appears | Search term |
|---|---|---|
| `hero.png` | Hero background, top of home page | tattoo studio interior |
| `gallery-1.png` | Portfolio gallery, tile 1 | black grey tattoo |
| `gallery-2.png` | Portfolio gallery, tile 2 | color tattoo sleeve |
| `gallery-3.png` | Portfolio gallery, tile 3 | geometric tattoo |
| `gallery-4.png` | Portfolio gallery, tile 4 | script tattoo |
| `gallery-5.png` | Portfolio gallery, tile 5 | portrait tattoo |
| `gallery-6.png` | Portfolio gallery, tile 6 | floral tattoo |
| `gallery-7.png` | Portfolio gallery, tile 7 | animal tattoo |
| `gallery-8.png` | Portfolio gallery, tile 8 | linework tattoo |

The "Meet the Team" section on this page shows the first 4 artists from
`images/artists/` (Marisol, Dae-Ho, Wren, Priya) — nothing to upload here
for them, see the `images/artists/` section above.

**Testimonial avatars reuse existing photos** rather than needing separate
client headshots (these are demo reviews from fictional clients, so there's
no real client photo to upload anyway). Three of the four currently reuse
the `images/home2/spotlight-N.png` files (clearer, front-facing portraits)
instead of the `images/artists/` action shots, since those crop better into
a small circle:

| Testimonial | Shows the photo from | Note |
|---|---|---|
| Jordan R. | `images/home2/spotlight-1.png` | |
| Ama T. | `images/home2/spotlight-2.png` | |
| Lena K. | `images/home2/spotlight-4.png` | |
| Diego P. | `images/artists/wren-halloway.png` | Still reuses Wren's artist photo — named directly in the quote |

**Heads up on two things with the `spotlight-*.png` files specifically:**
1. `spotlight-4.png` has a visible "Dreamstime" stock-photo watermark
   across it — that usually means it's an unpurchased/unlicensed preview
   image. Worth swapping for a licensed or original photo before this goes
   live publicly, both for copyright reasons and because the watermark will
   show on-screen.
2. Since these are the same files the Home 2 spotlight carousel uses
   (tagged there as Marisol Reyes, Dae-Ho Kim and Priya Nandan
   respectively), the same photo now visually represents a different
   "identity" in two places on the site — the person in `spotlight-2.png`,
   for example, appears both as "Dae-Ho Kim" on Home 2 and as "Ama T." in a
   testimonial. Not a functional problem, just something to be aware of if
   site-wide consistency matters to you.

Nothing extra to upload for testimonials as things stand — they're already
covered by files you've uploaded elsewhere.

## `images/home2/` — Home 2 / Editorial (home2.html) — 14 files

| File | Where it appears | Search term |
|---|---|---|
| `collage-1.png` | Split hero collage — big tile (Marisol Reyes) | tattoo artist working |
| `collage-2.png` | Split hero collage — small tile (Dae-Ho Kim) | tattoo artist tattooing |
| `collage-3.png` | Split hero collage — small tile (Wren Halloway) | traditional tattoo artist |
| `gallery-1.png` | Horizontal scroll gallery — Dagger & Banner | dagger banner tattoo |
| `gallery-2.png` | Horizontal scroll gallery — All-Seeing Eye | eye tattoo blackwork |
| `gallery-3.png` | Horizontal scroll gallery — Storm Bolt | lightning bolt tattoo |
| `gallery-4.png` | Horizontal scroll gallery — Ship's Anchor | anchor tattoo |
| `gallery-5.png` | Horizontal scroll gallery — Lotus Bloom | lotus tattoo |
| `gallery-6.png` | Horizontal scroll gallery — Memento Mori | skull tattoo realism |
| `gallery-7.png` | Horizontal scroll gallery — Tidal | wave tattoo |
| `about.png` | About / pull-quote section visual | tattoo studio interior |
| `blog-1.png` | Blog teaser card 1 — Aftercare | tattoo aftercare healing |
| `blog-2.png` | Blog teaser card 2 — Style Guide | tattoo style comparison |
| `blog-3.png` | Blog teaser card 3 — Studio News | tattoo studio team |

The artist spotlight carousel and the pull-quote avatar on this page both
reuse photos from `images/artists/` (Marisol, Dae-Ho, Wren, Priya) — nothing
extra to upload here for them.

## `images/services/` — Services page (services.html) — 14 files

Tattoo Services grid (6 files):

| File | Service | Search term |
|---|---|---|
| `fine-line.png` | Fine Line | fine line tattoo |
| `blackwork.png` | Blackwork & Ornamental | blackwork tattoo |
| `traditional.png` | Traditional & Neo-Traditional | traditional tattoo |
| `realism.png` | Realism & Portraiture | realistic tattoo |
| `large-scale.png` | Large Scale / Sleeve | sleeve tattoo |
| `cover-up.png` | Cover-Ups & Reworks | tattoo cover up |

Piercing Services grid (8 files, added so the piercing cards show a photo instead of plain text — same `.service-card` image-slot pattern as the tattoo cards above, drop a same-named `.png` into this folder and it appears automatically, falling back to an icon until then):

| File | Service | Search term |
|---|---|---|
| `piercing-ear.png` | Ear (Lobe / Helix / Tragus) | ear piercing lobe helix |
| `piercing-nose-septum.png` | Nose & Septum | nose septum piercing |
| `piercing-facial.png` | Facial (Eyebrow / Lip) | eyebrow lip piercing |
| `piercing-oral.png` | Oral (Tongue) | tongue piercing |
| `piercing-navel.png` | Navel | navel belly button piercing |
| `piercing-nipple.png` | Nipple | nipple piercing jewelry |
| `piercing-dermal.png` | Surface / Dermal | dermal surface piercing |
| `piercing-jewelry-upgrade.png` | Jewelry Upgrade | titanium piercing jewelry |

## `images/login/` — Client Login page (login.html) — 1 file

| File | Where it appears | Search term |
|---|---|---|
| `banner.png` | Left-side auth visual banner | tattoo studio dark |

## `images/blog/` — Blog listing (blog.html) *and* each article's own page (blog-post.html) — 11 files

| File | Where it appears | Search term |
|---|---|---|
| `featured.png` | Featured post thumbnail + article cover — "How Long Does A Tattoo Really Take To Heal?" | tattoo healing skin |
| `post-1.png` | Grid thumbnail + article cover — "Blackwork vs. Fine Line" | tattoo style comparison |
| `post-2.png` | Grid thumbnail + article cover — "Meet Our Two Newest Resident Artists" **and** reused as the author avatar for both "Studio Team"-bylined posts (post-2, post-7) | tattoo artists team |
| `post-3.png` | Grid thumbnail + article cover — "Titanium vs. Surgical Steel" | piercing jewelry titanium |
| `post-4.png` | Grid thumbnail + article cover — "From Cover-Up To Confidence" | tattoo sleeve coverup |
| `post-5.png` | Grid thumbnail + article cover — "The 5 Aftercare Mistakes" | tattoo aftercare mistake |
| `post-6.png` | Grid thumbnail + article cover — "A Beginner's Guide To Choosing Tattoo Placement" | tattoo placement body |
| `post-7.png` | Grid thumbnail + article cover — "InkBlood Is Now Open Seven Days A Week" | tattoo studio open |
| `post-8.png` | Grid thumbnail + article cover — "Why Ama Chose Fine Line" | fine line tattoo |
| `post-9.png` | Grid thumbnail + article cover — "Sun, Sweat & Swimming" | tattoo sunscreen summer |
Every other article's byline photo comes from `images/artists/` automatically
(Marisol, Dae-Ho, Sasha, Wren or Priya, depending who wrote it) — nothing
extra to upload here for those.

The "Studio Team" byline (not an individual — used on post-2 and post-7) reuses
the real team group photo already uploaded as `post-2.png` above, rather than a
separate never-uploaded placeholder file — no extra upload needed for it either.

---

## `images/dashboard/` — Client Dashboard (dashboard.html) — 1 file

| File | Where it appears | Search term |
|---|---|---|
| `user.png` | Logged-in client avatar, top of the sidebar | person portrait headshot |

Until a real client photo is dropped in as `user.png`, the sidebar avatar
reuses `images/artists/priya-nandan.png` (Artist 4 — Priya Nandan) instead
of showing plain "GC" initials. Drop `user.png` in any time and it takes
over automatically — no code change needed.

The "Recent Design References" tiles on this page reuse 3 of the home page's
own gallery photos — each tile shows a genuinely different picture, picked to
match its filename label — so nothing extra to upload here for those either:

| Tile label | Reuses | Why |
|---|---|---|
| `forearm-placement.jpg` | `images/home/gallery-4.png` | script lettering, clean forearm shot |
| `linework-ref.png` | `images/home/gallery-3.png` | fine-detail geometric linework sleeve |
| `botanical-sketch.jpg` | `images/home/gallery-6.png` | colorful floral bouquet piece |

---

### Notes

- Pricing and Aftercare pages use icons only (no photo slots) — nothing to
  upload there.
- If a file is missing or fails to load, that slot silently falls back to
  its icon/gradient (or initials, for a person) look — the page never shows
  a broken image.
- File names are case-sensitive on some systems — match them exactly as
  listed, all lowercase.
- Search terms are starting points, not exact matches — swap in your own
  studio's real photos whenever you have them; that will always look better
  and more authentic than stock images.
