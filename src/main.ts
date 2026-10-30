import './style.css'
import { pageContent, experienceContent, featureContent } from './content'
import type { Feature, FeatureEntry } from './content/types'

const iconPaths: Record<string, string> = {
  run:'<path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 22l3-7 3 2 2 5m-5-7 2-5 4 2 3 1m-8 2-4 4m8-8 2-4 4 1"/>',
  pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  coffee:'<path d="M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm13 2h2a2 2 0 1 1 0 4h-2M8 3v2m5-2v2"/>',
  spark:'<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Zm7 11 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8-1.8-.7 1.8-.7L5 2Z"/>',
  heart:'<path d="M20.8 8.7c0 4.3-8.8 10.3-8.8 10.3S3.2 13 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.1 7.1-1.4-1.4M6.3 6.3 4.9 4.9m14.2 0-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  shoe:'<path d="M3 15c2 0 3-.4 4-2l2-3 3 2 4 1c2 .4 4 1.4 5 3v3H3v-4Z"/><path d="M9 12.5 11 15m2-2 2 2"/>',
  leaf:'<path d="M20 4c-9 0-15 3-15 10a6 6 0 0 0 6 6c7 0 10-8 9-16Z"/><path d="M4 21c2-5 6-8 11-11"/>', ticket:'<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3v4Zm9-4v2m0 3v2m0 3v2"/>', menu:'<path d="M4 7h16M4 12h16M4 17h16"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>', check:'<path d="m5 12 4 4L19 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7a4 4 0 0 1 0 8m3 5a4 4 0 0 1 2 3v1"/>',play:'<path d="m9 6 10 6-10 6V6Z"/>',instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',chevron:'<path d="m9 18 6-6-6-6"/>'
}
const icon = (name: string, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] ?? iconPaths.spark}</svg>`
const esc = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!))
const site = pageContent
const whatsappHref = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Olá! Quero saber mais sobre a próxima edição do EleVa.')}`
const instagramHref = `https://instagram.com/${site.instagram.replace('@', '')}`
const features = featureContent as Feature[]
const app = document.querySelector<HTMLDivElement>('#app')!

function renderValue(value: {title:string;description:string}, index:number) {
  return `<div class="value"><span class="value-number">0${index+1}</span><div><h3>${esc(value.title)}</h3><p>${esc(value.description)}</p></div></div>`
}
function renderExperience(item: (typeof experienceContent)[number], index:number) {
  return `<article class="experience-card"><div class="experience-image" data-image="${esc(item.image)}" role="img" aria-label="${esc(item.imageAlt)}"><span class="image-tag">${esc(item.tag)}</span><span class="image-number">0${index+1}</span></div><div class="experience-info"><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div><a href="${whatsappHref}" target="_blank" rel="noreferrer" aria-label="${esc(site.experienceSection.action)}: ${esc(item.title)}">${icon('arrow')}</a></div></article>`
}
function renderEntry(feature: Feature, entry: FeatureEntry): string {
  if (feature.id === 'home-workouts') {
    const steps = Array.isArray(entry.steps) ? entry.steps : []
    return `<details class="entry-details"><summary>${esc(entry.name)} <span>${esc(entry.duration)} · ${esc(entry.level)}</span></summary><p>${esc(entry.description)}</p><div class="entry-meta">${icon('shoe')} ${esc(entry.equipment)}</div><ol>${steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></details>`
  }
  if (feature.id === 'challenges') {
    const active = localStorage.getItem(`challenge:${entry.id}`) === 'joined'
    return `<div class="feature-entry"><div class="entry-meta">${icon('calendar')} ${esc(entry.duration)}</div><h4>${esc(entry.name)}</h4><p>${esc(entry.goal)}</p><button class="feature-action challenge-action ${active?'joined':''}" data-id="${esc(entry.id)}">${active?`${icon('check')} ${esc(feature.joinedAction ?? 'Participando')}`:`${esc(feature.action)} ${icon('arrow')}`}</button></div>`
  }
  if (feature.id === 'coupons') {
    return `<div class="feature-entry coupon-entry"><div class="entry-meta">${esc(entry.partner)} · ${esc(entry.expires)}</div><h4>${esc(entry.discount)}</h4><p>${esc(entry.terms)}</p><button class="copy-coupon" data-code="${esc(entry.code)}">${esc(entry.code)} ${icon('check')}</button></div>`
  }
  if (feature.id === 'routes') {
    return `<div class="feature-entry"><div class="entry-meta">${esc(entry.city)} · ${esc(entry.type)} · ${esc(entry.distance)}</div><h4>${esc(entry.name)}</h4><p>${esc(entry.notes)}</p></div>`
  }
  if (feature.id === 'breakfasts') {
    return `<div class="feature-entry"><div class="entry-meta">${esc(entry.city)} · ${esc(entry.category)} · ${esc(entry.priceRange)}</div><h4>${esc(entry.name)}</h4><p>${esc(entry.notes)}</p></div>`
  }
  if (feature.id === 'nutrition') {
    return `<div class="feature-entry"><div class="entry-meta">${esc(entry.type)}</div><h4>${esc(entry.name)}</h4><p>${esc(entry.description)}</p></div>`
  }
  return `<div class="feature-entry"><div class="entry-meta">${esc(entry.category)}</div><h4>${esc(entry.name)}</h4><p>${esc(entry.offer)}</p><a href="${esc(entry.website)}" target="_blank" rel="noreferrer">Conhecer parceiro ${icon('arrow')}</a></div>`
}
function renderFeature(feature: Feature) {
  const entries = feature.items.length ? feature.items.map(entry=>renderEntry(feature,entry)).join('') : `<p class="feature-empty">${esc(feature.emptyState)}</p>`
  const action = `<a class="feature-link" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc((feature as Feature & {action?:string}).action ?? 'Fale com a EleVa')} ${icon('arrow')}</a>`
  return `<article class="feature-card" data-category="${esc(feature.category)}" data-feature="${esc(feature.id)}"><div class="feature-top"><span class="feature-icon">${icon(feature.icon)}</span><span class="feature-label">${esc(feature.label)}</span></div><h3>${esc(feature.title)}</h3><p>${esc(feature.description)}</p><div class="feature-detail"><span class="detail-dot"></span>${esc(feature.detail)}</div><div class="feature-entries">${entries}</div>${feature.disclaimer?`<small class="feature-disclaimer">${esc(feature.disclaimer)}</small>`:''}${action}</article>`
}

