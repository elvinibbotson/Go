function id(el) {
    // console.log("return element whose id is "+el);
    return document.getElementById(el);
}

'use strict';

// GLOBAL VARIABLES
// var db;
// var records = [];
var words=[];
var word={};
var wordIndex=null;
// var record = {};
var step=0;
var cardIndex=0;
var cardStep=0;
var mode='none';
var lang='English';
// var recordIndex = -1;
var lastSave = null;
var resort = false;
// var qFocus = null;
var finds=[]; // NEW: list of words matching find term
var findIndex=null;
// var find=-1; // index for matching finds (-1 if none)

// EVENT LISTENERS

id('header').addEventListener('click',function() {
	show('dataDialog');
})

id('background').addEventListener('click',function() {
	console.log('close dialogs');
	hide('dataDialog');
	hide('restoreDialog');
	hide('findDialog');
	hide('flashcardDialog');
	hide('wordDialog');
	hide('wordPanel');
	show('buttonFind');
	show('buttonAdd');
	mode='none';
	/*
	id('findDialog').style.display='none';
	id('recordDialog').style.display='none';
	id('wordPanel').style.display='none';
	id('buttonFind').style.display='block';
	*/
})

// JAPANESE flashcards
id('nihongoButton').addEventListener('click', function(e) {
	e.stopPropagation();
    // id('buttonNextDone').innerHTML = 'NEXT';
    lang = 'Japanese';
    mode='flashcards';
    // id('display').style.display = 'block';
    
    id('flashcardDialog').innerHTML='日本語 flashcards';
    show('flashcardDialog');
    hide('help');
    hide('buttonBack');
    show('buttonNext');
    show('wordPanel');
    
    // id('help').innerHTML = '';
    // cardIndex=Math.floor(Math.random()*records.length);
    flashcard(true);
})

// ENGLISH flashcards
id('angloButton').addEventListener('click', function(e) {
	e.stopPropagation();
    // id('buttonNextDone').innerHTML = 'NEXT';
    lang = 'English';
    mode='flashcards';
    // id('display').style.display = 'block';
    
    id('flashcardDialog').innerHTML='English flashcards';
    show('flashcardDialog');
    
    hide('help'); // id('help').innerHTML = '';
    show('wordPanel');
    // cardIndex=Math.floor(Math.random()*records.length);
    flashcard(true);
})
/*
id('buttonNextCard').addEventListener('click',function() {
	if ((lang=='Japanese')&&(step<3)) { // reveal words one at a time
            step++;
            if (step==2) {
                id('kana').innerHTML = record.kana
                id('title').innerHTML = 'kana';
            // } else if (step == 3) {
                id('romaji').innerHTML = record.romaji
                id('title').innerHTML = 'Romaji';
            } else {
                id('anglo').innerHTML = record.anglo;
                id('title').innerHTML = 'English';
            }
        } else if ((lang == 'English') && (step == 4)) { // reveal all Japanese at once
            id('kanji').innerHTML = record.kanji;
            id('kana').innerHTML = record.kana;
            id('romaji').innerHTML = record.romaji;
            step = 0;
        } else flashcard(false);
})
*/
// FIND
id('buttonFind').addEventListener('click',function() {
	console.log('FIND');
	mode='find';
	show('findDialog');
	hide('buttonFind');
	hide('help');
	findIndex=null;
	// id('findDialog').style.display='block';
	// id('buttonFind').style.display='none';
	// id('help').innerHTML = '';
})

id('find').addEventListener('click',function() {
    word=id('findField').value.toLowerCase();
    console.log("find "+word);
    var i=0,
        j=0;
    var found=false;
    record={};
    finds=[];
    
    		console.log('search '+words.length+' words for '+word);
    		while(i<words.length) {
    			found=false;
    			for(j=0;j<words[i].romaji.length;j++) {
    				if(words[i].romaji[j].indexOf(word)>=0) found=true;
    			}
    			for(j=0;j<words[i].anglo.length;j++) {
    				if(words[i].anglo[j].indexOf(word)>=0) found=true;
    			}
    			if(found) finds.push(i);
    			i++;
    		}
    		console.log(finds.length+' matching words');
    /*
    console.log('search '+records.length+' records for '+word);
    i=0;
    while(i<records.length) { // check every record
        found = false;
        for (j = 0; j < records[i].romaji.length; j++) {
            if (records[i].romaji[j].indexOf(word) >= 0) found = true;
        }
        for (j = 0; j < records[i].anglo.length; j++) {
            if (records[i].anglo[j].indexOf(word) >= 0) found = true;
        }
        if (found) finds.push(i);
        i++;
    }
    console.log(finds.length+' matching records');
    */
    if (finds.length > 0) { // if any matches...
        // id('title').innerHTML = word;
        findIndex=0;
        showMatch(); // show first match
        show('wordPanel'); // id('display').style.display = 'block';
        if(finds.length>1) {
        	show('buttonBack');
        	show('buttonNext');
        }
        else {
        	hide('buttonBack');
        	hide('buttonNext');
        }
    } else hide('wordPanel'); // id('display').style.display = 'none';
    // id('help').innerHTML = '';
});

