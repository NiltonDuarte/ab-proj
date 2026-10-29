import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve(process.argv[2] ?? 'dist')
const branches = JSON.parse(process.env.PREVIEW_BRANCHES_JSON ?? '[]')
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))
const links = branches.length
  ? branches.map(({branch, slug}) => `<li><a href="./${escapeHtml(slug)}/">${escapeHtml(branch)}</a></li>`).join('\n')
  : '<li class="empty">Nenhuma feature branch selecionada neste deploy.</li>'
const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Previews · Corre, Mana</title>
<style>*{box-sizing:border-box}body{margin:0;padding:48px 20px;background:#f9f7f1;color:#25231f;font:16px/1.6 system-ui,sans-serif}.wrap{max-width:760px;margin:auto}a{color:#b85f46}h1{font:500 clamp(2.5rem,7vw,4.5rem)/1.05 Georgia,serif;letter-spacing:-.04em;margin:20px 0}p{color:#716d64}.release{display:inline-flex;margin:14px 0 34px;padding:12px 16px;background:#25231f;color:#fff;text-decoration:none}.release:hover{background:#444}.list{padding:0;list-style:none;border-top:1px solid #e3e0d7}.list li{padding:16px 4px;border-bottom:1px solid #e3e0d7}.list a{text-decoration:none;font-weight:600}.list a:hover{text-decoration:underline}.empty{color:#817d74;font-weight:400}small{color:#898579}</style></head>
<body><main class="wrap"><small>CORRE, MANA · GALERIA DE VERSÕES</small><h1>Release e candidatas.</h1><p>A versão principal fica na raiz do site. Escolha uma feature para abrir a respectiva prévia.</p><a class="release" href="../">Abrir versão release →</a><h2>Features selecionadas</h2><ul class="list">${links}</ul></main></body></html>`
await mkdir(path.join(dist, 'previews'), { recursive: true })
await writeFile(path.join(dist, 'previews', 'index.html'), html)
