## Fica em Casa

Um app feito para quem
precisa de ajuda ou quer ajudar
seus vizinhos que fazem parte
do grupo de risco da Covid-19.


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

<h3>Rodar o servidor</h3>
Para rodar o servidor do backend agora basta entrar pelo terminal ou abrir o terminal do vscode na pasta do repositorio e rodar o comando:

```sh
  yarn dev
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
