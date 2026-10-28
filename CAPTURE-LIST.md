# Self-capture shot list (v11, owner action needed)

Owner decision D2 (30 Sep 2026): media comes from vendor assets **and** our own captures. Vendor assets carry v11. This list is what the pass needs from our own free accounts. It needs the owner to create (or share) one free account per product. Nothing here is faked: every capture is the real product with fictional studio data.

## Accounts

| Product | Plan | Needed for |
| --- | --- | --- |
| Fillout | Free | Builder, logic, Airtable link, login page (Starter trial if login pages are gated) |
| Softr | Free | Portal client view, user groups, permissions |
| Noloco | Free + 14-day Build trial | Team views, roles and permissions, client portal |

Seed data (same in all three, fictional): studio "Northwind Studio", 3 clients (Alder & Co, Birchline, Cedar Works), 6 projects, 10 tasks, 4 invoices. One Airtable base shared by Fillout, Softr and Noloco, so every capture shows the same records.

## Shots

Each at 1440 × 900 and 390 × 844 (device frame off), light theme; dark theme where the product has one (Noloco app, Softr builder). PNG, no browser chrome, no personal data, no cursor unless the shot is about a click.

| # | Product | Screen | Where it goes |
| --- | --- | --- | --- |
| F1 | Fillout | Form builder with the intake form open, logic panel visible | Home intake scene, Fillout hub gallery |
| F2 | Fillout | Published intake form, filled halfway (conditional question showing) | Fillout hub hero, guide covers |
| F3 | Fillout | Integrations: Airtable "create record" mapping | FitDiagram focal crop (Fillout), `/start/` bar |
| F4 | Fillout | Login page settings (Starter) | Access-boundary column |
| S1 | Softr | Client portal home as client "Alder & Co" (their projects only) | Home portal scene, Softr hub hero |
| S2 | Softr | Same page as client "Birchline" (different records) | Softr permissions story, compare covers |
| S3 | Softr | User groups + visibility rules panel | Access-boundary column, Softr hub |
| S4 | Softr | Builder with the list block's data source | FitDiagram focal crop (Softr) |
| N1 | Noloco | Team view: projects board with tasks | Home team scene, Noloco hub hero |
| N2 | Noloco | Client portal as a client user | Compare covers, Noloco hub gallery |
| N3 | Noloco | Roles and permissions table (read/create/update per role) | Access-boundary column, Noloco hub |
| N4 | Noloco | Data source settings (Airtable sync) | FitDiagram focal crop (Noloco) |

## Recordings (muted loops, 8 to 15 s, 1440 × 900, 30 fps)

| # | Flow | Where it goes |
| --- | --- | --- |
| R1 | Fillout: submit the intake form, the Airtable record appears | Home intake scene (loop) |
| R2 | Softr: log in as a client, open a project | Home portal scene (loop) |
| R3 | Noloco: move a task on the board, the client portal updates | Home team scene (loop) |

Deliver as MP4 (H.264) or WebM (VP9); we add them to `public/media/` with a manifest entry marked "own capture" and a poster frame.
