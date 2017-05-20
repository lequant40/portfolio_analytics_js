// ------------------------------------------------------------
QUnit.module('Distributions module', {
  before: function() {
	//
  }
});


QUnit.test('Norminv computation', function(assert) {    
  // Boundaries
  assert.equal(PortfolioAnalytics.norminv_(0), Number.NEGATIVE_INFINITY, 'Norminv -inf');  
  assert.equal(PortfolioAnalytics.norminv_(1), Number.POSITIVE_INFINITY, 'Norminv +inf');  
      
  // Values taken from Wolfram Alpha, with InverseCDF[NormalDistribution[0, 1], i/100] command, 22 digits precision requested.
  var p = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99];
  var x = [-2.326347874040841100886,-2.053748910631823052937,-1.880793608151250938868,-1.750686071252169979435,-1.644853626951472714864,-1.554773594596853541090,-1.475791028179170735221,-1.405071560309632555951,-1.340755033690216379613,-1.281551565544600466965,-1.226528120036610080449,-1.174986792066090005868,-1.126391129038800589205,-1.080319340814956118530,-1.036433389493789579713,-0.9944578832097531677397,-0.9541652531461944091517,-0.9153650878428140497859,-0.8778962950512285953771,-0.8416212335729142051787,-0.8064212470182402084887,-0.7721932141886846986886,-0.7388468491852136293212,-0.7063025628400874558801,-0.6744897501960817432022,-0.6433454053929169647476,-0.6128129910166272255783,-0.5828415072712162186919,-0.5533847195556728193145,-0.5244005127080407840383,-0.4958503473474533265668,-0.4676987991145082144086,-0.4399131656732338077535,-0.4124631294414047958027,-0.3853204664075676238108,-0.3584587932511937384668,-0.3318533464368165782307,-0.3054807880993973393709,-0.2793190344474541653227,-0.2533471031357997987982,-0.2275449766411494098089,-0.2018934791418508509514,-0.1763741647808613218049,-0.1509692154967772588685,-0.1256613468550740342102,-0.1004337205114697931399,-0.07526986209982982978492,-0.05015358346473361602091,-0.02506890825871103576236,0,0.02506890825871103576236,0.05015358346473361602091,0.07526986209982982978492,0.1004337205114697931399,0.1256613468550740342102,0.1509692154967772588685,0.1763741647808613218049,0.2018934791418508509514,0.2275449766411494098089,0.2533471031357997987982,0.2793190344474541653227,0.3054807880993973393709,0.3318533464368165782307,0.3584587932511937384668,0.3853204664075676238108,0.4124631294414047958027,0.4399131656732338077535,0.4676987991145082144086,0.4958503473474533265668,0.5244005127080407840383,0.5533847195556728193145,0.5828415072712162186919,0.6128129910166272255783,0.6433454053929169647476,0.6744897501960817432022,0.7063025628400874558801,0.7388468491852136293212,0.7721932141886846986886,0.8064212470182402084887,0.8416212335729142051787,0.8778962950512285953771,0.9153650878428140497859,0.9541652531461944091517,0.9944578832097531677397,1.036433389493789579713,1.080319340814956118530,1.126391129038800589205,1.174986792066090005868,1.226528120036610080449,1.281551565544600466965,1.340755033690216379613,1.405071560309632555951,1.475791028179170735221,1.554773594596853541090,1.644853626951472714864,1.750686071252169979435,1.880793608151250938868,2.053748910631823052937,2.326347874040841100886];

  // Check that the algorithm has a relative error whose absolute value is less than 1.15e-9 on the points sampled
  // Check that the algorithm has a relative error better than above when extended precision is requested on the points sampled
  for (var i=0; i<p.length; ++i) {
	assert.ok(Math.abs( (PortfolioAnalytics.norminv_(p[i]) - x[i]) ) <= 1.15e-9 * Math.abs(x[i]), 'Norminv comparison v.s. Wolfram Alpha');
	assert.ok(Math.abs( (PortfolioAnalytics.norminv_(p[i], true) - x[i]) ) <= 1e-14 * Math.abs(x[i]), 'Norminv comparison extended precision v.s. Wolfram Alpha');
  }  
});


