class Event {
    constructor() {
      this.listeners = [];
    }
  
    addListener(listener) {
      this.listeners.push(listener);
    }
  
    trigger(params) {
      this.listeners.forEach(listener => { listener(params); });
    }
  }
  
class Model {
  #board;
  #currentPlayer;
  #finished;
  constructor() {
    this.#board = [];
    this.fill(this.#board);
    this.#currentPlayer = "R";
    this.#finished = false;

    this.updateCellEvent = new Event();
    this.victoryEvent = new Event();
    this.drawEvent = new Event();
  }

  get getBoard() {
    return this.#board;
  }
  fill(arr) {
    for (let i = 0; i < 7; i++) {
      arr.push([]);
      for (let d = 0; d < 7; d++) {
        arr[i].push("");
      }
    }
  }

  isColNotEmpty(num){
      console.log(this.#board);
    for (let i = 0 ; i < 7 ; i ++){
        if(this.#board[num][i] === ''){
            console.log(i);
            return i;
        }
    }
    return false;
  }

  play(move) {console.log(move);
    let rawNumber=this.isColNotEmpty(move);
    if (typeof rawNumber === "number"){
        this.#board[move][rawNumber] = this.#currentPlayer;
        this.updateCellEvent.trigger( {colNumber: move, rawNumber: rawNumber, player: this.#currentPlayer});
    }
    if (this.isVictory()) {
        this.#finished = true;
        this.victoryEvent.trigger(this.#currentPlayer);
    }else if(this.isFull()){

        this.drawEvent.trigger();
    }
    if (typeof rawNumber === "number"){
        this.switchPlayer();
    }
  }

  isVictory() {
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, -1],
      [0, 1],
    ];
    for (let i = 0; i < 7; i++) {
      for (let d = 0; d < 7; d++) {
        if (this.checkPawn([i, d])) {
          if (this.checkVictoryForEachDirection([i, d], directions)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  checkVictoryForEachDirection(index, directions) {
    if (directions.length === 0) {
      return false;
    } else {
      return (
        this.checkVictoryOnDirection(index, directions[0]) ||
        this.checkVictoryForEachDirection(index, directions.slice(1))
      );
    }
  }

  checkVictoryOnDirection(index, direction) {
    let newIndex = index;
    for (let i = 0; i < 3; i++) {
      newIndex = [newIndex[0] + direction[0], newIndex[1] + direction[1]];
      if ( newIndex[0] > 6 || newIndex[0] < 0 || newIndex[1] > 6 ||newIndex[0] < 0) {
        return false;
      } else if (!this.checkPawn(newIndex)) {
        return false;
      }
    }
    return true;
  }

  checkPawn(index) {
    return this.#board[index[0]][index[1]] === this.#currentPlayer;
  }

  isFull(){
    for (let i = 0; i < 7; i++) {
        for (let d = 0; d < 7; d++) {
          if(this.#board[i][d] === ''){ console.log(1);return false;}
        }
      }
    return true;  
  }

  switchPlayer() {
    if (this.#currentPlayer === "R") {
      this.#currentPlayer = "Y";
    } else {
      this.#currentPlayer = "R";
    }
  }
}

class View {
  constructor() {
    this.playEvent = new Event();
  }

  render() {
    const board = document.createElement("div");
    board.className = "board";
    this.raws=[];
    for(let i = 0 ; i < 7 ; i++){
        const raw = document.createElement("div");
        raw.className = "raw";
        raw.id = `r${i+1}`;
        let cells=[]
        for(let d = 0 ; d < 7; d++){
            
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `${(i*7)+(7-d)}`;
          
            cell.addEventListener('click', () => {
                this.playEvent.trigger(i);
            });
            cells.push(cell);
            console.log(cells)
            raw.append(cell);    
        }
        this.raws.push(cells.reverse());
        board.append(raw);
    }
    console.log(this.raws);

    this.message = document.createElement("div");
    this.message.className = "message";

    document.body.appendChild(board);
    document.body.appendChild(this.message);
  }

  updateCell(data) {
    if(data.player==='R'){
        this.raws[data.colNumber][data.rawNumber].className += " red"
    }else{
        this.raws[data.colNumber][data.rawNumber].className += " yellow"
    }
  }

  victory(winner) {
    this.message.innerHTML = `${winner} wins!`;
  }

  draw() {
    this.message.innerHTML = "It's a draw!";
  }
}

class Controller {
    constructor() {
      this.model = new Model();
      this.view = new View();
  
      this.view.playEvent.addListener(move => { this.model.play(move); });
  
      this.model.updateCellEvent.addListener(data => { this.view.updateCell(data); });
      this.model.victoryEvent.addListener(winner => { this.view.victory(winner); });
      this.model.drawEvent.addListener(() => { this.view.draw(); });
    }
  
    run() {
      this.view.render();
    }
  }

const app = new Controller();
  
app.run();  