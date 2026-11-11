import './style.css'
import './shop.css'
import shop from './content/shop.json'

// One directory up reaches the site root both on Pages and nested branch previews.
const homeUrl = '../'
const esc = (value: string): string => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))

document.querySelector<HTMLDivElement>('#shop-app')!.innerHTML = `
  <header class="topbar shop-topbar">
    <a class="brand" href="${homeUrl}" aria-label="EleVa, página inicial"><span class="brand-mark"><img src="${homeUrl}images/eleva-lotus-mark.png" alt="" aria-hidden="true"></span><span>EleVa</span></a>
    <nav class="desktop-nav shop-nav" aria-label="Navegação principal"><a href="${homeUrl}">Página inicial</a><a href="${homeUrl}#parcerias">Parcerias</a></nav>
    <a class="button button-dark button-small" href="${homeUrl}">Voltar ao EleVa</a>
  </header>
  <main class="shop-main">
    <section class="shop-hero">
      <div class="section-kicker"><span class="shop-kicker-mark">✳</span>${esc(shop.eyebrow)}</div>
      <h1>${esc(shop.title)}<br><em>com intenção.</em></h1>
      <p>${esc(shop.description)}</p>
    </section>
    <section class="shop-categories" aria-label="Categorias da loja">
      ${shop.categories.map((category, index) => `<article class="shop-card shop-card-${index + 1}"><span class="shop-card-number">0${index + 1}</span><div class="shop-card-copy"><h2>${esc(category.title)}</h2><p>${esc(category.description)}</p><a class="button button-dark" href="${esc(category.url)}" target="_blank" rel="noopener noreferrer">${esc(category.action)} <span aria-hidden="true">↗</span></a></div><div class="shop-card-orb" aria-hidden="true">✳</div></article>`).join('')}
    </section>
    <p class="shop-disclosure">${esc(shop.disclosure)}</p>
  </main>
  <footer class="footer shop-footer"><a class="brand footer-brand" href="${homeUrl}"><span class="brand-mark"><img src="${homeUrl}images/eleva-lotus-mark.png" alt="" aria-hidden="true"></span><span>EleVa</span></a><a class="shop-back-link" href="${homeUrl}">Voltar para a página principal</a><small>© ${new Date().getFullYear()} EleVa</small></footer>
`
