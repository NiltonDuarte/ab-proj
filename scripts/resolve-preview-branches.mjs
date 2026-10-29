#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

const config = JSON.parse(await readFile(new URL('../.github/preview-branches.json', import.meta.url), 'utf8'))
const manualInput = (process.env.PREVIEW_BRANCHES_INPUT ?? '').trim()
const branches = manualInput
  ? manualInput.split(/[\n,]+/).map(value => value.trim()).filter(Boolean)
  : config.branches

if (!Array.isArray(branches)) throw new Error('preview-branches.json deve conter uma lista "branches".')
const unique = [...new Set(branches)]
if (unique.length !== branches.length) throw new Error('A lista contém branches repetidas.')
const include = unique.map(branch => {
  if (typeof branch !== 'string' || !/^feature\/[A-Za-z0-9._/-]+$/.test(branch) || branch.includes('..') || branch.includes('//')) {
    throw new Error(`Branch inválida: "${branch}". Use uma branch como feature/nova-home.`)
  }
  try { execFileSync('git', ['check-ref-format', '--branch', branch], { stdio: 'ignore' }) }
  catch { throw new Error(`Nome de branch Git inválido: \"${branch}\".`) }
  const slug = branch.replaceAll('/', '-')
  return { branch, slug }
})
if (new Set(include.map(item => item.slug)).size !== include.length) throw new Error('Dois nomes de branch geram a mesma pasta de preview.')

const matrix = JSON.stringify({ include })
const output = process.env.GITHUB_OUTPUT
if (output) {
  const { appendFile } = await import('node:fs/promises')
  await appendFile(output, `matrix=${matrix}\nhas_previews=${include.length ? 'true' : 'false'}\nbranches=${JSON.stringify(unique)}\n`)
} else {
  console.log(JSON.stringify({ matrix: { include }, branches: unique }, null, 2))
}
