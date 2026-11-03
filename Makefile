.PHONY: install build test

# Instala exatamente as versões registradas no package-lock.json.
install:
	npm ci

# Compila o TypeScript e gera a versão estática em dist/.
build:
	npm run build

# O projeto não tem suite de testes automatizados; valida os dados editáveis.
test:
	npm run content -- validate
