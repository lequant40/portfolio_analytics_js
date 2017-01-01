# PortfolioAnalytics v0.0.2 ([Changelog](changelog.md))

[![Travis Build Status](https://travis-ci.org/lequant40/portfolio_analytics_js.svg?style=flat)](https://travis-ci.org/lequant40/portfolio_analytics_js)

Pour le suivi des performances de mes stratégies d'investissement en bourse, ainsi que pour l'analyse des stratégies que je publie sur mon blog [Le Quant 40](http://www.lequant40.com/), j'avais besoin de fonctions de mesures de performances de portefeuille en JavaScript.

Pourquoi en JavaScript ? Principalement parce que je suis un utilisateur inconditionel de [Google Sheets](https://www.google.fr/intl/fr/sheets/about/), qui est facilement extensible grâce à [Google Apps Script](https://developers.google.com/apps-script/), un language dérivé du JavaScript. 

Après avoir cherché en vain mon bonheur sur Internet (codes incomplets, ou avec trop de dépendances, ou non documentés, ou comportant beaucoup d'erreurs...), j'ai décidé de créer ma propre bibliothèque de fonctions, en espérant qu'elle puisse être utile à quelqu'un d'autre que moi...

## Caractéristiques

- Compatible avec Google Sheets
- Compatible avec les navigateurs supportant le ECMAScript 5 (i.e., développement front-end)
- Compatible avec [Node.js](https://nodejs.org/) (i.e., développement back-end)
- (Performances) Utilisation automatique des tableaux typés JavaScript
- Code testé et intégré de manière continue avec [Travis CI](https://travis-ci.org/)
- Code documenté avec [JSDoc](http://usejsdoc.org/)

## Utilisation

### Utilisation avec Google Sheets

Si vous souhaitez utiliser PortfolioAnalytics avec Google Sheets dans vos feuilles de calcul, vous pouvez soit :

- (Solution recommandée) [Importer la bibliothèque externe](https://developers.google.com/apps-script/guide_libraries) de Script ID 1NXwj16pdgcJT-XG5LiWRJyRW604Dj26U4lqgGsJJfOKLum4y9grakXPI
- Importer les fichiers JavaScript contenus dans [le répertoire dist/gs](https://github.com/lequant40/portfolio_analytics_js/tree/master/dist/gs)

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
// == 0.5 - la perte maximale (maximum drawdown)

PortfolioAnalytics.drawdownFunction([1, 2, 1]); 
// == [0.0, 0.0, 0.5] - la fonction de pertes (drawdown function)

PortfolioAnalytics.topDrawdowns([1, 2, 1], 1); 
// == [[0.5, 1.0, 2.0]] - les 'n' pertes maximales (second largest drawdown, etc.) avec leurs indexes de début/fin

PortfolioAnalytics.ulcerIndex([1, 2, 1]);
// == ~0.289 - l'Ulcer Index

PortfolioAnalytics.painIndex([1, 2, 1]);
// == ~0.167- le Pain Index, qui correspond aussi à la valeur moyenne de la fonction de pertes

PortfolioAnalytics.conditionalDrawdown([100, 90, 80], 0.5);
// == 0.2 - la perte conditionelle (conditional drawdown) au niveau alpha 0.5
  
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

