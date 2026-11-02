import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const dist = path.resolve(process.argv[2] ?? 'dist')
const branches = JSON.parse(process.env.PREVIEW_BRANCHES_JSON ?? '[]')
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))
const links = branches.length
  ? branches.map(({description, path: branchPath, url}, index) => {
      const title = `Versão em avaliação ${index + 1}`
      const previewDir = path.join(dist, 'previews', branchPath)
      if (!existsSync(path.join(previewDir, 'index.html'))) {
        return mkdir(previewDir, { recursive: true }).then(() => writeFile(path.join(previewDir, 'index.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Versão indisponível · EleVa</title><body style="font:16px/1.6 system-ui,sans-serif;max-width:700px;margin:60px auto;padding:20px;background:#F8F0E8;color:#1C1C1C"><p>ELEVA · VERSÃO DE AVALIAÇÃO</p><h1>Esta versão está temporariamente indisponível.</h1><p>Não foi possível preparar esta versão agora. Tente novamente mais tarde.</p><a href="../../" style="color:#8E7246">Voltar à lista de versões</a></body></html>`)).then(() => `<li><a href="./${escapeHtml(url)}/">${title}</a><p>${escapeHtml(description || 'Descrição ainda não disponível.')}</p><small>Esta versão está temporariamente indisponível.</small></li>`)
      }
      return `<li><a href="./${escapeHtml(url)}/">${title}</a><p>${escapeHtml(description || 'Descrição ainda não disponível.')}</p></li>`
    })
  : []
const renderedLinks = (await Promise.all(links)).join('\n') || '<li class="empty">Nenhuma versão em avaliação disponível no momento.</li>'
const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Versões do site · EleVa</title>
<style>*{box-sizing:border-box}body{margin:0;padding:48px 20px;background:#F8F0E8;color:#1C1C1C;font:16px/1.6 system-ui,sans-serif}.wrap{max-width:760px;margin:auto}a{color:#8E7246}h1{font:500 clamp(2.5rem,7vw,4.5rem)/1.05 Georgia,serif;letter-spacing:-.04em;margin:20px 0}p{color:#716d64}.release{display:inline-flex;margin:14px 0 34px;padding:12px 16px;background:#1C1C1C;color:#fff;text-decoration:none}.release:hover{background:#444}.list{padding:0;list-style:none;border-top:1px solid #E6DED1}.list li{padding:16px 4px;border-bottom:1px solid #E6DED1}.list li p{margin:5px 0 0;font-size:14px}.list a{text-decoration:none;font-weight:600}.list a:hover{text-decoration:underline}.empty{color:#817d74;font-weight:400}small{color:#898579}</style></head>
<body><main class="wrap"><small>ELEVA · VERSÕES DO SITE</small><h1>Versão publicada e versões em avaliação</h1><p>A versão publicada é a que está disponível para todos. As versões em avaliação mostram mudanças que ainda estão sendo preparadas e podem mudar.</p><a class="release" href="../">Abrir versão publicada →</a><h2>Versões em avaliação</h2><p>As descrições explicam o que está sendo preparado em cada versão.</p><ul class="list">${renderedLinks}</ul></main></body></html>`
await mkdir(path.join(dist, 'previews'), { recursive: true })
await writeFile(path.join(dist, 'previews', 'index.html'), html)