id('buttonBack').addEventListener('click',function(e) {
	e.stopPropagation();
	console.log('BACK');
	if(mode=='find') {
		if(findIndex<1) findIndex=finds.length-1;
		else findIndex--;
		showMatch();
	}
})

id('buttonNext').addEventListener('click',function(e) {
	e.stopPropagation();
	console.log('NEXT');
	if(mode=='find') {
		findIndex++;
		if(findIndex==finds.length) findIndex=0;
		showMatch();
	}
	else if(mode=='flashcards') {
		if ((lang=='Japanese')&&(step<3)) { // reveal words one at a time
            step++;
            if (step==2) {
                id('kana').innerHTML = word.kana
                // id('title').innerHTML = 'kana';
            // } else if (step == 3) {
                id('romaji').innerHTML = word.romaji
                // id('title').innerHTML = 'Romaji';
            } else {
                id('anglo').innerHTML = word.anglo;
                // id('title').innerHTML = 'English';
            }
        } else if ((lang == 'English') && (step == 4)) { // reveal all Japanese at once
            id('kanji').innerHTML = word.kanji;
            id('kana').innerHTML = word.kana;
            id('romaji').innerHTML = word.romaji;
            step = 0;
        } else flashcard(false);
	}
})

id('wordPanel').addEventListener('click',function() {
	console.log('EDIT');
	hide('wordPanel');
    mode='edit';
    id('label').innerHTML='kanji';
    id('wordField').value=word.kanji;
    id('word').innerHTML=word.kanji+'/'+word.kana+'/'+word.romaji+'/'+word.anglo;
    id('label').innerHTML='kanji';
    id('wordField').value=word.kanji;
    step=1;
    id('nextSave').src='next.svg';
    show('buttonDelete');
    show('wordDialog');
})

id('buttonAdd').addEventListener('click',function() {
    hide('wordPanel');
    // id('display').style.display = 'none';
    mode='add';
    step=1;
    id('word').innerHTML='';
    id('wordField').value='';
    wordIndex=-1;
    id('label').innerHTML="kanji";
    /*
    id("buttonDelete").disabled = true;
    id('buttonDelete').style.color = 'gray';
    id('buttonNextSave').innerHTML = 'NEXT';
    // id('buttonClose').disabled = false;
    */
    hide('buttonDelete');
    show('wordDialog');
    // id('recordDialog').style.display = 'block';
    hide('help');
    hide('buttonAdd');
    // id('help').innerHTML = '';
});

// id('wordField').addEventListener('change',nextStep);

id('buttonDelete').addEventListener('click',function() {
    alert("DELETE WORD");
    words.splice(wordIndex,1);
    wordIndex=-1;
    save();
    hide('wordDialog');
    mode='none';
})

id('buttonNextSave').addEventListener('click',nextStep);

id('buttonRestore').addEventListener('click',function() {
	show('restoreDialog');
})

id('buttonBackup').addEventListener('click',function() {
	show('backupDialog');
});

