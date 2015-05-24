// TODO:
// 1. JÃ¤rjestÃ¤ tulokset
// 2. Varmista ettei mÃ¤Ã¤rÃ¤t mene miinuksen puolelle (dosage / TESTRUNS muutos step_intervalliin pitÃ¤isi korjata tÃ¤mÃ¤)
// 3. UI
// 4. Local storage?

// IDEAT:
// 1. Jokaiksella vitamiinilla voisi olla painoarvo. Kun scoreja lasketaan niin score kerrotaan vitamiinin painoarvolla ja lisÃ¤tÃ¤Ã¤n
//	totaaliscoreen. NÃ¤in ollen scoreCard jossa on suurimman painoarvon vitamiinit osunut kohdalleen saa eniten pisteitÃ¤.

var jf = require('jsonfile')

//	In this case dosage is "1" someting. 1g / 1mg / 1ug etc.
var dosage = 1;

//	Amount of tests to run 50/50 low/high
var TESTRUNS = 100;

//	Step up / down the dosage in this interval
var STEP_INTERVAL = dosage / TESTRUNS;

//	User input data for target values
var vitaminLimits = [
	{
		label: 'Vitamin A',
		lowLimit: 100,
		highLimit: 300
	},
	{
		label: 'Vitamin B',
		lowLimit: 300,
		highLimit: 1200
	},
	{
		label: 'Vitamin C',
		lowLimit: 1,
		highLimit: 2.4
	},
	{
		label: 'Vitamin D',
		lowLimit: 14,
		highLimit: 60
	}
]

// In this dosage we have the following values
var dosageAmounts = [
	{
		label: 'Vitamin A',
		amount: 400
	},
	{
		label: 'Vitamin B',
		amount: 4000
	},
	{
		label: 'Vitamin C',
		amount: 3
	},
	{
		label: 'Vitamin D',
		amount: 120
	}
]

var passed = {
	limits: [],
	test: []
};

var halfTestRuns = Math.floor(0.5 * TESTRUNS);
console.log("Halftestruns: ",halfTestRuns);

var testStartingDosage = dosage - (halfTestRuns * STEP_INTERVAL);
console.log("testStartingDosage: ",testStartingDosage);

var testEndingDosage = dosage + (halfTestRuns * STEP_INTERVAL);
console.log("testEndingDosage: ",testEndingDosage);

//	Test dosage is the dosage beign currently tested
var testDosage = testStartingDosage;

for(var i = 0; i < TESTRUNS; i++){
	var scoreCard = {};

	//	Scorecard for each test
	scoreCard.run = i;
	scoreCard.testDosage = testDosage;
	scoreCard.score = 0;
	scoreCard.results = [];

	dosageAmounts.forEach(function(row, i) {
		var result = {};


		// Test if amount is between the vitamin limits
		var vitaminLimitUnit = vitaminLimits[i];

		var amountInThisInterval = testDosage * row.amount;
		console.log("original amount: ",row.amount)
		console.log("amountInThisInterval: ",amountInThisInterval);

		//	Amount is between the limits
		if(amountInThisInterval > vitaminLimitUnit.lowLimit && amountInThisInterval < vitaminLimitUnit.highLimit){

			//	Incement score so that the best suitable amount is easy to pick (biggest score = most values are between limits)
			scoreCard.score++;

			result.label = row.label;
			result.amount = amountInThisInterval;
			result.passed = true;
		}else{
			result.label = row.label;
			result.amount = amountInThisInterval;
			result.passed = false;
		}

		scoreCard.results.push(result);
	});

	passed.test.push(scoreCard);

	testDosage = testDosage + STEP_INTERVAL;
}

passed.test.sort(function(a, b) {
	return b.score - a.score;
});

passed.limits = vitaminLimits;

var file = 'test-result.json';

jf.writeFile(file, passed, function(err) {
  console.log(err)
})

//console.log("PASSED: ",passed);
