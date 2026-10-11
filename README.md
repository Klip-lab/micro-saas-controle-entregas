# Micro-SaaS de Controle de Entregas

Aplicação para pequenas equipes acompanharem entregas, destinatários, prazos e status. A interface exige autenticação por código de e-mail e organiza os registros por organização.

## Stack

- React 19, Vite 7 e TypeScript
- Supabase Auth para OTP por e-mail
- PostgreSQL com RLS para autorização de dados por organização
- Vitest para testes unitários

## Configuração

Defina no ambiente de desenvolvimento e no projeto de hospedagem:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use somente a chave pública/anon no frontend. Nunca inclua `service_role` ou segredo de banco em variáveis `VITE_*`.

Configure o Supabase Auth para permitir o endereço do app como URL de redirecionamento. A opção de criação de usuários por OTP precisa estar habilitada conforme a política de acesso do projeto.

## Banco de dados

Aplique a migration em `supabase/migrations` em um ambiente de desenvolvimento/isolado antes de publicar. Ela cria organizações, membros e entregas, policies RLS e a função transacional `create_workspace`. Não aplique diretamente em produção sem revisar o schema existente e testar a migration no ambiente isolado.

## Segurança

- O usuário só lê suas associações de organização.
- A autorização final ocorre no PostgreSQL por RLS; filtros do frontend não são a fronteira de segurança.
- Inserção de entrega exige membro da organização e `created_by = auth.uid()`.
- A criação de workspace é feita por função `SECURITY DEFINER` com `search_path` fixo; a função associa somente o usuário autenticado que a chamou.
- O frontend nunca recebe uma chave privilegiada.
- A UI oculta dados de outras organizações, mas as policies são a proteção real contra acesso cruzado.

## Verificação

Execute `npm install`, `npm run check`, `npm test` e `npm run build`. Para provar isolamento de ponta a ponta, configure um projeto Supabase isolado e teste com dois usuários em organizações diferentes: leitura, inserção, atualização e exclusão cruzadas devem ser negadas pelo banco. A execução desses testes contra um Supabase real ainda é necessária antes da publicação.
