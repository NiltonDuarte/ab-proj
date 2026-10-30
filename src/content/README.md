# Conteúdo do site

A página é compilada como site estático. Os JSON abaixo são importados pelo Vite durante o build; não há banco de dados nem escrita de conteúdo pelo navegador. Edite os arquivos, valide e publique uma nova versão do site.

- `site.json`: marca, hero, apresentação, comunidade, frase e rodapé.
- `experiences.json`: cards de experiências e respectivos caminhos de imagem.
- `features/routes.json`: lugares para correr (`id`, `name`, `city`, `type`, `distance`, `notes`).
- `features/breakfasts.json`: cafés e brunches (`id`, `name`, `city`, `category`, `priceRange`, `notes`).
- `features/home-workouts.json`: treinos (`id`, `name`, `duration`, `level`, `equipment`, `description`, `steps`).
- `features/challenges.json`: desafios (`id`, `name`, `duration`, `goal`, `description`).
- `features/nutrition.json`: conteúdo educativo (`id`, `name`, `type`, `description`).
- `features/partnerships.json`: parceiros confirmados (`id`, `name`, `category`, `website`, `offer`).
- `features/coupons.json`: ofertas confirmadas (`id`, `partner`, `code`, `discount`, `expires`, `terms`).

## CLI

```sh
npm run content -- list
npm run content -- validate
npm run content -- show routes
npm run content -- add routes --id parque-da-cidade --name "Parque da Cidade" --city "Brasília" --type parque --distance "percurso de 5 km" --notes "Dica de acesso e horário"
npm run content -- edit routes parque-da-cidade --field notes --value "Nova dica confirmada"
npm run content -- remove routes parque-da-cidade
```

Para adicionar etapas de treino, passe `--steps "etapa 1|etapa 2|etapa 3"`. Os campos de cada coleção são obrigatórios e a CLI valida IDs duplicados. Mantenha as recomendações locais associadas à cidade correta; não publique ofertas, cupons ou parcerias antes da confirmação.

Depois de atualizar conteúdo, rode `npm run content -- validate` e `npm run build`. O GitHub Actions publica o diretório `dist` no GitHub Pages quando há push para `main`.

Para ativar o workflow, abra **Settings → Pages** neste repositório e escolha **GitHub Actions** como origem de publicação. O workflow publica o artifact combinado em pushes para `main` e após a validação de pushes em qualquer branch diferente de `main`.

## Previews de branches

O workflow monta um único artifact para Pages: `main` fica na raiz e cada outra branch remota ganha uma versão em `/previews/<branch>/`. O índice comparativo fica em `/previews/`.

A cada push em qualquer branch que não seja `main`, o workflow de validação compila a branch sem permissões de publicação. Quando termina, o workflow confiável definido em `main` busca todas as branches remotas, compila cada uma, combina os builds com a release e publica o site. Se um build falhar, a galeria mostra uma página de estado para essa branch e publica as demais prévias. Se uma branch for removida, o workflow reconstrói a galeria sem ela. Pushes em `main` também regeneram a publicação completa.

Os nomes das branches são preservados no caminho. Por exemplo, `feature/nova-home` fica em `/previews/feature/nova-home/`. Configure **Settings → Pages → GitHub Actions** para ativar a publicação. Para mudanças no processo, consulte as instruções em `AGENTS.md` na raiz.
