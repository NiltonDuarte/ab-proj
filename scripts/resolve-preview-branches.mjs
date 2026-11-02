#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { appendFile } from 'node:fs/promises'

const remoteRefs = execFileSync('git', ['for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin'], { encoding: 'utf8' })
const branches = [...new Set(remoteRefs.split(/\r?\n/)
  .map(ref => ref.trim().replace(/^origin\//, ''))
  .filter(branch => branch && branch !== 'HEAD' && branch !== 'main'))]
  .sort((a, b) => a.localeCompare(b))

const repository = process.env.GITHUB_REPOSITORY
const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN
const owner = repository?.split('/')[0]

async function getDescription(branch) {
  if (repository && token) {
    const query = new URLSearchParams({ state: 'open', head: `${owner}:${branch}`, per_page: '100' })
    const response = await fetch(`https://api.github.com/repos/${repository}/pulls?${query}`, {
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' }
    })
    if (!response.ok) throw new Error(`Não foi possível consultar o PR de "${branch}": HTTP ${response.status}.`)
    const pulls = await response.json()
    const pull = pulls.find(item => item.head.ref === branch)
    if (pull) return (pull.body?.trim() || pull.title).slice(0, 1200)
  }
  return execFileSync('git', ['log', '-1', '--format=%s', `origin/${branch}`], { encoding: 'utf8' }).trim()
}

const include = await Promise.all(branches.map(async (branch, index) => {
  try { execFileSync('git', ['check-ref-format', '--branch', branch], { stdio: 'ignore' }) }
  catch { throw new Error(`Nome de branch Git inválido: "${branch}".`) }
  return {
    branch,
    description: await getDescription(branch),
    path: branch,
    url: branch.split('/').map(encodeURIComponent).join('/'),
    artifact: `site-preview-${index + 1}`
  }
}))

const matrix = JSON.stringify({ include })
const output = process.env.GITHUB_OUTPUT
if (output) {
  await appendFile(output, `matrix=${matrix}\nhas_previews=${include.length ? 'true' : 'false'}\nbranches=${JSON.stringify(include)}\n`)
} else {
  console.log(JSON.stringify({ matrix: { include }, branches: include }, null, 2))
}
