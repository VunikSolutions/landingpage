-- Migration: Habilitar inserções anônimas na tabela leads
-- Este arquivo deve ser executado no Supabase SQL Editor

-- 1. Habilitar Row Level Security na tabela leads (se ainda não estiver habilitado)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Criar política que permite inserções anônimas (INSERT)
-- Esta política permite que qualquer usuário anônimo insira novos leads
CREATE POLICY "Permitir inserção de leads para usuários anônimos"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- 3. (Opcional) Criar política que permite leitura para usuários autenticados
-- Se você quiser que apenas usuários autenticados vejam os leads:
-- CREATE POLICY "Permitir leitura de leads para usuários autenticados"
-- ON leads
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- 4. (Opcional) Se você quiser que usuários autenticados também possam inserir:
-- CREATE POLICY "Permitir inserção de leads para usuários autenticados"
-- ON leads
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- Nota: A política acima permite inserções anônimas, que é necessário para
-- o formulário público funcionar. Se você quiser mais segurança, pode:
-- - Adicionar validações adicionais na política
-- - Usar rate limiting no Supabase
-- - Adicionar validação server-side nas Edge Functions
