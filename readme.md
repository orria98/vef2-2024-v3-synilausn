# Vefforritun 2, 2024, verkefni 3: boltadeildar™️ vefþjónustur

[Kynning í fyrirlestri](https://youtu.be/laL6P4hCnfQ).

Verkefnið er framhald af verkefnum 1 og 2 og snýst um að útbúa vefþjónustur ofan á gögnin.

## Markmið

Markmið verkefnisins:

- Búa til og hanna vefþjónustu.
- Framkvæma _CRUD_ aðgerðir gegnum vefþjónustlag með staðfestingu og hreinsun gagna.
- Nota TypeScript.
- Setja upp token auðkenningu fyrir vefþjónustur.

### Vefþjónustur

Útbúa skal vefþjónustur fyrir Boltadeildina, þ.e.a.s. þjónusta sem notar HTTP og JSON til að skila gögnum fyrir lið og leiki. Viðeigandi slóð og HTTP svör eru gefin fyrir lið en útfæra þarf fyrir leiki. Gera skal vefþjónustur eins _restful_ og hægt er (sjá námsefni).

Fyrir aðrar slóðir skal skila `404`. Ef villa kemur upp skal almennt skila `500`.

**Ekki** þarf að útfæra framenda, það verður gert með React í verkefni 4.

Lið:

- `GET /teams` skilar lista af liðum:
  - `200 OK` skilað með gögnum á JSON formi.
- `GET /teams/:slug` skilar stöku liði:
  - `200 OK` skilað með gögnum ef lið er til.
  - `404 Not Found` skilað ef lið er ekki til.
- `POST /teams` býr til nýtt lið:
  - `200 OK` skilað ásamt upplýsingum um lið.
  - `400 Bad Request` skilað ef gögn sem send inn eru ekki rétt (vantar gögn, gögn á röngu formi eða innihald þeirra ólöglegt).
- `PATCH /teams/:slug` uppfærir lið:
  - `200 OK` skilað með uppfærðu liði ef gekk.
  - `400 Bad Request` skilað ef gögn sem send inn eru ekki rétt.
  - `404 Not Found` skilað ef lið er ekki til.
  - `500 Internal Error` skilað ef villa kom upp.
- `DELETE /teams/:slug` eyðir liði:
  - `204 No Content` skilað ef gekk.
  - `404 Not Found` skilað ef lið er ekki til.
  - `500 Internal Error` skilað ef villa kom upp.

Skilgreina þarf (líkt og fyrir deildir) vefþjónustur til að geta:

- Skoðað leiki.
- Búa til leiki.
- Breyta leik.
- Uppfæra leik.

### Gögn og gagnagrunnur

Fyrir gögn skal staðfesta (_validation_) og hreinsa (_sanitization_) þau samkvæmt lýsingu. Ef gögn eru send inn sem standast ekki staðfestingu skal skila viðeigandi HTTP villu ásamt þeim villum sem komu upp, t.d. ef skilgreina þarf `date` og `away` en hvorugt er sent þarf að senda svar um að _bæði_ vantar (þ.e.a.s. ekki ætti að þurfa að senda gögn, fá eina villu, laga hana og senda uppfært og fá þá nýja villu sem var til staðar í fyrstu sendingu.)

Nota skal gögn sambærileg þeim úr verkefni 1 og 2, og eru í `data/` möppunni og skulu þau sett upp í gagnagrunn.

Útbúa þarf skema fyrir gögn í gagnagrunni út frá gögnum, endurnýta má skema úr verkefni 2.

Um gögnin gildir:

- Gögn sem vista skal fyrir lið:
  - `name`, nafn liðs, t.d. `Ósigrandi skotfólkið`, lágmarkslengd 3 stafir, hámarkslengd 128 stafir.
  - `slug`, nafn liðs í lágstöfum, með `-` í stað bila og með aðeins enskum stöfum og tölum, t.d. `osigrandi-skotfolkid`, búið til sjálfkrafa
  - `description`, lýsing á lið, má vera tómt, hámarkslengd 1024 stafir.
- Þar sem leikur er líkt og áður en með þessum reitum og reglum:
  - `date`, dagsetning leiks, ekki í framtíðinni, ekki meira en tvo mánuði aftur í tímann.
  - `home`, heimalið, verður að vera til.
  - `away`, útilið, verður að vera til, má ekki vera sama lið og heimalið.
  - `home_score`, heimaliðs stig, heiltala, ekki neikvæð, ekki 100 eða stærri.
  - `away_score`, útiliðs stig, heiltala, ekki neikvæð, ekki 100 eða stærri.

### TypeScript

Gefinn er grunnur sem notar `ts-node` til að keyra verkefnið sem TypeScript. Skilgreina skal týpur þar sem við á og ekki nota `any` (stillt sérstaklega í `tsconfig.json` og skal ekki breyta).

### Tæki, tól og test

Setja þarf upp `eslint` og `jest` eins og í fyrri verkefnum. Setja skal `eslint` upp þ.a. það [sé með TypeScript stuðning](https://typescript-eslint.io/getting-started). Ekki ættu að vera neinar `eslint` villur og öll test ættu að keyra.

Setja skal upp a.m.k. fimm test sem prófa vefþjónustur _keyrandi_, sjá [dæmi í verkefni 3 frá 2022](https://github.com/vefforritun/vef2-2022-v3-synilausn/tree/main/src/test/integration) og í [sýnilausn að hópverkefni 1 frá 2021](https://github.com/vefforritun/vef2-2021-h1-synilausn/tree/main/src/tests).

Aðeins skal nota ECMAScript modules (ESM) og ekki CommonJS.

Leyfilegt er að nota ORM (t.d. [Prisma](https://www.prisma.io/)) við lausn á verkefninu.

## Gefinn grunnur

Það sem er gefið er grunnur sem keyrir nodemon í dev og notar `ts-node` í keyrslu, þetta er ólíkt því sem gert var í verkefni 2.

Búið er að keyra:

```bash
npm init -y
npm install --save ts-node express
npm install --save-dev nodemon @types/express
```

og:

- Búa til `nodemon.json` sem keyrir `ts-node` sem `loader`.
- Setja inn `dev` og `start` script í `package.json`.

## GitHub og hýsing

Setja skal upp vefinn á Render, Railway eða Heroku (ath að uppsetning á Heroku mun kosta) tengt við GitHub með postgres settu upp.

## Mat

- 40% Vefþjónustur útfærðar.
- 20% Gagnagrunnur og gögn.
- 20% TypeScript notað.
- 20% Tæki, tól og test, verkefni sett upp í hýsingu.

## Sett fyrir

Verkefni sett fyrir í fyrirlestri miðvikudaginn 14. febrúar 2024.

## Skil

Skila skal í Canvas í seinasta lagi fyrir lok dags fimmtudaginn 7. mars 2024.

Skil skulu innihalda:

- Slóð á verkefni keyrandi í hýsingu.
- Slóð á GitHub repo fyrir verkefni. Dæmatímakennurum skal hafa verið boðið í repo. Notendanöfn þeirra eru:
  - `osk`
  - `polarparsnip`
  - `sturla-freyr`

## Einkunn

Leyfilegt er að ræða, og vinna saman að verkefni en **skrifið ykkar eigin lausn**. Ef tvær eða fleiri lausnir eru mjög líkar þarf að færa rök fyrir því, annars munu allir hlutaðeigandi hugsanlega fá 0 fyrir verkefnið.

Ef stórt mállíkan (LLM, „gervigreind“, t.d. ChatGTP) er notað til að skrifa part af lausn skal taka það fram. [Sjá nánar á upplýsingasíða um gervigreind hjá HÍ](https://gervigreind.hi.is/).

Sett verða fyrir ([sjá nánar í kynningu á áfanga](https://github.com/vefforritun/vef2-2024/blob/main/namsefni/01.kynning/1.kynning.md)):

- fimm minni sem gilda 10% hvert, samtals 50% af lokaeinkunn.
- tvö hópverkefni þar sem hvort um sig gildir 20%, samtals 40% af lokaeinkunn.
- einstaklingsverkefni sem gildir 10–20% af lokaeinkunn.

---

> Útgáfa 0.1

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Fyrsta útgáfa |
