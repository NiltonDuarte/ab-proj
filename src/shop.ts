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
  <main class="shop-main" data-view="grid">
    <section class="shop-hero">
      <div class="section-kicker"><span class="shop-kicker-mark">✳</span>${esc(shop.eyebrow)}</div>
      <h1>${esc(shop.title)}<br><em>com intenção.</em></h1>
      <p>${esc(shop.description)}</p>
    </section>
    <div class="shop-view-switcher" role="group" aria-label="Forma de visualizar os produtos"><span>Visualização</span><button type="button" class="shop-view-option active" data-view="grid" aria-pressed="true">Grade</button><button type="button" class="shop-view-option" data-view="list" aria-pressed="false">Lista</button><button type="button" class="shop-view-option" data-view="editorial" aria-pressed="false">Editorial</button><button type="button" class="shop-view-option" data-view="compact" aria-pressed="false">Compacta</button><button type="button" class="shop-view-option" data-view="mosaic" aria-pressed="false">Mosaico</button><button type="button" class="shop-view-option" data-view="categories" aria-pressed="false">Categorias</button><button type="button" class="shop-view-option" data-view="light" aria-pressed="false">Leve</button></div>
    <nav class="shop-category-nav" aria-label="Ir para categoria">${shop.categories.map((category, index) => `<a href="#shop-category-${index + 1}">${esc(category.title)}</a>`).join('')}</nav>
    <section class="shop-categories" aria-label="Categorias da loja">
      ${shop.categories.map((category, index) => `<section id="shop-category-${index + 1}" class="shop-category"><div class="shop-category-heading"><div><span class="shop-card-number">CURADORIA ELEVA</span><h2>${esc(category.title)}</h2><p>${esc(category.description)}</p></div><a class="shop-list-link" href="${esc(category.url)}" target="_blank" rel="noopener noreferrer">${esc(category.action)} ↗</a></div><div class="shop-products">${category.products.map(product => `<article class="shop-product"><a class="shop-product-image" href="${esc(product.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(product.name)} no Mercado Livre"><img src="${homeUrl}${esc(product.image)}" alt="${esc(product.name)}" loading="lazy"><span class="shop-product-open" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6m-11 5L20 4"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg></span></a><div class="shop-product-info"><h3>${esc(product.name)}</h3></div></article>`).join('')}</div>${category.products.length > 6 ? `<button type="button" class="shop-show-all" aria-expanded="false">Ver todos os ${category.products.length} produtos</button>` : ''}</section>`).join('')}
    </section>
    <p class="shop-disclosure">${esc(shop.disclosure)}</p>
  </main>
  <footer class="footer shop-footer"><a class="brand footer-brand" href="${homeUrl}"><span class="brand-mark"><img src="${homeUrl}images/eleva-lotus-mark.png" alt="" aria-hidden="true"></span><span>EleVa</span></a><a class="shop-back-link" href="${homeUrl}">Voltar para a página principal</a><small>© ${new Date().getFullYear()} EleVa</small></footer>
`

const shopMain = document.querySelector<HTMLElement>('.shop-main')!
document.querySelectorAll<HTMLButtonElement>('.shop-view-option').forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.view!
  shopMain.dataset.view = view
  document.querySelector('.shop-view-option.active')?.classList.remove('active')
  button.classList.add('active')
  document.querySelectorAll<HTMLButtonElement>('.shop-view-option').forEach(option => option.setAttribute('aria-pressed', String(option === button)))
}))

document.querySelectorAll<HTMLButtonElement>('.shop-show-all').forEach(button => button.addEventListener('click', () => {
  const category = button.closest<HTMLElement>('.shop-category')!
  const expanded = category.classList.toggle('expanded')
  button.setAttribute('aria-expanded', String(expanded))
  button.textContent = expanded ? 'Mostrar menos' : `Ver todos os ${category.querySelectorAll('.shop-product').length} produtos`
}))