QUnit.test('Normcdf computation', function(assert) {    
  // Boundaries
  assert.equal(PortfolioAnalytics.normcdf_(0), 0.5, 'Norminv -inf'); 
  
  // Values taken from Wolfram Alpha, with CDF[NormalDistribution[0, 1], i/100] command, 22 digits precision requested.
  var x = [-1/10,2/10,-3/10,-4/10,-5/10,-6/10,-7/10,-8/10,-9/10,-10/10,-11/10,-12/10,-13/10,-14/10,-15/10,-16/10,-17/10,-18/10,-19/10,-20/10,-21/10,-22/10,-23/10,-24/10,-25/10,-26/10,-27/10,-28/10,-29/10,-30/10,-31/10,-32/10,-33/10,-34/10,-35/10,-36/10,-37/10,-38/10,-39/10,-40/10,-41/10,-42/10,-43/10,-44/10,-45/10,-46/10,-47/10,-48/10,-49/10,-50/10,-51/10,-52/10,-53/10,-54/10,-55/10,-56/10,-57/10,-58/10,-59/10,-60/10,-61/10,-62/10,-63/10,-64/10,-65/10,-66/10,-67/10,-68/10,-69/10,-70/10,-71/10,-72/10,-73/10,-74/10,-75/10,-76/10,-77/10,-78/10,-79/10,-80/10,-81/10,-82/10,-83/10,-84/10,-85/10,-86/10,-87/10,-88/10,-89/10,-90/10,-91/10,-92/10,-93/10,-94/10,-95/10,-96/10,-97/10,-98/10,-99/10,-100/10, 1/10,2/10,3/10,4/10,5/10,6/10,7/10,8/10,9/10,10/10,11/10,12/10,13/10,14/10,15/10,16/10,17/10,18/10,19/10,20/10,21/10,22/10,23/10,24/10,25/10,26/10,27/10,28/10,29/10,30/10,31/10,32/10,33/10,34/10,35/10,36/10,37/10,38/10,39/10,40/10,41/10,42/10,43/10,44/10,45/10,46/10,47/10,48/10,49/10,50/10,51/10,52/10,53/10,54/10,55/10,56/10,57/10,58/10,59/10,60/10,61/10,62/10,63/10,64/10,65/10,66/10,67/10,68/10,69/10,70/10,71/10,72/10,73/10,74/10,75/10,76/10,77/10,78/10,79/10,80/10,81/10,82/10,83/10,84/10,85/10,86/10,87/10,88/10,89/10,90/10,91/10,92/10,93/10,94/10,95/10,96/10,97/10,98/10,99/10,100/10];
  var p =[0.4601721627229710185346,0.5792597094391030230424,0.3820885778110473626935,0.3445782583896758332631,0.3085375387259868963623,0.2742531177500735802944,0.2419636522230730147494,0.2118553985833966855755,0.1840601253467594885542,0.1586552539314570514148,0.1356660609463826751731,0.1150696702217082680222,0.09680048458561033315201,0.08075665923377104649619,0.06680720126885806600449,0.05479929169955799396047,0.04456546275854303948743,0.03593031911292580396033,0.02871655981600179940134,0.02275013194817920720028,0.01786442056281655678392,0.01390344751349861061475,0.01072411002167580539236,0.008197535924596129444387,0.006209665325776135166978,0.004661188023718750250993,0.003466973803040668495942,0.002555130330427932801531,0.001865813300384037950310,0.001349898031630094526652,0.0009676032132183568921157,0.0006871379379158484551177,0.0004834241423837772011101,0.0003369292656768809394098,0.0002326290790355250363499,0.0001591085901575338796651,0.0001077997334773883369375,0.00007234804392511997399341,0.00004809634401760271714671,0.00003167124183311992125377,0.00002065750691254673879525,0.00001334574901590633835309,8.539905470991804195354e-6,5.412543907703859841921e-6,3.397673124730060401687e-6,2.112454702502849769124e-6,1.300807453917282059602e-6,7.933281519755946161470e-7,4.791832765903198532984e-7,2.866515718791939116738e-7,1.698267407147598273938e-7,9.964426316933481269842e-8,5.790134039964588482705e-8,3.332044848542857284776e-8,1.898956246588771938385e-8,1.071759025831090735496e-8,5.990371401063534429834e-9,3.315745978326161338027e-9,1.817507863099432371362e-9,9.865876450376981407009e-10,5.303423262948829737329e-10,2.823158037043274469652e-10,1.488228221762310961320e-10,7.768847581709830408558e-11,4.016000583859117808346e-11,2.055788909399517967613e-11,1.042097698796519370792e-11,5.230957544144587508727e-12,2.600126965638172838025e-12,1.279812543885835004384e-12,6.237844463331575105220e-13,3.010627981117437487237e-13,1.438838638157585748676e-13,6.809224890620033184947e-14,3.190891672910896227767e-14,1.480653749004804708609e-14,6.803311540773970775939e-15,3.095358771958695450558e-15,1.394517146659268252841e-15,6.220960574271784123516e-16,2.747959392398220468854e-16,1.201935154273578710970e-16,5.205569744890285157996e-17,2.232393197288050341136e-17,9.479534822203318354151e-18,3.985804962848169561416e-18,1.659420869964773833918e-18,6.840807685935589292706e-19,2.792334374939655566956e-19,1.128588405953840647736e-19,4.516591491435442087441e-20,1.789748812014040789999e-20,7.022284240441672958777e-21,2.728153571346126105605e-21,1.049451507536260749283e-21,3.997221205726226709960e-22,1.507493168810194374794e-22,5.629282311376572223463e-23,2.081375219493213518484e-23,7.619853024160526065973e-24, 0.5398278372770289814654,0.5792597094391030230424,0.6179114221889526373065,0.6554217416103241667369,0.6914624612740131036377,0.7257468822499264197056,0.7580363477769269852506,0.7881446014166033144245,0.8159398746532405114458,0.8413447460685429485852,0.8643339390536173248269,0.8849303297782917319778,0.9031995154143896668480,0.9192433407662289535038,0.9331927987311419339955,0.9452007083004420060395,0.9554345372414569605126,0.9640696808870741960397,0.9712834401839982005987,0.9772498680518207927997,0.9821355794371834432161,0.9860965524865013893852,0.9892758899783241946076,0.9918024640754038705556,0.9937903346742238648330,0.9953388119762812497490,0.9965330261969593315041,0.9974448696695720671985,0.9981341866996159620497,0.9986501019683699054733,0.9990323967867816431079,0.9993128620620841515449,0.9995165758576162227989,0.9996630707343231190606,0.9997673709209644749637,0.9998408914098424661203,0.9998922002665226116631,0.9999276519560748800260,0.9999519036559823972829,0.9999683287581668800787,0.9999793424930874532612,0.9999866542509840936616,0.9999914600945290081958,0.9999945874560922961402,0.9999966023268752699396,0.9999978875452974971502,0.9999986991925460827179,0.9999992066718480244054,0.9999995208167234096801,0.9999997133484281208061,0.9999998301732592852402,0.9999999003557368306652,0.9999999420986596003541,0.9999999666795515145714,0.9999999810104375341123,0.9999999892824097416891,0.9999999940096285989365,0.9999999966842540216738,0.9999999981824921369006,0.9999999990134123549623,0.9999999994696576737051,0.9999999997176841962957,0.9999999998511771778238,0.9999999999223115241829,0.9999999999598399941614,0.9999999999794421109060,0.9999999999895790230120,0.9999999999947690424559,0.9999999999973998730344,0.9999999999987201874561,0.9999999999993762155537,0.9999999999996989372019,0.9999999999998561161362,0.9999999999999319077511,0.9999999999999680910833,0.9999999999999851934625,0.9999999999999931966885,0.9999999999999969046412,0.9999999999999986054829,0.9999999999999993779039,0.9999999999999997252041,0.9999999999999998798065,0.9999999999999999479443,0.9999999999999999776761,0.9999999999999999905205,0.9999999999999999960142,0.9999999999999999983406,0.9999999999999999993159,0.9999999999999999997208,0.9999999999999999998871,0.9999999999999999999548,0.9999999999999999999821,0.9999999999999999999930,0.9999999999999999999973,0.9999999999999999999990,0.9999999999999999999996,0.9999999999999999999998,0.9999999999999999999999,1.000000000000000000000,1.000000000000000000000];
  
  // Check that the algorithm has an absolute error of less than 8e−16 on the points sampled
  for (var i=0; i<x.length; ++i) {
	assert.ok(Math.abs( (PortfolioAnalytics.normcdf_(x[i]) - p[i]) ) <= 8e-14, 'Normcdf comparison v.s. Wolfram Alpha');
  } 
});


