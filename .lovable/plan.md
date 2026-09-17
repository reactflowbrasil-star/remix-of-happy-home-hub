# Viraliza — plataforma de cenas com IA por assinatura

Transformar o site atual de venda de cursos em uma plataforma de assinatura onde o cliente envia a foto do produto, escolhe uma pessoa da galeria (masculina ou feminina) e a IA gera cenas verticais 9x16 prontas para virar vídeo.

## O que o cliente vai ver

1. **Página inicial** — nova proposta: "transforme a foto do seu produto em cenas com pessoas reais". Mantém o visual escuro com laranja, títulos de impacto e a grade estilo bento.
2. **Planos** — três planos (Starter, Pro, Studio) com quantidade mensal de gerações. Por enquanto sem cobrança: o cliente escolhe o plano e recebe os créditos correspondentes; a cobrança real entra depois.
3. **Criar conta / entrar** — e-mail e senha, mais entrada com Google.
4. **Estúdio (área logada)** — o fluxo principal:
   - enviar a foto do produto
   - escolher a pessoa na galeria (filtro masculino / feminino)
   - escolher o ambiente da cena (ex.: rua, casa, academia, café) e quantas cenas gerar
   - gerar: aparecem as cenas em 9x16
   - em cada cena: baixar, gerar de novo ou **transformar em vídeo curto** (consome mais créditos)
5. **Minhas gerações** — histórico com produto, pessoa usada, cenas e vídeos, tudo rebaixável.
6. **Galeria de pessoas** — modelos criados por IA, variados em gênero, idade e tipo físico, com foto de referência de corpo inteiro.

## Regras de crédito

- 1 cena gerada = 1 crédito. 1 vídeo curto = 5 créditos.
- Créditos ficam guardados na conta e são renovados ao trocar de plano.
- Sem créditos, o botão de gerar avisa e leva para os planos.

## Detalhes técnicos

- **Banco (Lovable Cloud)**: `profiles`, `plans`, `subscriptions` (plano ativo + créditos restantes + reset mensal), `models` (galeria), `projects` (upload do produto), `scenes` (imagem 9x16, prompt, status), `videos`. RLS por usuário em tudo; galeria com leitura pública. GRANT em todas as tabelas novas.
- **Armazenamento**: buckets `products` (privado, por usuário), `scenes` (privado), `gallery` (público).
- **Geração de imagem**: server function que chama o Lovable AI Gateway com o modelo de imagem padrão, passando a foto do produto + a foto da pessoa escolhida como referências, em proporção 9:16. Roda por cena, grava o resultado no storage e a linha em `scenes`.
- **Vídeo**: server function que usa o modelo de vídeo do gateway a partir da cena escolhida como primeiro quadro, saída vertical de poucos segundos. Processo assíncrono com status (`queued` / `processing` / `done`) e atualização na tela.
- **Créditos**: debitados no servidor, dentro da mesma função que gera, nunca no navegador.
- **Rotas**: `/` (vendas), `/precos`, `/auth`, `/_authenticated/estudio`, `/_authenticated/galeria`, `/_authenticated/minhas-cenas`.
- **Galeria inicial**: ~12 modelos gerados por IA (6 masculinos, 6 femininos), salvos no projeto e semeados na migração.

## O que sai do site

O conteúdo de venda de cursos (cursos, preços de curso, método, depoimentos de alunos) é substituído pelo novo posicionamento. Depoimentos e números seguem como texto de exemplo até você me passar os reais.
