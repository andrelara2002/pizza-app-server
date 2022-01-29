# Pizza app server
Servidor para o aplicativo demo de pizza que estou desenvolvendo.
----------------------------------------------------------------

Olá, estou desenvolvendo esse servidor para testar minhas habilidades em Node Js, criando uma conexão com um MongoDB. Através dessa api é possível realizar autenticações, requisições e alterações nos dados que estão no banco de dados. Foram aplicados conceitos de token também.

Entre os módulos utilizados estão:
- Nodemon
- Express
- Mongoose
- Cors
- Body parser
- Json Web Token

Em breve estarei publicando o front end da aplicação, que ainda estou decidindo se será em flutter ou react native

#Versão 0.1
- Estrutura base do projeto
- Configuração e conexão com o banco de dados
- Divisão da estrutura de rotas em: User, Pizza, Esfirra, Order
- Primeiras rotas e estrutura de Busca de itens por "id" e "nome"

#Versão 0.2 (Atual)
- Adição de tokens para realizar as autenticações
- Exigindo tokens de usuários para realizar atividades de cadastro e gerenciamento
- Codificando "id de usuário", junto com "nível de acesso" para não ser necessário a busca no banco para autenticar usuário
- Implementando níveis de acesso para funções de gerenciamento da aplicação
- Definindo níveis de acesso para: 1) Usuário comum, 2) Funcionários e suporte, 3) Administradores do sistema
- Corrigindo rotas "GET" que recebiam requests para "POST", assim, todas as funções get não precisam enviar parâmetros
- Criando função para decodificar os dados do token de usuário
- Correção de bugs para recarregar token e verificação de token
- Criação de arquivo "settings" para guardar as configurações gerais do servidor
