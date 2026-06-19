# Produtos Originais Importados - Catálogo Digital Premium

Vitrine digital sofisticada para venda de **perfumes** e **eletrônicos** originais importados,
com reserva via **WhatsApp**. Visual premium (grafite + dourado), responsivo e com layout
otimizado para **exportar em PDF A4**.

---

## 🚀 Como usar (rápido)

1. **Dê dois cliques em `index.html`** - o catálogo abre no navegador.
2. Para colocar **suas fotos**, veja a seção abaixo.

> As imagens de demonstração (`_demo-*.svg`) já vêm prontas só para você ver o design.
> Pode apagá-las quando adicionar as fotos reais.

---

## 🖼️ Adicionando seus produtos

Os **nomes e preços já estão dentro das imagens** (como você pediu). O catálogo só exibe a foto.

1. Coloque os arquivos **`.jpg`** (ou `.png`/`.webp`) nas pastas de cada categoria:

   ```
   imagens/
   ├── perfumes-masculinos/     → aba "Perfumes Masculinos"
   ├── perfumes-femininos/      → aba "Perfumes Femininos"
   ├── eletronicos/             → aba "Eletrônicos"
   └── promocoes/               → aba "Promoções"
   ```

2. **Dê dois cliques em `atualizar-catalogo.bat`** (regenera a lista de produtos).
3. Abra/atualize o `index.html`. Pronto - as fotos novas aparecem. ✅

### Dica sobre o nome do arquivo
O nome do arquivo vira o **termo de busca** do produto (não aparece na tela - só serve para a
busca encontrar). Ex.: `sauvage-dior.jpg` → encontrável digitando "sauvage".
Use nomes descritivos, separando por hífen.

---

## ✨ Recursos

- **Capa premium** com título, subtítulo e botões *Ver Produtos* / *Reservar no WhatsApp*.
- **Menu fixo** + **menu mobile** (Início, Perfumes Masculinos, Perfumes Femininos, Eletrônicos, Promoções).
- **Busca instantânea** pelo nome do produto.
- **Filtros dinâmicos** por categoria (sem recarregar a página).
- **Grade responsiva:** 4 colunas (desktop) · 3 (tablet) · 2 (celular).
- **Lazy loading** das imagens + animações suaves de entrada e hover.
- Botão **"Reservar"** em cada produto → abre o WhatsApp com o nome do produto.
- **Botão flutuante** do WhatsApp em todas as telas.
- **Rolagem suave** entre seções + voltar ao topo.
- **SEO básico** (title, description, Open Graph, dados estruturados).

---

## 🖨️ Exportar em PDF (A4)

1. Abra o `index.html` no navegador (Chrome/Edge recomendados).
2. Pressione **Ctrl + P**.
3. Em *Destino*, escolha **"Salvar como PDF"**.
4. Tamanho do papel: **A4**. Ative **"Gráficos de plano de fundo"** para manter o visual.

O layout de impressão já é otimizado: esconde menus/botões e organiza as fotos por categoria.

---

## 📱 WhatsApp

Todos os botões apontam para **+55 31 99995-2023**
(`https://wa.me/5531999952023`). Para trocar o número, edite a constante `WHATSAPP`
no início de [`assets/app.js`](assets/app.js).

---

## 📂 Estrutura do projeto

```
Fotos Catalogo/
├── index.html              ← a vitrine (abra este)
├── assets/
│   ├── styles.css          ← visual premium (cores, layout, responsivo, PDF)
│   └── app.js              ← busca, filtros, lazy load, WhatsApp
├── imagens/                ← SUAS FOTOS aqui (por categoria)
│   ├── perfumes-masculinos/
│   ├── perfumes-femininos/
│   ├── eletronicos/
│   └── promocoes/
├── produtos.js             ← lista gerada automaticamente (não edite)
├── gerar-catalogo.js       ← gerador (escaneia as pastas)
├── atualizar-catalogo.bat  ← clique aqui após adicionar fotos
└── README.md
```

---

## 🎨 Personalização rápida

| O que mudar              | Onde                                                        |
|--------------------------|-------------------------------------------------------------|
| Número do WhatsApp       | `WHATSAPP` em `assets/app.js`                               |
| Cores (dourado/fundo)    | `:root { --gold / --bg ... }` em `assets/styles.css`        |
| Textos da capa           | seção `<section class="hero">` em `index.html`             |
| Nome das categorias      | `CATEGORIAS` em `gerar-catalogo.js` (e rode o `.bat`)       |

---

Feito com cuidado para transmitir **exclusividade, confiança e qualidade**. 🥂
