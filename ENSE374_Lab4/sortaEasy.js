
var userList = [];

function newList(){
    
    var list = document.getElementById("list");
    var input = document.getElementById("userInput").value;
    
    if (input.trim().length != 0) {
        userList.push(input);
        list.innerHTML += '<div Id="po"><li class="list-group-item list-group-item-secondary">' + input + "</li> </div>";
    }
    userInput.value = "";
}

function sortingList(){
    
    userList.sort();
    list.innerHTML = "";
    
    for( var i = 0; i < userList.length; i++)
    {
        list.innerHTML += '<div Id="po"><li class="list-group-item list-group-item-secondary">' + userList[i] + "</li> </div>";
    }
}