function nextStep() {
	// ******* COULD ALL GO IN BUTTONNEXTSAVE LISTENER?  *********
	console.log("input: " + id('wordField').value);
    // if (id('buttonNextSave').innerHTML == 'NEXT') {
    if(step<4) {
        if(step==1) { // kanji
            word.kanji = id('wordField').value;
            console.log('kanji:' + word.kanji);
            id('word').innerHTML=word.kanji; // id('dialogTitle').innerHTML = word.kanji;
            step++;
            // id('label').innerHTML = 'kana';
            id('label').innerHTML="kana";
            if (mode=='edit') id('wordField').value=word.kana;
            else id('wordField').value='';
        } else if (step == 2) { // kana
            word.kana=id('wordField').value.split(",");
            console.log('kana:'+word.kana);
            id('word').innerHTML+='/'+word.kana;
            // id('dialogTitle').innerHTML += " " + record.kana;
            step++;
            id('label').innerHTML="romaji";
            // id('label').innerHTML = 'romaji';
            if (mode == 'edit') id('wordField').value=word.romaji;
            else id('wordField').value='';
        } else if (step==3) { // romaji
            word.romaji=id('wordField').value.toLowerCase().split(",");
            for(var i=0;i<word.romaji.length;i++) { // strip any spaces following commas
                var w=word.romaji[i];
                while (w.charAt(0)==' ') w=w.slice(1);
                word.romaji[i]=w;
            }
            console.log('romaji:'+word.romaji);
            id('word').innerHTML+='/'+word.romaji;
            id('label').innerHTML='English'; // += " " + record.romaji;
            step++;
            // id('label').innerHTML = 'English';
            if(mode=='edit') id('wordField').value=word.anglo;
            else id('wordField').value='';
            id('nextSave').src='tick.svg';
            // id('buttonNextSave').innerHTML = 'SAVE';
        }
        return;
    }
    // reach here after entering English word (step 4)
    word.anglo=id('wordField').value.toLowerCase().split(",");
    for(var i=0;i<word.anglo.length;i++) { // strip any spaces following commas
        var w=word.anglo[i];
        while(w.charAt(0)==' ') w=w.slice(1);
        word.anglo[i]=w;
    }
    id('word').innerHTML+='/'+word.anglo;
    // id('dialogTitle').innerHTML += " " + record.anglo; // ****** no point? ******
    console.log("SAVE");
    hide('wordDialog');
    // id('recordDialog').style.display = 'none';
    console.log("save " + word.kanji + "; " + word.kana + "; " + word.romaji + "; " + word.anglo);
	if(wordIndex<0) words.push(word);
	else words[wordIndex]=word;
	save();
    // check if this word/phrase is already in the records array - if so display alert
	/* old code for IndexedDB...
    var dbTransaction = db.transaction('go', "readwrite");
    console.log("transaction ready");
    var dbObjectStore = dbTransaction.objectStore('go');
    console.log("objectStore ready");
    if (recordIndex < 0) { // add new record
        var request = dbObjectStore.add(record);
        // request.onsuccess = function(event) {console.log("record added - id is "+event.target.id);};
        request.onsuccess = function(event) {
            record.id = event.target.result;
            console.log("record added - id is " + record.id);
            // insert into records array
            var i = 0;
            var found = false;
            while ((i < records.length) && !found) {
                // console.log("record "+i+" date: "+records[i].date);
                if (records[i].date > record.date) found = true;
                else i++;
            }
            records.splice(i, 0, record);
            qFocus = null;
            id('count').innerHTML = records.length;
        };
        request.onerror = function(event) {
            console.log("error adding new record");
        };
    } else { // update record
        var request = dbObjectStore.put(record); // update record in database
        request.onsuccess = function(event) {
            console.log("record " + record.id + " updated");
        };
        request.onerror = function(event) {
            console.log("error updating record " + record.id);
        };
    }
    */
    // id('title').innerHTML = "saved";
    id('kanji').innerHTML=word.kanji;
    id('kana').innerHTML=word.kana;
    id('romaji').innerHTML=word.romaji;
    id('anglo').innerHTML=word.anglo;
    // id('buttonNextDone').innerHTML = 'DONE';
    hide('buttonBack');
    hide('buttonNext');
    show('wordPanel');
    show('buttonAdd');
    // id('display').style.display = 'block';
}
/*
id('buttonNextDone').addEventListener('click', function() {
    if(step>3) (id('buttonNextDone').innerHTML == 'DONE') id('display').style.display = 'none';
    else if (finds.length > 0) { // show next match
        showMatch();
    } else { // show next flashcard
        if ((lang == 'Japanese') && (step < 4)) { // reveal words one at a time
            step++;
            if (step == 2) {
                id('kana').innerHTML = record.kana
                id('title').innerHTML = 'kana';
            } else if (step == 3) {
                id('romaji').innerHTML = record.romaji
                id('title').innerHTML = 'Romaji';
            } else {
                id('anglo').innerHTML = record.anglo;
                id('title').innerHTML = 'English';
            }
        } else if ((lang == 'English') && (step == 4)) { // reveal all Japanese at once
            id('kanji').innerHTML = record.kanji;
            id('kana').innerHTML = record.kana;
            id('romaji').innerHTML = record.romaji;
            step = 0;
        } else flashcard(false);
    }
})
*/
function showMatch() {
			wordIndex=finds[findIndex];
	
	// recordIndex=finds[findIndex];

    		word=words[wordIndex];
    		id('kanji').innerHTML=word.kanji;
    		id('kana').innerHTML=word.kana;
    		id('romaji').innerHTML=word.romaji;
    		id('anglo').innerHTML=word.anglo;
    
    // record=records[recordIndex];
    /*
    id('kanji').innerHTML=record.kanji;
    id('kana').innerHTML=record.kana;
    id('romaji').innerHTML=record.romaji;
    id('anglo').innerHTML=record.anglo;
    */
    /*
    if (finds.length < 1) { // last match
        id('buttonNextDone').innerHTML = 'DONE';
        console.log('last match');
    } else id('buttonNextDone').innerHTML = 'NEXT';
    */
}

