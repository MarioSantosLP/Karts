# Karts · Apex Crew

Site React/Vite com landing page, circuito animado, resultados e perfis individuais dos pilotos.

```sh
npm install
npm run dev
```

Validação: `npm run build` e `npm run lint`.

## Pilotos

- A grelha está em `#pilotos`; cada piloto tem uma ligação própria, por exemplo `#piloto/mario`.
- Nomes, números e cores: `src/data/drivers.js`.
- Os resultados atuais são dados de exemplo em `src/data/season.js`. `driverSessions`, em `drivers.js`, lista as sessões usadas nos perfis. Os totais individuais são calculados a partir dessas sessões, separadamente dos totais gerais da temporada.
- Cada perfil permite adicionar, substituir e remover uma foto JPG, PNG ou WebP até 8 MB. A imagem é otimizada e guardada no armazenamento local do navegador; também aparece no cartão da grelha.
- As fotos ainda não são partilhadas entre navegadores ou dispositivos. Para isso será necessário ligar o carregamento de imagens a armazenamento persistente no servidor. Limpar os dados do site remove as fotos locais.
- Até serem adicionadas as fotos reais, os perfis apresentam um capacete ilustrado.