app.innerHTML = `
<header class="topbar"><a class="brand" href="#inicio" aria-label="${esc(site.brand)} início"><span class="brand-mark">${icon('run')}</span><span>${esc(site.shortBrand)}</span></a><nav class="desktop-nav"><a href="#sobre">${esc(site.navigation.about)}</a><a href="#experiencias">${esc(site.navigation.experiences)}</a><a href="#beneficios">${esc(site.navigation.features)}</a></nav><div class="top-actions"><a class="login-link" href="${instagramHref}" target="_blank" rel="noreferrer">${esc(site.navigation.memberAction)}</a><a class="button button-dark button-small" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc(site.navigation.joinAction)} ${icon('arrow')}</a></div><button class="menu-toggle" aria-label="${esc(site.navigation.menuOpen)}">${icon('menu')}</button></header>
<main id="inicio">
<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span>${esc(site.hero.eyebrow)}</div><h1>${esc(site.hero.title)}<br><em>${esc(site.hero.emphasis)}</em></h1><p class="hero-lead">${esc(site.hero.description)}</p><div class="hero-ctas"><a class="button button-coral" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc(site.hero.primaryAction)} ${icon('arrow')}</a><a href="${instagramHref}" target="_blank" rel="noreferrer" class="text-link">${esc(site.hero.secondaryAction)} ${icon('instagram')}</a></div><div class="social-proof"><span class="proof-mark">${icon('users')}</span><div><strong>${esc(site.hero.proofTitle)}</strong><small>${esc(site.hero.proofSubtitle)}</small></div></div></div><div class="hero-visual"><div class="hero-photo" data-hero-image="${esc(site.hero.image)}" role="img" aria-label="${esc(site.hero.photoAlt)}"></div><div class="photo-label"><span class="label-icon">${icon('heart')}</span><div><strong>${esc(site.hero.photoCaption)}</strong><small>${esc(site.hero.photoSubcaption)}</small></div></div><div class="photo-note"><span class="note-dot"></span> ${esc(site.hero.photoNote)}</div><div class="hero-scribble">✳</div></div><div class="hero-index"><span>01</span><span class="index-line"></span><span>03</span></div></section>
<section class="ticker" aria-label="O que fazemos"><div class="ticker-track">${site.ticker.map((item:string)=>`<span>${esc(item)}<b>✳</b></span>`).join('')}</div></section>
<section class="intro section" id="sobre"><div class="section-kicker">${icon('spark')} ${esc(site.about.eyebrow)}</div><div class="intro-grid"><h2>${esc(site.about.title)}<br><em>${esc(site.about.emphasis)}</em></h2><div class="intro-text"><p>${esc(site.about.description)}</p><a class="underlined-link" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc(site.navigation.joinAction)} ${icon('arrow')}</a></div></div><div class="values-row">${site.about.values.map(renderValue).join('')}</div></section>
<section class="experiences section" id="experiencias"><div class="section-heading"><div><div class="section-kicker">${icon('sun')} ${esc(site.experienceSection.eyebrow)}</div><h2>${esc(site.experienceSection.title)} <em>${esc(site.experienceSection.emphasis)}</em></h2></div><a class="underlined-link desktop-only" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc(site.experienceSection.action)} ${icon('arrow')}</a></div><div class="experience-grid">${experienceContent.map(renderExperience).join('')}</div><a class="underlined-link mobile-only" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc(site.experienceSection.action)} ${icon('arrow')}</a></section>
<section class="join-banner" id="comunidade"><div class="banner-shape">✳</div><div class="banner-content"><div class="section-kicker light-kicker">${icon('heart')} ${esc(site.community.eyebrow)}</div><h2>${esc(site.community.title)}<br><em>${esc(site.community.emphasis)}</em></h2><p>${esc(site.community.description)}</p><a class="button button-light join-button" href="${whatsappHref}" target="_blank" rel="noreferrer">${esc(site.community.action)} ${icon('arrow')}</a><small>${esc(site.community.promise)}</small></div><div class="banner-aside"><div class="banner-stat"><strong>${esc(site.community.meetingNumber)}</strong><p>${esc(site.community.meetingDescription)}</p></div><div class="banner-divider"></div><div class="banner-stat"><strong>${esc(site.community.friendshipStat)}</strong><p>${esc(site.community.friendshipDescription)}</p></div></div></section>
<section class="benefits section" id="beneficios"><div class="features-heading"><div><div class="section-kicker">${icon('spark')} ${esc(site.featureSection.eyebrow)}</div><h2>${esc(site.featureSection.title)}<br><em>${esc(site.featureSection.emphasis)}</em></h2><p>${esc(site.featureSection.description)}</p></div><div class="feature-filters" role="group" aria-label="Filtrar funcionalidades">${site.featureSection.filters.map((filter:{id:string;label:string},index:number)=>`<button class="filter-chip ${index===0?'active':''}" data-filter="${esc(filter.id)}">${esc(filter.label)}</button>`).join('')}</div></div><div class="feature-grid">${features.map(renderFeature).join('')}</div></section>
<section class="closing-quote"><div class="quote-mark">${esc(site.quote.mark)}</div><blockquote>${esc(site.quote.text)}<br><em>${esc(site.quote.emphasis)}</em></blockquote><div class="quote-byline"><span class="quote-line"></span>${esc(site.quote.byline)}</div><div class="quote-flower">✳</div></section>
</main><footer class="footer"><a class="brand footer-brand" href="#inicio"><span class="brand-mark">${icon('run')}</span><span>${esc(site.shortBrand)}</span></a><span>${esc(site.footer.message)} <b>♥</b></span>${site.instagram?`<a class="instagram" href="${instagramHref}" target="_blank" rel="noreferrer">${icon('instagram')} ${esc(site.instagram)}</a>`:''}<small>${esc(site.footer.copyright)}</small></footer>
<div class="toast" role="status" aria-live="polite"></div>`

