///////////////////////////////////////////////////////////////////////////
//
//	Goal: Display a list of Cards such as Ace - Spades, Ace - Diamonds
//
///////////////////////////////////////////////////////////////////////////
App.imageSource = "cardimages/"
App.imageSource_left = "cardimages-left/"
App.prev_player3rdCard;
App.bankerDrawScore;


function loadGame()
{
    window.theGame = new Shoe(10);

    theGame.ShuffleShoe(1);
    //theGame.printDeck();

    var gameRef = $('#div_myGame');
    //gameRef.append("test Append");
    document.getElementById('div_myGame').innerHTML = '';
    gameRef.append('Printing ' + theGame.CardArray.length + ' Cards' + '<br>');

    for(var i = 0; i < theGame.CardArray.length; i++)
    {

        var curImage = theGame.CardArray[i].ToImage();

        gameRef.append(curImage);
        gameRef.append('<br>')

    }

}

//Create Hand class
function Hand(theShoe)
{
    this.theShoe = theShoe;
    this.bankerCards = [];
    this.playerCards = [];
    this.bankerScore = null;
    this.playerScore = null;
    this.result = null;
    this.bankerDrawScore;
    this.player3rdCard;


    this.dealCard("id-player-card1","normal","player");
    this.dealCard("id-player-card2","normal","player");
    this.dealCard("id-banker-card1","normal","banker");
    this.dealCard("id-banker-card2", "normal", "banker");

    //check for natural
    if (this.bankerScore == 9 || this.bankerScore == 8 || this.playerScore == 8 || this.playerScore == 9)
    {
        //natural
        return this;
    }
   
    //if player total is 5 or less, then the player hits....
    if (this.playerScore < 6) //player hits
    {
        this.dealCard("id-player-card3", "left", "player");


        var BankerDrawTable = [['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
            ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
            ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
            ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'S', 'H'],
            ['S', 'S', 'H', 'H', 'H', 'H', 'H', 'H', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'S', 'S'],
            ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']];


        //save the cordinates so we can display the drawing rule on the main page.
        this.bankerDrawScore = this.bankerScore;
        this.player3rdCard = this.playerCards[2].bacCardValue;


        if(BankerDrawTable[this.bankerScore][this.playerCards[2].bacCardValue] == 'S')
        {
            return this;
        }
        else if (BankerDrawTable[this.bankerScore][this.playerCards[2].bacCardValue] == 'H')
        {
            this.dealCard("id-banker-card3", "left", "banker");
            return this;
        }



    }
    else //player stands
    {
        if(this.bankerScore < 6)
        {
            this.dealCard('id-banker-card3',"left","banker")
        }

        return this;
    }









    alert('score updated' + ' Banker has ' + this.bankerScore + ' Player has ' + this.playerScore);





}

Hand.prototype.updateScore = function()
{
    this.playerScore = 0;
    this.bankerScore = 0;
    var PlayerTempScore = 0;
    var BankerTempScore = 0;

    var getValue = function(myTempValue)
    {
        if (myValue == 'King' || myValue == 'Queen' || myValue == 'Jack') {
            //Face Cards are Zero
            return 0;
        }
        else if (myValue == 'Ace') {
            return 1;
        }
        else {
            return myTempValue
        }
    }
    //Calculate Player Score;
    for (var i = 0, l = this.playerCards.length; i < l; i++) {
        var myValue = this.playerCards[i].cardValue;
        PlayerTempScore += getValue(myValue)
        
    }
    //Calculate Banker Score;
    for (var i = 0, l = this.bankerCards.length; i < l; i++) {
        var myValue = this.bankerCards[i].cardValue;
        BankerTempScore += getValue(myValue)
    }

    this.playerScore = PlayerTempScore % 10;
    this.bankerScore = BankerTempScore % 10;

    //Update Current rESULT
    if(this.playerScore > this.bankerScore)
    {
        this.result = 'Player';
    }
    else if (this.bankerScore > this.playerScore)
    {
        this.result = 'Banker';
    }
    else if (this.bankerScore == this.playerScore)
    {
        this.result = 'Tie'
    }
    else
    {
        alert('score error!!')
    }


}

Hand.prototype.dealCard = function (DOMlocation,orient,type)
{
    var dealtCard = this.theShoe.dealCard();
    $("#" + DOMlocation).empty();
    $("#" + DOMlocation).append(dealtCard.ToImage(orient))
    if (type == 'banker')
    {
        this.bankerCards.push(dealtCard);
    }
    else if (type == 'player')
    {
        this.playerCards.push(dealtCard);
    }
  
    this.updateScore();

}


//Create Game Class
function Game()
{
    this.playerCards;
    this.bankerCards;
    this.bankerScore;
    this.playerScore;
    this.gameState = 'started';
    this.gameShoe = new Shoe(10);
    this.gameShoe.ShuffleShoe(1);
    //this.result = bitchy_result
    
    ////////////////////////////
    //Activate Player / Banker buttons
    ////////////////////////////


    ////////////////////////////
    //Deal a new hand
    ////////////////////////////
    //



}
//Game prototypes
Game.prototype.getResult = function () {
    return this.result;
};

Game.prototype.dealCard = function (DOMlocation, orient) {


    var dealtCard = this.gameShoe.dealCard();
    $("#" + DOMlocation).empty();
    $("#" + DOMlocation).append(dealtCard.ToImage(orient))
    //show card
}

Game.prototype.dealHand = function()
{

    //Clean up previous hand!
    //clear old hand
    $("#id-result-text").text("");
    $("#id-player-score").text("");
    $("#id-banker-score").text("");

    $(".hit,.stand").css("border","none")
    $("img", ".gameLayout").remove();





    //deal new hand!!!
    var currentHand = new Hand(this.gameShoe)
    var cardOrder = ['id-player-card1', 'id-player-card2', 'id-banker-card1', 'id-banker-card2']
    var delayOrder = [0, 0, 1000, 0, 1000, 1000]
    var i = 0;

    //retrieve array cordinates
    var bankerDrawScore = currentHand.bankerDrawScore;
    var player3rdCard = currentHand.player3rdCard;

    if (currentHand.playerCards.length > 2)
    {
        cardOrder.push("id-player-card3")
    }
    if (currentHand.bankerCards.length > 2) {
        cardOrder.push("id-banker-card3")
    }


    //after the hidden hand as been dealt reveal it one card at a time!!!

    function showNext(imgID)
    {
        $("img", "#" + imgID).css("display","inline")
    }

    function callFuncs()
    {
        showNext(cardOrder[i])
        i++;
        if (i < cardOrder.length) {
            setTimeout(callFuncs, delayOrder[i])
        }
        else
        {
            setTimeout(continueDealingHand, 1009)
        }
    }

    setTimeout(callFuncs, 1)


    function continueDealingHand()
    {
        $("#id-player-score").text(currentHand.playerScore);
        $("#id-banker-score").text(currentHand.bankerScore);


        ////Display Result Text
        if (currentHand.bankerScore > currentHand.playerScore)
        {
            //Banker Wins
            $("#id-result-text").text("Banker Wins!")
        }
        else if (currentHand.playerScore > currentHand.bankerScore)
        {
            //Player Wins
            $("#id-result-text").text("Player Wins!")
        }
        else if (currentHand.playerScore == currentHand.bankerScore)
        {
            $("#id-result-text").text("Tie!")
        }
        else
        {
            $("#id-result-text").text("scoring error: please report issues to matteskolin@gmail.com")
        }


        if (!player3rdCard) {
            ;
        }
        else
        {
            $("td[data-banker-score=" + bankerDrawScore + "][data-player-card=" + player3rdCard + "]").css("border", "4px solid black");
        }
       






    }
    
    //Light up the drawing rule that was used using cordinates!



    ///deal two cards to player
    /*this.dealCard("id-player-card1");
    this.dealCard("id-player-card2");
    this.dealCard("id-banker-card1");
    this.dealCard("id-banker-card2");
    */

    ////////////////////////////////////////////
    //////////Do we draw a 3rd card for the player?
    ///////////////////////////////////////////////////

    //check for naturals



    //deal two cards to banker
}


Game.prototype.UpdateScore = function()
{


}

Game.prototype.GetDrawState - function()
{

}
//////////////////////////////////////////////





//Create Card Class

function Card(suit, cardValue, imageFile)
{
    this.suit = suit;
    this.cardValue = cardValue;
    this.bacCardValue;
    this.imageFile = App.imageSource + imageFile;
    this.imageFileLeft = App.imageSource_left + imageFile;


    if (cardValue == 'King' || cardValue == 'Queen' || cardValue == 'Jack')
    {
        this.bacCardValue = 0
    }
    else if (cardValue == 'Ace')
    {
        this.bacCardValue = 1
    }
    else
    {
        this.bacCardValue = cardValue;
    }


    this.ToImage = function(orient)
    {
        var imageLocation;

        if (orient == "left")
        {
            imageLocation = this.imageFileLeft;
        }
        else 
        {
            imageLocation = this.imageFile;
        }

        var myCardImageElement = document.createElement("img");
        myCardImageElement.setAttribute('id','id_image' + this.suit + "_" + this.cardValue)
        myCardImageElement.setAttribute('src', imageLocation)
        myCardImageElement.style.display = 'none';

            
        return myCardImageElement;
    }

}

function Shoe(number_of_decks)
{
    //An Array of 52 Card Objects
    this.CardArray = []

    for(i = 1; i <= number_of_decks; i++)
    {
	
        //52 Cards in a deck - add each card to the deck
        this.CardArray.push(new Card('Hearts', 2, 'h2.gif'))
        this.CardArray.push(new Card('Hearts', 3, 'h3.gif'))
        this.CardArray.push(new Card('Hearts', 4, 'h4.gif'))
        this.CardArray.push(new Card('Hearts', 5, 'h5.gif'))
        this.CardArray.push(new Card('Hearts', 6, 'h6.gif'))
        this.CardArray.push(new Card('Hearts', 7, 'h7.gif'))
        this.CardArray.push(new Card('Hearts', 8, 'h8.gif'))
        this.CardArray.push(new Card('Hearts', 9, 'h9.gif'))
        this.CardArray.push(new Card('Hearts', 10, 'h10.gif'))
        this.CardArray.push(new Card('Hearts', 'Jack', 'hj.gif'))
        this.CardArray.push(new Card('Hearts', 'Queen', 'hq.gif'))
        this.CardArray.push(new Card('Hearts', 'King', 'hk.gif'))
        this.CardArray.push(new Card('Hearts', 'Ace', 'h1.gif'))
        this.CardArray.push(new Card('Clubs', 2, 'c2.gif'))
        this.CardArray.push(new Card('Clubs', 3, 'c3.gif'))
        this.CardArray.push(new Card('Clubs', 4, 'c4.gif'))
        this.CardArray.push(new Card('Clubs', 5, 'c5.gif'))
        this.CardArray.push(new Card('Clubs', 6, 'c6.gif'))
        this.CardArray.push(new Card('Clubs', 7, 'c7.gif'))
        this.CardArray.push(new Card('Clubs', 8, 'c8.gif'))
        this.CardArray.push(new Card('Clubs', 9, 'c9.gif'))
        this.CardArray.push(new Card('Clubs', 10, 'c10.gif'))
        this.CardArray.push(new Card('Clubs', 'Jack', 'cj.gif'))
        this.CardArray.push(new Card('Clubs', 'Queen', 'cq.gif'))
        this.CardArray.push(new Card('Clubs', 'King', 'ck.gif'))
        this.CardArray.push(new Card('Clubs', 'Ace', 'c1.gif'))
        this.CardArray.push(new Card('Diamonds', 2, 'd2.gif'))
        this.CardArray.push(new Card('Diamonds', 3, 'd3.gif'))
        this.CardArray.push(new Card('Diamonds', 4, 'd4.gif'))
        this.CardArray.push(new Card('Diamonds', 5, 'd5.gif'))
        this.CardArray.push(new Card('Diamonds', 6, 'd6.gif'))
        this.CardArray.push(new Card('Diamonds', 7, 'd7.gif'))
        this.CardArray.push(new Card('Diamonds', 8, 'd8.gif'))
        this.CardArray.push(new Card('Diamonds', 9, 'd9.gif'))
        this.CardArray.push(new Card('Diamonds', 10, 'd10.gif'))
        this.CardArray.push(new Card('Diamonds', 'Jack', 'dj.gif'))
        this.CardArray.push(new Card('Diamonds', 'Queen', 'dq.gif'))
        this.CardArray.push(new Card('Diamonds', 'King', 'dk.gif'))
        this.CardArray.push(new Card('Diamonds', 'Ace', 'd1.gif'))
        this.CardArray.push(new Card('Spades', 2, 's2.gif'))
        this.CardArray.push(new Card('Spades', 3, 's3.gif'))
        this.CardArray.push(new Card('Spades', 4, 's4.gif'))
        this.CardArray.push(new Card('Spades', 5, 's5.gif'))
        this.CardArray.push(new Card('Spades', 6, 's6.gif'))
        this.CardArray.push(new Card('Spades', 7, 's7.gif'))
        this.CardArray.push(new Card('Spades', 8, 's8.gif'))
        this.CardArray.push(new Card('Spades', 9, 's9.gif'))
        this.CardArray.push(new Card('Spades', 10, 's10.gif'))
        this.CardArray.push(new Card('Spades', 'Jack', 'sj.gif'))
        this.CardArray.push(new Card('Spades', 'Queen', 'sq.gif'))
        this.CardArray.push(new Card('Spades', 'King', 'sk.gif'))
        this.CardArray.push(new Card('Spades', 'Ace', 's1.gif'))
    }

    this.printDeck = function()
    {
	
        for(i = 0; i < this.CardArray.length; i++)
        {
            document.write(this.CardArray[i].cardValue + ' of ' + this.CardArray[i].suit)
            document.write('<br>')
        }
    }
	
    this.ShuffleShoe = function(times_to_shuffle)
    {
	
        //Make sure that times_to_shuffle is set!
        if(!times_to_shuffle > 1)
        {
            times_to_shuffle = 1
        }
        var i, j, k
        var temp;
				
        //shuffle the deck multiple times if requested
        for(i = 0; i < times_to_shuffle; i++)
        {
            for (j = 0; j < this.CardArray.length; j++)
            {
                k = Math.floor(Math.random() * this.CardArray.length)
                temp = this.CardArray[j];
                this.CardArray[j] = this.CardArray[k];
                this.CardArray[k] = temp
            }	
        }
    }
    this.dealCard = function()
    {
        //pop one card from the top of the shoe
        return this.CardArray.pop();
    }
}


//Development Notes
/*

    Notice, the next thing we need to do is test our suffleing and printing of the deck



*/

//Create a New Shoe, Shuffle it, and then display it
//myShoe.printDeck()
//myShoe.ShuffleShoe()
//myShoe.printDeck()






