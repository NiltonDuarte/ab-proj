#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { appendFile } from 'node:fs/promises'

const remoteRefs = execFileSync('git', ['for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin'], { encoding: 'utf8' })
const branches = [...new Set(remoteRefs.split(/\r?\n/)
  .map(ref => ref.trim().replace(/^origin\//, ''))
  .filter(branch => branch && branch !== 'HEAD' && branch !== 'main'))]
  .sort((a, b) => a.localeCompare(b))

const include = branches.map((branch, index) => {
  try { execFileSync('git', ['check-ref-format', '--branch', branch], { stdio: 'ignore' }) }
  catch { throw new Error(`Nome de branch Git inválido: "${branch}".`) }
  return {
    branch,
    path: branch,
    url: branch.split('/').map(encodeURIComponent).join('/'),
    artifact: `site-preview-${index + 1}`
  }
})

const matrix = JSON.stringify({ include })
const output = process.env.GITHUB_OUTPUT
if (output) {
  await appendFile(output, `matrix=${matrix}\nhas_previews=${include.length ? 'true' : 'false'}\nbranches=${JSON.stringify(include)}\n`)
} else {
  console.log(JSON.stringify({ matrix: { include }, branches: include }, null, 2))
}
