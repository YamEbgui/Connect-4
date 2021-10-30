
class Model{
    #board
    #currentPlayer
    #finished 
    constructor(){
        this.#board=[];
        this.fill(this.#board);
        this.#currentPlayer = 'R';
        this.#finished = false;
    }

    get getBoard(){
        return this.#board;
    }
    fill (arr){
        for(let i = 0; i < 7; i++){
            arr.push([])
            for(let d = 0; d < 7 ; d++){
                arr[i].push('')
            } 
        }
    }

    play(move){
        console.log(this.#board[move[0]][move[1]]);
        this.#board[move[0]][move[1]] = this.#currentPlayer;
    }

    isVictory(){
        const directions = [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,-1],[0,1]];
        for (let i = 0; i< 7 ; i++){
            for (let d = 0; d< 7 ; d++){
                if (this.checkPawn([i , d])){
                    if(this.checkVictoryForEachDirection([i,d] , directions)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkVictoryForEachDirection(index, directions){
        if (directions.length ===0){
            return false;
        }else{
            return this.checkVictoryOnDirection(index , directions[0]) || this.checkVictoryForEachDirection(index, directions.slice(1));
        }
    }

    checkVictoryOnDirection(index , direction){
        let newIndex=index;
        for (let i = 0 ; i < 3 ; i++){
            newIndex = [newIndex[0] + direction[0] , newIndex[1] + direction[1]]
            if (newIndex[0] > 6 || newIndex[0] < 0 || newIndex[1] > 6 || newIndex[0] < 0){
                return false;
            }else if (!this.checkPawn(newIndex)){
                return false;
            }
        }
        return true;
    }

    checkPawn(index){
        return this.#board[index[0]][index[1]] === this.#currentPlayer;
    }

    switchPlayer(){
        if (this.#currentPlayer === 'R'){ this.#currentPlayer = 'Y'}
        else { this.#currentPlayer = 'R' }
    }
} 

class View{
    constructor(){

    }

    createElement(tag, className , atrributes) {
        const element = document.createElement(tag);
    
        if (className) element.classList.add(className);
        if (atrributes){
            for (let i = 0; i < atrributes.length ; i++ ){
                element.setAttribute(atrributes[i].key , atrributes[i])
            }
        }
    
        return element;
      }
    
}

class Controller{
    constructor(){

    }
}

class Board{
    #boardSize
    #board
    constructor(){
        this.#boardSize=7;
        this.#board=[]
        this.fill();

    }
    
    fill (){
        for(let i = 0; i < this.#boardSize ; i++){
            this.#board.push([])
            for(let d = 0; d < this.#boardSize ; d++){
                this.#board[i].push([])
            } 
        }
    }

    get getBoard(){
        return this.#board;
    }
}
let b= new Model;
b.play([0,0]);
b.play([0,1]);
b.play([0,2]);
b.play([0,3]);
console.log(b.getBoard);
console.log(b.checkPawn([0,0]));
console.log(b.isVictory());

