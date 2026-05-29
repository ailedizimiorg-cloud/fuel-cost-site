#!/usr/bin/env python3
"""Add new SEO translation keys to all 25 languages in i18n.ts - proper version using regex"""

import re

with open('lib/i18n.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define new keys for each language (just the keys, no trailing comma needed)
# Format: dict[lang] = {
#   "breadcrumb_home": "...",
#   "faq_title": "...",
#   ...
# }

data = {}

data['en'] = {
    'breadcrumb_home': 'Home',
    'faq_title': 'Frequently Asked Questions',
    'faq_q1': 'What is the most affordable fuel type in {city}?',
    'faq_a1': 'Based on current prices, the cheapest option varies. Check our price comparison table for the best deal in {city}.',
    'faq_q2': 'Which fuel produces the least CO\u2082 emissions?',
    'faq_a2': 'Electric vehicles produce the lowest emissions, followed by hybrid and LPG options.',
    'faq_q3': 'How often are fuel prices updated?',
    'faq_a3': 'Prices are updated daily using our automated multi-source pipeline.',
    'relatedCities': 'Related Cities',
    'seo_homeTitle': 'FuelCost.info - Compare Gasoline, Diesel, LPG & EV Prices Across 48,000+ Cities',
    'seo_homeDescription': 'Compare fuel prices across 48,000+ cities worldwide. Get real-time gasoline, diesel, LPG and electric vehicle charging costs. Plan your route and save money on fuel.',
    'fuelGuideLabel': 'Fuel Type Guide',
    'aboutFuelTypes': 'About Fuel Types',
    'readMore': 'Read more about fuel prices',
}

data['tr'] = {
    'breadcrumb_home': 'Ana Sayfa',
    'faq_title': 'S\u0131k\u00e7a Sorulan Sorular',
    'faq_q1': '{city} \u015fehrinde en uygun fiyatl\u0131 yak\u0131t t\u00fcr\u00fc hangisidir?',
    'faq_a1': 'G\u00fcncel fiyatlara g\u00f6re en ucuz se\u00e7enek de\u011fi\u015fiklik g\u00f6sterir. {city} \u015fehrindeki en iyi f\u0131rsat i\u00e7in fiyat kar\u015f\u0131la\u015ft\u0131rma tablomuza g\u00f6z at\u0131n.',
    'faq_q2': 'Hangi yak\u0131t en az CO\u2082 sal\u0131n\u0131m\u0131 \u00fcretir?',
    'faq_a2': 'Elektrikli ara\u00e7lar en d\u00fc\u015f\u00fck emisyonu \u00fcretir, ard\u0131ndan hibrit ve LPG se\u00e7enekleri gelir.',
    'faq_q3': 'Akaryak\u0131t fiyatlar\u0131 ne s\u0131kl\u0131kla g\u00fcncellenir?',
    'faq_a3': 'Fiyatlar, otomatik \u00e7ok kaynakl\u0131 veri ak\u0131\u015f\u0131m\u0131z kullan\u0131larak g\u00fcnl\u00fck olarak g\u00fcncellenir.',
    'relatedCities': '\u0130lgili \u015eehirler',
    'seo_homeTitle': 'FuelCost.info - 48.000\'den Fazla \u015eehirde Benzin, Motorin, LPG ve Elektrikli Ara\u00e7 Fiyatlar\u0131n\u0131 Kar\u015f\u0131la\u015ft\u0131r\u0131n',
    'seo_homeDescription': 'D\u00fcnya \u00e7ap\u0131nda 48.000\'den fazla \u015fehirde yak\u0131t fiyatlar\u0131n\u0131 kar\u015f\u0131la\u015ft\u0131r\u0131n. Ger\u00e7ek zamanl\u0131 benzin, motorin, LPG ve elektrikli ara\u00e7 \u015farj maliyetlerini \u00f6\u011frenin. Rotan\u0131z\u0131 planlay\u0131n ve yak\u0131ttan tasarruf edin.',
    'fuelGuideLabel': 'Yak\u0131t T\u00fcr\u00fc Rehberi',
    'aboutFuelTypes': 'Yak\u0131t T\u00fcrleri Hakk\u0131nda',
    'readMore': 'Akaryak\u0131t fiyatlar\u0131 hakk\u0131nda daha fazla bilgi',
}

data['de'] = {
    'breadcrumb_home': 'Startseite',
    'faq_title': 'H\u00e4ufig gestellte Fragen',
    'faq_q1': 'Was ist die g\u00fcnstigste Kraftstoffart in {city}?',
    'faq_a1': 'Basierend auf den aktuellen Preisen variiert die g\u00fcnstigste Option. Sehen Sie sich unsere Preisvergleichstabelle f\u00fcr das beste Angebot in {city} an.',
    'faq_q2': 'Welcher Kraftstoff verursacht die geringsten CO\u2082-Emissionen?',
    'faq_a2': 'Elektrofahrzeuge verursachen die geringsten Emissionen, gefolgt von Hybrid- und LPG-Optionen.',
    'faq_q3': 'Wie oft werden die Kraftstoffpreise aktualisiert?',
    'faq_a3': 'Die Preise werden t\u00e4glich \u00fcber unsere automatisierte Multi-Source-Pipeline aktualisiert.',
    'relatedCities': '\u00c4hnliche St\u00e4dte',
    'seo_homeTitle': 'FuelCost.info - Benzin-, Diesel-, LPG- und EV-Preise in \u00fcber 48.000 St\u00e4dten vergleichen',
    'seo_homeDescription': 'Vergleichen Sie Kraftstoffpreise in \u00fcber 48.000 St\u00e4dten weltweit. Erhalten Sie Echtzeit-Benzin-, Diesel-, LPG- und Stromkosten f\u00fcr Elektrofahrzeuge. Planen Sie Ihre Route und sparen Sie Geld.',
    'fuelGuideLabel': 'Kraftstoffarten-Guide',
    'aboutFuelTypes': '\u00dcber Kraftstoffarten',
    'readMore': 'Erfahren Sie mehr \u00fcber Kraftstoffpreise',
}

data['fr'] = {
    'breadcrumb_home': 'Accueil',
    'faq_title': 'Questions fr\u00e9quemment pos\u00e9es',
    'faq_q1': 'Quel est le type de carburant le plus abordable \u00e0 {city}?',
    'faq_a1': "Sur la base des prix actuels, l'option la moins ch\u00e8re varie. Consultez notre tableau comparatif des prix pour la meilleure offre \u00e0 {city}.",
    'faq_q2': "Quel carburant produit le moins d'\u00e9missions de CO\u2082?",
    'faq_a2': 'Les v\u00e9hicules \u00e9lectriques produisent les \u00e9missions les plus faibles, suivis par les options hybrides et GPL.',
    'faq_q3': '\u00c0 quelle fr\u00e9quence les prix du carburant sont-ils mis \u00e0 jour?',
    'faq_a3': 'Les prix sont mis \u00e0 jour quotidiennement via notre pipeline automatis\u00e9 multi-sources.',
    'relatedCities': 'Villes connexes',
    "seo_homeTitle": "FuelCost.info - Comparez les prix de l'essence, du diesel, du GPL et des VE dans plus de 48 000 villes",
    "seo_homeDescription": "Comparez les prix du carburant dans plus de 48 000 villes dans le monde. Obtenez les co\u00fbts en temps r\u00e9el de l'essence, du diesel, du GPL et de la recharge des v\u00e9hicules \u00e9lectriques. Planifiez votre itin\u00e9raire et \u00e9conomisez.",
    'fuelGuideLabel': 'Guide des types de carburant',
    'aboutFuelTypes': '\u00c0 propos des types de carburant',
    'readMore': 'En savoir plus sur les prix du carburant',
}

data['es'] = {
    'breadcrumb_home': 'Inicio',
    'faq_title': 'Preguntas frecuentes',
    'faq_q1': '\u00bfCu\u00e1l es el tipo de combustible m\u00e1s econ\u00f3mico en {city}?',
    'faq_a1': 'Seg\u00fan los precios actuales, la opci\u00f3n m\u00e1s barata var\u00eda. Consulte nuestra tabla comparativa de precios para encontrar la mejor oferta en {city}.',
    'faq_q2': '\u00bfQu\u00e9 combustible produce las menores emisiones de CO\u2082?',
    'faq_a2': 'Los veh\u00edculos el\u00e9ctricos producen las emisiones m\u00e1s bajas, seguidos por las opciones h\u00edbridas y de GLP.',
    'faq_q3': '\u00bfCon qu\u00e9 frecuencia se actualizan los precios del combustible?',
    'faq_a3': 'Los precios se actualizan diariamente mediante nuestro canal automatizado de m\u00faltiples fuentes.',
    'relatedCities': 'Ciudades relacionadas',
    'seo_homeTitle': 'FuelCost.info - Compara precios de gasolina, di\u00e9sel, GLP y VE en m\u00e1s de 48 000 ciudades',
    'seo_homeDescription': 'Compare precios de combustible en m\u00e1s de 48 000 ciudades de todo el mundo. Obtenga costos en tiempo real de gasolina, di\u00e9sel, GLP y carga de veh\u00edculos el\u00e9ctricos. Planifique su ruta y ahorre.',
    'fuelGuideLabel': 'Gu\u00eda de tipos de combustible',
    'aboutFuelTypes': 'Acerca de los tipos de combustible',
    'readMore': 'M\u00e1s informaci\u00f3n sobre los precios del combustible',
}

data['it'] = {
    'breadcrumb_home': 'Home',
    'faq_title': 'Domande frequenti',
    'faq_q1': "Qual \u00e8 il tipo di carburante pi\u00f9 conveniente a {city}?",
    'faq_a1': "In base ai prezzi attuali, l'opzione pi\u00f9 economica varia. Consulta la nostra tabella comparativa per l'offerta migliore a {city}.",
    'faq_q2': 'Quale carburante produce le minori emissioni di CO\u2082?',
    'faq_a2': 'I veicoli elettrici producono le emissioni pi\u00f9 basse, seguiti dalle opzioni ibride e GPL.',
    'faq_q3': 'Con quale frequenza vengono aggiornati i prezzi del carburante?',
    'faq_a3': 'I prezzi vengono aggiornati quotidianamente tramite la nostra pipeline automatizzata multi-fonte.',
    'relatedCities': 'Citt\u00e0 correlate',
    'seo_homeTitle': 'FuelCost.info - Confronta i prezzi di benzina, diesel, GPL e VE in oltre 48.000 citt\u00e0',
    'seo_homeDescription': 'Confronta i prezzi del carburante in oltre 48.000 citt\u00e0 in tutto il mondo. Ottieni costi in tempo reale per benzina, diesel, GPL e ricarica di veicoli elettrici. Pianifica il tuo percorso e risparmia.',
    'fuelGuideLabel': 'Guida ai tipi di carburante',
    'aboutFuelTypes': 'Informazioni sui tipi di carburante',
    'readMore': 'Scopri di pi\u00f9 sui prezzi del carburante',
}

data['pt'] = {
    'breadcrumb_home': 'In\u00edcio',
    'faq_title': 'Perguntas frequentes',
    'faq_q1': 'Qual \u00e9 o tipo de combust\u00edvel mais acess\u00edvel em {city}?',
    'faq_a1': 'Com base nos pre\u00e7os atuais, a op\u00e7\u00e3o mais barata varia. Consulte nossa tabela de compara\u00e7\u00e3o de pre\u00e7os para a melhor oferta em {city}.',
    'faq_q2': 'Qual combust\u00edvel produz menos emiss\u00f5es de CO\u2082?',
    'faq_a2': 'Os ve\u00edculos el\u00e9tricos produzem as menores emiss\u00f5es, seguidos pelas op\u00e7\u00f5es h\u00edbridas e GLP.',
    'faq_q3': 'Com que frequ\u00eancia os pre\u00e7os dos combust\u00edveis s\u00e3o atualizados?',
    'faq_a3': 'Os pre\u00e7os s\u00e3o atualizados diariamente usando nosso pipeline automatizado de m\u00faltiplas fontes.',
    'relatedCities': 'Cidades relacionadas',
    'seo_homeTitle': 'FuelCost.info - Compare pre\u00e7os de gasolina, diesel, GLP e VE em mais de 48.000 cidades',
    'seo_homeDescription': 'Compare pre\u00e7os de combust\u00edvel em mais de 48.000 cidades em todo o mundo. Obtenha custos em tempo real de gasolina, diesel, GLP e recarga de ve\u00edculos el\u00e9tricos. Planeje sua rota e economize.',
    'fuelGuideLabel': 'Guia de tipos de combust\u00edvel',
    'aboutFuelTypes': 'Sobre tipos de combust\u00edvel',
    'readMore': 'Saiba mais sobre pre\u00e7os de combust\u00edveis',
}

data['ru'] = {
    'breadcrumb_home': '\u0413\u043b\u0430\u0432\u043d\u0430\u044f',
    'faq_title': '\u0427\u0430\u0441\u0442\u043e \u0437\u0430\u0434\u0430\u0432\u0430\u0435\u043c\u044b\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b',
    'faq_q1': '\u041a\u0430\u043a\u043e\u0439 \u0442\u0438\u043f \u0442\u043e\u043f\u043b\u0438\u0432\u0430 \u0441\u0430\u043c\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0439 \u0432 {city}?',
    'faq_a1': '\u041e\u0441\u043d\u043e\u0432\u044b\u0432\u0430\u044f\u0441\u044c \u043d\u0430 \u0442\u0435\u043a\u0443\u0449\u0438\u0445 \u0446\u0435\u043d\u0430\u0445, \u0441\u0430\u043c\u044b\u0439 \u0434\u0435\u0448\u0435\u0432\u044b\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442 \u043c\u043e\u0436\u0435\u0442 \u043e\u0442\u043b\u0438\u0447\u0430\u0442\u044c\u0441\u044f. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043d\u0430\u0448\u0443 \u0442\u0430\u0431\u043b\u0438\u0446\u0443 \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0446\u0435\u043d \u0434\u043b\u044f \u043b\u0443\u0447\u0448\u0435\u0439 \u0446\u0435\u043d\u044b \u0432 {city}.',
    'faq_q2': '\u041a\u0430\u043a\u043e\u0435 \u0442\u043e\u043f\u043b\u0438\u0432\u043e \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442 \u043d\u0430\u0438\u043c\u0435\u043d\u044c\u0448\u0435\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0432\u044b\u0431\u0440\u043e\u0441\u043e\u0432 CO\u2082?',
    'faq_a2': '\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u0431\u0438\u043b\u0438 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u044f\u0442 \u043d\u0430\u0438\u043c\u0435\u043d\u044c\u0448\u0438\u0435 \u0432\u044b\u0431\u0440\u043e\u0441\u044b, \u0437\u0430 \u043d\u0438\u043c\u0438 \u0441\u043b\u0435\u0434\u0443\u044e\u0442 \u0433\u0438\u0431\u0440\u0438\u0434\u043d\u044b\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u0438 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u043d\u0430 LPG.',
    'faq_q3': '\u041a\u0430\u043a \u0447\u0430\u0441\u0442\u043e \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0446\u0435\u043d\u044b \u043d\u0430 \u0442\u043e\u043f\u043b\u0438\u0432\u043e?',
    'faq_a3': '\u0426\u0435\u043d\u044b \u043e\u0431\u043d\u043e\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u043e \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043d\u0430\u0448\u0435\u0433\u043e \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0433\u043e \u043c\u043d\u043e\u0433\u043e\u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432\u043e\u0433\u043e \u043a\u043e\u043d\u0432\u0435\u0439\u0435\u0440\u0430.',
    'relatedCities': '\u041f\u043e\u0445\u043e\u0436\u0438\u0435 \u0433\u043e\u0440\u043e\u0434\u0430',
    'seo_homeTitle': 'FuelCost.info - \u0421\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0439\u0442\u0435 \u0446\u0435\u043d\u044b \u043d\u0430 \u0431\u0435\u043d\u0437\u0438\u043d, \u0434\u0438\u0437\u0435\u043b\u044c, LPG \u0438 \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u0431\u0438\u043b\u0438 \u0432 \u0431\u043e\u043b\u0435\u0435 \u0447\u0435\u043c 48 000 \u0433\u043e\u0440\u043e\u0434\u0430\u0445',
    'seo_homeDescription': '\u0421\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0439\u0442\u0435 \u0446\u0435\u043d\u044b \u043d\u0430 \u0442\u043e\u043f\u043b\u0438\u0432\u043e \u0432 \u0431\u043e\u043b\u0435\u0435 \u0447\u0435\u043c 48 000 \u0433\u043e\u0440\u043e\u0434\u0430\u0445 \u043f\u043e \u0432\u0441\u0435\u043c\u0443 \u043c\u0438\u0440\u0443. \u0423\u0437\u043d\u0430\u0432\u0430\u0439\u0442\u0435 \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u0431\u0435\u043d\u0437\u0438\u043d\u0430, \u0434\u0438\u0437\u0435\u043b\u044f, LPG \u0438 \u0437\u0430\u0440\u044f\u0434\u043a\u0438 \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u0439 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u0432\u0440\u0435\u043c\u0435\u043d\u0438. \u041f\u043b\u0430\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0432\u043e\u0439 \u043c\u0430\u0440\u0448\u0440\u0443\u0442 \u0438 \u044d\u043a\u043e\u043d\u043e\u043c\u044c\u0442\u0435.',
    'fuelGuideLabel': '\u0420\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e \u043f\u043e \u0442\u0438\u043f\u0430\u043c \u0442\u043e\u043f\u043b\u0438\u0432\u0430',
    'aboutFuelTypes': '\u041e \u0442\u0438\u043f\u0430\u0445 \u0442\u043e\u043f\u043b\u0438\u0432\u0430',
    'readMore': '\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435 \u043e \u0446\u0435\u043d\u0430\u0445 \u043d\u0430 \u0442\u043e\u043f\u043b\u0438\u0432\u043e',
}

data['zh'] = {
    'breadcrumb_home': '\u9996\u9875',
    'faq_title': '\u5E38\u89C1\u95EE\u9898',
    'faq_q1': '\u5728{city}\uFF0C\u54EA\u79CD\u71C3\u6599\u7C7B\u578B\u6700\u4E3A\u7ECF\u6D4E\u5B9E\u60E0\uFF1F',
    'faq_a1': '\u6839\u636E\u5F53\u524D\u4EF7\u683C\uFF0C\u6700\u4FBF\u5B9C\u7684\u9009\u62E9\u56E0\u5730\u800C\u5F02\u3002\u8BF7\u67E5\u770B\u6211\u4EEC\u7684\u4EF7\u683C\u5BF9\u6BD4\u8868\uFF0C\u4E86\u89E3{city}\u7684\u6700\u4F73\u65B9\u6848\u3002',
    'faq_q2': '\u54EA\u79CD\u71C3\u6599\u4EA7\u751F\u7684CO\u2082\u6392\u653E\u6700\u5C11\uFF1F',
    'faq_a2': '\u7535\u52A8\u6C7D\u8F66\u4EA7\u751F\u7684\u6392\u653E\u6700\u4F4E\uFF0C\u5176\u6B21\u662F\u6DF7\u5408\u52A8\u529B\u548CLPG\u9009\u9879\u3002',
    'faq_q3': '\u71C3\u6599\u4EF7\u683C\u591A\u4E45\u66F4\u65B0\u4E00\u6B21\uFF1F',
    'faq_a3': '\u4EF7\u683C\u901A\u8FC7\u6211\u4EEC\u7684\u81EA\u52A8\u5316\u591A\u6E90\u7BA1\u9053\u6BCF\u65E5\u66F4\u65B0\u3002',
    'relatedCities': '\u76F8\u5173\u57CE\u5E02',
    'seo_homeTitle': 'FuelCost.info - \u6BD4\u8F83\u8D85\u8FC748,000\u4E2A\u57CE\u5E02\u7684\u6C7D\u6CB9\u3001\u67F4\u6CB9\u3001\u6DB2\u5316\u77F3\u6CB9\u6C14\u548C\u7535\u52A8\u6C7D\u8F66\u4EF7\u683C',
    'seo_homeDescription': '\u6BD4\u8F83\u5168\u7403\u8D85\u8FC748,000\u4E2A\u57CE\u5E02\u7684\u71C3\u6599\u4EF7\u683C\u3002\u83B7\u53D6\u5B9E\u65F6\u6C7D\u6CB9\u3001\u67F4\u6CB9\u3001\u6DB2\u5316\u77F3\u6CB9\u6C14\u548C\u7535\u52A8\u6C7D\u8F66\u5145\u7535\u6210\u672C\u3002\u89C4\u5212\u60A8\u7684\u8DEF\u7EBF\u5E76\u8282\u7701\u71C3\u6599\u8D39\u7528\u3002',
    'fuelGuideLabel': '\u71C3\u6599\u7C7B\u578B\u6307\u5357',
    'aboutFuelTypes': '\u5173\u4E8E\u71C3\u6599\u7C7B\u578B',
    'readMore': '\u4E86\u89E3\u66F4\u591A\u5173\u4E8E\u71C3\u6599\u4EF7\u683C\u7684\u4FE1\u606F',
}

data['ja'] = {
    'breadcrumb_home': '\u30DB\u30FC\u30E0',
    'faq_title': '\u3088\u304F\u3042\u308B\u8CEA\u554F',
    'faq_q1': '{city}\u3067\u6700\u3082\u8CB7\u3044\u5F97\u306A\u71C3\u6599\u30BF\u30A4\u30D7\u306F\u4F55\u3067\u3059\u304B\uFF1F',
    'faq_a1': '\u73FE\u5728\u306E\u4FA1\u683C\u306B\u57FA\u3065\u304D\u3001\u6700\u3082\u5B89\u3044\u9078\u629E\u80A2\u306F\u7570\u306A\u308A\u307E\u3059\u3002{city}\u306E\u6700\u9069\u306A\u30AA\u30D5\u30A1\u30FC\u3092\u898B\u3064\u3051\u308B\u306B\u306F\u3001\u3046\u3061\u306E\u4FA1\u683C\u6BD4\u8F03\u8868\u3092\u3054\u89A7\u304F\u3060\u3055\u3044\u3002',
    'faq_q2': '\u6700\u3082CO\u2082\u6392\u51FA\u91CF\u306E\u5C11\u306A\u3044\u71C3\u6599\u306F\u3069\u308C\u3067\u3059\u304B\uFF1F',
    'faq_a2': '\u96FB\u52D5\u81EA\u52D5\u8ECA\u306E\u6392\u51FA\u91CF\u304C\u6700\u3082\u4F4E\u304F\u3001\u305D\u306E\u5F8C\u306B\u30CF\u30A4\u30D6\u30EA\u30C3\u30C9\u3084LPG\u304C\u7D9A\u304D\u307E\u3059\u3002',
    'faq_q3': '\u71C3\u6599\u4FA1\u683C\u306F\u3069\u306E\u304F\u3089\u3044\u306E\u983B\u5EA6\u3067\u66F4\u65B0\u3055\u308C\u307E\u3059\u304B\uFF1F',
    'faq_a3': '\u4FA1\u683C\u306F\u81EA\u52D5\u5316\u3055\u308C\u305F\u30DE\u30EB\u30C1\u30BD\u30FC\u30B9\u30FB\u30D1\u30A4\u30D7\u30E9\u30A4\u30F3\u306B\u3088\u3063\u3066\u6BCE\u65E5\u66F4\u65B0\u3055\u308C\u307E\u3059\u3002',
    'relatedCities': '\u95A2\u9023\u3059\u308B\u90FD\u5E02',
    'seo_homeTitle': 'FuelCost.info - 48,000\u4EE5\u4E0A\u306E\u90FD\u5E02\u306E\u30AC\u30BD\u30EA\u30F3\u30FB\u8EFD\u6CB9\u30FBLPG\u30FBEV\u4FA1\u683C\u3092\u6BD4\u8F03',
    'seo_homeDescription': '\u4E16\u754C\u4E2D\u306E48,000\u4EE5\u4E0A\u306E\u90FD\u5E02\u3067\u71C3\u6599\u4FA1\u683C\u3092\u6BD4\u8F03\u3057\u307E\u3059\u3002\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u306E\u30AC\u30BD\u30EA\u30F3\u3001\u8EFD\u6CB9\u3001LPG\u3001\u96FB\u6C17\u81EA\u52D5\u8ECA\u306E\u5145\u96FB\u30B3\u30B9\u30C8\u3092\u78BA\u8A8D\u3002\u30EB\u30FC\u30C8\u3092\u8A08\u753B\u3057\u3066\u71C3\u6599\u8CBB\u3092\u7BC0\u7D04\u3057\u307E\u3057\u3087\u3046\u3002',
    'fuelGuideLabel': '\u71C3\u6599\u30BF\u30A4\u30D7\u30AC\u30A4\u30C9',
    'aboutFuelTypes': '\u71C3\u6599\u30BF\u30A4\u30D7\u306B\u3064\u3044\u3066',
    'readMore': '\u71C3\u6599\u4FA1\u683C\u306B\u3064\u3044\u3066\u3082\u3063\u3068\u8AAD\u3080',
}

data['ko'] = {
    'breadcrumb_home': '\ud648',
    'faq_title': '\uc790\uc8fc \ubb3b\ub294 \uc9c8\ubb38',
    'faq_q1': '{city}\uc5d0\uc11c \uac00\uc7a5 \uc800\ub834\ud55c \uc5f0\ub8cc \uc720\ud615\uc740 \ubb34\uc5c7\uc778\uac00\uc694?',
    'faq_a1': '\ud604\uc7ac \uac00\uaca9\uc5d0 \uae30\ucd08\ud558\uc5ec \uac00\uc7a5 \uc800\ub834\ud55c \uc635\uc158\uc740 \ub2ec\ub77c\uc9d1\ub2c8\ub2e4. {city}\uc5d0\uc11c \ucd5c\uace0\uc758 \uc635\uc158\uc744 \ucc3e\uc73c\uba74 \uac00\uaca9 \ube44\uad50 \ud45c\ub97c \ud655\uc778\ud558\uc138\uc694.',
    'faq_q2': '\uc5b4\ub5a4 \uc5f0\ub8cc\uac00 CO\u2082 \ubc30\ucd9c\ub7c9\uc774 \uac00\uc7a5 \uc801\uc740\uac00\uc694?',
    'faq_a2': '\uc804\uae30\ucc28\uc758 \ubc30\ucd9c\ub7c9\uc774 \uac00\uc7a5 \ub0ae\uace0, \uadf8 \ub2e4\uc74c\uc73c\ub85c \ud558\uc774\ube0c\ub9ac\ub4dc\uc640 LPG \uc635\uc158\uc774 \ub2e4\uc74c\uc785\ub2c8\ub2e4.',
    'faq_q3': '\uc5f0\ub8cc \uac00\uaca9\uc740 \uc5bc\ub9c8\ub098 \uc790\uc8fc \uc5c5\ub370\uc774\ud2b8\ub418\ub098\uc694?',
    'faq_a3': '\uac00\uaca9\uc740 \uc790\ub3d9\ud654\ub41c \ub2e4\uc911 \uc18c\uc2a4 \ud30c\uc774\ud504\ub77c\uc778\uc744 \ud1b5\ud574 \ub9e4\uc77c \uc5c5\ub370\uc774\ud2b8\ub429\ub2c8\ub2e4.',
    'relatedCities': '\uad00\ub828 \ub3c4\uc2dc',
    'seo_homeTitle': 'FuelCost.info - 48,000\uac1c \uc774\uc0c1 \ub3c4\uc2dc\uc758 \ud718\ubc1c\uc720, \uacbd\uc720, LPG \ubc0f \uc804\uae30\ucc28 \uac00\uaca9 \ube44\uad50',
    'seo_homeDescription': '\uc804 \uc138\uacc4 48,000\uac1c \uc774\uc0c1 \ub3c4\uc2dc\uc758 \uc5f0\ub8cc \uac00\uaca9\uc744 \ube44\uad50\ud558\uc138\uc694. \uc2e4\uc2dc\uac04 \ud718\ubc1c\uc720, \uacbd\uc720, LPG \ubc0f \uc804\uae30\ucc28 \ucda9\uc804 \ube44\uc6a9\uc744 \ud655\uc778\ud558\uc138\uc694. \uacbd\ub85c\ub97c \uacc4\ud68d\ud558\uace0 \uc5f0\ub8cc\ube44\ub97c \uc808\uc57d\ud558\uc138\uc694.',
    'fuelGuideLabel': '\uc5f0\ub8cc \uc720\ud615 \uac00\uc774\ub4dc',
    'aboutFuelTypes': '\uc5f0\ub8cc \uc720\ud615\uc5d0 \ub300\ud574',
    'readMore': '\uc5f0\ub8cc \uac00\uaca9\uc5d0 \ub300\ud574 \ub354 \uc77d\uc5b4\ubcf4\uae30',
}

data['nl'] = {
    'breadcrumb_home': 'Home',
    'faq_title': 'Veelgestelde vragen',
    'faq_q1': 'Wat is de meest betaalbare brandstofsoort in {city}?',
    'faq_a1': 'Op basis van de huidige prijzen varieert de goedkoopste optie. Bekijk onze prijsvergelijkingstabel voor de beste deal in {city}.',
    'faq_q2': 'Welke brandstof produceert de minste CO\u2082-uitstoot?',
    'faq_a2': 'Elektrische voertuigen produceren de laagste uitstoot, gevolgd door hybride en LPG-opties.',
    'faq_q3': 'Hoe vaak worden de brandstofprijzen bijgewerkt?',
    'faq_a3': 'Prijzen worden dagelijks bijgewerkt via onze geautomatiseerde multi-source pijplijn.',
    'relatedCities': 'Vergelijkbare steden',
    'seo_homeTitle': 'FuelCost.info - Vergelijk benzine-, diesel-, LPG- en EV-prijzen in meer dan 48.000 steden',
    'seo_homeDescription': 'Vergelijk brandstofprijzen in meer dan 48.000 steden wereldwijd. Ontvang realtime benzine-, diesel-, LPG- en oplaadkosten voor elektrische voertuigen. Plan uw route en bespaar op brandstof.',
    'fuelGuideLabel': 'Brandstoftype gids',
    'aboutFuelTypes': 'Over brandstoftypen',
    'readMore': 'Lees meer over brandstofprijzen',
}

data['pl'] = {
    'breadcrumb_home': 'Strona g\u0142\u00f3wna',
    'faq_title': 'Cz\u0119sto zadawane pytania',
    'faq_q1': 'Jaki jest najta\u0144szy rodzaj paliwa w {city}?',
    'faq_a1': 'W zale\u017cno\u015bci od bie\u017c\u0105cych cen najta\u0144sza opcja mo\u017ce si\u0119 r\u00f3\u017cni\u0107. Sprawd\u017a nasz\u0105 tabel\u0119 por\u00f3wnania cen, aby znale\u017a\u0107 najlepsz\u0105 ofert\u0119 w {city}.',
    'faq_q2': 'Kt\u00f3re paliwo wytwarza najmniej emisji CO\u2082?',
    'faq_a2': 'Pojazdy elektryczne wytwarzaj\u0105 najni\u017csze emisje, a nast\u0119pnie opcje hybrydowe i LPG.',
    'faq_q3': 'Jak cz\u0119sto aktualizowane s\u0105 ceny paliw?',
    'faq_a3': 'Ceny s\u0105 aktualizowane codziennie za pomoc\u0105 naszego zautomatyzowanego potoku wielo\u017ar\u00f3d\u0142owego.',
    'relatedCities': 'Powi\u0105zane miasta',
    'seo_homeTitle': 'FuelCost.info - Por\u00f3wnaj ceny benzyny, oleju nap\u0119dowego, LPG i EV w ponad 48 000 miast',
    'seo_homeDescription': 'Por\u00f3wnaj ceny paliw w ponad 48 000 miast na ca\u0142ym \u015bwiecie. Uzyskaj rzeczywiste koszty benzyny, oleju nap\u0119dowego, LPG i \u0142adowania pojazd\u00f3w elektrycznych. Zaplanuj swoj\u0105 tras\u0119 i oszcz\u0119d\u017a na paliwie.',
    'fuelGuideLabel': 'Przewodnik po rodzajach paliw',
    'aboutFuelTypes': 'O rodzajach paliw',
    'readMore': 'Dowiedz si\u0119 wi\u0119cej o cenach paliw',
}

data['ar'] = {
    'breadcrumb_home': '\u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
    'faq_title': '\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629',
    'faq_q1': '\u0645\u0627 \u0647\u0648 \u0623\u0643\u062B\u0631 \u0646\u0648\u0639 \u0648\u0642\u0648\u062F \u0645\u064A\u0633\u0648\u0631 \u0641\u064A {city}\u061F',
    'faq_a1': '\u0627\u0633\u062A\u0646\u0627\u062F\u0627\u064B \u0625\u0644\u0649 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629\u060C \u064A\u062A\u0641\u0627\u0648\u062A \u0627\u0644\u062E\u064A\u0627\u0631 \u0627\u0644\u0623\u0631\u062E\u0635. \u0631\u0627\u062C\u0639 \u062C\u062F\u0648\u0644 \u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u0635\u0641\u0642\u0629 \u0641\u064A {city}.',
    'faq_q2': '\u0623\u064A \u0648\u0642\u0648\u062F \u064A\u0646\u062A\u062C \u0623\u0642\u0644 \u0627\u0646\u0628\u0639\u0627\u062B\u0627\u062A CO\u2082\u061F',
    'faq_a2': '\u062A\u0646\u062A\u062C \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0623\u0642\u0644 \u0627\u0644\u0627\u0646\u0628\u0639\u0627\u062B\u0627\u062A\u060C \u062A\u0644\u064A\u0647\u0627 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0647\u062C\u064A\u0646\u0629 \u0648\u0627\u0644\u063A\u0627\u0632 \u0627\u0644\u0646\u0641\u0637\u064A \u0627\u0644\u0645\u0633\u0627\u0644 (LPG).',
    'faq_q3': '\u0643\u0645 \u0645\u0631\u0629 \u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0648\u0642\u0648\u062F\u061F',
    'faq_a3': '\u064A\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u064A\u0648\u0645\u064A\u0627\u064B \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u062E\u0637 \u0627\u0644\u0623\u0646\u0627\u0628\u064A\u0628 \u0627\u0644\u0622\u0644\u064A \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u062E\u0627\u0635 \u0628\u0646\u0627.',
    'relatedCities': '\u0645\u062F\u0646 \u0630\u0627\u062A \u0635\u0644\u0629',
    'seo_homeTitle': 'FuelCost.info - \u0642\u0627\u0631\u0646 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0628\u0646\u0632\u064A\u0646 \u0648\u0627\u0644\u062F\u064A\u0632\u0644 \u0648\u0627\u0644\u063A\u0627\u0632 \u0627\u0644\u0646\u0641\u0637\u064A \u0627\u0644\u0645\u0633\u0627\u0644 \u0648\u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0641\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 48,000 \u0645\u062F\u064A\u0646\u0629',
    'seo_homeDescription': '\u0642\u0627\u0631\u0646 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0648\u0642\u0648\u062F \u0641\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 48,000 \u0645\u062F\u064A\u0646\u0629 \u062D\u0648\u0644 \u0627\u0644\u0639\u0627\u0644\u0645. \u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0644\u0644\u0628\u0646\u0632\u064A\u0646 \u0648\u0627\u0644\u062F\u064A\u0632\u0644 \u0648\u0627\u0644\u063A\u0627\u0632 \u0627\u0644\u0646\u0641\u0637\u064A \u0627\u0644\u0645\u0633\u0627\u0644 \u0648\u0634\u062D\u0646 \u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629. \u062E\u0637\u0637 \u0644\u0631\u062D\u0644\u062A\u0643 \u0648\u0648\u0641\u0631 \u0627\u0644\u0646\u0642\u0648\u062F.',
    'fuelGuideLabel': '\u062F\u0644\u064A\u0644 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0648\u0642\u0648\u062F',
    'aboutFuelTypes': '\u062D\u0648\u0644 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0648\u0642\u0648\u062F',
    'readMore': '\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064A\u062F \u0639\u0646 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0648\u0642\u0648\u062F',
}

data['id'] = {
    'breadcrumb_home': 'Beranda',
    'faq_title': 'Pertanyaan yang Sering Diajukan',
    'faq_q1': 'Apa jenis bahan bakar yang paling terjangkau di {city}?',
    'faq_a1': 'Berdasarkan harga saat ini, pilihan termurah bervariasi. Lihat tabel perbandingan harga kami untuk penawaran terbaik di {city}.',
    'faq_q2': 'Bahan bakar mana yang menghasilkan emisi CO\u2082 paling sedikit?',
    'faq_a2': 'Kendaraan listrik menghasilkan emisi paling rendah, diikuti oleh opsi hybrid dan LPG.',
    'faq_q3': 'Seberapa sering harga bahan bakar diperbarui?',
    'faq_a3': 'Harga diperbarui setiap hari menggunakan sistem pipa multi-sumber otomatis kami.',
    'relatedCities': 'Kota Terkait',
    'seo_homeTitle': 'FuelCost.info - Bandingkan Harga Bensin, Diesel, LPG & EV di 48.000+ Kota',
    'seo_homeDescription': 'Bandingkan harga bahan bakar di lebih dari 48.000 kota di seluruh dunia. Dapatkan biaya bensin, diesel, LPG, dan pengisian daya kendaraan listrik secara real-time. Rencanakan rute Anda dan hemat biaya bahan bakar.',
    'fuelGuideLabel': 'Panduan Jenis Bahan Bakar',
    'aboutFuelTypes': 'Tentang Jenis Bahan Bakar',
    'readMore': 'Baca lebih lanjut tentang harga bahan bakar',
}

data['vi'] = {
    'breadcrumb_home': 'Trang ch\u1ee7',
    'faq_title': 'C\u00e2u h\u1ecfi th\u01b0\u1eddng g\u1eb7p',
    'faq_q1': 'Lo\u1ea1i nhi\u00ean li\u1ec7u n\u00e0o r\u1ebb nh\u1ea5t \u1edf {city}?',
    'faq_a1': 'D\u1ef1a tr\u00ean gi\u00e1 hi\u1ec7n t\u1ea1i, l\u1ef1a ch\u1ecdn r\u1ebb nh\u1ea5t c\u00f3 th\u1ec3 kh\u00e1c nhau. H\u00e3y xem b\u1ea3ng so s\u00e1nh gi\u00e1 c\u1ee7a ch\u00fang t\u00f4i \u0111\u1ec3 t\u00ecm \u01b0u \u0111\u00e3i t\u1ed1t nh\u1ea5t \u1edf {city}.',
    'faq_q2': 'Lo\u1ea1i nhi\u00ean li\u1ec7u n\u00e0o th\u1ea3i ra \u00edt CO\u2082 nh\u1ea5t?',
    'faq_a2': 'Xe \u0111i\u1ec7n th\u1ea3i ra \u00edt kh\u00ed th\u1ea3i nh\u1ea5t, ti\u1ebfp theo l\u00e0 c\u00e1c l\u1ef1a ch\u1ecdn hybrid v\u00e0 LPG.',
    'faq_q3': 'Gi\u00e1 nhi\u00ean li\u1ec7u \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt bao l\u00e2u m\u1ed9t l\u1ea7n?',
    'faq_a3': 'Gi\u00e1 \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt h\u00e0ng ng\u00e0y b\u1eb1ng h\u1ec7 th\u1ed1ng \u0111\u01b0\u1eddng \u1ed1ng t\u1ef1 \u0111\u1ed9ng \u0111a ngu\u1ed3n c\u1ee7a ch\u00fang t\u00f4i.',
    'relatedCities': 'Th\u00e0nh ph\u1ed1 li\u00ean quan',
    'seo_homeTitle': 'FuelCost.info - So s\u00e1nh gi\u00e1 x\u0103ng, d\u1ea7u diesel, LPG v\u00e0 xe \u0111i\u1ec7n tr\u00ean 48.000+ th\u00e0nh ph\u1ed1',
    'seo_homeDescription': 'So s\u00e1nh gi\u00e1 nhi\u00ean li\u1ec7u tr\u00ean 48.000+ th\u00e0nh ph\u1ed1 tr\u00ean to\u00e0n th\u1ebf gi\u1edbi. Nh\u1eadn chi ph\u00ed x\u0103ng, d\u1ea7u diesel, LPG v\u00e0 s\u1ea1c xe \u0111i\u1ec7n theo th\u1eddi gian th\u1ef1c. L\u00ean k\u1ebf ho\u1ea1ch l\u1ed9 tr\u00ecnh v\u00e0 ti\u1ebft ki\u1ec7m ti\u1ec1n nhi\u00ean li\u1ec7u.',
    'fuelGuideLabel': 'H\u01b0\u1edbng d\u1eabn lo\u1ea1i nhi\u00ean li\u1ec7u',
    'aboutFuelTypes': 'V\u1ec1 c\u00e1c lo\u1ea1i nhi\u00ean li\u1ec7u',
    'readMore': '\u0110\u1ecdc th\u00eam v\u1ec1 gi\u00e1 nhi\u00ean li\u1ec7u',
}

data['hi'] = {
    'breadcrumb_home': '\u0939\u094b\u092e',
    'faq_title': '\u0905\u0915\u094d\u0938\u0930 \u092a\u0942\u091b\u0947 \u091c\u093e\u0928\u0947 \u0935\u093e\u0932\u0947 \u092a\u094d\u0930\u0936\u094d\u0928',
    'faq_q1': '{city} \u092E\u0947\u0902 \u0938\u092C\u0938\u0947 \u0938\u0938\u094D\u0924\u093E \u0908\u0902\u0927\u0928 \u092A\u094D\u0930\u0915\u093E\u0930 \u0915\u094C\u0928 \u0938\u093E \u0939\u0948?',
    'faq_a1': '\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0942\u0932\u094D\u092F\u094B\u0902 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930, \u0938\u092C\u0938\u0947 \u0938\u0938\u094D\u0924\u093E \u0935\u093F\u0915\u0932\u094D\u092A \u092C\u0926\u0932\u0924\u093E \u0930\u0939\u0924\u093E \u0939\u0948\u0964 {city} \u092E\u0947\u0902 \u0938\u092C\u0938\u0947 \u0905\u091A\u094D\u091B\u093E \u0938\u094C\u0926\u093E \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0939\u092E\u093E\u0930\u0940 \u092E\u0942\u0932\u094D\u092F \u0924\u0941\u0932\u0928\u093E \u0924\u093E\u0932\u093F\u0915\u093E \u0926\u0947\u0916\u0947\u0902\u0964',
    'faq_q2': '\u0915\u094C\u0928 \u0938\u093E \u0908\u0902\u0927\u0928 \u0938\u092C\u0938\u0947 \u0915\u092E CO\u2082 \u0909\u0924\u094D\u0938\u0930\u094D\u091C\u0928 \u092A\u0948\u0926\u093E \u0915\u0930\u0924\u093E \u0939\u0948?',
    'faq_a2': '\u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u093F\u0915 \u0935\u093E\u0939\u0928 \u0938\u092C\u0938\u0947 \u0915\u092E \u0909\u0924\u094D\u0938\u0930\u094D\u091C\u0928 \u092A\u0948\u0926\u093E \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0909\u0938\u0915\u0947 \u092C\u093E\u0926 \u0939\u093E\u092F\u092C\u094D\u0930\u093F\u0921 \u0914\u0930 LPG \u0935\u093F\u0915\u0932\u094D\u092A \u0906\u0924\u0947 \u0939\u0948\u0902\u0964',
    'faq_q3': '\u0908\u0902\u0927\u0928 \u0915\u0940 \u0915\u0940\u092E\u0924\u0947\u0902 \u0915\u093F\u0924\u0928\u0940 \u092C\u093E\u0930 \u0905\u092A\u0921\u0947\u091F \u0939\u094B\u0924\u0940 \u0939\u0948\u0902?',
    'faq_a3': '\u0939\u092E\u093E\u0930\u0940 \u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924 \u092E\u0932\u094D\u091F\u0940-\u0938\u094B\u0930\u094D\u0938 \u092A\u093E\u0907\u092A\u0932\u093E\u0907\u0928 \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0915\u0947 \u0915\u0940\u092E\u0924\u0947\u0902 \u092A\u094D\u0930\u0924\u093F\u0926\u093F\u0928 \u0905\u092A\u0921\u0947\u091F \u0915\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948\u0902\u0964',
    'relatedCities': '\u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0936\u0939\u0930',
    'seo_homeTitle': 'FuelCost.info - 48,000+ \u0936\u0939\u0930\u094B\u0902 \u092E\u0947\u0902 \u092A\u0947\u091F\u094D\u0930\u094B\u0932, \u0921\u0940\u091C\u0932, LPG \u0914\u0930 EV \u0915\u0940 \u0915\u0940\u092E\u0924\u094B\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902',
    'seo_homeDescription': '\u0926\u0941\u0928\u093F\u092F\u093E \u092D\u0930 \u0915\u0947 48,000+ \u0936\u0939\u0930\u094B\u0902 \u092E\u0947\u0902 \u0908\u0902\u0927\u0928 \u0915\u0940 \u0915\u0940\u092E\u0924\u094B\u0902 \u0915\u0940 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0947\u0902\u0964 \u0935\u093E\u0938\u094D\u0924\u0935\u093F\u0915 \u0938\u092E\u092F \u092E\u0947\u0902 \u092A\u0947\u091F\u094D\u0930\u094B\u0932, \u0921\u0940\u091C\u0932, LPG \u0914\u0930 \u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u093F\u0915 \u0935\u093E\u0939\u0928 \u091A\u093E\u0930\u094D\u091C\u093F\u0902\u0917 \u0932\u093E\u0917\u0924 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902\u0964 \u0905\u092A\u0928\u0947 \u092E\u093E\u0930\u094D\u0917 \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u092C\u0928\u093E\u090F\u0902 \u0914\u0930 \u0908\u0902\u0927\u0928 \u092A\u0930 \u092A\u0948\u0938\u0947 \u092C\u091A\u093E\u090F\u0902\u0964',
    'fuelGuideLabel': '\u0908\u0902\u0927\u0928 \u092A\u094D\u0930\u0915\u093E\u0930 \u0917\u093E\u0907\u0921',
    'aboutFuelTypes': '\u0908\u0902\u0927\u0928 \u092A\u094D\u0930\u0915\u093E\u0930\u094B\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902',
    'readMore': '\u0908\u0902\u0927\u0928 \u0915\u0940 \u0915\u0940\u092E\u0924\u094B\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0914\u0930 \u092A\u0922\u093C\u0947\u0902',
}

data['uk'] = {
    'breadcrumb_home': '\u0413\u043e\u043b\u043e\u0432\u043d\u0430',
    'faq_title': '\u0427\u0430\u0441\u0442\u0456 \u0437\u0430\u043f\u0438\u0442\u0430\u043d\u043d\u044f',
    'faq_q1': '\u042f\u043a\u0438\u0439 \u0442\u0438\u043f \u043f\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0454 \u043d\u0430\u0439\u0431\u0456\u043b\u044c\u0448 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0438\u043c \u0443 {city}?',
    'faq_a1': '\u0412\u0438\u0445\u043e\u0434\u044f\u0447\u0438 \u0437 \u043f\u043e\u0442\u043e\u0447\u043d\u0438\u0445 \u0446\u0456\u043d, \u043d\u0430\u0439\u0434\u0435\u0448\u0435\u0432\u0448\u0438\u0439 \u0432\u0430\u0440\u0456\u0430\u043d\u0442 \u0432\u0456\u0434\u0440\u0456\u0437\u043d\u044f\u0454\u0442\u044c\u0441\u044f. \u041f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043d\u0430\u0448\u0443 \u0442\u0430\u0431\u043b\u0438\u0446\u044e \u043f\u043e\u0440\u0456\u0432\u043d\u044f\u043d\u043d\u044f \u0446\u0456\u043d, \u0449\u043e\u0431 \u0437\u043d\u0430\u0439\u0442\u0438 \u043d\u0430\u0439\u043a\u0440\u0430\u0449\u0443 \u043f\u0440\u043e\u043f\u043e\u0437\u0438\u0446\u0456\u044e \u0432 {city}.',
    'faq_q2': '\u042f\u043a\u0435 \u043f\u0430\u043b\u044c\u043d\u0435 \u0432\u0438\u043a\u0438\u0434\u0430\u0454 \u043d\u0430\u0439\u043c\u0435\u043d\u0448\u0435 CO\u2082?',
    'faq_a2': '\u0415\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u0431\u0456\u043b\u0456 \u0432\u0438\u043a\u0438\u0434\u0430\u044e\u0442\u044c \u043d\u0430\u0439\u043c\u0435\u043d\u0448\u0435 \u0432\u0438\u043a\u0438\u0434\u0456\u0432, \u0437\u0430 \u043d\u0438\u043c\u0438 \u0441\u043b\u0456\u0434\u0443\u044e\u0442\u044c \u0433\u0456\u0431\u0440\u0438\u0434\u043d\u0456 \u0442\u0430 LPG \u0432\u0430\u0440\u0456\u0430\u043d\u0442\u0438.',
    'faq_q3': '\u042f\u043a \u0447\u0430\u0441\u0442\u043e \u043e\u043d\u043e\u0432\u043b\u044e\u044e\u0442\u044c\u0441\u044f \u0446\u0456\u043d\u0438 \u043d\u0430 \u043f\u0430\u043b\u044c\u043d\u0435?',
    'faq_a3': '\u0426\u0456\u043d\u0438 \u043e\u043d\u043e\u0432\u043b\u044e\u044e\u0442\u044c\u0441\u044f \u0449\u043e\u0434\u043d\u044f \u0437\u0430 \u0434\u043e\u043f\u043e\u043c\u043e\u0433\u043e\u044e \u043d\u0430\u0448\u043e\u0433\u043e \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u043e\u0432\u0430\u043d\u043e\u0433\u043e \u0431\u0430\u0433\u0430\u0442\u043e\u0434\u0436\u0435\u0440\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u043a\u043e\u043d\u0432\u0435\u0454\u0440\u0430.',
    'relatedCities': '\u0421\u0445\u043e\u0436\u0456 \u043c\u0456\u0441\u0442\u0430',
    'seo_homeTitle': 'FuelCost.info - \u041f\u043e\u0440\u0456\u0432\u043d\u044e\u0439\u0442\u0435 \u0446\u0456\u043d\u0438 \u043d\u0430 \u0431\u0435\u043d\u0437\u0438\u043d, \u0434\u0438\u0437\u0435\u043b\u044c, LPG \u0442\u0430 \u0435\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u0431\u0456\u043b\u0456 \u0432 \u043f\u043e\u043d\u0430\u0434 48 000 \u043c\u0456\u0441\u0442\u0430\u0445',
    'seo_homeDescription': '\u041f\u043e\u0440\u0456\u0432\u043d\u044e\u0439\u0442\u0435 \u0446\u0456\u043d\u0438 \u043d\u0430 \u043f\u0430\u043b\u044c\u043d\u0435 \u0432 \u043f\u043e\u043d\u0430\u0434 48 000 \u043c\u0456\u0441\u0442\u0430\u0445 \u043f\u043e \u0432\u0441\u044c\u043e\u043c\u0443 \u0441\u0432\u0456\u0442\u0456. \u041e\u0442\u0440\u0438\u043c\u0443\u0439\u0442\u0435 \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044c \u0431\u0435\u043d\u0437\u0438\u043d\u0443, \u0434\u0438\u0437\u0435\u043b\u044e, LPG \u0442\u0430 \u0437\u0430\u0440\u044f\u0434\u043a\u0438 \u0435\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u0431\u0456\u043b\u0456\u0432 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c\u0443 \u0447\u0430\u0441\u0456. \u041f\u043b\u0430\u043d\u0443\u0439\u0442\u0435 \u0441\u0432\u0456\u0439 \u043c\u0430\u0440\u0448\u0440\u0443\u0442 \u0442\u0430 \u0435\u043a\u043e\u043d\u043e\u043c\u044c\u0442\u0435.',
    'fuelGuideLabel': '\u041f\u0443\u0442\u0456\u0432\u043d\u0438\u043a \u043f\u043e \u0442\u0438\u043f\u0430\u0445 \u043f\u0430\u043b\u044c\u043d\u043e\u0433\u043e',
    'aboutFuelTypes': '\u041f\u0440\u043e \u0442\u0438\u043f\u0438 \u043f\u0430\u043b\u044c\u043d\u043e\u0433\u043e',
    'readMore': '\u0414\u0456\u0437\u043d\u0430\u0442\u0438\u0441\u044f \u0431\u0456\u043b\u044c\u0448\u0435 \u043f\u0440\u043e \u0446\u0456\u043d\u0438 \u043d\u0430 \u043f\u0430\u043b\u044c\u043d\u0435',
}

data['ro'] = {
    'breadcrumb_home': 'Acas\u0103',
    'faq_title': '\u00centreb\u0103ri frecvente',
    'faq_q1': 'Care este cel mai accesibil tip de combustibil \u00een {city}?',
    'faq_a1': 'Pe baza pre\u021burilor actuale, cea mai ieftin\u0103 op\u021biune variaz\u0103. Consulta\u021bi tabelul nostru de compara\u021bie a pre\u021burilor pentru cea mai bun\u0103 ofert\u0103 \u00een {city}.',
    'faq_q2': 'Care combustibil produce cele mai pu\u021bine emisii de CO\u2082?',
    'faq_a2': 'Vehiculele electrice produc cele mai sc\u0103zute emisii, urmate de op\u021biunile hibride \u0219i GPL.',
    'faq_q3': 'C\u00e2t de des sunt actualizate pre\u021burile combustibililor?',
    'faq_a3': 'Pre\u021burile sunt actualizate zilnic folosind conducta noastr\u0103 automat\u0103 multi-surs\u0103.',
    'relatedCities': 'Ora\u0219e similare',
    'seo_homeTitle': 'FuelCost.info - Compar\u0103 pre\u021burile la benzin\u0103, motorin\u0103, GPL \u0219i vehicule electrice \u00een peste 48.000 de ora\u0219e',
    'seo_homeDescription': 'Compar\u0103 pre\u021burile combustibililor \u00een peste 48.000 de ora\u0219e din \u00eentreaga lume. Ob\u021bine costurile \u00een timp real pentru benzin\u0103, motorin\u0103, GPL \u0219i \u00eenc\u0103rcarea vehiculelor electrice. Planific\u0103-\u021bi ruta \u0219i economise\u0219te.',
    'fuelGuideLabel': 'Ghidul tipurilor de combustibil',
    'aboutFuelTypes': 'Despre tipurile de combustibil',
    'readMore': 'Afla\u021bi mai multe despre pre\u021burile combustibililor',
}

data['sv'] = {
    'breadcrumb_home': 'Hem',
    'faq_title': 'Vanliga fr\u00e5gor',
    'faq_q1': 'Vilken \u00e4r den mest prisv\u00e4rda br\u00e4nsletypen i {city}?',
    'faq_a1': 'Baserat p\u00e5 aktuella priser varierar det billigaste alternativet. Kolla in v\u00e5r prisj\u00e4mf\u00f6relsetabell f\u00f6r b\u00e4sta erbjudandet i {city}.',
    'faq_q2': 'Vilket br\u00e4nsle ger l\u00e4gst CO\u2082-utsl\u00e4pp?',
    'faq_a2': 'Elfordon ger l\u00e4gst utsl\u00e4pp, f\u00f6ljt av hybrid- och LPG-alternativ.',
    'faq_q3': 'Hur ofta uppdateras br\u00e4nslepriserna?',
    'faq_a3': 'Priserna uppdateras dagligen med v\u00e5r automatiska pipeline med flera k\u00e4llor.',
    'relatedCities': 'Relaterade st\u00e4der',
    'seo_homeTitle': 'FuelCost.info - J\u00e4mf\u00f6r bensin-, diesel-, LPG- och elbilspriser i \u00f6ver 48 000 st\u00e4der',
    'seo_homeDescription': 'J\u00e4mf\u00f6r br\u00e4nslepriser i \u00f6ver 48 000 st\u00e4der v\u00e4rlden \u00f6ver. F\u00e5 realtidskostnader f\u00f6r bensin, diesel, LPG och laddning av elfordon. Planera din rutt och spara pengar p\u00e5 br\u00e4nsle.',
    'fuelGuideLabel': 'Guide \u00f6ver br\u00e4nsletyper',
    'aboutFuelTypes': 'Om br\u00e4nsletyper',
    'readMore': 'L\u00e4s mer om br\u00e4nslepriser',
}

data['no'] = {
    'breadcrumb_home': 'Hjem',
    'faq_title': 'Ofte stilte sp\u00f8rsm\u00e5l',
    'faq_q1': 'Hva er den mest rimelige drivstofftypen i {city}?',
    'faq_a1': 'Basert p\u00e5 gjeldende priser varierer det billigste alternativet. Sjekk prissammenligningstabellen v\u00e5r for det beste tilbudet i {city}.',
    'faq_q2': 'Hvilket drivstoff gir minst CO\u2082-utslipp?',
    'faq_a2': 'Elbiler gir lavest utslipp, etterfulgt av hybrid- og LPG-alternativer.',
    'faq_q3': 'Hvor ofte oppdateres drivstoffprisene?',
    'faq_a3': 'Prisene oppdateres daglig ved hjelp av v\u00e5r automatiserte fler-kilde pipeline.',
    'relatedCities': 'Relaterte byer',
    'seo_homeTitle': 'FuelCost.info - Sammenlign bensin-, diesel-, LPG- og elbilpriser i over 48 000 byer',
    'seo_homeDescription': 'Sammenlign drivstoffpriser i over 48 000 byer over hele verden. F\u00e5 samtidskostnader for bensin, diesel, LPG og lading av elbiler. Planlegg ruten din og spar penger.',
    'fuelGuideLabel': 'Veiledning for drivstofftyper',
    'aboutFuelTypes': 'Om drivstofftyper',
    'readMore': 'Les mer om drivstoffpriser',
}

data['da'] = {
    'breadcrumb_home': 'Hjem',
    'faq_title': 'Ofte stillede sp\u00f8rgsm\u00e5l',
    'faq_q1': 'Hvad er den mest overkommelige br\u00e6ndstoftype i {city}?',
    'faq_a1': 'Baseret p\u00e5 aktuelle priser varierer det billigste alternativ. Se vores prissammenligningstabel for det bedste tilbud i {city}.',
    'faq_q2': 'Hvilket br\u00e6ndstof giver de laveste CO\u2082-udledninger?',
    'faq_a2': 'Elbiler giver de laveste udledninger, efterfulgt af hybrid- og LPG-muligheder.',
    'faq_q3': 'Hvor ofte opdateres br\u00e6ndstofpriserne?',
    'faq_a3': 'Priserne opdateres dagligt via vores automatiserede multi-kilde pipeline.',
    'relatedCities': 'Relaterede byer',
    'seo_homeTitle': 'FuelCost.info - Sammenlign benzin-, diesel-, LPG- og elbilpriser i over 48.000 byer',
    'seo_homeDescription': 'Sammenlign br\u00e6ndstofpriser i over 48.000 byer verden over. F\u00e5 realtidsomkostninger for benzin, diesel, LPG og opladning af elbiler. Planl\u00e6g din rute og spar penge.',
    'fuelGuideLabel': 'Guide til br\u00e6ndstoftyper',
    'aboutFuelTypes': 'Om br\u00e6ndstoftyper',
    'readMore': 'L\u00e6s mere om br\u00e6ndstofpriser',
}

data['fi'] = {
    'breadcrumb_home': 'Etusivu',
    'faq_title': 'Usein kysytyt kysymykset',
    'faq_q1': 'Mik\u00e4 on edullisin polttoainetyyppi kohteessa {city}?',
    'faq_a1': 'Nykyisten hintojen perusteella halvin vaihtoehto vaihtelee. Katso hintavertailutaulukostamme paras tarjous kohteessa {city}.',
    'faq_q2': 'Mik\u00e4 polttoaine tuottaa v\u00e4hiten CO\u2082-p\u00e4\u00e4st\u00f6j\u00e4?',
    'faq_a2': 'S\u00e4hk\u00f6autot tuottavat v\u00e4hiten p\u00e4\u00e4st\u00f6j\u00e4, jota seuraavat hybridi- ja LPG-vaihtoehdot.',
    'faq_q3': 'Kuinka usein polttoainehintoja p\u00e4ivitet\u00e4\u00e4n?',
    'faq_a3': 'Hintoja p\u00e4ivitet\u00e4\u00e4n p\u00e4ivitt\u00e4in automaattisen monil\u00e4hdeputkemme avulla.',
    'relatedCities': 'Liittyv\u00e4t kaupungit',
    'seo_homeTitle': 'FuelCost.info - Vertaa bensiinin, dieselin, LPG:n ja s\u00e4hk\u00f6autojen hintoja yli 48 000 kaupungissa',
    'seo_homeDescription': 'Vertaa polttoainehintoja yli 48 000 kaupungissa ymp\u00e4ri maailmaa. Hanki reaaliaikaiset bensiinin, dieselin, LPG:n ja s\u00e4hk\u00f6autojen latauskustannukset. Suunnittele reittisi ja s\u00e4\u00e4st\u00e4 rahaa.',
    'fuelGuideLabel': 'Polttoainetyyppiopas',
    'aboutFuelTypes': 'Tietoa polttoainetyypeist\u00e4',
    'readMore': 'Lue lis\u00e4\u00e4 polttoainehinnoista',
}

data['el'] = {
    'breadcrumb_home': '\u0391\u03c1\u03c7\u03b9\u03ba\u03ae',
    'faq_title': '\u03a3\u03c5\u03c7\u03bd\u03ad\u03c2 \u0395\u03c1\u03c9\u03c4\u03ae\u03c3\u03b5\u03b9\u03c2',
    'faq_q1': '\u03a0\u03bf\u03b9\u03bf\u03c2 \u03b5\u03af\u03bd\u03b1\u03b9 \u03bf \u03c0\u03b9\u03bf \u03bf\u03b9\u03ba\u03bf\u03bd\u03bf\u03bc\u03b9\u03ba\u03cc\u03c2 \u03c4\u03cd\u03c0\u03bf\u03c2 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03bf\u03c5 \u03c3\u03c4\u03b7\u03bd {city};',
    'faq_a1': '\u0392\u03ac\u03c3\u03b5\u03b9 \u03c4\u03c9\u03bd \u03c4\u03c1\u03b5\u03c7\u03bf\u03c5\u03c3\u03ce\u03bd \u03c4\u03b9\u03bc\u03ce\u03bd, \u03b7 \u03c6\u03b8\u03b7\u03bd\u03cc\u03c4\u03b5\u03c1\u03b7 \u03b5\u03c0\u03b9\u03bb\u03bf\u03b3\u03ae \u03b4\u03b9\u03b1\u03c6\u03ad\u03c1\u03b5\u03b9. \u0395\u03bb\u03ad\u03b3\u03be\u03c4\u03b5 \u03c4\u03bf\u03bd \u03c0\u03af\u03bd\u03b1\u03ba\u03b1 \u03c3\u03cd\u03b3\u03ba\u03c1\u03b9\u03c3\u03b7\u03c2 \u03c4\u03b9\u03bc\u03ce\u03bd \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd \u03ba\u03b1\u03bb\u03cd\u03c4\u03b5\u03c1\u03b7 \u03c0\u03c1\u03bf\u03c3\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd {city}.',
    'faq_q2': '\u03a0\u03bf\u03b9\u03bf \u03ba\u03b1\u03cd\u03c3\u03b9\u03bc\u03bf \u03c0\u03b1\u03c1\u03ac\u03b3\u03b5\u03b9 \u03c4\u03b9\u03c2 \u03bb\u03b9\u03b3\u03cc\u03c4\u03b5\u03c1\u03b5\u03c2 \u03b5\u03ba\u03c0\u03bf\u03bc\u03c0\u03ad\u03c2 CO\u2082;',
    'faq_a2': '\u03a4\u03b1 \u03b7\u03bb\u03b5\u03ba\u03c4\u03c1\u03b9\u03ba\u03ac \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03b1 \u03c0\u03b1\u03c1\u03ac\u03b3\u03bf\u03c5\u03bd \u03c4\u03b9\u03c2 \u03c7\u03b1\u03bc\u03b7\u03bb\u03cc\u03c4\u03b5\u03c1\u03b5\u03c2 \u03b5\u03ba\u03c0\u03bf\u03bc\u03c0\u03ad\u03c2, \u03b1\u03ba\u03bf\u03bb\u03bf\u03c5\u03b8\u03bf\u03cd\u03bc\u03b5\u03bd\u03b1 \u03b1\u03c0\u03cc \u03c5\u03b2\u03c1\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03b9 LPG \u03b5\u03c0\u03b9\u03bb\u03bf\u03b3\u03ad\u03c2.',
    'faq_q3': '\u03a0\u03cc\u03c3\u03bf \u03c3\u03c5\u03c7\u03bd\u03ac \u03b5\u03bd\u03b7\u03bc\u03b5\u03c1\u03ce\u03bd\u03bf\u03bd\u03c4\u03b1\u03b9 \u03bf\u03b9 \u03c4\u03b9\u03bc\u03ad\u03c2 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03c9\u03bd;',
    'faq_a3': '\u039f\u03b9 \u03c4\u03b9\u03bc\u03ad\u03c2 \u03b5\u03bd\u03b7\u03bc\u03b5\u03c1\u03ce\u03bd\u03bf\u03bd\u03c4\u03b1\u03b9 \u03ba\u03b1\u03b8\u03b7\u03bc\u03b5\u03c1\u03b9\u03bd\u03ac \u03c7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03ce\u03bd\u03c4\u03b1\u03c2 \u03c4\u03bf\u03bd \u03b1\u03c5\u03c4\u03bf\u03bc\u03b1\u03c4\u03bf\u03c0\u03bf\u03b9\u03b7\u03bc\u03ad\u03bd\u03bf \u03b1\u03b3\u03c9\u03b3\u03cc \u03c0\u03bf\u03bb\u03bb\u03b1\u03c0\u03bb\u03ce\u03bd \u03c0\u03b7\u03b3\u03ce\u03bd \u03bc\u03b1\u03c2.',
    'relatedCities': '\u03a3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ad\u03c2 \u03a0\u03cc\u03bb\u03b5\u03b9\u03c2',
    'seo_homeTitle': 'FuelCost.info - \u03a3\u03c5\u03b3\u03ba\u03c1\u03af\u03bd\u03b5\u03c4\u03b5 \u03c4\u03b9\u03bc\u03ad\u03c2 \u03b2\u03b5\u03bd\u03b6\u03af\u03bd\u03b7\u03c2, \u03bd\u03c4\u03b9\u03b5\u03b6\u03b5\u03bb, LPG \u03ba\u03b1\u03b9 \u03b7\u03bb\u03b5\u03ba\u03c4\u03c1\u03b9\u03ba\u03ce\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd \u03c3\u03b5 \u03c0\u03ac\u03bd\u03c9 \u03b1\u03c0\u03cc 48.000 \u03c0\u03cc\u03bb\u03b5\u03b9\u03c2',
    'seo_homeDescription': '\u03a3\u03c5\u03b3\u03ba\u03c1\u03af\u03bd\u03b5\u03c4\u03b5 \u03c4\u03b9\u03bc\u03ad\u03c2 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03c9\u03bd \u03c3\u03b5 \u03c0\u03ac\u03bd\u03c9 \u03b1\u03c0\u03cc 48.000 \u03c0\u03cc\u03bb\u03b5\u03b9\u03c2 \u03c0\u03b1\u03b3\u03ba\u03bf\u03c3\u03bc\u03af\u03c9\u03c2. \u039b\u03ac\u03b2\u03c4\u03b5 \u03ba\u03cc\u03c3\u03c4\u03b7 \u03b2\u03b5\u03bd\u03b6\u03af\u03bd\u03b7\u03c2, \u03bd\u03c4\u03b9\u03b5\u03b6\u03b5\u03bb, LPG \u03ba\u03b1\u03b9 \u03c6\u03cc\u03c1\u03c4\u03b9\u03c3\u03b7\u03c2 \u03b7\u03bb\u03b5\u03ba\u03c4\u03c1\u03b9\u03ba\u03ce\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd \u03c3\u03b5 \u03c0\u03c1\u03b1\u03b3\u03bc\u03b1\u03c4\u03b9\u03ba\u03cc \u03c7\u03c1\u03cc\u03bd\u03bf. \u03a3\u03c7\u03b5\u03b4\u03b9\u03ac\u03c3\u03c4\u03b5 \u03c4\u03b7 \u03b4\u03b9\u03b1\u03b4\u03c1\u03bf\u03bc\u03ae \u03c3\u03b1\u03c2 \u03ba\u03b1\u03b9 \u03b5\u03be\u03bf\u03b9\u03ba\u03bf\u03bd\u03bf\u03bc\u03ae\u03c3\u03c4\u03b5.',
    'fuelGuideLabel': '\u039f\u03b4\u03b7\u03b3\u03cc\u03c2 \u03c4\u03cd\u03c0\u03c9\u03bd \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03bf\u03c5',
    'aboutFuelTypes': '\u03a3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5 \u03c4\u03bf\u03c5\u03c2 \u03c4\u03cd\u03c0\u03bf\u03c5\u03c2 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03bf\u03c5',
    'readMore': '\u0394\u03b9\u03b1\u03b2\u03ac\u03c3\u03c4\u03b5 \u03c0\u03b5\u03c1\u03b9\u03c3\u03c3\u03cc\u03c4\u03b5\u03c1\u03b1 \u03b3\u03b9\u03b1 \u03c4\u03b9\u03c2 \u03c4\u03b9\u03bc\u03ad\u03c2 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03c9\u03bd',
}

data['cs'] = {
    'breadcrumb_home': 'Dom\u016f',
    'faq_title': '\u010casto kladen\u00e9 dotazy',
    'faq_q1': 'Jak\u00fd je nejdostupn\u011bj\u0161\u00ed typ paliva v {city}?',
    'faq_a1': 'Na z\u00e1klad\u011b aktu\u00e1ln\u00edch cen se nejlevn\u011bj\u0161\u00ed mo\u017enost li\u0161\u00ed. Pod\u00edvejte se na na\u0161i tabulku porovn\u00e1n\u00ed cen pro nejlep\u0161\u00ed nab\u00eddku v {city}.',
    'faq_q2': 'Kter\u00e9 palivo produkuje nejm\u00e9n\u011b emis\u00ed CO\u2082?',
    'faq_a2': 'Elektrick\u00e1 vozidla produkuj\u00ed nejni\u017e\u0161\u00ed emise, n\u00e1sledovan\u00e1 hybridn\u00edmi a LPG mo\u017enostmi.',
    'faq_q3': 'Jak \u010dasto jsou ceny paliv aktualizov\u00e1ny?',
    'faq_a3': 'Ceny jsou aktualizov\u00e1ny denn\u011b pomoc\u00ed na\u0161eho automatizovan\u00e9ho potrub\u00ed z v\u00edce zdroj\u016f.',
    'relatedCities': 'Souvisej\u00edc\u00ed m\u011bsta',
    'seo_homeTitle': 'FuelCost.info - Porovnejte ceny benz\u00ednu, nafty, LPG a elektromobil\u016f ve v\u00edce ne\u017e 48 000 m\u011bstech',
    'seo_homeDescription': 'Porovnejte ceny paliv ve v\u00edce ne\u017e 48 000 m\u011bstech po cel\u00e9m sv\u011bt\u011b. Z\u00edskejte aktu\u00e1ln\u00ed n\u00e1klady na benz\u00edn, naftu, LPG a nab\u00edjen\u00ed elektromobil\u016f. Napl\u00e1nujte svou trasu a u\u0161et\u0159ete.',
    'fuelGuideLabel': 'Pr\u016fvodce typy paliv',
    'aboutFuelTypes': 'O typech paliv',
    'readMore': 'P\u0159e\u010d\u011bte si v\u00edce o cen\u00e1ch paliv',
}

def build_new_entries(d):
    """Build the new entries string for a language."""
    entries = f'''    "breadcrumb": {{
      "home": "{d['breadcrumb_home']}"
    }},
    "faq": {{
      "title": "{d['faq_title']}",
      "question1": "{d['faq_q1']}",
      "answer1": "{d['faq_a1']}",
      "question2": "{d['faq_q2']}",
      "answer2": "{d['faq_a2']}",
      "question3": "{d['faq_q3']}",
      "answer3": "{d['faq_a3']}"
    }},
    "relatedCities": "{d['relatedCities']}",
    "seo": {{
      "homeTitle": "{d['seo_homeTitle']}",
      "homeDescription": "{d['seo_homeDescription']}"
    }},
    "fuelGuideLabel": "{d['fuelGuideLabel']}",
    "aboutFuelTypes": "{d['aboutFuelTypes']}",
    "readMore": "{d['readMore']}",
'''
    return entries

# Process each language - find the specific section and insert before its "fuelTypes"
lang_order = ['en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'nl', 'pl', 'ar', 'id', 'vi', 'hi', 'uk', 'ro', 'sv', 'no', 'da', 'fi', 'el', 'cs']

# Build a unique marker for each language section
# Use: the language key line + the title line + the closing brace before fuelTypes
# Actually, let's use a simpler approach: find each section by its language-specific content
# and make the replacement there.

# For each language, find the line containing    "startLocation": and the one containing
#     "fuelTypes": and insert new entries between them.

lines = content.split('\n')
new_lines = []

i = 0
current_lang = None
while i < len(lines):
    line = lines[i]
    
    # Check if this is a language header
    for lang in lang_order:
        if line.strip() == f'"{lang}":' or line.strip() == f'"{lang}": {{':
            current_lang = lang
            break
    
    # Check if we're at the line right before "fuelTypes"
    if current_lang and line.rstrip().startswith('"fuelTypes"') and not line.strip().startswith('//'):
        # Add the new entries before this line
        new_lines.append(build_new_entries(data[current_lang]))
        current_lang = None
    
    new_lines.append(line)
    i += 1

result = '\n'.join(new_lines)

with open('lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(result)

print(f"Done! File updated. Total lines: {len(result.split(chr(10)))}")
