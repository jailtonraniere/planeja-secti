# Planeja SECTI — Oficina 2025–2028

MVP local-first em React/TypeScript. Funciona sem credenciais, salva automaticamente no navegador e inclui identificação simples, portfólio, fluxo guiado, validações, painel, CSV e ficha para impressão/PDF.

## Executar

```powershell
npm.cmd install
npm.cmd run dev
```

Testes e build: `npm.cmd test` e `npm.cmd run build`.

## Importar as bases oficiais

Coloque as duas planilhas no projeto e execute:

```powershell
npm.cmd run import -- "Planejamento SECTI.xlsx" "TABELA INDICADORES SECTI.xlsx"
```

O arquivo `src/generated/imported.json` mantém cada linha original (`raw`), a versão apenas para exibição (`normalized`), arquivo, aba e número da linha. Nenhum vazio é preenchido. A importação oficial atual contém 269 linhas: 64 da visão resumida, 55 da base principal e 150 indicadores. Após consolidação case-insensitive e exclusões expressas, o portfólio possui 92 projetos únicos.

## Supabase opcional

1. Crie um projeto e habilite anonymous sign-ins em Authentication.
2. Execute `supabase/migrations/202608130001_initial.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e informe URL e publishable key. Nunca use `service_role` no frontend.
4. A migração ativa RLS em todas as tabelas expostas e restringe escritas ao autor autenticado.

O frontend atual mantém o modo de demonstração local. A adaptação do repositório de persistência para Realtime deve ser feita após a criação do projeto Supabase e definição de quais facilitadores terão autorização global; essa permissão não foi presumida.

## Uso na oficina

1. Participante informa nome e executiva.
2. Escolhe ou cria projeto e preenche as quatro etapas; rascunhos incompletos são aceitos.
3. Na revisão, corrige pendências e marca “Pronto para validação”.
4. Facilitador acompanha o painel, filtra status, abre fichas, imprime e exporta CSV.

## Divergências registradas

- CNH Recife: duas áreas conflitantes.
- Bora Impactar: enquadramento a validar.
- Viva + Cidadania / Viva Mais Cidadania Digital: possível relação, sem fusão.
- E-SUAS / Sistema E-SUAS / SUAS Digital: nomes possivelmente relacionados, sem fusão.
- SUAS Fácil: projeto próprio ou iniciativa do SUAS Digital.

Voucher 99 não foi incluído no portfólio estratégico.

## Limitações conhecidas

- Vídeo, transcrição e documento “DEMANDAS PARA O CLICKUP” não foram disponibilizados.
- XLSX de consolidação e sincronização multiusuário dependem da conexão Supabase; CSV e impressão/PDF estão funcionais no modo local.
- Algumas classificações divergem entre a base principal, a visão resumida e os diagramas; o sistema preserva a classificação importada e sinaliza os casos conhecidos para decisão.
