# MIROR V10 implementation map

## Feature -> file -> route/mount

39. Not-found
- `src/app/not-found.tsx`
- mounts `MirorV10NotFound`

40. Loading / transition
- `src/app/loading.tsx`
- `src/app/system/loading/page.tsx`
- mounts `MirorV10Loading`

41. Accessibility
- route `/accessibility`
- `src/components/v10/MirorV10Accessibility.tsx`

42. Performance
- route `/system/performance`
- `MirorV10Performance`

43. Mobile
- route `/system/mobile`
- `MirorV10Mobile`

44. Legal / trust
- `/privacy`
- `/terms`
- `/disclaimer`
- mounts `MirorV10LegalTrust`

45. Admin
- `/admin`
- `MirorV10Admin`
- production authentication must be connected; V10 uses a deny-by-default auth seam

46. Project evidence
- `/admin/evidence`
- `MirorV10Evidence`
- evidence workflow blocks publication until source + permission + approval are present

47. Media rights
- `/admin/media`
- `MirorV10MediaRights`
- usage rights, ownership, expiry and CAD redaction are represented as first-class data

## Shared files
- `src/data/miror-v10-kernel.ts`
- `src/data/v10-route-map.ts`
- `src/data/v10-admin-auth.ts`
- `src/styles/miror-v10-production.css`
- `db/miror-v10-production.sql`
- `tools/python/audit_miror_v10.py`

## Integration pattern

Existing V9/V8 pages remain the public site content layer.

V10 is the system layer:

Public page -> visual sections -> approved project data -> media rights -> evidence -> release checks.

This keeps internal governance separate from public storytelling.
