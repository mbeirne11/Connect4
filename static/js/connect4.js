window.onload = function() {
    setBoard();
}
// 6x7 board
let board = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
//Create an empty board
let turn;
function setBoard() {
    // assign  the value of each selector to a variable using d3 and their id 
    cpuRating = d3.select("#cpuRating").property('value')
    turn = d3.select("#homeOrAway").property('value')
    console.log(`depth: ${cpuRating}`)
    // assign button to a variable using D3 and button's id
    let b = d3.select('#newGame')
    // start a new game when clicked
    b.on("click", () => {
        setBoard()
        // Player first
        newGame(board,cpuRating,turn)
    })
    // reset header
    document.getElementById('winner').textContent = ""
    console.log('setBoard')
    // check to see if board already exists
    let elementExists = document.getElementById('0, 0')
    // if board does not exist, create a new one
    if(elementExists == null){
        //loop through each space on the board
        for(let i=0;i<6;i++){
            for(let j=0;j<7;j++){
                //create tile
                let tile = document.createElement('div')
                //add id and class for styling
                tile.id = `${i}, ${j}`
                tile.classList.add('tile')
                //add attributes for styling on mouse events
                tile.setAttribute("onclick", "playerMove(this)");
                tile.setAttribute("onmousemove", "highlightMove(this)");
                // tile.setAttribute("onmousedown", "highlightMove(this)");
                tile.setAttribute("onmouseout", "unHighlightMove(this)");
                //add tile to the board
                document.getElementById('board').append(tile)
            }
        }
    // if board already exists, reset the board
    }else{
        //loop through each space on the board
        for(let i=0;i<6;i++){
            for(let j=0;j<7;j++){
                //reset the class of tile so every tile is empty
                document.getElementById(`${i}, ${j}`).setAttribute("class",'')
                document.getElementById(`${i}, ${j}`).classList.add('tile')
            }
        }
    }
    // player first
    // newGame(board,cpuRating,turn)
}
// Unhighlight tile when mouse leaves tile
function unHighlightMove(tile){
    //grab column of tile
    c=parseInt(tile.id.split(', ')[1]) + 1
    document.getElementById(`col${c}`).classList.remove('playerHover')
}
// Highlight tile when mouse moves over tile
function highlightMove(tile){
    if(check_for_winner(board) != 0){
        return([])
    }
    //grab column of tile
    c=parseInt(tile.id.split(', ')[1]) + 1
    document.getElementById(`col${c}`).classList.add('playerHover')
}
//New game
function newGame(board,cpuRating,turn) {
    //create a new board with all 0s
    for(let i=0;i<6;i++){
        for(let j=0;j<7;j++){
            board[i][j] = 0
        }
    }
    console.log('new game')
    //if cpu's turn, call cpuMove
    if(turn == "1"){
        setTimeout(function(){
            cpuMove(board,cpuRating)
        },500)
    }
}
//Check legal moves based on current board 
function check_legal_moves(board){
    //if there is a winner, no legal moves
    if(check_for_winner(board) != 0){
        return([])
    }else{
        //create an empty list to hold all legal moves
        let legal_moves = []
        //loop through each column
        for(let col = 0;col<7;col++){
            //check value for each row, if 0 then True
            row1 = (board[5][col] == 0)
            row2 = (board[4][col] == 0)
            row3 = (board[3][col] == 0)
            row4 = (board[2][col] == 0)
            row5 = (board[1][col] == 0)
            row6 = (board[0][col] == 0)
            if(row1){//if first row is 0, then must be legal move
                legal_moves.push([5,col]) 
            }else if(row2){//first row is not 0 but row 2 is 
                legal_moves.push([4,col])
            }else if(row3){//first 2 rows are not 0 but row 3 is and so on..
                legal_moves.push([3,col])
            }else if(row4){//...
                legal_moves.push([2,col])
            }else if(row5){//...
                legal_moves.push([1,col])
            }else if(row6){//...
                legal_moves.push([0,col])
            }
        }
        //function returns a list of legal moves of form [row,column]
        return(legal_moves)
    }
}
//Check for winner based on current board
// CPU:1
// Player:-1
function check_for_winner(board){
    //row number increases as row goes down
    //column number increases as column goes to the right
    let winner = 0
    //Horizontal
    // loop throuhg every row
    for(let r = 0;r<6;r++){
        //loop through the first 4 columns,
        for(let c = 0;c<4;c++){
            //check for when the values of the current tile and the three tiles to the right are the same, but not 0
            if ((board[r][c] != 0) &(board[r][c] == board[r][c+1]) & (board[r][c] == board[r][c+2]) &(board[r][c] == board[r][c+3])){
                winner = board[r][c]
            }
        }
    }
    //Vertical
    //loop through every column
    for (let c=0;c<7;c++){
        // loop through the first 3 rows
        for(let r=0;r<3;r++){
            //check for when the values of the current tile and the three tiles below are the same, but not 0
            if ((board[r][c] != 0) &(board[r][c] == board[r+1][c]) & (board[r][c] == board[r+2][c]) &(board[r][c] == board[r+3][c])){
                winner = board[r][c]
            }
        }
    }
    //Diagonal
    //loop through the first 3 rows
    for (let r=0;r<3;r++){
        //loop through the first 4 columns
        for (let c = 0;c<4;c++){
            //check for when the values of the current tile and the three tiles in a (down and right) diagonal line are the same, but not 0
            if ((board[r][c] != 0) &(board[r][c] == board[r+1][c+1]) & (board[r][c] == board[r+2][c+2]) &(board[r][c] == board[r+3][c+3])){
                winner = board[r][c]
            }
        }
    }
    //loop through the first 3 rows
    for (let r=0;r<3;r++){
        //loop through the first 4 columns
        for (let c = 0;c<4;c++){
            //check for when the values of the current tile and the three tiles in a (up and left) diagonal line are the same, but not 0
            if ((board[5-r][c] != 0) &(board[5-r][c] == board[4-r][c+1]) & (board[5-r][c] == board[3-r][c+2]) &(board[5-r][c] == board[2-r][c+3])){
                winner = board[5-r][c]
            }
        }
    }
    //function returns a 0, 1, or -1
    return(winner)
}
//highlight winning tiles
//similar to check_for_winner
function color_winner(board){
    let winner = 0
    // h
    for(let r = 0;r<6;r++){
        for(let c = 0;c<4;c++){
            if ((board[r][c] != 0) &(board[r][c] == board[r][c+1]) & (board[r][c] == board[r][c+2]) &(board[r][c] == board[r][c+3])){
                winner = board[r][c]
                if(winner==1){
                    document.getElementById(`${r}, ${c}`).classList.add('cpuWinner')
                    document.getElementById(`${r}, ${c+1}`).classList.add('cpuWinner')
                    document.getElementById(`${r}, ${c+2}`).classList.add('cpuWinner')
                    document.getElementById(`${r}, ${c+3}`).classList.add('cpuWinner')
                }else if(winner == -1){
                    document.getElementById(`${r}, ${c}`).classList.add('playerWinner')
                    document.getElementById(`${r}, ${c+1}`).classList.add('playerWinner')
                    document.getElementById(`${r}, ${c+2}`).classList.add('playerWinner')
                    document.getElementById(`${r}, ${c+3}`).classList.add('playerWinner')
                }
            }
        }
    }
    // v
    for (let c=0;c<7;c++){
        for(let r=0;r<3;r++){
            if ((board[r][c] != 0) &(board[r][c] == board[r+1][c]) & (board[r][c] == board[r+2][c]) &(board[r][c] == board[r+3][c])){
                winner = board[r][c]
                if(winner==1){
                    document.getElementById(`${r}, ${c}`).classList.add('cpuWinner')
                    document.getElementById(`${r+1}, ${c}`).classList.add('cpuWinner')
                    document.getElementById(`${r+2}, ${c}`).classList.add('cpuWinner')
                    document.getElementById(`${r+3}, ${c}`).classList.add('cpuWinner')
                }else if(winner == -1){
                    document.getElementById(`${r}, ${c}`).classList.add('playerWinner')
                    document.getElementById(`${r+1}, ${c}`).classList.add('playerWinner')
                    document.getElementById(`${r+2}, ${c}`).classList.add('playerWinner')
                    document.getElementById(`${r+3}, ${c}`).classList.add('playerWinner')
                }
            }
        }
    }
    // d
    for (let r=0;r<3;r++){
        for (let c = 0;c<4;c++){
            if ((board[r][c] != 0) &(board[r][c] == board[r+1][c+1]) & (board[r][c] == board[r+2][c+2]) &(board[r][c] == board[r+3][c+3])){
                winner = board[r][c]
                if(winner==1){
                    document.getElementById(`${r}, ${c}`).classList.add('cpuWinner')
                    document.getElementById(`${r+1}, ${c+1}`).classList.add('cpuWinner')
                    document.getElementById(`${r+2}, ${c+2}`).classList.add('cpuWinner')
                    document.getElementById(`${r+3}, ${c+3}`).classList.add('cpuWinner')
                }else if(winner == -1){
                    document.getElementById(`${r}, ${c}`).classList.add('playerWinner')
                    document.getElementById(`${r+1}, ${c+1}`).classList.add('playerWinner')
                    document.getElementById(`${r+2}, ${c+2}`).classList.add('playerWinner')
                    document.getElementById(`${r+3}, ${c+3}`).classList.add('playerWinner')
                }
            }
        }
    }
    for (let r=0;r<3;r++){
        for (let c = 0;c<4;c++){
            if ((board[5-r][c] != 0) &(board[5-r][c] == board[4-r][c+1]) & (board[5-r][c] == board[3-r][c+2]) &(board[5-r][c] == board[2-r][c+3])){
                winner = board[5-r][c]
                if(winner==1){
                    document.getElementById(`${5-r}, ${c}`).classList.add('cpuWinner')
                    document.getElementById(`${4-r}, ${c+1}`).classList.add('cpuWinner')
                    document.getElementById(`${3-r}, ${c+2}`).classList.add('cpuWinner')
                    document.getElementById(`${2-r}, ${c+3}`).classList.add('cpuWinner')
                }else if(winner == -1){
                    document.getElementById(`${5-r}, ${c}`).classList.add('playerWinner')
                    document.getElementById(`${4-r}, ${c+1}`).classList.add('playerWinner')
                    document.getElementById(`${3-r}, ${c+2}`).classList.add('playerWinner')
                    document.getElementById(`${2-r}, ${c+3}`).classList.add('playerWinner') 
                }
            }
        }
    }
    return(winner)
}
//when minmax is at depth 0, this function will be called
//calculate score of the board using the bms table
function find_score(board){
    // bms -> best move score: number of possible connect 4s for each tile
    bms = [[3, 4, 5, 7, 5, 4, 3],
           [4, 6, 8,10, 8, 6, 4],
           [5, 7,11,13,11, 7, 5],
           [5, 7,11,13,11, 7, 5],
           [4, 6, 8,10, 8, 6, 4],
           [3, 4, 5, 7, 5, 4, 3]]
    score = 0
    // player move = -1
    // cpu move = 1
    // open = 0
    //loop through each tile
    for(i = 0;i<6;i++){
        for(j = 0;j<7;j++){
            //if tile is empty, add 0
            //if tile is cpu's, add possitive bms value
            //if tile is player's, add negative bms value
            score+=bms[i][j]*board[i][j]
        }
    }
    //cpu wants a high score
    moves = check_legal_moves(board)
    // next move
    moves.forEach(move => {
        a = move[0]
        b = move[1]
        score+=bms[a][b]
    }) 
    return(score)
}
//minmax function called during best_move
                                //alpha = -Infinity
                                //beta = Infinity
