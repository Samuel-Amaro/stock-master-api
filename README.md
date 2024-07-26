# Projeto de Estudo de Back-End API: StockMaster(Mestre de estoque)

Este projeto visa principal o aprendizado e a construção de uma API RESTful para gerenciamento de entrada e saída de estoque de produtos com controle de acesso, utilizando tecnologias modernas no desenvolvimento back-end. A API permitirá realizar operações CRUD (Criar, Ler, Atualizar, Deletar) para gerenciar produtos, categorias, fornecedores, usuários, movimentações no estoque.

## Instalar e rodar o projeto

Rodar o projeto em sua máquina local é uma tarefa extremamente simples.

### Dependências globais

Você precisa ter duas principais dependências instaladas:

-   Bun runtime v1.1.10 (ou qualquer versão superior)
-   Docker Engine v26.1.3 com Docker Compose v2.27.0 (ou qualquer versão superior)

### Dependências locais

Com o repositório clonado e as dependências globais instaladas, você pode instalar as dependências locais do projeto:

```sh
 bun install
```

### Rodar o projeto

Para rodar o projeto localmente, basta executar o comando abaixo:

```sh
 bun dev
```

Isto irá automaticamente rodar serviços como Banco de dados (incluindo as Migrations), Servidor desenvolvimento seguinte endereço:

```sh
 http://localhost:3000/
 http://localhost:3000/api/v1/*
```

Após este passo executar a semente para preencher o banco de dados com dados falsos.

```sh
 bun seed
```

### Documentação API (Swagger)

para acessar a documentação da API, vá para:

```sh
 http://localhost:3000/api/v1/docs
```

## Autenticação

Para utilizar a API, será necessária uma autenticação, para se autenticar acesse o seguinte endpoint:

```sh
 http://localhost:3000/api/v1/authenticate
```

fornecendo o seguinte json no body da request:

```json
{
  "email": "scottmichael@hotmail.com",
  "password": "A1b@2c3d"
}
```

após ser retornado um token, você o utilizará para realizar cada request na api informando um header

```js
  Authorization: Bearer <token>
```

A autenticação será implementada para proteger os endpoints da API, garantindo que apenas usuários autorizados possam acessar e modificar os dados, o token tem duração de 1 dia.

## Paginação

Os endpoints que recuperam informações possuem paginação simples usando **limit/offset**, via `params search` com os parâmetros.

```js
?page=1&pageSize=5&order=asc
```

## Funcionalidades da API

A API será projetada para suportar as seguintes operações:

- Autenticação

  - [x] **Login**: Autenticação via JWT (JSON Web Token).
  - [x] **Sign-out**: desconectar.

- Usuários (Somente Administradores têm acesso)

  - [x] **Registrar**: Registrar um novo usuário.
  - [x] **Obter Todos**: Recuperar informações de todos os usuários criados por um usuário administrador (autenticado).
  - [x] **Detalhes**: Recuperar informações do usuário autenticado.
  - [x] **Atualizar**: Atualizar o usuário autenticado, após modificação de email ou senha, fazer login novamente.
  - [x] **Deletar**: Excluir o usuário autenticado.
  - [x] **Deletar lote**: deletar um lote de usuários criados por um usuário administrador.
  - [x] **Recuperação de Senha**: Mecanismo para recuperação de senha via e-mail.

- Categorias

  - [x] **Registrar**: Registrar uma nova categoria (somente administradores)
  - [x] **Obter todos**: Recuperar informações de todas as categorias
  - [x] **Detalhes**: Recuperar informações de uma categoria
  - [x] **Atualizar**: Modificar informações de uma categoria (somente administradores)
  - [x] **Deletar**: Deletar categoria (somente administradores)

- Fornecedores

  - [x] **Registrar**: Registrar um novo fornecedor (somente administradores)
  - [x] **Obter todos**: Recuperar informações de todos os fornecedores
  - [x] **Detalhes**: Recuperar informações de um fornecedor
  - [x] **Atualizar**: Modificar informações de um fornecedor (somente administradores)
  - [x] **Deletar**: Deletar categoria (somente administradores)

-   Produtos

  - [x] **Registrar**: Registrar um novo produto, e uma movimentação no estoque (somente administradores)
  - [x] **Obter todos**: Recuperar informações de todos os produtos
  - [x] **Detalhes**: Recuperar informações de um produto
  - [x] **Obter todos**: recuperar informações de todos os produtos de um fornecedor específico.
  - [x] **Obter todos**: Recuperar informações de todos os produtos de uma categoria especifica
  - [x] **Atualizar**: Modificar informações de um produto específico (somente administradores)
  - [x] **Atualizar Lote**: Modificar informações de um lote de produtos (somente administradores)
  - [X] **Deletar**: Deletar um produto (somente administradores)
  - [X] **Deletar lote**: Deletar um lote de produtos (somente administradores)

- Movimentações De Estoque

  - [x] **Registrar**: Registrar uma movimentação no estoque (somente administradores)
  - [x] **Detalhes**: Recuperar informações de uma movimentação especifica
  - [x] **Obter Todos**: Recuperar todas as movimentações realizadas no estoque.
  - [x] **Detalhes**: Recuperar quantidade movimentada de produto específico em um tipo de movimentação (entrada/saída)
  - [x] **Obter todos**: recuperar a quantidade movimentada de todos os produtos em um tipo de movimentação (entrada/saída).
  - [x] **Obter todos**: Recuperar informações sobre quantidade de produtos em estoque

## Estrutura

Em termos de estrutura, baseamo-nos na documentação do **Elysia** e suas recomendações, fizemos uma mesclagem da estrutura de arquivos recomendada para **Elysia** se você não preferir estritamente uma convenção específica, com o padrão MVC, por exemplo, e um MVC adaptado para o **Elysia**

### Estrutura de arquivos recomendada para Elysia

-   src - Qualquer arquivo associado ao desenvolvimento do servidor Elysia.
  - index.ts – Ponto de entrada para seu servidor Elysia, local ideal para configurar plugin global.
  - setup.ts - Composto por vários plugins para serem usados ​​como Localizador de Serviços.
  - controllers - Instâncias que encapsulam vários endpoints.
  - libs - Funções úteis
  - models - Data Type Objects (DTOs) para instância Elysia
  - types - tipo TypeScript compartilhado, se necessário.
-   test - Arquivo de teste para servidor Elysia

### Elysia Com padrão MVC

Como foi dito, Elysia é uma estrutura agnóstica de padrões e é apenas um guia de recomendação para lidar com Elysia com MVC.

-   **src** - Qualquer arquivo associado ao desenvolvimento do servidor Elysia.
  - **index.ts** – Ponto de entrada para seu servidor Elysia, local ideal para configurar plugin global.
  - **controllers** - Instâncias que encapsulam vários endpoints.
  - **services** - Serviço é um conjunto de funções utilitárias/auxiliares para cada módulo, no nosso caso, instância de Elysia. Qualquer lógica que possa ser desacoplada do controlador pode estar ativa em um Service.
  - **models** - Data Type Objects (DTOs) para a instância Elysia, recomendamos usar o modelo de referência Elysia ou criar um objeto, ou classe de DTOs para cada módulo.
  - **types** - tipo TypeScript compartilhado, se necessário.
  - **database** - Irá conter a lógica para criar uma conexão com o banco de dados, um script de migração e as definições do esquema, e um scrip de seed.
  - **scripts** / **Utils.ts** - scripts úteis, opcionalmente para uma lógica ainda mais granular relacionada a um recurso.