# Instruções do projeto

## Conteúdo e aplicação

- A página é um site estático em TypeScript/Vite. Mantenha textos e dados editáveis em `src/content/`; não duplique conteúdo editorial em `src/main.ts`.
- Use `npm run content -- list`, `show`, `add`, `edit`, `remove` e `validate` para manter listas. Consulte `src/content/README.md` para os esquemas e campos obrigatórios.
- Não invente recomendações locais, parcerias ou descontos. Mantenha a nutrição como conteúdo geral e educativo.
- Preserve `base: './'` em `vite.config.ts`: os builds da release e das branches são servidos em caminhos diferentes.
- Todo layout deve ser responsivo para desktop e celular; confira os breakpoints e evite overflow horizontal em telas pequenas.
- Após alterar arquivos de conteúdo, rode `npm run content -- validate`; após alterar o renderer ou configurações Vite, rode também `npm run build`.
- Em worktrees sem `node_modules/`, rode `make install` antes do build; esse alvo executa `npm ci` usando o `package-lock.json`. Depois rode `make build` (ou `npm run build`). Se o build retornar `tsc: Permission denied`, confira se `node_modules/` existe; se não existir, execute `make install` e tente novamente.
- Não inclua uma seção intitulada “Validação” na descrição de pull requests.
- Cada alteração concluída deve ser registrada em um commit e enviada com `git push` para a branch de trabalho atual.

## Páginas de preview no GitHub Pages

- Um único deploy contém a release de `main` em `/` e uma página por branch remota não principal em `/previews/<nome-da-branch>/`. O índice comparativo é `/previews/`.
- Todo push fora de `main` executa `.github/workflows/feature-branch-check.yml`. Após a conclusão da validação (bem-sucedida ou não), `workflow_run` dispara `.github/workflows/pages.yml`, definido em `main`; ele compila `main` e todas as branches remotas e publica os resultados juntos. Se um build individual falhar, a galeria deve mostrar uma página de estado para essa branch e publicar as demais.
- Pushes em `main` recompilam a publicação completa. A exclusão de uma branch também reconstrói o site para remover sua página de preview.
- Preserve `fetch-depth: 0` na descoberta das refs remotas e mantenha o nome do workflow de validação consistente entre `feature-branch-check.yml` e `pages.yml`.
- A validação de branch deve manter apenas `contents: read`, `persist-credentials: false` e não pode fazer deploy. A publicação com `pages: write` e `id-token: write` fica no job `deploy` do workflow confiável de `main`.
- O helper `scripts/resolve-preview-branches.mjs` descobre refs e cria a matriz; `scripts/create-preview-index.mjs` monta a página comparativa. Ao alterar qualquer um, mantenha caminhos de branch seguros para diretório e URL e atualize o índice.
- Para verificar localmente o comportamento da lista e do índice, rode `node scripts/resolve-preview-branches.mjs` e `npm run build`. O workflow real só executa depois que as mudanças forem enviadas ao GitHub e Pages estiver configurado como **GitHub Actions**.