function minmax(board,depth,turn,alpha,beta){
    // if someone wins, score = + or - 1000, a lower depth will have a lower score
    if (check_for_winner(board) != 0){
        return(1000*(-turn)*(depth+1))
    }
    // after looking depth moves ahead, find the score of the board
    if (depth == 0){
        return(find_score(board,turn))
    }
    if (turn == 1){//CPU's turn, maximizing
        let bscore = -Infinity
        const moves = check_legal_moves(board)
        //loop through each legal move
        for(let move of moves){
            //play the move on the board
            board[move[0]][move[1]] = turn
            //call the function again until depth == 0, 
            score = minmax(board,depth-1,-turn,alpha,beta)
            //remove move from board
            board[move[0]][move[1]] = 0
            //find best score from all depths
            bscore = Math.max(score,bscore)
            //update alpha
            alpha = Math.max(alpha, bscore);
            //alpha beta prunning
            if(beta<=alpha){
                break;
            }
        }
        return(bscore)
    }else{//Player's turn, minimizing
        let bscore = Infinity
        const moves = check_legal_moves(board)
        for(let move of moves){
            board[move[0]][move[1]] = turn
            score = minmax(board,depth-1,-turn,alpha,beta)
            board[move[0]][move[1]] = 0
            bscore = Math.min(score,bscore)
            beta = Math.min(beta, bscore);
            if(beta<=alpha){
                break;
            }
        }
        return(bscore)
    }
}
//Used to find best move for CPU
function best_move(board,depth){
    console.log('bestMove')
    //empty list to hold scores of each legal move
    scores = []
    const moves = check_legal_moves(board)
    //loop through each move
    moves.forEach(move => {
        let r=move[0]
        let c=move[1]
        //move = [r,c]
        //play the move on the board
        board[r][c] = 1
        //find score using minmax function
        score = minmax(board,depth,-1,-Infinity,Infinity)
        //remove move from board
        board[r][c] = 0
        //add score to list
        scores.push(score)
    });
    console.log(scores)
    console.log(moves)
    //find max score or scores
    someMoves = []
    for(let i = 0; i< scores.length;i++){
        let s = scores[i]
        let m = moves[i]
        if(s == Math.max(...scores)){
            someMoves.push(m)
        }
    }
    console.log(someMoves)
    //choose a random move from list of best moves
    let bmove = someMoves[~~(Math.random() * someMoves.length)];
    return(bmove)
}
//tile on click attribute
function playerMove(move){
    if(turn == 1){
        return
    }
    //check to see if the game is over
    let winner = document.getElementById('winner').textContent
    if(winner != ''){//if the game is over
        //do nothing
        return
    }else{//if the game is not over
        console.log('PlayerMove')
        // get column for player move and check legal moves to get the row
        c=parseInt(move.id.split(', ')[1])
        const moves = check_legal_moves(board)
        console.log(moves)
        let cols = []
        moves.forEach(move=>{
            cols.push(move[1])
        })
        if(cols.includes(c)){
            moves.forEach(move =>{
                if(move[1]==c){
                    let r = move[0]
                    board[r][c]=-1
                    // change class to color the tile with id "r, c"
                    document.getElementById(`col${c+1}`).classList.remove('playerHover')
                    document.getElementById(`${r}, ${c}`).classList.add('player')
                }
            })
        }else{
            return
        }
        turn = 1
        let winner = check_for_winner(board)
        if (winner == -1){
            score = parseFloat(document.getElementById('playerScore').innerHTML)
            document.getElementById('playerScore').innerHTML = score + 1
            document.getElementById('winner').textContent = "Player Wins!!"
            color_winner(board)
            return
        }
        setTimeout(function(){
            cpuMove(board,cpuRating)
        },1000)
    } 
}
//after playerMove or if CPU first
//find the best move for the CPU
function cpuMove(board,cpuRating){
    if(turn == 0){
        return
    }
    turn = 0
    console.log(cpuRating)
    console.log('cpuMove')
    let winner = check_for_winner(board)
    if (winner == -1){
        score = parseFloat(document.getElementById('playerScore').innerHTML)
        document.getElementById('playerScore').innerHTML = score + 1
        document.getElementById('winner').textContent = "Player Wins!!"
        color_winner(board)
        return
    }else if(winner == 0){
        let move = best_move(board,cpuRating)
        let smoves = []
        for(let i=0;i<check_legal_moves(board).length;i++){
            r=check_legal_moves(board)[i][0]
            c=check_legal_moves(board)[i][1]
            board[r][c]=-1
            if(check_for_winner(board)==-1){
                move = [r,c]
                console.log(move)
            }
            board[r][c]=0
        }
        if(cpuRating==1){
            smoves.push(move)
            move = check_legal_moves(board)[~~(Math.random() * check_legal_moves(board).length)]
            smoves.push(move)
            move = smoves[~~(Math.random() * smoves.length)]
        }
        if(!move){
            console.log('draw')
            document.getElementById('winner').textContent = "Draw"
            cpuScore = parseFloat(document.getElementById('cpuScore').innerHTML)
            document.getElementById('cpuScore').innerHTML = cpuScore + 0.5
            playerScore = parseFloat(document.getElementById('playerScore').innerHTML)
            document.getElementById('playerScore').innerHTML = playerScore + 0.5
            return
        }else{
            let r = move[0]
            let c = move[1]
            board[r][c] = 1
            document.getElementById(`${r}, ${c}`).classList.add('cpu')
            let winner = check_for_winner(board)
            if(winner == 1){
                score = parseFloat(document.getElementById('cpuScore').innerHTML)
                document.getElementById('cpuScore').innerHTML = score + 1
                console.log('Winner!!')
                console.log(winner)
                document.getElementById('winner').textContent = "CPU Wins"
                color_winner(board)
            }else if(check_legal_moves(board).length == 0){
                console.log('draw')
                document.getElementById('winner').textContent = "Draw"
                cpuScore = parseFloat(document.getElementById('cpuScore').innerHTML)
                document.getElementById('cpuScore').innerHTML = cpuScore + 0.5
                playerScore = parseFloat(document.getElementById('playerScore').innerHTML)
                document.getElementById('playerScore').innerHTML = playerScore + 0.5
                return
            }
        }
    }else{
        console.log('Winner!!')
        console.log(winner)
        setBoard()
    }
}