QUnit.test('Erf computation', function(assert) {    
  // Boundaries
  assert.equal(PortfolioAnalytics.erf_(26.543e0), 1, 'Erf -boundary');  
  assert.equal(PortfolioAnalytics.erf_(-26.543e0), -1, 'Erf +boundary');  
  assert.equal(PortfolioAnalytics.erf_(0), 0, 'Erf 0');
  
  // Values taken from Wolfram Alpha, with Erf[i/10] command, 32 digits precision requested.
  var x = [1/10,2/10,3/10,4/10,5/10,6/10,7/10,8/10,9/10,10/10,11/10,12/10,13/10,14/10,15/10,16/10,17/10,18/10,19/10,20/10,21/10,22/10,23/10,24/10,25/10,26/10,27/10,28/10,29/10,30/10,31/10,32/10,33/10,34/10,35/10,36/10,37/10,38/10,39/10,40/10,41/10,42/10,43/10,44/10,45/10,46/10,47/10,48/10,49/10,50/10, 51/10,52/10,53/10,54/10,55/10,56/10,57/10,58/10,59/10,60/10,61/10,62/10,63/10,64/10,65/10,66/10,67/10,68/10,69/10,70/10,71/10,72/10,73/10,74/10,75/10,76/10,77/10,78/10,79/10,80/10,81/10,82/10,83/10,84/10,85/10,86/10,87/10,88/10,89/10,90/10,91/10,92/10,93/10,94/10,95/10,96/10,97/10,98/10,99/10,100/10];
  var y = [0.11246291601828489220327507174397,0.22270258921047845414013900680014,0.32862675945912742763891404786676,0.42839235504666845510360384532017,0.52049987781304653768274665389196,0.60385609084792592256262243605672,0.67780119383741847297562880924415,0.74210096470766048616711058650295,0.79690821242283212851872478514189,0.84270079294971486934122063508261,0.88020506957408169977186776632192,0.91031397822963538023840577571537,0.93400794494065243660389332750371,0.95228511976264881051648269153343,0.96610514647531072706697626164595,0.97634838334464400777428344714200,0.98379045859077456362624258812188,0.98909050163573071418373281075585,0.99279042923525746994835753930335,0.99532226501895273416206925636725,0.99702053334366701449611498335898,0.99813715370201810855654824397137,0.99885682340264334853465254061923,0.99931148610335492143025506782937,0.99959304798255504106043578426003,0.99976396558347065079600899679246,0.99986566726005947567085988127982,0.99992498680533454097577675475190,0.99995890212190054116431613251112,0.99997790950300141455862722387042,0.99998835134263280040396629383655,0.99999397423884823790502825763716,0.99999694229020356183853819659731,0.99999847800663713771463824286234,0.99999925690162765858725447631624,0.99999964413700699231470118444358,0.99999983284894209085379762592446,0.99999992299607254303587130180218,0.99999996520775140276825772169236,0.99999998458274209971998114784033,0.99999999329997234591510162727327,0.99999999714450582040781138425078,0.99999999880652820627795869604907,0.99999999951082897293941115820427,0.99999999980338395584571125237208,0.99999999992250400402558168108137,0.99999999997004740213620339679457,0.99999999998864785641507803904511,0.99999999999578106347599421857026,0.99999999999846254020557196514981,0.99999999999945061797824447004030,0.99999999999980750938900027640306,0.99999999999993386918149659201738,0.99999999999997772321320532205214,0.99999999999999264215208202560194,0.99999999999999761716371541698163,0.99999999999999924337883781374986,0.99999999999999976444106248435634,0.99999999999999992809590216449492,0.99999999999999997848026328750109,0.99999999999999999368539784980631,0.99999999999999999818332438276187,0.99999999999999999948757783126043,0.99999999999999999985829196523316,0.99999999999999999996157851672879,0.99999999999999999998978674832142,0.99999999999999999999733828542362,0.99999999999999999999931991394347,0.99999999999999999999982963958070,0.99999999999999999999995816174392,0.99999999999999999999998992659748,0.99999999999999999999999762220543,0.99999999999999999999999944974262,0.99999999999999999999999987516144,0.99999999999999999999999997223351,0.99999999999999999999999999394546,0.99999999999999999999999999870573,0.99999999999999999999999999972876,0.99999999999999999999999999994427,0.99999999999999999999999999998878,0.99999999999999999999999999999778,0.99999999999999999999999999999957,0.99999999999999999999999999999992,0.99999999999999999999999999999998,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000,1.0000000000000000000000000000000];
  
  // Check the relative error on the sampled points on the interval [0,10].
  // Contrary to the claims made in the function prototype, tests show that the relative error and the absolute error
  // are not what they are described.
  // Relative error of ~10^-15 is the best attained on the sampled points, which is not that a big deal since the number of significant
  // digits in double precision is around 16 anyway...
  for (var i=0; i<x.length; ++i) {
	assert.ok(Math.abs( (PortfolioAnalytics.erf_(x[i]) - y[i]) ) <= 1e-15* Math.abs(y[i]), 'Erf comparison v.s. Wolfram Alpha');
	assert.equal(PortfolioAnalytics.erf_(-x[i]), -PortfolioAnalytics.erf_(x[i]), 'Erf(-x) = -Erf(x)');
  }  
});


