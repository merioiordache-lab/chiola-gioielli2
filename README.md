# 16 Santiago Store

Sito e-commerce statico per **16 Santiago Store**: catalogo prodotti, carrello,
checkout con dati di spedizione e scelta del metodo di pagamento (PayPal,
bonifico bancario, contrassegno). Gli ordini arrivano al negozio via
**WhatsApp** (con riepilogo precompilato) o via email.

Non richiede build né backend: si pubblica così com'è su Netlify (o qualsiasi
hosting statico).

## Struttura

```
index.html            Home: hero, catalogo, chi siamo, pagamenti, contatti
checkout.html         Carrello, dati spedizione, pagamento, conferma ordine
assets/css/style.css  Stile del sito
assets/js/products.js Catalogo prodotti (nomi, prezzi, taglie, foto)
assets/js/store.js    Logica carrello/checkout + CONFIGURAZIONE NEGOZIO
assets/img/           Foto dei prodotti
```

## ⚙️ Configurazione (IMPORTANTE)

Apri `assets/js/store.js` e modifica il blocco `STORE_CONFIG` in cima al file
con i tuoi dati reali:

| Campo | Cosa inserire |
|---|---|
| `whatsappNumber` | Il tuo numero WhatsApp in formato internazionale senza `+` (es. `393331234567`) |
| `orderEmail` | L'email dove vuoi ricevere gli ordini |
| `paypalLink` | Il tuo link PayPal.Me (crealo gratis su [paypal.me](https://paypal.me)) |
| `bank.iban` / `bank.intestatario` | I dati per il bonifico |
| `shippingCost`, `freeShippingOver`, `codFee` | Costi di spedizione e contrassegno |

Finché non li aggiorni, il sito usa dei segnaposto (numero `390000000000`, IBAN
di esempio, ecc.).

## 🛍️ Gestire i prodotti

Apri `assets/js/products.js`: ogni prodotto è un oggetto con nome, prezzo,
taglie, descrizione e immagine. Per aggiungere un prodotto:

1. Metti la foto in `assets/img/`
2. Copia un blocco prodotto esistente e modifica i campi

## 🚀 Pubblicazione

Il repository è già collegato a Netlify: ogni push su `main` pubblica il sito.
In alternativa trascina la cartella su [app.netlify.com/drop](https://app.netlify.com/drop).

## 💡 Evoluzioni possibili

- **Pagamenti carta integrati**: con [Stripe Payment Links](https://stripe.com/payments/payment-links)
  puoi creare un link di pagamento per prodotto e sostituirlo al flusso PayPal.Me.
- **Snipcart / Shopify Buy Button**: per un carrello con pagamento carta
  direttamente sul sito serve un account su uno di questi servizi (richiedono
  chiavi API personali).
