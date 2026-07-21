// ============================================================
// 16 SANTIAGO STORE — Catalogo prodotti
// Aggiungi, modifica o rimuovi prodotti qui.
// Le immagini vanno messe in assets/img/
// ============================================================

const PRODUCTS = [
  {
    id: "set-black",
    name: "Completo Total Black",
    category: "Completi",
    price: 39.9,
    oldPrice: 49.9,
    img: "assets/img/set-black.jpeg",
    badge: "Best seller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Completo T-shirt oversize + shorts in cotone pesante. Vestibilità comoda, colore nero pieno che non stinge. Il classico che non sbaglia mai.",
  },
  {
    id: "set-sand",
    name: "Completo Oversize Sand",
    category: "Completi",
    price: 44.9,
    oldPrice: null,
    img: "assets/img/set-sand.jpeg",
    badge: "Nuovo arrivo",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Completo oversize color sabbia: T-shirt drop-shoulder e shorts coordinati. Tessuto morbido e traspirante, perfetto per l'estate.",
  },
  {
    id: "set-urban",
    name: "Outfit Urban Beige & Grey",
    category: "Outfit",
    price: 42.9,
    oldPrice: null,
    img: "assets/img/set-urban.jpeg",
    badge: null,
    sizes: ["S", "M", "L", "XL"],
    description:
      "T-shirt beige in cotone leggero abbinata a shorts grigio antracite con coulisse a contrasto. Look pulito da città, comodo tutto il giorno.",
  },
  {
    id: "set-riviera",
    name: "Completo Riviera Salvia",
    category: "Completi",
    price: 49.9,
    oldPrice: 59.9,
    img: "assets/img/set-riviera.jpeg",
    badge: "Edizione limitata",
    sizes: ["M", "L", "XL"],
    description:
      "Camicia bowling a maniche corte + shorts coordinati color salvia. Tessuto fresco effetto lino: l'outfit giusto per le serate estive.",
  },
];
