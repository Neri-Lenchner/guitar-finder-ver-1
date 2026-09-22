# Cloudinary

How GuitarFinder stores user-uploaded profile images. See
[ARCHITECTURE.md](./ARCHITECTURE.md#24-file-uploads-transitional-state) for how this
fits into the wider backend.

---

## 1. What it's used for

Cloudinary is the storage backend for **profile avatars only** — nothing else in the
app uploads files. Two routes accept an image:

| Route | When |
|---|---|
| `POST /api/auth/register` | Optional avatar at signup |
| `PUT /api/users/:id` | Replacing an existing avatar |

---

## 2. How the upload pipeline works

Three files, each with one job:

- **`backend/src/utils/cloudinary.config.ts`** — configures the Cloudinary SDK (`v2`)
  once at module load, from `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`. Exports the configured `cloudinary` client for reuse.
- **`backend/src/utils/multer.config.ts`** — wires `multer` (Express's multipart/
  form-data middleware) to `multer-storage-cloudinary`, an npm package that plugs into
  `multer` as a *storage engine* so uploaded files stream straight to Cloudinary instead
  of local disk. Configured with:
  - `folder: "guitar-finder"` — every avatar lands under this Cloudinary folder.
  - `allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"]`.
  - `transformation: [{ width: 400, height: 400, crop: "limit" }]` — Cloudinary itself
    downsizes oversized images on upload; the app never resizes anything locally.
  - A `fileFilter` rejecting anything whose mimetype doesn't start with `image/`.
  - A hard `5 MB` file size limit (`limits: { fileSize: 5 * 1024 * 1024 }`).
- **`auth.controller.ts`** / **`user.controller.ts`** — mount `upload.single("profileImage")`
  on their respective routes, then read `request.file.path` (the Cloudinary-hosted URL
  multer-storage-cloudinary returns) and save it as `UserModel.profileImage`.

Nothing else in the codebase touches Cloudinary directly — controllers only ever see
`request.file.path`, a URL string.

---

## 3. Replacing an avatar (delete-then-upload)

`user.controller.ts`'s `updateProfile` handler does this when a new file is attached to
a user who already had a `profileImage`:

1. Take the existing `profileImage` URL, split on `/`, take the last path segment, and
   strip the file extension to recover the asset's filename.
2. Rebuild the Cloudinary `public_id` as `guitar-finder/<filename>` (the same folder the
   upload config writes to).
3. Call `cloudinary.uploader.destroy(publicId)` — errors are swallowed
   (`.catch(() => {})`), so a failed delete never blocks the new upload from saving.
4. Save the new file's URL over the old one.

**Fragility to be aware of:** step 1–2 reconstruct the `public_id` by string-parsing the
stored URL rather than storing the `public_id` itself. This only works because every
upload always goes through the same `multer.config.ts` pipeline into the same
`guitar-finder` folder. If an avatar URL ever gets set another way (manually in the DB,
a future migration, a differently-configured upload path), the parsed `public_id` won't
match anything in Cloudinary and the delete silently no-ops — not dangerous, but it'll
leave orphaned assets in the Cloudinary account over time.

---

## 4. The legacy local-disk path

Before this Cloudinary pipeline existed, avatars were saved to local disk. That path is
gone for new uploads, but two things are kept around purely for backwards compatibility
with `profileImage` URLs issued before the migration:

- `app.ts` still mounts `express.static("uploads")`, so old `/uploads/...` URLs keep
  resolving.
- `backend/uploads/` is still created at startup (`mkdirSync("uploads", { recursive:
  true })`) and mounted as a volume in `docker-compose.yml` (`uploads-data`).

This directory is **not** used by the current upload pipeline and isn't persisted across
Railway deploys (ephemeral container filesystem) — only Docker Compose's named volume
keeps it around. If every pre-migration user has since re-uploaded an avatar, this whole
path is dead weight and could be removed.

---

## 5. Environment variables

| Variable | Required | Where set |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | Yes | Backend env (Railway dashboard for prod, `.env` locally) |
| `CLOUDINARY_API_KEY` | Yes | Same |
| `CLOUDINARY_API_SECRET` | Yes | Same |

`app-config.ts` reads these with the TypeScript non-null assertion (`process.env.X!`),
same as `JWT_SECRET_KEY` and `OPENAI_API_KEY` — that's a compile-time assertion only,
not a runtime check. If one is missing, nothing crashes at startup; `cloudinary.config()`
just gets `undefined` for that field, and the first real upload attempt fails with a
Cloudinary auth error instead of a clear "missing env var" error at boot. Worth knowing
if an avatar upload ever fails mysteriously in a fresh environment — check these three
vars are actually set before debugging further.
