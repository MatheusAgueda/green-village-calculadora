// routes.js — transportRoutes data for Green Village app
window.__GV_ROUTES = {
  portugal: {
    label: "Portugal", flag: "🇵🇹", vatRate: 0.23,
    routes: {
      uk: [
        { from: "Purfleet", to: "Leixões", cost: 3625, type: "RO-RO" },
        { from: "Killingholme", to: "Leixões", cost: 3975, type: "RO-RO" },
        { from: "Portbury", to: "Setúbal", cost: 5950, type: "RO-RO" },
        { from: "Felixstowe", to: "Leixões", cost: 6780, type: "Flat Rack" }
      ],
      netherlands: [{ from: "Rotterdam", to: "Leixões", cost: 2400, type: "RO-RO" }],
      france: [{ from: "França", to: "Portugal", cost: 6000, type: "Camião" }],
      portugal: [
        { from: "Leixões", to: "Caniçal (Madeira)", cost: 2960, type: "Flat Rack", note: "⚠️ ILHAS: Preço varia conforme tamanho da casa. Valor ref. casa grande (11,58×3,66×3,50m / 5t) em transporte convencional." },
        { from: "Leixões", to: "Caniçal (Madeira)", cost: 5550, type: "Breakbulk", note: "⚠️ ILHAS: Preço varia conforme tamanho da casa." },
        { from: "Leixões", to: "Porto Santo", cost: 3790, type: "Flat Rack", note: "⚠️ ILHAS: Preço varia conforme tamanho da casa. Valor ref. casa grande (11,58×3,66×3,50m / 5t)." },
        { from: "Leixões", to: "Porto Santo", cost: 6945, type: "Breakbulk", note: "⚠️ ILHAS: Preço varia conforme tamanho da casa." },
        { from: "Leixões", to: "Ponta Delgada (Açores)", cost: 5985, type: "Flat Rack", note: "⚠️ ILHAS: Preço ref. casa grande (11,58×3,68×3,50m / 5t) em transporte CONVENCIONAL. Inclui despesas portuárias e BL. Varia conforme tamanho." },
        { from: "Leixões", to: "Ponta Delgada (Açores)", cost: 8162, type: "Breakbulk", note: "⚠️ ILHAS: Preço varia conforme tamanho da casa." },
        { from: "Leixões", to: "Ilha do Pico (Açores)", cost: 6650, type: "Flat Rack", note: "⚠️ ILHAS: Preço varia conforme tamanho da casa." }
      ],
      china: [
        { from: "Shanghai", to: "Leixões", cost: 23244, type: "Flat Rack" },
        { from: "Shanghai", to: "Leixões", cost: 2655, type: "Container 20'" },
        { from: "Shanghai", to: "Leixões", cost: 3528, type: "Container 40'" }
      ]
    }
  },
  spain: {
    label: "Espanha", flag: "🇪🇸", vatRate: 0.21,
    routes: {
      uk: [
        { from: "Purfleet", to: "Santander", cost: 4950, type: "RO-RO" },
        { from: "Felixstowe", to: "Algeciras", cost: 5980, type: "Flat Rack" },
        { from: "Felixstowe", to: "Valencia", cost: 9650, type: "Flat Rack" },
        { from: "Portbury", to: "Vigo", cost: 11050, type: "RO-RO" },
        { from: "Portbury", to: "Vigo", cost: 11300, type: "RO-RO" },
        { from: "Southampton", to: "Valencia", cost: 11950, type: "RO-RO" },
        { from: "Southampton", to: "Santander", cost: 12950, type: "RO-RO" },
        { from: "Portbury", to: "Sagunto", cost: 16570, type: "RO-RO" }
      ],
      netherlands: [
        { from: "Rotterdam", to: "Valencia", cost: 3500, type: "RO-RO" },
        { from: "Rotterdam", to: "Santander", cost: 3200, type: "RO-RO" }
      ],
      france: [
        { from: "Calais", to: "Santander", cost: 2800, type: "RO-RO" },
        { from: "Marseille", to: "Valencia", cost: 2500, type: "RO-RO" }
      ],
      portugal: [
        { from: "Leixões", to: "Las Palmas (Canárias)", cost: 6200, type: "Flat Rack" }
      ]
    }
  },
  france: {
    label: "França", flag: "🇫🇷", vatRate: 0.20,
    routes: {
      uk: [
        { from: "Purfleet", to: "Calais", cost: 2950, type: "RO-RO" },
        { from: "Tilbury", to: "Le Havre", cost: 3250, type: "RO-RO" },
        { from: "Southampton", to: "Le Havre", cost: 3750, type: "RO-RO" }
      ],
      france: [
        { from: "Calais", to: "Le Havre", cost: 2500, type: "Camião" },
        { from: "Le Havre", to: "Marseille", cost: 3500, type: "Camião" }
      ]
    }
  },
  italy: { label: "Itália", flag: "🇮🇹", vatRate: 0.22, routes: { uk: [
    { from: "Southampton", to: "Salerno", cost: 11950, type: "RO-RO" },
    { from: "Portbury", to: "Livorno", cost: 16010, type: "RO-RO" },
    { from: "Portbury", to: "Livorno", cost: 16520, type: "RO-RO" }
  ]}},
  greece: { label: "Grécia", flag: "🇬🇷", vatRate: 0.24, routes: { uk: [
    { from: "Southampton", to: "Pireu", cost: 14900, type: "RO-RO" },
    { from: "Portbury", to: "Pireu", cost: 18300, type: "RO-RO" },
    { from: "Portbury", to: "Pireu", cost: 19100, type: "RO-RO" },
    { from: "Southampton", to: "Thessaloniki", cost: 14500, type: "RO-RO" }
  ]}},
  malta: { label: "Malta", flag: "🇲🇹", vatRate: 0.18, routes: { uk: [
    { from: "Southampton", to: "Malta Free Port", cost: 4560, type: "Flat Rack" },
    { from: "Southampton", to: "La Valleta", cost: 11200, type: "RO-RO" }
  ]}},
  "netherlands-dest": { label: "Holanda", flag: "🇳🇱", vatRate: 0.21, routes: {
    uk: [
      { from: "Purfleet", to: "Rotterdam", cost: 1325, type: "RO-RO" },
      { from: "Killingholme", to: "Rotterdam", cost: 1675, type: "RO-RO" }
    ],
    france: [{ from: "Calais", to: "Rotterdam", cost: 2800, type: "Camião" }]
  }},
  poland: { label: "Polónia", flag: "🇵🇱", vatRate: 0.23, routes: {
    uk: [
      { from: "Felixstowe", to: "Gdańsk", cost: 6950, type: "Flat Rack" },
      { from: "Purfleet", to: "Gdańsk", cost: 9900, type: "RO-RO" },
      { from: "Southampton", to: "Gdynia", cost: 11950, type: "RO-RO" }
    ],
    belgium: [
      { from: "Antwerp", to: "Gdynia", cost: 5895, type: "RO-RO", note: "Dims: 12×4×4m / 5t por unidade" }
    ],
    netherlands: [
      { from: "Rotterdam", to: "Szczecin", cost: 3800, type: "RO-RO" },
      { from: "Rotterdam", to: "Gdańsk", cost: 9667, type: "Camião", note: "Transporte por camião — 12×4×4m / 5t" }
    ],
    france: [{ from: "Calais", to: "Gdańsk", cost: 5200, type: "RO-RO" }]
  }},
  croatia: { label: "Croácia", flag: "🇭🇷", vatRate: 0.25, routes: { uk: [
    { from: "Felixstowe", to: "Rijeka", cost: 7150, type: "Flat Rack" },
    { from: "Southampton", to: "Rijeka", cost: 11950, type: "RO-RO" },
    { from: "Southampton", to: "Split", cost: 12950, type: "RO-RO" }
  ]}},
  bulgaria: { label: "Bulgária", flag: "🇧🇬", vatRate: 0.20, routes: {
    netherlands: [
      { from: "Rotterdam", to: "Sófia", cost: 17167, type: "Camião", note: "Transporte por camião — 12×4×4m / 5t" }
    ]
  }},
  brazil: {
    label: "Brasil", flag: "🇧🇷", vatRate: 0,
    importTax1: 0.126, importTax2: 0.021, importTax3: 0.0965, fobRate: 0.10,
    routes: {
      uk: [
        { from: "Felixstowe", to: "Santos", cost: 5850, type: "Flat Rack", note: "Medidas: 11,58×3,66×3,50m. Inclui desp. portuárias, BL e despacho exportação" },
        { from: "London Gateway", to: "Santos", cost: 13500, type: "Flat Rack" },
        { from: "Tilbury", to: "Santos", cost: 25200, type: "RO-RO" },
        { from: "Tilbury", to: "Vitória", cost: 25200, type: "RO-RO" },
        { from: "Tilbury", to: "Rio de Janeiro", cost: 25200, type: "RO-RO" }
      ],
      netherlands: [
        { from: "Rotterdam", to: "Santos", cost: 5450, type: "Flat Rack", note: "Medidas: 11,58×3,66×3,50m. Inclui desp. portuárias, BL e despacho exportação" },
        { from: "Rotterdam", to: "Santos", cost: 25200, type: "RO-RO" },
        { from: "Rotterdam", to: "Vitória", cost: 25200, type: "RO-RO" },
        { from: "Rotterdam", to: "Rio de Janeiro", cost: 25200, type: "RO-RO" }
      ],
      portugal: [
        { from: "Leixões", to: "Santos", cost: 8850, type: "Flat Rack", note: "Medidas: 11,58×3,66×3,50m. Inclui desp. portuárias, BL e despacho exportação" }
      ],
      china: [
        { from: "Shanghai", to: "Santos", cost: 21000, type: "Flat Rack" },
        { from: "Shanghai", to: "Santos", cost: 2880, type: "Container 20HQ" },
        { from: "Shanghai", to: "Santos", cost: 5760, type: "Container 40HQ" }
      ]
    }
  },
  china: { label: "China", flag: "🇨🇳", vatRate: 0.23, vatExtra: 0.027, routes: { china: [
    { from: "Shanghai", to: "Leixões", cost: 23244, type: "Flat Rack" },
    { from: "Shanghai", to: "Leixões", cost: 2655, type: "Container 20'" },
    { from: "Shanghai", to: "Leixões", cost: 3528, type: "Container 40'" }
  ]}},
  usa: { label: "EUA", flag: "🇺🇸", vatRate: 0, routes: { uk: [
    { from: "Southampton", to: "New York, NY", cost: 29550, type: "RO-RO" },
    { from: "Southampton", to: "Brunswick, GA", cost: 29550, type: "RO-RO" },
    { from: "Southampton", to: "Galveston, TX", cost: 34370, type: "RO-RO" }
  ]}}
};
