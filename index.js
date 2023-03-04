document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid')
    const bombsLeft = document.querySelector('.left-bombs')
    let width = 16
    let squares = []
    let init_bombs = 40
    let bombs = 40

    bombsLeft.innerHTML = bombs

    let dy2 = [-1,-1,-1,0,0,1,1,1]
    let dx2 = [-1,0,1,-1,1,-1,0,1]

    function createBoard(){
        let bombsArray = Array(bombs).fill('bomb')
        let emptyArray = Array(width*width-bombs).fill('valid')
        let gameArray = emptyArray.concat(bombsArray)
        gameArray.sort(() => Math.random() - 0.5)

        for (let i=0;i<width*width;i++){
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(gameArray[i])
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click', function(){
                click(square)
            })
            square.addEventListener('contextmenu', function(e){
                e.preventDefault()
                flag(square)
            })
        }
    }

    createBoard()

    for (let i=0;i<squares.length;i++){
        if (squares[i].classList.contains('valid')){
            let total = 0
            for (let j=0;j<8;j++){
                let nr = parseInt(i / width) + dy2[j]
                let nc = i % width + dx2[j]
                if (nr<0||nc<0||nr>=width||nc>=width) continue
                let idx = nr * width + nc
                if (squares[idx].classList.contains('bomb')) total++
            }
            squares[i].setAttribute('data', total)
        } 
    }
    function checkSuccess(){
        let b = 0
        let c = 0
        for (let i=0;i<squares.length;i++){
            if (squares[i].classList.contains('bomb') && squares[i].classList.contains('flag')){
                b++
            }
            else if (squares[i].classList.contains('checked')){
                c++
            }
        }
        
        if (b + c == width * width) {
            console.log(b, c, width*width)
            return true
        }
        return false
    }

    function flag(square){
        if (square.classList.contains('checked')) return

        if (square.classList.contains('flag')){
            square.classList.remove('flag')
            bombs++
            bombsLeft.innerHTML = bombs
        }
        else {
            square.classList.add('flag')
            bombs--
            bombsLeft.innerHTML = bombs
            if (checkSuccess()==true){
                alert('success!!')
                location.reload()
            }
        }
    }

    function bfs(square){
        let needvisit = []
        let nblist = []
        let id = square.getAttribute('id')
        square.classList.add('zero')
        needvisit.push(id)
        
        while (needvisit.length !== 0){
            let nodeId = needvisit.shift()
            let elem = squares[nodeId]
            nblist.push(nodeId)
            elem.classList.add('checked')
            let flag = 0
            for (let j=0;j<8;j++){
                let nr = parseInt(nodeId / width) + dy2[j]
                let nc = nodeId % width + dx2[j]
                if (nr<0||nc<0||nr>=width||nc>=width) continue
                let idx = nr * width + nc

                if (squares[idx].classList.contains('checked')){
                    continue
                }
                let bombs = squares[idx].getAttribute('data')
                if (bombs == 0){
                    needvisit.push(idx)
                    nblist.push(idx)
                    squares[idx].classList.add('zero')
                }
            }
        }
        for (let i=0;i<nblist.length;i++){
            const cur = squares[nblist[i]].getAttribute('id')
            for (let j=0;j<8;j++){
                let nr = parseInt(cur / width) + dy2[j]
                let nc = cur % width + dx2[j]
                if (nr<0||nc<0||nr>=width||nc>=width) continue
                let idx = nr * width + nc

                if (squares[idx].classList.contains('checked')){
                    continue
                }
                squares[idx].classList.add('checked')
                squares[idx].innerHTML = squares[idx].getAttribute('data')
            }
        }
    }
    function gameOver(){
        window.onload = setTimeout(function(){
            alert('Game Over !');
            window.location.reload();
        }, 500);
    }

    function click(square) {
        if (square.classList.contains('flag')) return
        if (square.classList.contains('bomb')){
            for (let i=0;i<squares.length;i++){
                if (squares[i].classList.contains('bomb')){
                    squares[i].classList.add('lose')
                }
            }
            gameOver()
        } else {
            if (square.classList.contains('checked')) {
                let nodeId = square.getAttribute('id')
                let list = []
                let zerolist = []
                let bombsList = []
                let gameover = 0
                for (let j=0;j<8;j++){
                    let nr = parseInt(nodeId / width) + dy2[j]
                    let nc = nodeId % width + dx2[j]
                    if (nr<0||nc<0||nr>=width||nc>=width) continue
                    let idx = nr * width + nc

                    if (squares[idx].classList.contains('checked')){
                        continue
                    }
                    if (squares[idx].classList.contains('flag')){
                        continue
                    }

                    if (squares[idx].classList.contains('bomb')){
                        if (squares[idx].classList.contains('flag')){
                            continue
                        }
                        else{
                            for (let i=0;i<squares.length;i++){
                                if (squares[i].classList.contains('bomb')){
                                    squares[i].classList.add('lose')
                                }
                            }
                            gameOver()
                            return
                        }
                    }
                    if (squares[idx].getAttribute('data') == 0){
                        zerolist.push(squares[idx])
                    }
                    else list.push(idx)
                }
                if (gameover >= 1){
                    return
                }
                for (let i=0;i<zerolist.length;i++){
                    bfs(zerolist[i])
                }
                for (let i=0;i<list.length;i++){
                    squares[list[i]].classList.add('checked')
                    squares[list[i]].innerHTML = squares[list[i]].getAttribute('data')
                }
                if (checkSuccess()==true){
                    alert('success!!')
                }
            }

            let totalbombs = square.getAttribute('data')
            
            if (totalbombs >= 1){
                square.classList.add('checked')
                square.innerHTML = totalbombs
                return
            } else {
                //bfs
                bfs(square) 
            }
            if (checkSuccess()==true){
                alert('success!!')
                location.reload()
            }
        }
    }













})