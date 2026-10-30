#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'src', 'content')
const featureDir = path.join(contentDir, 'features')
const definitions = {
  experiences: { path: path.join(contentDir, 'experiences.json'), required: ['id','title','description','tag','image','imageAlt'] },
  routes: { path: path.join(featureDir, 'routes.json'), required: ['id','name','city','type','distance','notes'] },
  books: { path: path.join(featureDir, 'books.json'), required: ['id','name','author','theme','notes'] },
  breakfasts: { path: path.join(featureDir, 'breakfasts.json'), required: ['id','name','city','category','priceRange','notes'] },
  'home-workouts': { path: path.join(featureDir, 'home-workouts.json'), required: ['id','name','duration','level','equipment','description','steps'], arrays: ['steps'] },
  challenges: { path: path.join(featureDir, 'challenges.json'), required: ['id','name','duration','goal','description'] },
  nutrition: { path: path.join(featureDir, 'nutrition.json'), required: ['id','name','type','description'] },
  partnerships: { path: path.join(featureDir, 'partnerships.json'), required: ['id','name','category','website','offer'] },
  coupons: { path: path.join(featureDir, 'coupons.json'), required: ['id','partner','code','discount','expires','terms'] }
}
const usage = `Corre, Mana · gerenciador de conteúdo estático

Comandos:
  npm run content -- list
  npm run content -- validate [coleção]
  npm run content -- show <coleção|site>
  npm run content -- add <coleção> --campo valor ...
  npm run content -- edit <coleção> <id> --field campo --value valor
  npm run content -- remove <coleção> <id>

Coleções: ${Object.keys(definitions).join(', ')}
Para treinos, informe --steps "etapa 1|etapa 2|etapa 3".
Edite src/content/site.json diretamente para textos gerais da marca e da página.`

