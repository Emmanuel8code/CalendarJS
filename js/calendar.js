class Calendar{
    
    constructor(id){  //id como parametro corresponde al id del elemento en donde se colocara el calendario con su template
        
        this.calendarDiv = document.getElementById(id);
        this.cells = [];                                //this.cells es el campo en donde se cargara el conjunto de objetos de las fechas correspondiente al mes seleccionado
        this.selectedDate = null;                       //this.selectedDate campo para guardar el objeto de la fecha seleccionada
        this.currentMonth = moment();                   //this.currentMonth objeto moment() del mes seleccionado
        this.showTemplate();                            //carga el template del calendario    
        this.gridBodyDiv = this.calendarDiv.querySelector('.grid-body'); //despues del showTemplate() sino marcaria error porque depende de lo anterior
        this.monthNameSpan = this.calendarDiv.querySelector('.month-name');  //utiliza el elemento html en donde se carga el nombre del mes
        this.showCells();
   
    }


    showTemplate(){
        this.calendarDiv.innerHTML = this.getTemplate(); 
        this.addEventListenerToControl();
    }

   
    getTemplate(){
        let template = 
        `<div class="calendar-head">
            <button type="button" class="control control--prev">&lt;</button>
            <span class="month-name"></span>
            <button type="button" class="control control--next">&gt;</button>
        </div>
        <div class="calendar-body">
            <div class="grid">
                <div class="grid-head">
                    <span class="grid-cell grid-cell--gh">Lun</span>
                    <span class="grid-cell grid-cell--gh">Mar</span>
                    <span class="grid-cell grid-cell--gh">Mie</span>
                    <span class="grid-cell grid-cell--gh">Jue</span>
                    <span class="grid-cell grid-cell--gh">Vie</span>
                    <span class="grid-cell grid-cell--gh">Sab</span>
                    <span class="grid-cell grid-cell--gh">Dom</span>
                </div>
                <div class="grid-body">
                
                
                </div>
            </div>
        </div>`;
        
        return template;
    }


    addEventListenerToControl(){               //para escuchar los eventos sobre los controles (imagen de flechas en el html) para cambiar el mes
        let allControlsButton = this.calendarDiv.querySelectorAll('.control');   //selecciono todos los elementos que tengan la clase control (en este caso son 2)
        
        allControlsButton.forEach( controlElement => {                        //con el foreach recorro cada elemento (las dos flechas < >) dentro de controlsButton decirles que escuchen el evento click
            controlElement.addEventListener('click', e => {
                let eleTarget = e.target;
                if(eleTarget.classList.contains('control--next')){
                    this.currentMonth.add(1, 'month');
                }   
                else{
                    this.currentMonth.subtract(1, 'month');
                }
                
                //IMPORTANTE llamo a la funcion showCells() de nuevo para que me actualice el template
                this.showCells();
            })
        })
    }

    showCells(){                                             //showCells() cargara las celdas y el nombre del mes  
        this.cells = this.generateDates(this.currentMonth); //se generan las fechas del mes seleccionado para cargar en el campo this.cell
        
        if (this.cells === null){
            console.error('No se pudo generar las fechas');
            return;
        }
        //console.log(this.cells.length);
        this.gridBodyDiv.innerHTML = ''; //borramos para que quede vacio y luego ingresar las celdas
        let templateCells = '';
        let disabledCell = '';

        for (let i = 0; i < this.cells.length; i++) {
            disabledCell = '';
           
            if(!this.cells[i].isInCurrentMonth){
                disabledCell = 'grid-cell--disabled';
            }
           
            templateCells += `<span class="grid-cell grid-cell--gd ${disabledCell}" data-cell-id="${i}">${this.cells[i].cellDate.date()}</span>`;
            
        }
        
        this.monthNameSpan.innerHTML = this.currentMonth.format('MMM YYYY'); //buscar la version en español de moment() porque me devuelve los meses en ingles
        this.gridBodyDiv.innerHTML = templateCells;
        this.addEventListenerToCells();
    }
    
    generateDates(dateToShow = moment()){
        
        if(!moment.isMoment(dateToShow)) return null;
        
        let monthStart = moment(dateToShow).startOf('month');
        let monthEnd = moment(dateToShow).endOf('month');
        let cells = [];

        let subDays = monthStart.day() - 1;

        //console.log(sub);

        let calendarStart = monthStart.subtract(subDays, 'days');
        //console.log(dateStart.format("YYYY MM DD"));

        for(let i = 0; i < 42; i++) {
            cells.push({
                cellDate: moment(calendarStart),
                isInCurrentMonth: calendarStart.month() === dateToShow.month()
            });
            calendarStart.add(1, 'days');
        }

        //console.log(cells);
        return cells;
    }

    addEventListenerToCells(){
        let allCells = this.calendarDiv.querySelectorAll('.grid-cell--gd');
        allCells.forEach( cellElement => {
            cellElement.addEventListener('click', e => {
                let eleTarget = e.target;
                
                //Para no seleccionar a las deshabilitadas y tampoco a la que ya esta seleccionada (sino javascript haria un trabajo de nuevo al vicio)
                if(eleTarget.classList.contains('grid-cell--disabled')||eleTarget.classList.contains('grid-cell--selected')){
                    return;
                }
                
                //Para borrar la seleccionada anterior y que no queden varias seleccionadas
                let selectedBefore = this.gridBodyDiv.querySelector('.grid-cell--selected');
                if(selectedBefore){
                    selectedBefore.classList.remove('grid-cell--selected');
                }
                
                //console.log(eleTarget.dataset.cellId); //para ver el valor que tiene el atributo HTML personalizado de dataset (dataset buscar teoria como se usa)
               
                //cargo el campo selectedDate con el objeto fecha selecionado del array cells segun el id que me sale en dataset (dataset atributo HTML personalizado) al hacer click sobre el elemento q se guarda en eleTarget
                this.selectedDate = this.cells[parseInt(eleTarget.dataset.cellId)].cellDate;
                
                //al elemento eleTarget le agrego la clase grid-cell--selected para que css haga su trabajo dandole estilo
                eleTarget.classList.add('grid-cell--selected'); 
               
                //disparo el evento personalizado changeDate 
                this.calendarDiv.dispatchEvent(new Event ('changeDate'));
            });

        });
    }

    getElement() {
        return this.calendarDiv;
    }

    value(){
        return this.selectedDate;
    }

}



//console.log(moment().format('YYYY MM')); //Probando moment();

let calendar = new Calendar('calendar');

calendar.getElement().addEventListener('changeDate', e => {
    console.log(calendar.value().format('LLL'));
});
