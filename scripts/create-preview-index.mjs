import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const dist = path.resolve(process.argv[2] ?? 'dist')
const branches = JSON.parse(process.env.PREVIEW_BRANCHES_JSON ?? '[]')
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))
const renderInline = text => {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*/g
  let html = ''
  let offset = 0
  for (const match of text.matchAll(pattern)) {
    html += escapeHtml(text.slice(offset, match.index))
    if (match[1]) html += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noreferrer">${escapeHtml(match[1])}</a>`
    else if (match[3]) html += `<code>${escapeHtml(match[3])}</code>`
    else if (match[4] || match[5]) html += `<strong>${escapeHtml(match[4] || match[5])}</strong>`
    else html += `<em>${escapeHtml(match[6])}</em>`
    offset = match.index + match[0].length
  }
  return html + escapeHtml(text.slice(offset))
}
const renderMarkdown = markdown => {
  const lines = String(markdown ?? '').replace(/\r/g, '').split('\n')
  const blocks = []
  let paragraph = []
  let list = []
  let code = null
  const flushParagraph = () => { if (paragraph.length) blocks.push(`<p>${paragraph.map(renderInline).join('<br>')}</p>`); paragraph = [] }
  const flushList = () => { if (list.length) blocks.push(`<ul>${list.map(item => `<li>${renderInline(item)}</li>`).join('')}</ul>`); list = [] }
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      flushParagraph(); flushList()
      if (code === null) code = []
      else { blocks.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); code = null }
      continue
    }
    if (code !== null) { code.push(line); continue }
    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    const item = line.match(/^\s*[-*+]\s+(.+)$/)
    if (!line.trim()) { flushParagraph(); flushList(); continue }
    if (heading) {
      flushParagraph(); flushList()
      const level = Math.min(heading[1].length + 1, 4)
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
    } else if (item) {
      flushParagraph(); list.push(item[1])
    } else {
      flushList(); paragraph.push(line)
    }
  }
  if (code !== null) blocks.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`)
  flushParagraph(); flushList()
  return blocks.join('')
}
const links = branches.length
  ? branches.map(({description, path: branchPath, url}, index) => {
      const title = `Versão em avaliação ${index + 1}`
      const previewDir = path.join(dist, 'previews', branchPath)
      if (!existsSync(path.join(previewDir, 'index.html'))) {
        return mkdir(previewDir, { recursive: true }).then(() => writeFile(path.join(previewDir, 'index.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Versão indisponível · EleVa</title><body style="font:16px/1.6 system-ui,sans-serif;max-width:700px;margin:60px auto;padding:20px;background:#F8F0E8;color:#1C1C1C"><p>ELEVA · VERSÃO DE AVALIAÇÃO</p><h1>Esta versão está temporariamente indisponível.</h1><p>Não foi possível preparar esta versão agora. Tente novamente mais tarde.</p><a href="../../" style="color:#8E7246">Voltar à lista de versões</a></body></html>`)).then(() => `<li><a href="./${escapeHtml(url)}/">${title}</a><div class="description">${renderMarkdown(description || 'Descrição ainda não disponível.')}</div><small>Esta versão está temporariamente indisponível.</small></li>`)
      }
      return `<li><a href="./${escapeHtml(url)}/">${title}</a><div class="description">${renderMarkdown(description || 'Descrição ainda não disponível.')}</div></li>`
    })
  : []
const renderedLinks = (await Promise.all(links)).join('\n') || '<li class="empty">Nenhuma versão em avaliação disponível no momento.</li>'
const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Versões do site · EleVa</title>
<style>*{box-sizing:border-box}body{margin:0;padding:48px 20px;background:#F8F0E8;color:#1C1C1C;font:16px/1.6 system-ui,sans-serif}.wrap{max-width:760px;margin:auto}a{color:#8E7246}h1{font:500 clamp(2.5rem,7vw,4.5rem)/1.05 Georgia,serif;letter-spacing:-.04em;margin:20px 0}p{color:#716d64}.release{display:inline-flex;margin:14px 0 34px;padding:12px 16px;background:#1C1C1C;color:#fff;text-decoration:none}.release:hover{background:#444}.list{padding:0;list-style:none;border-top:1px solid #E6DED1}.list li{padding:16px 4px;border-bottom:1px solid #E6DED1}.description{margin-top:5px;color:#716d64;font-size:14px}.description p{margin:0 0 8px}.description ul{padding-left:22px;margin:6px 0}.description h2,.description h3,.description h4{margin:10px 0 5px;font-size:16px}.description pre{overflow:auto;padding:10px;background:#eee8dc;border-radius:4px}.description code{font-size:.9em}.list a{text-decoration:none;font-weight:600}.list a:hover{text-decoration:underline}.empty{color:#817d74;font-weight:400}small{color:#898579}</style></head>
<body><main class="wrap"><small>ELEVA · VERSÕES DO SITE</small><h1>Versão publicada e versões em avaliação</h1><p>A versão publicada é a que está disponível para todos. As versões em avaliação mostram mudanças que ainda estão sendo preparadas e podem mudar.</p><a class="release" href="../">Abrir versão publicada →</a><h2>Versões em avaliação</h2><p>As descrições explicam o que está sendo preparado em cada versão.</p><ul class="list">${renderedLinks}</ul></main></body></html>`
await mkdir(path.join(dist, 'previews'), { recursive: true })
await writeFile(path.join(dist, 'previews', 'index.html'), html)
