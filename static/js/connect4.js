window.onload = function() {
    setBoard();
}
let board = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]

function setBoard() {
    let b = d3.select('#newGame')
    let c = d3.select('#newGame2')
    b.on("click", () => {
        setBoard()
        newGame(board)
    })
    c.on("click", () => {
        setBoard()
        newGame2(board)
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
    newGame(board)
}

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

function newGame(board) {
    for(let i=0;i<6;i++){
        for(let j=0;j<7;j++){
            board[i][j] = 0
        }
    }
    console.log('new game')}
function newGame2(board) {
    for(let i=0;i<6;i++){
        for(let j=0;j<7;j++){
            board[i][j] = 0
        }
    }
    console.log('new game')
    cpuMove(board)
}

function check_legal_moves(board){
    if(check_for_winner(board) != 0){
        return([])
    }else{
        let legal_moves = []
        for(let col = 0;col<7;col++){

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
function find_score(board,turn){
    bms = [[3, 4, 5, 7, 5, 4, 3],
               [4, 6, 8,10, 8, 6, 4],
               [5, 7,11,13,11, 7, 5],
               [5, 7,11,13,11, 7, 5],
               [4, 6, 8,10, 8, 6, 4],
               [3, 4, 5, 7, 5, 4, 3]]
    score = 0
    for(i = 0;i<6;i++){
        for(j = 0;j<7;j++){
            score+=bms[i][j]*board[i][j]
        }
    }
    moves = check_legal_moves(board)
    moves.forEach(move => {
        a = move[0]
        b = move[1]
        score+=bms[a][b]*(-turn)
    }) 
    return(score)
}
function minmax(board,depth,turn,alpha,beta){
    // #if game ends in a draw, score = 0
    if (check_legal_moves(board) == []){
        return(0)
    }
    // #if someone wins, score = + or - 1000
    if (check_for_winner(board) != 0){
        return(Infinity*(-turn))
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
    let winner = document.getElementById('winner').textContent
    if(winner != ''){
        setBoard()
    }else{
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
                    document.getElementById(`${r}, ${c}`).classList.remove('playerHover')
                    document.getElementById(`${r}, ${c}`).classList.add('player')
                    if (check_for_winner(board) == -1){
                        document.getElementById('winner').textContent = "You Win"
                    }
                }
            })
        }else{
            return
        }
        cpuMove(board)
    }
    
}

function cpuMove(board){
    console.log('cpuMove')
    let winner = check_for_winner(board)
    if (winner == -1){
        score = parseInt(document.getElementById('playerScore').innerHTML)
        document.getElementById('playerScore').innerHTML = score + 1
        document.getElementById('winner').textContent = "Player Wins"
        return
    }else if(winner == 0){
        let move = best_move(board,5)
        if(!move){
            document.getElementById('winner').textContent = "Draw"
            return
        }else{
            let r = move[0]
            let c = move[1]
            board[r][c] = 1
            document.getElementById(`${r}, ${c}`).classList.add('cpu')
            let winner = check_for_winner(board)
            if(winner == 1){
                score = parseInt(document.getElementById('cpuScore').innerHTML)
                document.getElementById('cpuScore').innerHTML = score + 1
                console.log('Winner!!')
                console.log(winner)
                document.getElementById('winner').textContent = "CPU Wins"
            }else if(check_legal_moves(board).length == 0){
                document.getElementById('winner').textContent = "Draw"
                return
            }
        }
        
    }else{
        console.log('Winner!!')
        console.log(winner)
        setBoard()
    }
}