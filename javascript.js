console.log("'startGame()' to start");
var suits = ["spades", "diamonds", "clubs", "hearts"];
var playerValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
var jValues = ["J"];
var qValues = ["Q"];
var kValues = ["K"];
var monsterDeck = new Array();
var drawDeck = new Array();
var discardDeck = new Array();
var handDeck = new Array();
var playedCard = new Array();
var playedDeck = new Array();
var playedThisRound = new Array();
var lostedDeck = new Array();
var monster = new Array();
var sumValue = 0;
var jesterCount = 0;
var indexOfMonster = 0;
var gameStage = 0;
var round = 0;

function getDeck(deckvalue){
	let deck = new Array();
		
		for(let i = 0 ; i <suits.length ; i++ ){
			for(let j = 0 ; j<deckvalue.length; j++){
				let card ={Value:deckvalue[j], Suit:suits[i]};
				deck.push(card);
			}
		}
	return deck;
}

function shuffle(deck){
	// for 1000 turns
	// switch the valuus of two random cards
	for (let i = 0; i<1000 ; i++){
		let location1 = Math.floor((Math.random()*deck.length));
		let location2 = Math.floor((Math.random()*deck.length));
		let tmp = deck[location1];
		
		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

function getMonsterDeck(){
	let tmpDeckJ = getDeck(jValues);
	let tmpDeckQ = getDeck(qValues);
	let tmpDeckK = getDeck(kValues);
	shuffle(tmpDeckJ);
	shuffle(tmpDeckQ);
	shuffle(tmpDeckK);
	monsterDeck = tmpDeckJ.concat(tmpDeckQ,tmpDeckK)
}

function getHandDeck(){
	drawDeck = getDeck(playerValues);
	shuffle(drawDeck);
	handDeck = drawDeck.slice(0,8);
	drawDeck.splice(0,8);
}

function getMonster(){
	//getMonsterDeck();
	
	monster = monsterDeck.slice(0,1);
	monsterDeck.shift();

	
	if (monster[0].Value === "J"){
		let stat = {Health:20,Power:10}
		monster = monster.concat(stat)
	}
	if (monster[0].Value === "Q"){
		let stat = {Health:30,Power:15}
		monster = monster.concat(stat)
	}
	if (monster[0].Value === "K"){
		let stat = {Health:40,Power:20}
		monster = monster.concat(stat)
	}
	
}

function showStat(){
	console.log(`Monster : ${monster[0].Value} of ${monster[0].Suit}.`);
	console.log(`Health: ${monster[1].Health} Power : ${monster[1].Power}`);
	console.log(`Discard Pile : ${discardDeck.length}  Drawing Pile : ${drawDeck.length}`)
	console.log(`Played Pile: ${playedDeck.length} Jester : ${jesterCount}`)
	console.log(`Monster : ${indexOfMonster} ; Round : ${round}`);
	console.log("Hands:");
	displayHand();
}

function startGame(){
	getHandDeck();
	getMonsterDeck();
	jesterCount = 2;
	indexOfMonster = 0;
	while(monsterDeck.length > 0 && gameStage === 0){
	round = 0;
	getMonster();
	//showStat();
	indexOfMonster++;
	combatRound(indexOfMonster);
	}
	if (monster[1].Health <= 0 && monsterDeck.length === 0){
	alert("YOU WIN");	
	}
	
}

function resumeGame(){
	if (gameStage === 1){
		
		console.clear();
		gameStage = 0;
		//showStat();
		round --;
		combatRound(indexOfMonster);
		
	}else if (gameStage === 2 ){
		
		console.clear();
		gameStage = 0;
		//showStat();
		monsterRound();
		combatRound(indexOfMonster);
		}
	while(monsterDeck.length > 0 && gameStage === 0){
	round = 0;
	getMonster();
	//showStat();
	indexOfMonster++;
	combatRound(indexOfMonster);
	}
	if (monster[1].Health <= 0 && monsterDeck.length === 0){
	alert("YOU WIN");	
	}


}

function combatRound(num){
	
	while (Number(monster[1].Health) > 0  && gameStage === 0 ){
	round++;
	
	playerRound();
		if (Number(monster[1].Health) > 0 && Number(monster[1].Power ) > 0  && gameStage === 0 ){
		//showStat();
		monsterRound();
		};
	}
	return;
}

function jester() {
	if (jesterCount > 0){
	for ( let i = handDeck.length ; i > 0 ; i-- ){
		discardDeck.push(handDeck.shift());
	}
	for ( let j = 0 ; j < 8 ; j++){
		handDeck.push(drawDeck.shift());
	}		
	jesterCount --;
	console.log(`You use a Jester`);
	}else{
	console.log("No More Jester");
	}
}
function playerRound(){
	gameStage = 1;
	showStat();
	console.log("You Attack");
	if (handDeck.length === 0 && jesterCount === 0){
		alert("You Lose, no handDeck and no Jester")
	}else{
	let playerInput = prompt(
`You Attack!
Play your card, J : 10 ; Q : 15 ; K : 20 
Play mutiple card by enter all their index(123)
'*' to use Jester , 's' to sort your hand`);
	if(playerInput === null){
	console.log("'resumeGame()' to resume");
	}else if (playerInput === ("*")){
	jester();
	playerRound();
	}else if(Number(playerInput)+1){
	gameStage = 0;
	play(playerInput);
	}else if(playerInput === "s" || playerInput === "S"){
	handDeck.sort(compare);
	//showStat();
	playerRound();
	}else if(playerInput !== null){
	console.log(`Invalid Input`);
	playerRound()
	}
	}
}

 function compare(a, b) {          
      if (a.Suit === b.Suit) {
         if(playedValue(a) > playedValue(b)){
		 return 1;}
		 else{
		 return -1;}
      }
      return a.Suit > b.Suit ? 1 : -1;
   }
   
function play(card){

	sumValue = 0;
	for (let i = 0 ; i<card.length;i++){
	playedCard = handDeck[Number(card[i])];
	playedThisRound = playedThisRound.concat(playedCard);
	sumValue += playedValue(playedCard);
	}
	if (specialPlay()=== true ){
		//discard card
	for (let i = 0 ; i < playedThisRound.length ; i++){
		//let idx = handDeck.indexOf(playedThisRound[i]);
		playedDeck = playedDeck.concat(playedThisRound[i]);	
		handDeck = handDeck.filter(x => !playedThisRound.includes(x));		
		//handDeck.splice(idx,1);
	}
	//handDeck = handDeck.filter(x => !playedThisRound.includes(x));
	suitPower(sumValue);
	//console.log(`Played Card :`);
	//console.log(playedCard);
	console.log(`Played Card In This Round:`);
	console.log(playedThisRound);
	//showStat();
	playedThisRound = [];
	}else{
		console.log("Illegal Play");
		playedThisRound = [];
		playerRound();
	}
}

function specialPlay(){
	//function to check if allEqual
	const allEqual = arr => arr.every(val => val === arr[0]);
	let allValuePlayed = [];
	for ( let i = 0; i < playedThisRound.length ; i++){
	allValuePlayed = allValuePlayed.concat(playedThisRound[i].Value);
	}
	if (allValuePlayed.length === 1){
		return true;
	}else if(allValuePlayed.length === 2 && allValuePlayed.includes("A")){
		return true;
	}else if(allValuePlayed.length >1 && allValuePlayed.length <=4){
		let sumOfValue = 0;
		for ( let j =0 ; j < allValuePlayed.length ; j++){
			sumOfValue += Number(allValuePlayed[j])
		}
		if( sumOfValue <= 10 && allEqual(allValuePlayed) ){
		return true;
		}
	}else {
		return false;
	}
	
}
	
function playedValue(card){
	if (card.Value === "A"){
	return 1;
	}else if (card.Value === "J"){
	return 10;
	}else if(card.Value === "Q"){
	return 15;
	}else if(card.Value === "K"){
	return 20;
	}else {
	return Number(card.Value);
	}
}

function suitPower(card){
	let allSuitPlayed = [];
	for ( let i = 0; i < playedThisRound.length ; i++){
	allSuitPlayed = allSuitPlayed.concat(playedThisRound[i].Suit);
	}
	
	if( allSuitPlayed.includes("spades") && monster[0].Suit !== "spades"){
		spadesPower();
	}
	
	if (allSuitPlayed.includes("hearts") && monster[0].Suit !== "hearts"){
		heartsPower();
	}
	if (allSuitPlayed.includes("diamonds") && monster[0].Suit !== "diamonds"){
		diamondsPower();
	}
	if (allSuitPlayed.includes("clubs") && monster[0].Suit !== "clubs"){
		clubsPower();
	}else {
		attackMonster(Number(monster[1].Health),sumValue);
	}
	console.log(`allSuitPlayed:${allSuitPlayed}`)
}

function clubsPower(){
	attackMonster(Number(monster[1].Health),sumValue*2);
}

function spadesPower(){
	if(Number(monster[1].Power)-sumValue<0){
		monster[1].Power = 0;
	} else { 
		monster[1].Power = Number(monster[1].Power)-sumValue;
	}
}

function heartsPower(){
	shuffle(discardDeck);
	for (let i = sumValue;i > 0;i--){
		if(discardDeck.length>0){
		drawDeck.push(discardDeck.shift());
		}
	}
}


function diamondsPower(){
	
	for( let i = sumValue ; i > 0; i-- ){
		if(handDeck.length < 8 && drawDeck.length > 0 ){
		handDeck.push(drawDeck.shift());
		}
	}
}


function attackMonster(monsterHP,attPower){
	if((monsterHP-attPower) === 0){
		//monster go to fist card of draw deck
		discardDeck = discardDeck.concat(playedDeck);
		drawDeck.unshift(monster[0]);
		playedDeck = [];
		monster[1].Health = monsterHP-attPower;
		console.clear();
		console.log(`${monster[0].Value} of ${monster[0].Suit} is perfectly defected`)
		//getMonster();
		
	}else if ((monsterHP-attPower) < 0){
		//monster die
		discardDeck = discardDeck.concat(playedDeck,monster[0]);
		playedDeck = [];
		monster[1].Health = monsterHP-attPower;
		console.clear();
		console.log(`${monster[0].Value} of ${monster[0].Suit} is defected`)
		//getMonster();
	}else {
		monster[1].Health = monsterHP-attPower;
	}
}

// function attackPlayer(){
	// prompt(`Monster Attck is ${monster[1].Power}. Please discard cards value larger than ${monster[1].Power}.`)
// }

function displayHand(){
	for ( let i = 0; i <handDeck.length; i++){
		console.log(`[${i}] Value:${handDeck[i].Value} Suit:${handDeck[i].Suit}`)
	}
}

 const list = document.createElement('ul');
 const section = document.querySelector('section');
 section.appendChild(list);
 
 function showHand(){
	 //Display Hand in Webpage
	 list.innerHTML = '';
	
	for ( let i = 0; i <handDeck.length; i++) {
	const listItem = document.createElement('li');
	listItem.textContent = `[${i}] Value:${handDeck[i].Value} Suit:${handDeck[i].Suit}`;
	list.appendChild(listItem);
	}
 }

function monsterRound(){
	gameStage = 2;
	showStat();
	console.log("Monster Attack");
	if(canPlayerSurvive()){
	let playerInput = prompt(
`Monster Attack!
Monster Attack:${monster[1].Power}, Discard value of card at least: ${monster[1].Power}
Play your card, J : 10 ; Q : 15 ; K : 20 
Play mutiple card by enter all their index(123)
'*' to use Jester , 's' to sort your hand`);
	if(playerInput === null){
	console.log("'resumeGame()' to resume");
	}else if (playerInput === ("*")){
	jester();
	monsterRound();
	}else if(Number(playerInput)+1){
		gameStage = 0;
		monsterAttack(playerInput);
	}else if(playerInput === "s" || playerInput === "S"){
	handDeck.sort(compare);
	//showStat();
	monsterRound();
	}else if(playerInput !== null){
	console.log(`Invalid Input`);
	monsterRound()
	}compare
	}
}

function canPlayerSurvive(){
	let sumOfValue = 0;
	for (const card of handDeck){
		sumOfValue += playedValue(card)
	}
	if (sumOfValue < monster[1].Power && jesterCount === 0){
		alert("You Lose, cannot take hit and no Jester");
		return false;
	}else return true;
	
}

function monsterAttack(cards){
	let totalValue = 0;
	let lostedCardIndex = cards;
	for (let i = 0; i < lostedCardIndex.length; i++) {
	//lostedDeck = lostedDeck.concat(handDeck[Number(lostedCardIndex[i])]);
	lostedCard = handDeck[Number(lostedCardIndex[i])];
	lostedDeck = lostedDeck.concat(lostedCard);
	totalValue += playedValue(lostedCard);
	}
	console.log(`TotalValue : ${totalValue}`);
	
	if (totalValue >= monster[1].Power){
		for (let i = lostedDeck.length ; i > 0 ; i--){
		let idx = handDeck.indexOf(lostedDeck[0]);
		playedDeck = playedDeck.concat(lostedDeck[0]);
		handDeck.splice(idx,1);
		lostedDeck.shift();
		}
	}else{
	console.log("Not enough");
	lostedDeck =[];
	monsterRound();
	}
}
