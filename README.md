# 🏠 Green Village — Dashboard de Importação (v8.5)

Calculadora de importação e transporte de casas pré-fabricadas (mobile homes) da Green Village Mobile Homes. Aplicação **100% client-side em um único ficheiro** (`index.html`) — sem build, sem servidor, sem dependências instaladas.

---

## ✨ Funcionalidades

A aplicação tem 4 abas:

### 🌍 Internacional
Cálculo completo de importação por país de destino (Portugal, Espanha, França, Itália, Grécia, Malta, Holanda, Polónia, Croácia, Bulgária, Açores, Brasil, EUA):
- **Non-EU → UE** (UK/China): CIF → direitos aduaneiros (HS 8716.10.98, 2,7% MFN) → IVA aduaneiro (dedutível) → despacho, porto, demurrage → margem → IVA venda
- **UE → UE**: aquisição intracomunitária (reverse charge, IVA net 0)
- **→ Brasil**: II + IPI + PIS + COFINS + ICMS (gross-up) + AFRMM + SISCOMEX, com tarifa preferencial **Mercosul-UE** (NCM 9406.90.20 Cat. 10, cortes anuais 2026–2036)
- Tiers de margem automáticos: Low Budget (≤5k€), Médio (5–20k€), Luxo (>20k€)
- Copiar resultado e exportar PDF

### ⚙️ Configurações
- Taxas de câmbio (manuais ou via API AwesomeAPI, com margem de segurança cambial)
- Custos de transporte, alfândega, seguro, demurrage, direitos por origem
- Editor completo de rotas por país/origem (adicionar/remover países, origens e rotas)
- Persistência em `localStorage` + exportar/importar JSON

### 🚢 Rotas Marítimas
Mapa interativo (Leaflet) com todas as rotas da calculadora:
- Traçados que seguem corredores marítimos reais (Canal da Mancha, Biscaia, Gibraltar, Suez) e corredores rodoviários reais
- Navios animados, filtros por destino/origem/tipo, painel de detalhes e analytics

### 🏭 Catálogo Chinês
95 produtos (Conrayn + Glamni) com preços EXW verificados:
- PVP calculado para Portugal (CIF + direitos + ops + margem + IVA 23%) e Brasil (todos os impostos de importação)
- Configurador Manju 5.8m e upgrades da Folding House
- Tabelas de referência de frete e isolamento, directório conrayn.net

---

## 🚀 Como usar

Basta abrir o `index.html` num navegador moderno (duplo clique) — ou servir estaticamente:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

> Nota: Tailwind, Leaflet, html2canvas e jsPDF são carregados via CDN — a estética e o mapa precisam de internet; os cálculos funcionam offline.

---

## 📂 Estrutura

```
index.html          ← Toda a aplicação (HTML + CSS + JS)
images/             ← Fotos dos produtos do catálogo
service-worker.js   ← SW auto-destrutivo (limpa caches de versões antigas)
.github/workflows/
  └─ sync-to-project-green.yml  ← Sincroniza p/ project-green a cada push no main
```

---

## 🔄 Deploy

- **GitHub Pages:** https://matheusagueda.github.io/green-village-calculadora/
- Push no `main` dispara o workflow que copia `index.html`, `service-worker.js` e `images/` para `project-green/apps/site/public/calculadora`.

```bash
git add .
git commit -m "Descrição das alterações"
git push origin main
```

---

## 📝 Notas

- Margens e comissões dos tiers estão **bloqueadas** no código (decisão de negócio 2026-05-01).
- Configurações do utilizador ficam guardadas no navegador (`localStorage`, chave `gv_dashboard_v8_5`).
- Preços de rotas verificados em 2026-04-30 (faturas Across, cotações UECC/Savino/Conrayn).

**Autor:** Green Village Mobile Homes · **Licença:** MIT
