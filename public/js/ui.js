document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // add timer form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
    // add form select
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
    // add modal
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
  });  
  
  
  
  
  
  const listTimers = [];
  const timers = document.querySelector('.timers')
       
  // render timer data
  const renderTimer = (data, id) => {
  
      var icon = ''
      if(data.type === 'study'){
          icon = 'school' 
      } else if(data.type === 'leisure'){
          icon = 'weekend'
      } else if(data.type === 'work'){
          icon = 'next_week'
      }else {
          icon = 'hourglass_full'
      }
      const html = `
          <div class="card-panel timer white row" data-id="${id}">
              <div class="valign-wrapper stopwatch-row" >
                  <i class="material-icons small data-id="${id}">${icon}</i>
              </div>
              <div class="timer-details stopwatch-row">
                  <div class="timer-title">${data.title}</div>
                  <div class="timer-description">${data.description}</div>
              </div>
              <div class="valign-wrapper container center-align basic stopwatch" data-id="${id}">
              </div>
              <div>
                  <a class="timer-settings modal-trigger" href="#modal-settings">
                      <i class="material-icons">settings</i>
                  </a>
                  <a class="modal-trigger hide" href="#modal-settings"><i class="settings-trigger"></i></a>
              </div>
              <div class="timer-delete">
                  <i class="large material-icons" data-id="${id}">delete_outline</i>
              </div>
          </div>
      `;
  
      timers.innerHTML += html
      // basic examples
      var elem = document.querySelector(`.basic[data-id=${CSS.escape(id)}]`);
      const timer = new Stopwatch(elem,{},id);
      listTimers[listTimers.length] = timer;
  
  /*     for (var i=0, len=elems.length; i<len; i++) {
          //debugger;
          new Stopwatch(elems[i]);
          //debugger;
      } */
  }
  
  //remove timer from dom
  const removeTimer = (id) => {
      const timer = document.querySelector(`[data-id=${CSS.escape(id)}]`);
      timer.remove();
  };
  
  
  //start and stop stopwatch
  const timerContainer = document.querySelector('.timers');
  timerContainer.addEventListener('click', evt => {
  /*     console.log(evt);
      console.log(evt.target.closest('.card-panel'));
      console.log(evt.target.closest('.card-panel').getAttribute('data-id'));
   */
        const id = evt.target.closest('.card-panel').getAttribute('data-id');

      if(evt.target.innerHTML !== "delete_outline" && evt.target.innerHTML !== "settings") {
          //trigger delete modal
         // console.log(id)
          for (var i=0, len=listTimers.length; i<len; i++) {
              //console.log(listTimers[i].id)
              if(listTimers[i].id === id){
                  if(listTimers[i].state === 'stopped'){
                      listTimers[i].start();
                      listTimers[i].state = 'running';
                  } else {
                      listTimers[i].stop();
                      listTimers[i].state = 'stopped';
                  }
              }
          }
        } else if (evt.target.innerHTML === 'settings'){
            document.querySelector('#reset').addEventListener('click', () => {
                for (var i=0, len=listTimers.length; i<len; i++) {
                    //console.log(listTimers[i].id)
                    if(listTimers[i].id === id){
                        listTimers[i].reset();
                        listTimers[i].stop();
                    }
                }
                document.getElementById('close-settings').click();
            })
        }
  } )
  
  
  
   //Stopwatch
   const Stopwatch = function(elem, options, id) {
    this.id = id;
    this.state = 'stopped';
    this.sec = '00';
    this.min = '00';
    this.hour = '00';
    this.miliSec = '00';
    var timer = createTimer(),
        secCounter = 0;
    var offset,
        clock,
        interval;
/*         var startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset); */
      

    
    // default options
    options = options || {};
    options.delay = options.delay || 1;
   
    // append elements    
    elem.appendChild(timer);
    //elem.appendChild(startButton);
    //elem.appendChild(stopButton);
    //elem.appendChild(resetButton);
    
    // initialize
    reset();
    
    // private functions
    function createTimer() {
        var span = document.createElement("span");
        span.classList.add('center');
        span.setAttribute('data-id', id)
        //console.log('creating timer')
      return span
    }
    
/*       function createButton(action, handler) {
      var a = document.createElement("a");
      a.href = "#" + action;
      a.innerHTML = action;
      a.addEventListener("click", function(event) {
        handler();
        event.preventDefault();
      });
      return a;
    } */
    
    function start() {
        //console.log('started')
      if (!interval) {
        offset   = Date.now();
        interval = setInterval(update, options.delay);
      }
    }
    
    function stop() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
    
    function reset() {
      clock = 0;
      render(0);
    }
    
    function update() {
      clock += delta();
      //console.log('updating')
      render();
    }
    
    function render() {
        //console.log('rendering')
      const timerSpan = document.querySelector(`span[data-id=${CSS.escape(id)}]`)
      secCounter = Math.floor(clock/1000);
      this.miliSec = Math.floor((clock - Math.floor(clock/1000)*1000)/100);
      clockDivider(secCounter);
      timerSpan.innerHTML = this.hour + ':' + this.min + ':' + this.sec + ':' + this.miliSec;
     // console.log(clock/1000)
      //console.log(timer.innerHTML)
    }
    
    function delta() {
        //console.log('adding time')
      var now = Date.now(),
          d   = now - offset;
      
      offset = now;
      return d;
    }

    //getting hours, mins, second
    function clockDivider(secs) {
          var exactHour = 0,
            exactMin = 0,
            exactSec = 0;
          exactHour = secs/3600;
          this.hour = Math.floor(exactHour);
          exactMin = (exactHour - this.hour) * 60;
          this.min = Math.floor(exactMin);
          exactSec = (exactMin - this.min) * 60;
          this.sec = Math.floor(exactSec);
          getTime(this.hour, this.min, this.sec);
      };

      function getTime(hour,min,sec){
          var list = [hour, min, sec];
          for (i=0; i < list.length; i++) {
              if(list[i]<10) {
                  list[i] = '0' + list[i];
              };
          }
        this.hour = list[0] 
        this.min = list[1]
        this.sec = list[2]
      }
    
    
    // public API
    this.start  = start;
    this.stop   = stop;
    this.reset  = reset;
};
  
  /* // basic examples
  var elems = document.getElementsByClassName(".basic");
  
  for (var i=0, len=elems.length; i<len; i++) {
  new Stopwatch(elems[i]);
  } */
  
  
  /* // programmatic examples
  var a = document.getElementById("a-timer");
  aTimer = new Stopwatch(a);
  aTimer.start();
  
  var b = document.getElementById("b-timer");
  bTimer = new Stopwatch(b, {delay: 100});
  bTimer.start();
  
  var c = document.getElementById("c-timer");
  cTimer = new Stopwatch(c, {delay: 456});
  cTimer.start();
  
  var d = document.getElementById("d-timer");
  dTimer = new Stopwatch(d, {delay: 1000});
  dTimer.start(); */
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /* 
  // swipe
  $(function(){
    // Bind the swipeHandler callback function to the swipe event on div.box
     $( ".card-panel" ).on("swipe", swipeHandler); 
  
    // Callback function references the event target and adds the 'swipe' class to it
    function swipeHandler( event ){
      $(this).find('.settings-trigger').trigger( "click" );  }
  });
  $(function(){
    $('.settings-trigger').on('click', function(e){
      e.stopPropagation();})
  });
  
  
  
  
  
  
  
  // Stopwatch
  $(function(){
  
  var stopwatchInterval = 0;      // The interval for our loop.
  var stopwatchRow = $(".stopwatch-row")
  var stopwatch = $(".container.stopwatch")
  var stopwatchClock = stopwatch.find(".clock"),
      stopwatchDigits = stopwatchClock.find('span');
  
  // Checks if the previous session was ended while the stopwatch was running.
  // If so start it again with according time.
  if(Number(localStorage.stopwatchBeginingTimestamp) && Number(localStorage.stopwatchRunningTime)){
  
      var runningTime = Number(localStorage.stopwatchRunningTime) + new Date().getTime() - Number(localStorage.stopwatchBeginingTimestamp);
  
      localStorage.stopwatchRunningTime = runningTime;
  
      startStopwatch();
  }
  
  // If there is any running time form previous session, write it on the clock.
  // If there isn't initialise to 0.
  if(localStorage.stopwatchRunningTime){
      stopwatchDigits.text(returnFormattedToMilliseconds(Number(localStorage.stopwatchRunningTime)));
  }
  else{
      localStorage.stopwatchRunningTime = 0;
  }
  
  $('#stopwatch-btn-start').on('click',function(){
      if(stopwatchClock.hasClass('inactive')){
          startStopwatch()
      }
  });
  
  $('#stopwatch-btn-pause').on('click',function(){
      pauseStopwatch();
  });
  
  $('#stopwatch-btn-reset').on('click',function(){
      resetStopwatch();
  });
  
  // Pressing the clock will pause/unpause the stopwatch.
  stopwatch.on('click',function(){
  
      if(stopwatchClock.hasClass('inactive')){
          startStopwatch()
      }
      else{
          pauseStopwatch();
      }
  });
  
  stopwatchRow.on('click',function(){
  
    if(stopwatchClock.hasClass('inactive')){
        startStopwatch()
    }
    else{
        pauseStopwatch();
    }
  });
  
  
  function startStopwatch(){
      // Prevent multiple intervals going on at the same time.
      clearInterval(stopwatchInterval);
  
      var startTimestamp = new Date().getTime(),
          runningTime = 0;
  
      localStorage.stopwatchBeginingTimestamp = startTimestamp;
  
      // The app remembers for how long the previous session was running.
      if(Number(localStorage.stopwatchRunningTime)){
          runningTime = Number(localStorage.stopwatchRunningTime);
      }
      else{
          localStorage.stopwatchRunningTime = 1;
      }
  
      // Every 100ms recalculate the running time, the formula is:
      // time = now - when you last started the clock + the previous running time
  
      stopwatchInterval = setInterval(function () {
          var stopwatchTime = (new Date().getTime() - startTimestamp + runningTime);
  
          stopwatchDigits.text(returnFormattedToMilliseconds(stopwatchTime));
      }, 100);
  
      stopwatchClock.removeClass('inactive');
  }
  
  function pauseStopwatch(){
      // Stop the interval.
      clearInterval(stopwatchInterval);
  
      if(Number(localStorage.stopwatchBeginingTimestamp)){
  
          // On pause recalculate the running time.
          // new running time = previous running time + now - the last time we started the clock.
          var runningTime = Number(localStorage.stopwatchRunningTime) + new Date().getTime() - Number(localStorage.stopwatchBeginingTimestamp);
  
          localStorage.stopwatchBeginingTimestamp = 0;
          localStorage.stopwatchRunningTime = runningTime;
  
          stopwatchClock.addClass('inactive');
      }
  }
  
  // Reset everything.
  function resetStopwatch(){
      clearInterval(stopwatchInterval);
  
      stopwatchDigits.text(returnFormattedToMilliseconds(0));
      localStorage.stopwatchBeginingTimestamp = 0;
      localStorage.stopwatchRunningTime = 0;
  
      stopwatchClock.addClass('inactive');
  }
  
  
  function returnFormattedToMilliseconds(time){
      var milliseconds = Math.floor((time % 1000) / 100),
          seconds = Math.floor((time/1000) % 60),
          minutes = Math.floor((time/(1000*60)) % 60),
          hours = Math.floor((time/(1000*60*60)) % 24);
  
      seconds = seconds < 10 ? '0' + seconds : seconds;
      minutes = minutes < 10 ? '0' + minutes : minutes;
  
  
      return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }
  }) */