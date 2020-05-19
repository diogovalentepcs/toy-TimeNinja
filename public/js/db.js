// database interaction

// offline data
db.enablePersistence()
    //this method enables persiting data offline from firebase to indexedDB
    .catch(err => {
        if(err.code == 'failed-precondition' ){
            //failed precondition is when multiple tabs are opened
            console.log('persistence failed')
        } else if(err == 'unimplemented') {
            //lack of browser support
            console.log('persience not available')
        }
    })

// real time listener
db.collection('timers').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), change.doc.id)
        if(change.type === 'added'){
            //add data to the web page
            renderTimer(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed'){
            //remove data to the web page
            removeTimer(change.doc.id)
        }
    })
})



// add timer
const addForm = document.querySelector('.add-timer')
const type = addForm.type
const title = addForm.title
const description = addForm.description
addForm.addEventListener('submit', evt => {
    evt.preventDefault();
    //console.log(addForm.title.value, addForm.description.value)
    //console.log(type.options[type.selectedIndex].text.toLowerCase());
    const timer = {
        //type: addForm.type.options[addForm.type.selectedIndex].value,
        type: type.options[type.selectedIndex].text.toLowerCase(),
        title: title.value,
        description: description.value,
    };

    db.collection('timers').add(timer)
        .catch(err => console.log(err));
    
    //addForm.type.value = '';
    addForm.title.value = '';
    addForm.description.value = '';
    var instance = M.Sidenav.getInstance('.side-form');
    instance.close();
} )


// delete timer
//const timerContainer = document.querySelector('.timers');
timerContainer.addEventListener('click', evt => {
    //console.log(evt);
    if(evt.target.innerHTML === "delete_outline") {
        //trigger delete modal
        const id = evt.target.getAttribute('data-id');
        const deleteModalButton = document.querySelector('.delete-trigger');
        deleteModalButton.click();
        document.getElementById('confirm-delete').onclick = function() {
            db.collection('timers').doc(id).delete();
            document.getElementById('cancel-delete').click()
        };
    }
} )