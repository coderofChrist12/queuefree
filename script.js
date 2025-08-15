var queue = [];
var nextQueueNumber = 1;

function bookSpot() {
    var name = document.getElementById("userName").value;
    var age = Number(document.getElementById("userAge").value);
    var service = document.getElementById("service").value;

    if (name === "" || age === 0 || service === "") {
        alert("Please fill in all the fields.");
        return;
    }

    var booking = {
        name: name.trim(),
        age: age,
        service: service,
        queueNumber: nextQueueNumber
    };
    queue.push(booking);
    nextQueueNumber++;

    var message = "";
    if (age >= 60) {
        message = "✅ " + name + ", you have been granted a PRIORITY PASS for " + service + 
                  "\nYour queue number is: " + booking.queueNumber + 
                  "\nPlease show this screen at the counter and proceed without queuing (priority verified by staff).";
    } else {
        message = "⏱️ " + name + ", you are now booked for " + service +
                  "\nYour queue number is: " + booking.queueNumber + 
                  "\nPlease wait your turn or keep an eye on your spot.";
    }
    document.getElementById("confirmationMessage").textContent = message;


    document.getElementById("userName").value = "";
    document.getElementById("userAge").value = "";
    document.getElementById("service").value = "";

    displayQueue();
}

function displayQueue() {
    var list = document.getElementById("queueList");
    list.innerHTML = "";

    var sortedQueue = queue.slice().sort(function(a, b) {
        if (a.age >= 60 && b.age < 60) return -1;
        if (a.age < 60 && b.age >= 60) return 1;
        return a.queueNumber - b.queueNumber;
    });

    for (var i = 0; i < sortedQueue.length; i++) {
        var person = sortedQueue[i];
        var li = document.createElement("li");


        if (person.age >= 60) {
            li.innerHTML = "👑 " + person.name + " (Priority) - " + person.service + " | Queue #" + person.queueNumber;
            li.classList.add("priority");
        } else {
            li.innerHTML = "👤 " + person.name + " - " + person.service + " | Queue #" + person.queueNumber;
        }

    
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginLeft = "10px";
        editBtn.onclick = (function(index) {
            return function() {
                editBooking(index);
            };
        })(queue.indexOf(person));

        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "5px";
        removeBtn.onclick = (function(index) {
            return function() {
                removeBooking(index);
            };
        })(queue.indexOf(person));

        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        list.appendChild(li);
    }

    if (queue.length > 0) {
        list.style.backgroundColor = "#e6f7ff";
        list.style.padding = "15px";
        list.style.borderRadius = "8px";
    } else {
        list.style.backgroundColor = "transparent";
    }
}

function editBooking(index) {
    var person = queue[index];

    var newName = prompt("Edit name:", person.name);
    if (newName === null || newName.trim() === "") return;

    var newAge = prompt("Edit age:", person.age);
    if (newAge === null || isNaN(newAge) || Number(newAge) <= 0) return;

    var newService = prompt("Edit service:", person.service);
    if (newService === null || newService.trim() === "") return;

    queue[index] = {
        name: newName.trim(),
        age: Number(newAge),
        service: newService.trim(),
        queueNumber: person.queueNumber
    };

    displayQueue();
}

function removeBooking(index) {
    if (confirm("Are you sure you want to remove this booking?")) {
        queue.splice(index, 1);
        displayQueue();
    }
}

function serveNext() {
    if (queue.length === 0) {
        alert("The queue is empty.");
        return;
    }

    var priorityIndex = queue.findIndex(p => p.age >= 60);
    var served;
    if (priorityIndex !== -1) {
        served = queue.splice(priorityIndex, 1)[0];
    } else {
        served = queue.shift();
    }

    alert(served.name + " has been served.");
    displayQueue();
}