/*
id('buttonClose').addEventListener('click', function() {
    id('display').style.display = 'none';
})
*/

/* EDIT word/phrase
id('buttonEdit').addEventListener('click', function() {
    id('display').style.display = 'none';
    mode = 'edit';
    id('dialogTitle').innerHTML = "edit word/phrase";
    id('label').innerHTML = 'kanji';
    id('wordField').value = record.kanji;
    step = 1;
    id('buttonNextSave').innerHTML = 'NEXT';
    id("buttonDelete").disabled = false;
    id('buttonDelete').style.color = 'yellow';
    id('recordDialog').style.display = 'block';
})
*/

/* NEXT/DONE

*/



// RANDOM FLASHCARD
function flashcard(first) {
	console.log('FLASHCARD - first? '+first);
    if(first) {
        cardIndex=Math.floor(Math.random()*words.length);
        cardStep=1+Math.floor(Math.random()*5); // flashcards step by 1-5 words
        console.log("flashcard "+cardIndex +" step by "+cardStep);
    }
    console.log("flashcard "+cardIndex);
    wordIndex=cardIndex; // NEEDED???
    word=words[wordIndex];
    console.log(word.kanji+','+word.kana+','+word.anglo);
    if(lang=='Japanese') {
        id('kanji').innerHTML=word.kanji;
        if(word.kanji) {
            id('kana').innerHTML='-';
            step=1;
        } else { // no kanji
            id('kana').innerHTML = word.kana;
            step = 2;
        }
        id('romaji').innerHTML = id('anglo').innerHTML = '-';
    } else {
        id('anglo').innerHTML = word.anglo;
        id('kanji').innerHTML = id('kana').innerHTML = id('romaji').innerHTML = '-';
        step = 4;
    }
    
    //id('wordPanel').style.display='block';
    console.log('wordPanel is '+id('wordPanel').style.display);
    // show('help');
    cardIndex = (cardIndex + cardStep) % records.length; // ready for next flashcard
}

// ADD word/phrase BUTTON


// DELETE RECORD ******** REINSTATE THIS *************
/* id('buttonDelete').addEventListener('click', function() {
    alert("delete record " + record.id);
    var dbTransaction = db.transaction("go", "readwrite");
    console.log("transaction ready");
    var dbObjectStore = dbTransaction.objectStore("go");
    var request = dbObjectStore.delete(record.id);
    request.onsuccess = function(event) {
        records.splice(recordIndex, 1) // remove record form records array
        console.log("record " + recordIndex + " (id " + record.id + ") deleted. " + records.length + " records");
        hide('recordDialog');
        // id('recordDialog').style.display = 'none';
    };
    request.onerror = function(event) {
        console.log("error deleting record " + record.id);
    };
}); */

// LOAD VOCABULARY
function load() {
	var data=localStorage.getItem('WordData');
	if(!data) {
		id('dataMessage').innerText='No data - restore backup?';
		id('backupButton').disabled=true;
		showDialog('dataDialog',true);
		return;
	}
	console.log('data: '+data.length+' bytes');
    words=JSON.parse(data);
    console.log(words.length+' words loaded - latest: '+words[words.length-1].romaji);
    id('wordCount').innerText=words.length+' words';
    var today=Math.floor(new Date().getTime()/86400000);
	// var days=today-backupDay;
	/* if(days>4) { // backup reminder every 5 days
		id('dataMessage').innerText=days+' since last backup';
		id('restoreButton').disabled=true;
		toggleDialog('dateDialog',true);
	}
	*/
}
// SAVE VOCABULARY
function save() {
	console.log('save '+words.length+' words');
	var data=JSON.stringify(words);
	window.localStorage.setItem('WordData',data);
	console.log('data saved to WordData');
}

