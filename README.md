| [English version](readme.en.md)

# PortfolioAnalytics v0.0.1 ([Changelog](changelog.md))

[![Travis Build Status](https://travis-ci.org/lequant40/portfolio_analytics_js.svg?style=flat)](https://travis-ci.org/lequant40/portfolio_analytics_js)

Pour le suivi des performances de mes stratégies d'investissement en bourse, ainsi que pour l'analyse des stratégies que je publie sur mon blog [Le Quant 40](http://www.lequant40.com/), j'avais besoin de fonctions de mesures de performances de portefeuille en JavaScript.

Pourquoi en JavaScript ? Principalement parce que je suis un utilisateur inconditionel de [Google Sheets](https://www.google.fr/intl/fr/sheets/about/), qui est facilement extensible grâce à [Google Apps Script](https://developers.google.com/apps-script/), un language dérivé du JavaScript. 

Après avoir cherché en vain mon bonheur sur Internet (codes incomplets, ou avec trop de dépendances, ou non documentés, ou comportant beaucoup d'erreurs...), j'ai décidé de créer ma propre bibliothèque de fonctions, en espérant qu'elle puisse être utile à quelqu'un d'autre que moi...

## Caractéristiques

- Compatible avec Google Sheets
- Compatible avec les navigateurs supportant le ECMAScript 5 (i.e., développement front-end)
- Compatible avec [Node.js](https://nodejs.org/) (i.e., développement back-end)
- Code testé, documenté et lisible (en tout cas, j'espère :-))

## Utilisation

### Utilisation avec Google Sheets

Si vous souhaitez utiliser PortfolioAnalytics avec Google Sheets dans vos feuilles de calcul, vous pouvez soit :

- (Solution recommandée) Importer la bibliothèque externe de Script ID 1NXwj16pdgcJT-XG5LiWRJyRW604Dj26U4lqgGsJJfOKLum4y9grakXPI
- Importer les fichiers JavaScript contenus dans [le répertoire dist/gs](https://github.com/lequant40/portfolio_analytics_js/tree/master/dist/gs)

Vous trouverez des exemples d'utilisation spécifiques à Google Sheets (récupération des données depuis une plage de cellules, etc.) dans [cette feuille de calcul](https://docs.google.com/spreadsheets/d/16FDa3mhrvo8FTD62ravszhMZEkR-gIpipK4uLRNbj-o/edit?usp=sharing).

### Utilisation avec un navigateur

Si vous souhaitez utiliser PortfolioAnalytics avec un navigateur, vous pouvez télécharger le code source [ici](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.js) et/ou le code source minifié [ici](http://raw.github.com/lequant40/portfolio_analytics_js/master/dist/portfolio_analytics.dist.min.js).

Ensuite, il suffit de l'inclure ce code source dans la page HTML, par exemple :

```html
	<script src="portfolio_analytics.dist.min.js" type="text/javascript"></script>
```

### Utilisation avec Node.js

A venir...

### Exemples

```js
// Mesures liées aux pertes (drawdowns)
PortfolioAnalytics.maxDrawdown([1, 2, 1]); // == 0.5 - la perte maximale (maximum drawdown)
PortfolioAnalytics.drawdownFunction([1, 2, 1], 0, 2); // == [0.5, 1.0, 2.0] - la fonction de pertes (drawdown function)
PortfolioAnalytics.topDrawdowns([1, 2, 1], 1); // == [[0.5, 1.0, 2.0]] - les 'n' pertes maximales (second largest drawdown, and more generally, the 'n' largest drawdowns)
```


## Contribution

### Clonage du projet depuis [Github](https://github.com/)

```
git clone git://github.com/lequant40/portfolio_analytics_js.git

cd portfolio_analytics_js
```

### Installation des dépendances [Grunt](http://gruntjs.com/):

```
npm install
```

### Compilation et tests

La commande suivante génère plusieurs fichiers dans le répertoire `dist` et exécute les tests unitaires (répertoire `test`) [QUnit](https://qunitjs.com/) sur le fichier `dist\portfolio_analytics.dev.min.js` :

```
grunt deliver
```


## License

[License MIT](https://fr.wikipedia.org/wiki/Licence_MIT)

