const renderGameView = () => {
    
    charView.innerHTML = ''
   
    playerForm = ce('form')
    playerForm.setAttribute('style', 'display: flex; flex-direction: column')
    judge = currentPlayers[i]
    playerCaptionClicks = 0
    quotesArr = []
    
    currentPlayers.forEach((player) => {
        if (player !== judge) {
            let charFormDiv = ce('div')
            charFormDiv.dataset.id = player.id
            charFormDiv.setAttribute('style', 'display: inline-block')
            // charFormDiv.style.display = 'inline'
            
            let playerImg = ce('img')
            playerImg.setAttribute('src', player.character_image)
            playerImg.setAttribute('style', 'display: inline-block; max-width: 5em')
            
            let playerInput = ce('input')
            playerInput.setAttribute('type', 'password')
            playerInput.setAttribute('placeholder', player.name)
            playerInput.setAttribute('id', player.id)
    
            playerComment = ce('button')
            playerComment.setAttribute('id', 'comment-button')
            playerComment.innerText = 'Add Comment'
            
            charFormDiv.append(playerImg, playerInput, playerComment)
            playerForm.append(charFormDiv)
            
            playerComment.addEventListener('click', (e) => {
                e.preventDefault()
                charFormDiv.innerHTML = ''
                charFormDiv.append(playerImg, playerInput)
                player.quote = playerInput.value
                quotesArr.push(player.quote)
                playerCaptionClicks++
                if(playerCaptionClicks == 3){

                    fetchCartoon()
                }
            })
        }
    })

    let judgeImage = ce("img")
    judgeImage.setAttribute("src", judge.character_image)
    judgeImage.setAttribute('class', 'img-responsive')
    judgeView.append(judgeImage)

    playerSpan.append(playerForm)
    playerView.append(playerSpan)
     
    
}

function fetchCartoon(){
    playerView.innerHTML = ''
    fetch('https://www.newyorker.com/cartoons/random/randomAPI')
    .then(res => res.json())
    .then(res => randomCartoon = res[0].src)
    .then(renderCartoonAndCaptions)
    .then(heading.innerText = 'Choose the Best Caption')
}

function renderCartoonAndCaptions(){
    let img = ce('img')
    img.src = randomCartoon
    let captionOptions = ce('div')
    playerView.append(img, captionOptions)
    
    currentPlayers.forEach((player) => {
        if (player !== judge) {
            let p = ce('p')
            let options = ce('h3')
            options.innerText = player.quote
            p.append(options)
            p.addEventListener('click', function(){
                playerView.innerHTML = ''
                let winMessage = ce('h2')
                heading.innerText = `${player.name} wins this round!`
                playerView.append(img, p)
                i++
                player.round_wins += 1
                fetchPostWins(player, randomCartoon)
                console.log(player.round_wins)
                if (i === 4){
                    renderWinner()
                }
                else {
                    renderJumbotron()
                }
            })
            captionOptions.append(p)
        }
    })
}

function fetchPostWins(player, randomCartoon){
    fetch('http://localhost:3000/wins', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
            character_id: player.id,
            quote: player.quote,
            image_url: randomCartoon
        })
    })
}

function renderWinner(){
    heading.innerText = 'Game Over, Babblers!'
    view.innerHTML = ''
    let ref = 0
    winningPlayer = null
    currentPlayers.forEach(function(player){
        if(player.round_wins > ref){
            ref = player.round_wins
            winningPlayer = player
        }
    })
    let winnerImg = ce('img')
    winnerImg.setAttribute('src', winningPlayer.character_image)
    let winnerBanner = ce('h2')
    winnerBanner.innerText = `🏆🏆🏆🏆🏆🏆 Scoring ${winningPlayer.round_wins} out of 4 rounds, ${winningPlayer.name} wins the game! 🏆🏆🏆🏆🏆🏆`
    view.append(winnerBanner, winnerImg)
}