// RESTORE BACKUP
id("fileChooser").addEventListener('change', function() {
    console.log("file chosen");
    var file = id('fileChooser').files[0];
    console.log("file: " + file + " name: " + file.name);
    var fileReader = new FileReader();
    fileReader.addEventListener('load', function(evt) {
        console.log("file read: " + evt.target.result);
        var data = evt.target.result;
        var json = JSON.parse(data);
        console.log("json: " + json);
        var records = json.records;
        console.log(records.length + " records loaded");
        var dbTransaction = db.transaction('go', "readwrite");
        var dbObjectStore = dbTransaction.objectStore('go');
        var request = dbObjectStore.clear();
        request.onsuccess = function(e) {
            console.log(records.length + " records in database");
        };
        for (var i = 0; i < records.length; i++) {
            console.log("add records" + i);
            request = dbObjectStore.add(records[i]);
            request.onsuccess = function(e) {
                console.log(records.length + " records added to database");
            };
            request.onerror = function(e) {
                console.log("error adding record");
            };
        }
        hide('importDialog');
        // id('importDialog').style.display = 'none';
        id("menu").style.display = "none";
        alert("records imported - restart")
    });
    fileReader.readAsText(file);
});

// CANCEL RESTORE
id('buttonCancelImport').addEventListener('click', function() {
    console.log("cancel restore");
    hide('importDialog');
    // id('importDialog').style.display = 'none';
});

// BACKUP
function backup() {
    console.log("EXPORT");
    var fileName = "tango.json";
    var data = {
        'records': records
    };
    var json = JSON.stringify(data);
    console.log(records.length + " records to save");
    var blob = new Blob([json], {
        type: "data:application/json"
    });
    var a = document.createElement('a');
    a.style.display = 'none';
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    alert(fileName + " saved to downloads folder");
    var today=new Date();
    lastSave=today.getMonth(); // remember month of backup
    window.localStorage.setItem('tangoSave', lastSave);
}

// UTILITIES
function show(d) {
	console.log('show '+d);
	id(d).style.display='block';
	console.log(d+' is '+id(d).style.display);
}
function hide(d) {
	console.log('hide '+d);
	// if(d=='wordPanel') return;
	id(d).style.display='none';
}

// START-UP CODE
console.log("STARTING");
console.log('screen size: '+screen.width+'x'+screen.height);
lastSave=window.localStorage.getItem('tangoSave');
console.log('lastSave: '+lastSave);
load();
/*
var defaultData = {
    records: [{
        kanji: "字",
        level: 1,
        kana: "じ ",
        romaji: "ji",
        anglo: "character"
    }]
}
var request = window.indexedDB.open("nihongoDB");
request.onsuccess = function(event) {
    console.log("request: " + request);
    db = event.target.result;
    console.log("DB open");
    var dbTransaction = db.transaction('go', "readwrite");
    console.log("transaction ready");
    var dbObjectStore = dbTransaction.objectStore('go');
    console.log("objectStore ready");
    records = [];
    console.log("records array ready");
    
    			words=[];
    			// word={};
    
    var request = dbObjectStore.openCursor();
    // var words="";
    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            records.push(cursor.value);
            console.log("record " + cursor.key + ", id: " + cursor.value.id + ": " + cursor.value.kanji + "; " + cursor.value.kana + "; " + cursor.value.romaji + "; " + cursor.value.anglo);
            // words+=cursor.value.romaji;
            // words+="; ";
            
            			word={};
            			word.kanji=cursor.value.kanji;
            			word.kana=cursor.value.kana;
            			word.romaji=cursor.value.romaji;
            			word.anglo=cursor.value.anglo;
            			console.log('word: '+word.kanji+'/'+word.kana+'/'+word.romaji+'/'+word.anglo);
            			words.push(word);
            
            cursor.continue();
        } else {
            console.log("No more entries!");
            
            			console.log('save '+words.length+' words - first is '+words[0].romaji+'/'+words[0].anglo);
            			save();
            
            console.log("words: " + records.length);
            id('count').innerHTML = records.length;
            if (records.length < 1) {
                console.log("no records - restore backup?");
                // id('importDialog').style.display = 'block';
                show('importDialog'); // offer to recover backup
            }
            // var today=new Date();
            // alert('this month: '+today.getMonth()+'; lastSave: '+lastSave);
            // if (today.getMonth()!=lastSave) backup(); // monthly backups
            var thisMonth=new Date().getMonth();
	        if(thisMonth!=lastSave) backup(); // monthly backups
        }
    };
};
request.onupgradeneeded = function(event) {
    var dbObjectStore = event.currentTarget.result.createObjectStore("go", {
        keyPath: "id",
        autoIncrement: true
    });
    console.log("new Go ObjectStore created");
};
request.onerror = function(event) {
    alert("indexedDB error code " + event.target.errorCode);
    records = defaultData.records;
    alert("use default data");
};
*/
// implement service worker if browser is PWA friendly
if (navigator.serviceWorker.controller) {
    console.log('Active service worker found, no need to register')
} else { //Register the ServiceWorker
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log('Service worker has been registered for scope:' + reg.scope);
    });
}