const baseUrl = import.meta.env.BASE_URL
const heroPhoto = document.querySelector<HTMLElement>('.hero-photo')
if (heroPhoto) heroPhoto.style.backgroundImage = `url("${baseUrl}${heroPhoto.dataset.heroImage}")`
document.querySelectorAll<HTMLElement>('.experience-image[data-image]').forEach(el=>{el.style.backgroundImage=`linear-gradient(180deg,#14140b33,transparent 30%,transparent 75%,#15150e28),url("${el.dataset.image}")`})

const toast = document.querySelector<HTMLElement>('.toast')!
function announce(message:string) { toast.textContent=message;toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),3500) }
document.querySelectorAll<HTMLButtonElement>('.filter-chip').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filter-chip.active')?.classList.remove('active');button.classList.add('active');const filter=button.dataset.filter;document.querySelectorAll<HTMLElement>('.feature-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter})}))
document.querySelectorAll<HTMLButtonElement>('.challenge-action').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.id!;const joined=localStorage.getItem(`challenge:${id}`)==='joined';if(joined){localStorage.removeItem(`challenge:${id}`);button.classList.remove('joined');button.innerHTML=`Participar do desafio ${icon('arrow')}`}else{localStorage.setItem(`challenge:${id}`,'joined');button.classList.add('joined');button.innerHTML=`${icon('check')} ${esc(featureContent.find(feature=>feature.id==='challenges')?.joinedAction ?? 'Participando')}`}}))
document.querySelectorAll<HTMLButtonElement>('.copy-coupon').forEach(button=>button.addEventListener('click',async()=>{const code=button.dataset.code!;try{await navigator.clipboard.writeText(code);announce(`Cupom ${code} copiado.`)}catch{announce(`Código do cupom: ${code}`)}}))
const menu=document.querySelector<HTMLButtonElement>('.menu-toggle')!
menu.addEventListener('click',()=>{document.body.classList.toggle('nav-open');menu.innerHTML=icon(document.body.classList.contains('nav-open')?'close':'menu');menu.setAttribute('aria-label',document.body.classList.contains('nav-open')?site.navigation.menuClose:site.navigation.menuOpen)})
document.querySelectorAll('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('nav-open');menu.innerHTML=icon('menu');menu.setAttribute('aria-label',site.navigation.menuOpen)}))