QUnit.test('Erfc computation', function(assert) {    
  // Boundaries
  assert.equal(PortfolioAnalytics.erfc_(26.543e0), 0, 'Erfc -boundary');  
  assert.equal(PortfolioAnalytics.erfc_(-26.543e0), 2, 'Erfc +boundary');  
  assert.equal(PortfolioAnalytics.erfc_(0), 1, 'Erfc 0');
  
  // Values taken from Wolfram Alpha, with Erfc[i/10] command, 32 digits precision requested.
  var x = [1/10,2/10,3/10,4/10,5/10,6/10,7/10,8/10,9/10,10/10,11/10,12/10,13/10,14/10,15/10,16/10,17/10,18/10,19/10,20/10,21/10,22/10,23/10,24/10,25/10,26/10,27/10,28/10,29/10,30/10,31/10,32/10,33/10,34/10,35/10,36/10,37/10,38/10,39/10,40/10,41/10,42/10,43/10,44/10,45/10,46/10,47/10,48/10,49/10,50/10,51/10,52/10,53/10,54/10,55/10,56/10,57/10,58/10,59/10,60/10,61/10,62/10,63/10,64/10,65/10,66/10,67/10,68/10,69/10,70/10,71/10,72/10,73/10,74/10,75/10,76/10,77/10,78/10,79/10,80/10,81/10,82/10,83/10,84/10,85/10,86/10,87/10,88/10,89/10,90/10,91/10,92/10,93/10,94/10,95/10,96/10,97/10,98/10,99/10,100/10];
  var y = [0.88753708398171510779672492825603,0.77729741078952154585986099319986,0.67137324054087257236108595213324,0.57160764495333154489639615467983,0.47950012218695346231725334610804,0.39614390915207407743737756394328,0.32219880616258152702437119075585,0.25789903529233951383288941349705,0.20309178757716787148127521485811,0.15729920705028513065877936491739,0.11979493042591830022813223367808,0.089686021770364619761594224284626,0.065992055059347563396106672496289,0.047714880237351189483517308466568,0.033894853524689272933023738354052,0.023651616655355992225716552857996,0.016209541409225436373757411878119,0.010909498364269285816267189244151,0.0072095707647425300516424606966481,0.0046777349810472658379307436327471,0.0029794666563329855038850166410235,0.0018628462979818914434517560286267,0.0011431765973566514653474593807691,0.00068851389664507856974493217063168,0.00040695201744495893956421573997491,0.00023603441652934920399100320754396,0.00013433273994052432914011872018009,0.000075013194665459024223245248099073,0.000041097878099458835683867488875795,0.000022090496998585441372776129582320,0.000011648657367199596033706163453034,6.0257611517620949717423628361071e-6,3.0577097964381614618034026870820e-6,1.5219933628622853617571376573568e-6,7.4309837234141274552368375609564e-7,3.5586299300768529881555641991706e-7,1.6715105790914620237407554121863e-7,7.7003927456964128698197817895929e-8,3.4792248597231742278307635161514e-8,1.5417257900280018852159673486884e-8,6.7000276540848983727267338076342e-9,2.8554941795921886157492192281762e-9,1.1934717937220413039509333336046e-9,4.8917102706058884179573427660978e-10,1.9661604415428874762791603676643e-10,7.7495995974418318918628409475904e-11,2.9952597863796603205425166193223e-11,1.1352143584921960954885445294122e-11,4.2189365240057814297363618127549e-12,1.5374597944280348501883434853834e-12,5.4938202175552995970065229574613e-13,1.9249061099972359694173491459377e-13,6.6130818503407982620633350861744e-14,2.2276786794677947857714513668666e-14,7.3578479179743980630683623985701e-15,2.3828362845830183671460507352978e-15,7.5662116218625013625471041464421e-16,2.3555893751564366489008784336345e-16,7.1904097835505082898529686245915e-17,2.1519736712498913116593350399187e-17,6.3146021501936904066059443647239e-18,1.8166756172381310723782403459068e-18,5.1242216873957039392399444201550e-19,1.4170803476684115331030797811134e-19,3.8421483271206474698758045437688e-20,1.0213251678575745537046011994277e-20,2.6617145763765944138996886584408e-21,6.8008605653312335097097819251267e-22,1.7036041929656905108542680954471e-22,4.1838256077794143986140102238999e-23,1.0073402520858387751288709091964e-23,2.3777945663263091908068282431779e-24,5.5025737506919080142139797931838e-25,1.2483856463533282061979619091847e-25,2.7766493860305691006639662093224e-26,6.0545351804892769403467496119508e-27,1.2942740067717171625282256270796e-27,2.7124113294366022755581582065466e-28,5.5727180569525767059017570092626e-29,1.1224297172982927079967888443170e-29,2.2163085720657411296966533193339e-30,4.2902120227629316657005119660656e-31,8.1414783530249892574441448041186e-32,1.5146153527973109841590733642699e-32,2.7623240713337714461345029300578e-33,4.9387695707741782284129321114201e-34,8.6563234754127823663516910334395e-35,1.4873648892442622746992464681948e-35,2.5053574980338516077953856808149e-36,4.1370317465138102380539034673625e-37,6.6969004279885641850576832455035e-38,1.0627315595404748656942995199936e-38,1.6532441840301569593991955644029e-39,2.5212336392627164900750726795713e-40,3.7692144856548799416770873210473e-41,5.5239445993750064686381382700811e-42,7.9361075632144017752366600410323e-43,1.1176984190571432073491269651660e-43,1.5431200214053183950564774814395e-44,2.0884875837625447570007862949578e-45];
  
  // Check the relative error on the sampled points on the interval [0,10].
  // Contrary to the claims made in the function prototype, tests show that the relative error and the absolute error
  // are not what they are described.
  // Relative error of ~5*10^-14 is the best attained on the sampled points...
  for (var i=0; i<x.length; ++i) {
	assert.ok(Math.abs( (PortfolioAnalytics.erfc_(x[i]) - y[i]) ) <= 5e-14* Math.abs(y[i]), 'Erfc comparison v.s. Wolfram Alpha');
	assert.equal(PortfolioAnalytics.erfc_(-x[i]), 2-PortfolioAnalytics.erfc_(x[i]), 'Erfc(-x) = 2-Erfc(x)');
  }
});