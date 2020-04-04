## Fica em Casa

O Fica em Casa foi criado para as pessoas ajudarem umas as outras em questões de necessidades básicas em meio ao caos causado pela pandemia do COVID-19.

No Fica em Casa o usuário pode cadastrar o que está precisando em casa, como por exemplo arroz, carne, feijao, etc. Após o cadastro de suas necessidades, usuários o app num raio de 10km poderão ver a necessidade do seu vizinho, desta maneira a ajuda vem de alguém próximo.


## Rodando o backend localmente

<h3>Node e NPM</h3>
Instalar NVM (Node Version Manager)
https://github.com/nvm-sh/nvm
Atentar para instalação do NVM e setar as variáveis de ambiente.

Instalar o node LTS via NVM
Verificar no site do node qual é a versão LTS atual.
https://nodejs.org/en/download/
Instalar o node através do NVM

```sh
  nvm install "versaoLTSDoNode"
```
Setar essa versão como padrão no sistema

```sh
  nvm alias default "versaoLTDSDoNode"
```

<h3>Yarn</h3>
Instalar o yarn. Escolher a versão correta do SO
https://classic.yarnpkg.com/en/docs/install#debian-stable

<h3>Instalar dependências do projeto</h3>
Entrar na pasta desejada (backend, web, mobile) e rodar o comando pelo terminal:

```sh
  yarn
```

## Estilizador de código
Atráves do VSCode, procurar a extensão ESLint e Instalar.</p>
Após isso, abrir as settings do VSCode "CTRL + Shift + P" settings JSON e adicionar os settings abaixo:

```sh
  "[javascript]": {
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
    }
  },

  "[javascriptreact]": {
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
    }
  },

  "emmet.syntaxProfiles": {
    "javascript": "jsx",
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
  },
```
Instalar o EditorConfig através das extensões do VSCode
