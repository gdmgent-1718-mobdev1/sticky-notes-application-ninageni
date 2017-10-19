function ready(cb) {
    /in/.test(document.readyState)
    ? setTimeout(ready.bind(null, cb), 90)
    : cb();
};

ready(function(){

    var App = {
        "init": function() {
            this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
            this._applicationDbContext.init('ahs.nmd.stickynotes'); // Intialize the ApplicationDbContext with the connection string as parameter value
            this.testApplicationDbContext(); // Test DbContext
        },
        "testApplicationDbContext": function() {


            function stickyNotesListUpdate() {
                let stickyNotesElement = document.querySelector('.stickynotes');
                
                let tempStr = '';
                // 1. Get all sticky notes
                let data = App._applicationDbContext.getStickyNotes();
                if (data == null) {
                    tempStr = 'There are no stickynotes';
                }
                else {
                    data.forEach(function(stickyNote) {
                        tempStr += `
                            <div class="stickynote">
                                <p class="message">${stickyNote.message}</p>
                                New message:<input type="text" class="update-message">
                                <button class="update">UPDATE</button>                        
                                <button class="delete">DELETE</button>
                            </div>
                        `;
                    }, this);

                    stickyNotesElement.innerHTML = tempStr;
                }
                let stickyNoteUpdateButton = document.querySelectorAll('.update');
                for (var i=0; i < stickyNoteUpdateButton.length; i++) {
                    stickyNoteUpdateButton[i].addEventListener('click', listener.bind(null, i, "update"), false);
                    
                };
    
                let stickyNoteDeleteButton = document.querySelectorAll('.delete');
                for (var i=0; i < stickyNoteDeleteButton.length; i++) {
                    stickyNoteDeleteButton[i].addEventListener('click', listener.bind(null, i, "delete"), false);
                    
                };
            };

            stickyNotesListUpdate()

            
            // 2. Create a new sticky note

            let stickyNoteAddButton = document.querySelector('.add-button');
            let stickyNoteAdMessageField = document.querySelector('.add-message');
            stickyNoteAddButton.addEventListener('click', function(ev){
                ev.preventDefault();
                let stickyNoteAddMessage = '';
                stickyNoteAddMessage = stickyNoteAdMessageField.value;
                if (stickyNoteAddMessage == '') {
                    alert('Wrtie a message!');
                }
                else {
                    let sn = new StickyNote();
                    sn.message = stickyNoteAddMessage;
                    App._applicationDbContext.addStickyNote(sn); // add to db and save it
                    stickyNotesListUpdate();
                } 
            }, false);

            function listener(index, kind){
                let stickyNoteUpdateMessageField = document.querySelectorAll('.update-message');
                let data = App._applicationDbContext.getStickyNotes();
                if (kind == "update"){ 
                    let stickyNoteUpdateMessage = '';
                    stickyNoteUpdateMessage = stickyNoteUpdateMessageField[index].value;
                    
                    if (stickyNoteUpdateMessage != ''){
                        let sn = new StickyNote();
                        sn = App._applicationDbContext.getStickyNoteById(data[index].id);
                        console.log(sn.id);
                        sn.message = stickyNoteUpdateMessage;
                        const updated = App._applicationDbContext.updateStickyNote(sn);
                        console.log(updated);
                        stickyNotesListUpdate();
                    }
                }

                else if (kind == "delete") {
                
                    const deleted = App._applicationDbContext.deleteStickyNoteById(data[index].id);
                    console.log(deleted);
                    stickyNotesListUpdate();
                }

            }

            
            //let sn = new StickyNote();
            // 3. Get allesticky notes
            data = this._applicationDbContext.getStickyNotes();
            console.log(data);
            // 4. Get sticky note by id
            sn = this._applicationDbContext.getStickyNoteById(2306155430445);
            console.log(sn);
            // 5. Delete sticky note by id
            
            // 6. Soft Delete sticky note with id: 1551637732407
            //const softDeleted = this._applicationDbContext.softDeleteStickyNoteById(1551637732407);
            //console.log(softDeleted);
            //sn = this._applicationDbContext.getStickyNoteById(1551637732407);
            //console.log(sn);
            // 6. Soft Delete sticky note with id: 1551637732407
            const softUnDeleted = this._applicationDbContext.softUnDeleteStickyNoteById(1551637732407);
            console.log(softUnDeleted);
            sn = this._applicationDbContext.getStickyNoteById(1551637732407);
            console.log(sn);
            // Update sticky note with id: 1902577181167
            sn = this._applicationDbContext.getStickyNoteById(1902577181167);
            console.log(sn);

        }
    };

    App.init(); // Initialize the application
});