function fail(message) { console.error(`Erro: ${message}`); process.exitCode = 1 }
function parseOptions(args) {
  const options = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg.startsWith('--')) throw new Error(`Argumento inesperado: ${arg}`)
    const equal = arg.indexOf('=')
    const key = arg.slice(2, equal === -1 ? undefined : equal)
    const value = equal === -1 ? args[++i] : arg.slice(equal + 1)
    if (value === undefined || value.startsWith('--')) throw new Error(`Informe um valor para --${key}`)
    options[key] = value
  }
  return options
}
async function readJson(file) { return JSON.parse(await readFile(file, 'utf8')) }
async function writeJson(file, data) { await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8') }
async function readCollection(name) {
  const definition = definitions[name]
  if (!definition) throw new Error(`Coleção desconhecida: ${name}. Use "list" para ver as opções.`)
  const document = await readJson(definition.path)
  if (name === 'experiences') return { items: document, wrap: false }
  return { items: document.items, document, wrap: true }
}
function validateItems(name, items, required) {
  const errors = []
  if (!Array.isArray(items)) return [`${name}: "items" deve ser uma lista.`]
  const seen = new Set()
  items.forEach((item, index) => {
    const label = `${name}[${index}]`
    if (!item || typeof item !== 'object' || Array.isArray(item)) { errors.push(`${label}: esperado um objeto.`); return }
    for (const field of required) {
      const value = item[field]
      if (value === undefined || value === null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0)) errors.push(`${label}: campo obrigatório "${field}" ausente.`)
    }
    if (item.id) {
      if (seen.has(item.id)) errors.push(`${label}: id duplicado "${item.id}".`)
      seen.add(item.id)
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) errors.push(`${label}: id deve usar minúsculas, números e hífens.`)
    }
  })
  return errors
}
async function validate(name) {
  const names = name ? [name] : Object.keys(definitions)
  const errors = []
  for (const collectionName of names) {
    const definition = definitions[collectionName]
    if (!definition) { errors.push(`Coleção desconhecida: ${collectionName}.`); continue }
    try {
      const document = await readJson(definition.path)
      const items = collectionName === 'experiences' ? document : document.items
      if (collectionName !== 'experiences') {
        for (const field of ['id','category','icon','label','title','description','detail','emptyState','action']) {
          if (typeof document[field] !== 'string' || !document[field].trim()) errors.push(`${collectionName}: campo de coleção "${field}" ausente.`)
        }
      }
      errors.push(...validateItems(collectionName, items, definition.required))
    } catch (error) { errors.push(`${collectionName}: ${error.message}`) }
  }
  if (errors.length) { errors.forEach(error => console.error(`✗ ${error}`)); process.exitCode = 1 }
  else console.log(`✓ Conteúdo válido: ${names.join(', ')}`)
}
async function list() {
  for (const [name, definition] of Object.entries(definitions)) {
    try {
      const { items } = await readCollection(name)
      console.log(`${name.padEnd(16)} ${String(items.length).padStart(2)} item(ns)  ${path.relative(root, definition.path)}`)
    } catch (error) { console.log(`${name.padEnd(16)} erro: ${error.message}`) }
  }
}
async function show(name) {
  if (name === 'site') {
    console.log(JSON.stringify(await readJson(path.join(contentDir, 'site.json')), null, 2))
    return
  }
  const { items } = await readCollection(name)
  console.log(JSON.stringify(items, null, 2))
}
async function add(name, args) {
  const definition = definitions[name]
  if (!definition) throw new Error(`Coleção desconhecida: ${name}.`)
  const options = parseOptions(args)
  const item = {}
  for (const [key, value] of Object.entries(options)) item[key] = definition.arrays?.includes(key) ? value.split('|').map(part => part.trim()).filter(Boolean) : value
  const { items, document, wrap } = await readCollection(name)
  const errors = validateItems(name, [...items, item], definition.required)
  if (errors.length) throw new Error(errors.join('\n'))
  items.push(item)
  await writeJson(definition.path, wrap ? { ...document, items } : items)
  console.log(`✓ Adicionado "${item.id}" em ${name}.`)
}
async function edit(name, id, args) {
  const options = parseOptions(args)
  const field = options.field
  if (!field || options.value === undefined) throw new Error('Use --field nome-do-campo --value "novo valor".')
  const definition = definitions[name]
  if (!definition) throw new Error(`Coleção desconhecida: ${name}.`)
  const { items, document, wrap } = await readCollection(name)
  const item = items.find(entry => entry.id === id)
  if (!item) throw new Error(`Não encontrei o id "${id}" em ${name}.`)
  item[field] = definition.arrays?.includes(field) ? options.value.split('|').map(part => part.trim()).filter(Boolean) : options.value
  const errors = validateItems(name, items, definition.required)
  if (errors.length) throw new Error(errors.join('\n'))
  await writeJson(definition.path, wrap ? { ...document, items } : items)
  console.log(`✓ Atualizado "${id}" em ${name}.`)
}
async function remove(name, id) {
  const { items, document, wrap } = await readCollection(name)
  const filtered = items.filter(entry => entry.id !== id)
  if (filtered.length === items.length) throw new Error(`Não encontrei o id "${id}" em ${name}.`)
  await writeJson(definitions[name].path, wrap ? { ...document, items: filtered } : filtered)
  console.log(`✓ Removido "${id}" de ${name}.`)
}

const [command, name, ...rest] = process.argv.slice(2)
try {
  if (!command || command === 'help' || command === '--help' || command === '-h') console.log(usage)
  else if (command === 'list') await list()
  else if (command === 'validate') await validate(name)
  else if (command === 'show' && name) await show(name)
  else if (command === 'add' && name) await add(name, rest)
  else if (command === 'edit' && name && rest[0]) await edit(name, rest[0], rest.slice(1))
  else if (command === 'remove' && name && rest[0]) await remove(name, rest[0])
  else console.log(usage)
} catch (error) { fail(error.message) }
