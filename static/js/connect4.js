window.onload = function() {
    setBoard();
}
// 6x7 board
let board = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
function setBoard() {
    // assign button to a variable using D3 and button's id 
    cpuRating = d3.select("#cpuRating").property('value')
    turn = d3.select("#homeOrAway").property('value')

    console.log(`depth: ${cpuRating}`)
    let b = d3.select('#newGame')
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
    if(elementExists == null){
        for(let i=0;i<6;i++){
            for(let j=0;j<7;j++){
                let tile = document.createElement('div')
                tile.id = `${i}, ${j}`
                tile.classList.add('tile')
                tile.setAttribute("onclick", "playerMove(this)");
                tile.setAttribute("onmousemove", "highlightMove(this)");
                tile.setAttribute("onmousedown", "highlightMove(this)");
                tile.setAttribute("onmouseout", "unHighlightMove(this)");
                document.getElementById('board').append(tile)
            }
        }
    // if board already exists, reset the board
    }else{
        for(let i=0;i<6;i++){
            for(let j=0;j<7;j++){
                document.getElementById(`${i}, ${j}`).setAttribute("class",'')
                document.getElementById(`${i}, ${j}`).classList.add('tile')
            }
        }
    }
    // player first
    // newGame(board,cpuRating,turn)
}
// mouseout event
function unHighlightMove(tile){
    c=parseInt(tile.id.split(', ')[1])
    const moves = check_legal_moves(board)
    moves.forEach(move =>{
        if(move[1]==c){
            let r = move[0]
            document.getElementById(`${r}, ${c}`).classList.remove('playerHover')
        }
    })
}
// mousemove event
function highlightMove(tile){
    c=parseInt(tile.id.split(', ')[1])
    const moves = check_legal_moves(board)
    moves.forEach(move =>{
        if(move[1]==c){
            let r = move[0]
            document.getElementById(`${r}, ${c}`).classList.add('playerHover')
        }
    })
}
// Player first
function newGame(board,cpuRating,turn) {
    for(let i=0;i<6;i++){
        for(let j=0;j<7;j++){
            board[i][j] = 0
        }
    }
    console.log('new game')
    if(turn == "1"){
        cpuMove(board,cpuRating)
    }
}
// // CPU first
// function newGame2(board) {
//     for(let i=0;i<6;i++){
//         for(let j=0;j<7;j++){
//             board[i][j] = 0
//         }
//     }
//     console.log('new game')
//     cpuMove(board,cpuRating)
// }
function check_legal_moves(board){
    if(check_for_winner(board) != 0){
        return([])
    }else{
        let legal_moves = []
        for(let col = 0;col<7;col++){
            // check for first 0 in each column
            row1 = (board[5][col] == 0)
            row2 = (board[4][col] == 0)
            row3 = (board[3][col] == 0)
            row4 = (board[2][col] == 0)
            row5 = (board[1][col] == 0)
            row6 = (board[0][col] == 0)
            if(row1){
                legal_moves.push([5,col])
            }else if(row2){
                legal_moves.push([4,col])
            }else if(row3){
                legal_moves.push([3,col])
            }else if(row4){
                legal_moves.push([2,col])
            }else if(row5){
                legal_moves.push([1,col])
            }else if(row6){
                legal_moves.push([0,col])
            }
        }
        return(legal_moves)
    }
}
function check_for_winner(board){
    let winner = 0
    // h
    for(let r = 0;r<6;r++){
        for(let c = 0;c<4;c++){
            if ((board[r][c] != 0) &(board[r][c] == board[r][c+1]) & (board[r][c] == board[r][c+2]) &(board[r][c] == board[r][c+3])){
                winner = board[r][c]
            }
        }
    }
    // v
    for (let c=0;c<7;c++){
        for(let r=0;r<3;r++){
            if ((board[r][c] != 0) &(board[r][c] == board[r+1][c]) & (board[r][c] == board[r+2][c]) &(board[r][c] == board[r+3][c])){
                winner = board[r][c]
            }
        }
    }
    // d
    for (let r=0;r<3;r++){
        for (let c = 0;c<4;c++){
            if ((board[r][c] != 0) &(board[r][c] == board[r+1][c+1]) & (board[r][c] == board[r+2][c+2]) &(board[r][c] == board[r+3][c+3])){
                winner = board[r][c]
            }
        }
    }
    for (let r=0;r<3;r++){
        for (let c = 0;c<4;c++){
            if ((board[5-r][c] != 0) &(board[5-r][c] == board[4-r][c+1]) & (board[5-r][c] == board[3-r][c+2]) &(board[5-r][c] == board[2-r][c+3])){
                winner = board[5-r][c]
            }
        }
    }
    return(winner)
}
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
// bms-best move score: number of possible connect 4s for each tile
function find_score(board,turn){
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
    for(i = 0;i<6;i++){
        for(j = 0;j<7;j++){
            score+=bms[i][j]*board[i][j]
        }
    }
    let counts = []
    let count = 0
    for(let i = 0; i<6;i++){
        for(let j=0;j<=7;j++){
            if(board[i,j]!=turn){
                counts.push(count)
                count = 0
            }else{
                count +=1
            }
        }
    }
    moves = check_legal_moves(board)
    // next move
    moves.forEach(move => {
        a = move[0]
        b = move[1]
        score+=bms[a][b]*(-turn)
    }) 
    return(score)
}
function minmax(board,depth,turn,alpha,beta){
    // #if someone wins, score = + or - 1000
    if (check_for_winner(board) != 0){
        return(1000*(-turn)*(depth+1))
    }
    // #check bms to approximate best move
    if (depth == 0){
        return(find_score(board,turn))
    }
    if (turn == 1){
        let bscore = -Infinity
        const moves = check_legal_moves(board)
        for(let move of moves){
            board[move[0]][move[1]] = turn
            score = minmax(board,depth-1,-turn,alpha,beta)
            board[move[0]][move[1]] = 0
            bscore = Math.max(score,bscore)
            alpha = Math.max(alpha, bscore);
            if(beta<=alpha){
                break;
            }
        }
        return(bscore)
    }else{
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
// Check all legal moves and find the best score
function best_move(board,depth){
    console.log('bestMove')
    scores = []
    const moves = check_legal_moves(board)
    moves.forEach(move => {
        let r=move[0]
        let c=move[1]
        board[r][c] = 1
        score = minmax(board,depth,-1,-Infinity,Infinity)
        board[r][c] = 0
        scores.push(score)
    });
    console.log(scores)
    console.log(moves)
    someMoves = []
    for(let i = 0; i< scores.length;i++){
        let s = scores[i]
        let m = moves[i]
        if(s == Math.max(...scores)){
            someMoves.push(m)
        }
    }
    console.log(someMoves)
    let bmove = someMoves[~~(Math.random() * someMoves.length)];
    return(bmove)
}
function playerMove(move){
    // if there is a winner on the previous move, reset the board
    let winner = document.getElementById('winner').textContent
    if(winner != ''){
        return
    }else{ 
        // get column for player move and check legal moves to get the row
        console.log('PlayerMove')
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
                    document.getElementById(`${r}, ${c}`).classList.remove('playerHover')
                    document.getElementById(`${r}, ${c}`).classList.add('player')
                    
                }
            })
        }else{
            return
        }
        
        cpuMove(board,cpuRating)
    } 
}
function cpuMove(board,cpuRating){
    console.log(cpuRating)
    console.log('cpuMove')
    let winner = check_for_winner(board)
    if (winner == -1){
        score = parseFloat(document.getElementById('playerScore').innerHTML)
        document.getElementById('playerScore').innerHTML = score + 1
        document.getElementById('winner').textContent = "Player Wins"
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