# PortfolioAnalytics v0.0.3 ([Changelog](changelog.md))

[![Travis Build Status](https://travis-ci.org/lequant40/portfolio_analytics_js.svg?style=flat)](https://travis-ci.org/lequant40/portfolio_analytics_js)

Pour le suivi des performances de mes stratégies d'investissement en bourse, ainsi que pour l'analyse des stratégies que je publie sur mon blog [Le Quant 40](http://www.lequant40.com/), j'avais besoin de fonctions de mesures de performances de portefeuille en JavaScript.

Pourquoi en JavaScript ? Principalement parce que je suis un utilisateur inconditionel de [Google Sheets](https://www.google.fr/intl/fr/sheets/about/), qui est facilement extensible grâce à [Google Apps Script](https://developers.google.com/apps-script/), un language dérivé du JavaScript. 

Après avoir cherché en vain mon bonheur sur Internet (codes incomplets, ou avec trop de dépendances, ou non documentés, ou comportant beaucoup d'erreurs...), j'ai décidé de créer ma propre bibliothèque de fonctions, en espérant qu'elle puisse être utile à quelqu'un d'autre que moi...

## Caractéristiques

- Compatible avec Google Sheets
- Compatible avec les navigateurs supportant le ECMAScript 5 (i.e., développement front-end)
- Compatible avec [Node.js](https://nodejs.org/) (i.e., développement back-end)
- (Performances) Utilisation automatique des tableaux typés JavaScript
- (Performances et précision) Utilisation interne de méthodes d'algèbre linéaire similaires à celles de LAPACK (somme, produit scalaire...)
- (Précision) Utilisation interne de méthodes précises pour les calculs statistiques (algorithmes corrigés en deux passes pour le calcul de la moyenne, de la variance...)
- Code testé et intégré de manière continue avec [Travis CI](https://travis-ci.org/)
- Code documenté avec [JSDoc](http://usejsdoc.org/)

## Utilisation

### Utilisation avec Google Sheets

Si vous souhaitez utiliser PortfolioAnalytics avec Google Sheets dans vos feuilles de calcul, vous pouvez soit :

- (Solution recommandée) [Importer la bibliothèque externe](https://developers.google.com/apps-script/guide_libraries) de Script ID 1NXwj16pdgcJT-XG5LiWRJyRW604Dj26U4lqgGsJJfOKLum4y9grakXPI

ou soit :

- Importer les fichiers JavaScript contenus dans [le répertoire dist/gs](https://github.com/lequant40/portfolio_analytics_js/tree/master/dist/gs)

Dans les deux cas, vous pouvez ensuite appeler les fonctions de PortfolioAnalytics de la manière que vous préferez :

- En utilisant une fonction qui encapsule ces appels, fonction qui est directement accessible depuis votre feuille de calcul et à laquelle vous pouvez donc fournir une plage de données quelconque (A1:A99...), e.g.:

```js
function computeUlcerIndexWrapper(iEquityCurveRange) {
  // La plage d'entree est convertie en tableau
  var aInternalArray = [];
  for (var i=0; i<iEquityCurveRange.length; ++i) {
    aInternalArray.push(iEquityCurveRange[i][0]);
  }
    
  // Calcul de l'index par PortfolioAnalytics
  var ulcerIndex = PortfolioAnalytics.ulcerIndex(aInternalArray);
  
  // Renvoi de cet index a la feuille de calcul
  return ulcerIndex;
}
```

- En utilisant des fonctions internes à Google Apps Script - typiquement la famille de fonctions getRange(...) -, qui sont optimisées pour les performances, e.g.:

```js
function computeUlcerIndex() {
  // Adapte de https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow-column-numrows
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheets()[0];
 var range = sheet.getRange(1, 1, 100); // A1:A100
 var values = range.getValues();

 // Conversion de la plage ci-dessus en tableau
 var aInternalArray = [];
 for (var row in values) {
   for (var col in values[row]) {
     aInternalArray.push(values[row][col]);
   }
 }
 
  // Calcul de l'index
  var ulcerIndex = PortfolioAnalytics.ulcerIndex(aInternalArray);
  
  // Utilisation de l'index (nouveau calcul, ecriture dans la feuille de calcul...)
  ...
}
```

Vous trouverez des exemples d'utilisation spécifiques à Google Sheets (récupération des données depuis une plage de cellules, etc.) dans [cette feuille de calcul](https://docs.google.com/spreadsheets/d/16FDa3mhrvo8FTD62ravszhMZEkR-gIpipK4uLRNbj-o/edit?usp=sharing).

### Utilisation avec un navigateur

Si vous souhaitez utiliser PortfolioAnalytics avec un navigateur, vous pouvez télécharger [le code source](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.js) et/ou [le code source minifié](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.min.js).

Il vous suffit ensuite d'inclure ce code dans une page HTML, par exemple :

```html
	<script src="portfolio_analytics.dist.min.js" type="text/javascript"></script>
```

A noter que si le navigateur prend en charge les tableaux typés JavaScript, vous pouvez utiliser ces tableaux avec PortfolioAnalytics pour de meilleures performances, par exemple :
```html
	PortfolioAnalytics.arithmeticReturns(new Float64Array([100.0, 109.75, 111.25]))
	// Le type de retour sera un Float64Array
```

### Utilisation avec Node.js

A venir...

### Exemples

#### Mesures liées aux pertes (drawdowns)

```js
PortfolioAnalytics.maxDrawdown([1, 2, 1]); 
// == La perte maximale (maximum drawdown)

PortfolioAnalytics.drawdownFunction([1, 2, 1]); 
// == La fonction de pertes (drawdown function)

PortfolioAnalytics.topDrawdowns([1, 2, 1], 1); 
// == Les 'n' pertes maximales (second largest drawdown, etc.) avec leurs indexes de début/fin

PortfolioAnalytics.ulcerIndex([1, 2, 1]);
// == L'Ulcer Index

PortfolioAnalytics.painIndex([1, 2, 1]);
// == Le Pain Index, qui correspond aussi à la valeur moyenne de la fonction de pertes

PortfolioAnalytics.conditionalDrawdown([100, 90, 80], 0.5);
// == La perte conditionelle (conditional drawdown)
```

#### Mesures liées aux rendements

```js
PortfolioAnalytics.cumulativeReturn([1, 2, 1]); 
// Le rendement cumulé de la première à la dernière période

PortfolioAnalytics.cagr([1, 2, 1], [new Date("2015-12-31"), new Date("2016-12-31"), new Date("2017-12-31")]); 
// Le taux de croissance annuel composé (CAGR) de la première à la dernière date

PortfolioAnalytics.arithmeticReturns([1, 2, 1]); 
// Les rendements arithmétiques pour toutes les périodes

PortfolioAnalytics.valueAtRisk([1, 2, 1], 0.7);
// La valeur à risque en pourcentage (value at risk)
```

#### Mesures liées aux rendements par rapport à la variabilité

```js
PortfolioAnalytics.gainToPainRatio([1, 2, 1]); 
// Le ratio gain to pain
```

## Comment contribuer ?

### Forker le projet depuis [Github](https://github.com/)...


### Installer les dépendances [Grunt](http://gruntjs.com/)

```
npm install
```

### Développer...

### Compiler

- La commande suivante génère les fichiers à utiliser dans un navigateur ou avec Node.js dans le répertoire `dist` :

```
grunt deliver
```

- La commande suivante génère les fichiers à utiliser avec Google Sheets dans le répertoire `dist\gs` :

```
grunt deliver
```
### Tester

L'une ou l'autre des deux commandes suivantes exécute les tests unitaires [QUnit](https://qunitjs.com/) du répertoire `test` sur le fichier généré `dist\portfolio_analytics.dev.min.js` :

```
npm test
```

```
grunt test
```

### Soumettre une pull-request...


## License

[License MIT](https://fr.wikipedia.org/wiki/Licence_MIT)

