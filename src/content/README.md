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

Para ativar o workflow, abra **Settings → Pages** neste repositório e escolha **GitHub Actions** como origem de publicação. O workflow publica o artifact combinado em pushes para `main` e após a validação de pushes em branches selecionadas.

## Previews de feature branches

O workflow monta uma publicação combinada em um único artifact: `main` fica na raiz e branches selecionadas ficam em `previews/<branch-com-barras-trocadas-por-hífens>/`. O índice comparativo fica em `/previews/`. Configure as branches em `.github/preview-branches.json` (ex.: `feature/nova-home`) para que pushes nelas atualizem a galeria; a URL será `/previews/feature-nova-home/`; ou informe uma lista separada por vírgulas ao executar manualmente **Build and publish Corre, Mana** na branch `main` (a lista manual vale só para aquela execução).

Um push para uma branch `feature/**` valida e compila essa branch sem permissão de publicação. Após a validação, um workflow confiável definido em `main` recompila `main` e as branches selecionadas e publica o artifact combinado. Assim a prévia não substitui o conteúdo da release na raiz.
