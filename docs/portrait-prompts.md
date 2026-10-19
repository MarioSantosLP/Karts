# Recortes dos pilotos

Fonte: fotografia IMG_4655.jpeg fornecida pelo utilizador. Ferramenta: image_gen incorporada, modo de edição, fundo transparente.

Os recortes são usados nos cartões e perfis. A foto carregada localmente por um utilizador tem prioridade; remover essa substituição repõe o recorte original.

## nuno-duarte

Ficheiro: `public/portraits/nuno-duarte.png`

Prompt final:

```text
Use case: background-extraction. Asset type: transparent photographic cutout for the person's driver profile and website card. Input image is the EDIT TARGET, not a style reference. Extract ONLY the LEFT man, Nuno, with dark swept-back hair and beard, black long-sleeved top, beige trousers and second-place trophy. Remove the other two people and the entire backdrop, signage, logos/watermark overlays and surrounding scene. Preserve this person's exact real face, expression, hair, body, original photographic texture, clothing, pose, hands, trophy and held belongings. Do not redraw, stylize, beautify, change facial features, invent visible body below the source photograph or add text. Crop to the visible head-through-hips portion available in the original photograph, with a little clear padding above the hair and at both sides; keep all hair and both elbows/hands. Horizontally center the isolated person, upright, on a genuine transparent alpha background. Accurate clean edges around hair and clothing, no halos and no rectangular image background. Produce just this one person as one transparent PNG portrait.
```

## tomas-duarte

Ficheiro: `public/portraits/tomas-duarte.png`

Prompt final:

```text
Use case: background-extraction. Asset type: transparent photographic cutout for the person's driver profile and website card. Input image is the EDIT TARGET, not a style reference. Extract ONLY the CENTER man, Tomás, smiling with brown tousled hair, blue and lime racing suit, first-place trophy, bottle in left side of image and helmet at his lower right. Remove the other two people and the entire backdrop, signage, logos/watermark overlays and surrounding scene. Preserve this person's exact real face, expression, hair, body, original photographic texture, clothing, pose, hands, trophy and held belongings. Do not redraw, stylize, beautify, change facial features, invent visible body below the source photograph or add text. Crop to the visible head-through-hips portion available in the original photograph, with a little clear padding above the hair and at both sides; keep all hair and both elbows/hands. Horizontally center the isolated person, upright, on a genuine transparent alpha background. Accurate clean edges around hair and clothing, no halos and no rectangular image background. Produce just this one person as one transparent PNG portrait.
```

## tiago-cardoso — camisola LOUD e dois troféus

Ficheiro: `public/portraits/tiago-cardoso-cutout.png`

Fonte conservada: `public/portraits/tiago-cardoso.png`.
Ferramenta: `image_gen` integrada, com `transparent_background: true`.
Transparência RGBA confirmada; o ficheiro original não foi substituído.

Prompt final:

```text
Use case: background-extraction. Edit target: the supplied photograph. Remove the entire photographic background and the partial person at the far left. Keep ONLY the central person, with his own head, ears, neck, black and green LOUD jersey, necklace, both arms, both hands and BOTH large golden trophies he is holding. Preserve his exact facial expression, identity, proportions, pose, clothing text/logos, and trophy details. Do not redesign, stylize, retouch or invent any anatomy or objects. Preserve the original photo pixels as closely as possible. Keep the complete two trophies visible including their bases at the bottom as far as visible in the source. Tight clean cutout with small transparent margin, centered composition, genuine transparent alpha background including the gaps between arms, trophies and head. No added shadow, no halo, no checkerboard baked in, no added text.
```

