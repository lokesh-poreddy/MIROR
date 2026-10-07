# UX acceptance checklist

## Navigation
- [ ] Menu opens from keyboard and pointer
- [ ] Escape closes full-screen menu
- [ ] Body scroll is locked while menu is open
- [ ] Focus management is added before production (focus trap + restore)
- [ ] All menu routes have visible current state

## Motion
- [ ] `prefers-reduced-motion` disables non-essential animation
- [ ] No animation blocks reading or form completion
- [ ] Large images are lazy-loaded outside the hero
- [ ] No autoplay audio
- [ ] Optional WebGL is lazy-loaded and not required for content

## Projects
- [ ] Every public project has an explicit Miror role
- [ ] Client/project name has publication permission
- [ ] Public/verified project facts have a source
- [ ] Gallery images have appropriate alt text
- [ ] Project routes work when linked directly

## Performance
- [ ] Test mobile 4G / low-power hardware
- [ ] Audit with Lighthouse / WebPageTest
- [ ] Confirm image dimensions and responsive `sizes`
- [ ] Confirm no main-thread work from continuous pointer effects
