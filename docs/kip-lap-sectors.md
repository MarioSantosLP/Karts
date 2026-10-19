# Setores por volta — KIP, 17 de outubro de 2026

Transcrição das seis capturas enviadas pelo utilizador no chat “Ver chat paleta karts”.
As capturas originais estão guardadas em `docs/sources/kip-2026-10-17/`.

| Piloto | Sessão | Voltas | Captura |
| --- | --- | --- | --- |
| Tomás Duarte | Classificação | 7 | image(6).png |
| Tomás Duarte | Corrida | 16 | image(5).png |
| Tiago Cardoso | Classificação | 6 | image(8).png |
| Tiago Cardoso | Corrida | 16 | image(7).png |
| Mário Santos | Classificação | 6 | image(20261018-150045).png |
| Mário Santos | Corrida | 15 | image(10).png |

Os 66 conjuntos S1/S2/S3 foram conferidos contra os tempos totais já existentes,
com precisão de um milésimo de segundo. Os setores da melhor volta também
coincidem com os da tabela geral. Os tempos, posições e totais de voltas mantêm-se.

`lapSectors[i]` contém os três setores, em segundos, da volta `lapTimes[i]`.
Só os perfis com estes dados apresentam setores por volta; os restantes mantêm
os seus tempos totais e os setores disponíveis na tabela geral.

A fotografia do Tiago em `public/portraits/tiago-cardoso.png` conserva o ficheiro
original “LOUD Origens 2026 jersey reveal.png”, enviado pelo utilizador. O perfil
e o cartão usam agora `public/portraits/tiago-cardoso-cutout.png`, com fundo
transparente, mantendo o piloto com os dois troféus. O prompt está documentado
em `docs/portrait-prompts.md`.

Os setores por volta começam recolhidos e só abrem ao selecionar essa volta.
Conforme a indicação do utilizador, a velocidade da corrida é identificada como
“Velocidade média da corrida” e a da classificação como “Velocidade máxima alcançada”.
Os valores de velocidade já existentes mantêm-se.
