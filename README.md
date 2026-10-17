# Karts · Apex Crew

Site React/Vite com landing page, circuito animado, resultados e perfis individuais dos pilotos.

```sh
npm install
npm run dev
```

Validação: `npm run build` e `npm run lint`.

## Resultados de Palmela · 17/10/2026

- Duas sessões separadas: Sessão 2 / Classificação às 08:15 e Race 3 / Corrida às 08:25.
- Os dados estão em `src/data/sessions/kip-2026-10-17.js`: posições, karts, melhores voltas, voltas individuais, setores da tabela geral e velocidade indicada. Tempos armazenados em segundos, apresentados como `m:ss.SSS`.
- A página principal apresenta apenas o resumo e os resultados gerais. As voltas individuais, os setores e as velocidades ficam exclusivamente no perfil de cada piloto, nos detalhes da classificação e da corrida.
- A corrida preserva a posição oficial de chegada; a comparação de ritmo usa a melhor volta. O intervalo da corrida é para o anterior, conforme o PDF, e a diferença da classificação é para o líder.
- Os totais são calculados a partir das sessões registadas: 2 sessões, 199 voltas, 10 pilotos e 1 circuito. Os perfis somam as voltas efetivamente realizadas por cada piloto.
- Fonte: `tempos_karts_17-10-2026_para_confirmacao.pdf`. As páginas 4–5 trocam as linhas de voltas de Guilherme/Nicolas e Carolina/Juan. As associações foram corrigidas pela fotografia original `IMG_6608.png`, que identifica os karts 34, 21, 4 e 36 ao lado de cada sequência. As melhores voltas e o número de voltas coincidem com a tabela geral após a correção.
- Nicolas Mendes, volta 4 da classificação: `1:24.734`, conforme a correção do utilizador no PDF.
- Setores e velocidades são os valores da tabela geral, não telemetria de todas as voltas. A média de tempo por volta inclui todas as voltas registadas.

## Pilotos

- Nuno Duarte e Tomás Duarte usam recortes transparentes partilhados em `public/portraits/`, centrados nos cartões e perfis. Os prompts e a origem estão documentados em `docs/portrait-prompts.md`. Uma foto carregada neste navegador substitui temporariamente o recorte; ao remover a substituição, volta a foto do projeto.

- A grelha está em `#pilotos`; cada piloto tem uma ligação própria, por exemplo `#piloto/mario-santos`.
- Nomes, números pessoais e cores: `src/data/drivers.js`. A associação aos resultados usa `driverId`, independente do kart utilizado em cada sessão. Tomás mantém o número pessoal 13 (kart 15 nesta sessão), e Nuno mantém 44 (kart 22).
- A grelha mantém pesquisa, ordenação e paginação de seis pilotos por página. Os perfis mostram o histórico separado por sessão e permitem expandir todas as voltas e setores.
- Cada perfil permite adicionar, substituir e remover uma foto JPG, PNG ou WebP até 8 MB. A imagem é otimizada e guardada no armazenamento local do navegador; também aparece no cartão da grelha.
- As fotos carregadas pelo utilizador ainda não são partilhadas entre navegadores ou dispositivos. Para isso será necessário ligar o carregamento de imagens a armazenamento persistente no servidor. Limpar os dados do site remove as fotos locais.
- Os pilotos sem foto do projeto ou substituição local apresentam um capacete ilustrado.
