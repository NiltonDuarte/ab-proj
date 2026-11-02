import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const dist = path.resolve(process.argv[2] ?? 'dist')
const branches = JSON.parse(process.env.PREVIEW_BRANCHES_JSON ?? '[]')
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))
const links = branches.length
  ? branches.map(({branch, description, path: branchPath, url}) => {
      const previewDir = path.join(dist, 'previews', branchPath)
      if (!existsSync(path.join(previewDir, 'index.html'))) {
        return mkdir(previewDir, { recursive: true }).then(() => writeFile(path.join(previewDir, 'index.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prévia indisponível · EleVa</title><body style="font:16px/1.6 system-ui,sans-serif;max-width:700px;margin:60px auto;padding:20px;background:#F8F0E8;color:#1C1C1C"><p>ELEVA · PRÉVIA</p><h1>Não foi possível compilar esta branch.</h1><p>A branch <strong>${escapeHtml(branch)}</strong> foi encontrada, mas a compilação falhou. Confira a validação e tente novamente.</p><a href="../../" style="color:#8E7246">Voltar à galeria de prévias</a></body></html>`)).then(() => `<li><a href="./${escapeHtml(url)}/">${escapeHtml(branch)}</a><p>${escapeHtml(description || 'Resumo da alteração não informado.')}</p><small>Prévia indisponível: a compilação falhou.</small></li>`)
      }
      return `<li><a href="./${escapeHtml(url)}/">${escapeHtml(branch)}</a><p>${escapeHtml(description || 'Resumo da alteração não informado.')}</p></li>`
    })
  : []
const renderedLinks = (await Promise.all(links)).join('\n') || '<li class="empty">Nenhuma branch além de main foi encontrada.</li>'
const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Previews · EleVa</title>
<style>*{box-sizing:border-box}body{margin:0;padding:48px 20px;background:#F8F0E8;color:#1C1C1C;font:16px/1.6 system-ui,sans-serif}.wrap{max-width:760px;margin:auto}a{color:#8E7246}h1{font:500 clamp(2.5rem,7vw,4.5rem)/1.05 Georgia,serif;letter-spacing:-.04em;margin:20px 0}p{color:#716d64}.release{display:inline-flex;margin:14px 0 34px;padding:12px 16px;background:#1C1C1C;color:#fff;text-decoration:none}.release:hover{background:#444}.list{padding:0;list-style:none;border-top:1px solid #E6DED1}.list li{padding:16px 4px;border-bottom:1px solid #E6DED1}.list li p{margin:5px 0 0;font-size:14px}.list a{text-decoration:none;font-weight:600}.list a:hover{text-decoration:underline}.empty{color:#817d74;font-weight:400}small{color:#898579}</style></head>
<body><main class="wrap"><small>ELEVA · GALERIA DE VERSÕES</small><h1>Versão publicada e prévias</h1><p>A versão publicada é a versão oficial disponível na página principal. As prévias mostram versões em desenvolvimento de cada branch e podem incluir alterações ainda não publicadas.</p><a class="release" href="../">Abrir versão publicada →</a><h2>Versões em prévia</h2><p>Quando disponível, cada resumo vem da descrição do pull request aberto da branch. Sem um PR aberto, mostramos a mensagem do commit mais recente.</p><ul class="list">${renderedLinks}</ul></main></body></html>`
await mkdir(path.join(dist, 'previews'), { recursive: true })
await writeFile(path.join(dist, 'previews', 'index.html'), html)
