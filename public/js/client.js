const socket=io();

var username ;
var chats = document.querySelector(".chats")

var user_list = document.querySelector(".user-list")
var users_count = document.querySelector(".users-count")

var msg_send = document.querySelector("#user-send")
var user_msg = document.querySelector("#user-msg")


// do while jab tak chale jab tak username na mile 
do{
   username = prompt("Enter your name: ")
}
while(!username);

// it will be called when user will join
socket.emit("new-user-joined", username);

// Notification when user will join
socket.on('user-connected',(socket_name)=>{

    userJoinLeft(socket_name, 'joined');

} )

// joined /left status

function userJoinLeft(name,status){
    let div = document.createElement("div");
    div.classList.add("user-join");

    let content = `<p><b> ${name} </b> ${status} the chat </p>` ;
    div.innerHTML=content;
    chats.appendChild(div)

}
// Notification when user is left
socket.on('user-disconnected', (user)=>{
    userJoinLeft(user, "left")
})

// userlist and count
socket.on('user-list', (users)=>{
    user_list.innerHTML="";
    users_arr = Object.values(users)
    for(let i=0; i<users_arr.length; i++){
        let p= document.createElement('p');
        p.innerText=users_arr[i]
        user_list.appendChild(p);
    }
    users_count.innerHTML= users_arr.length;
})


// for msg msg_send

msg_send.addEventListener('click',()=>{
    let data = {
        user: username,
        msg : user_msg.value
    };
    if(user_msg.value != ""){
        appendMessage(data, "outgoing");
        socket.emit('message',data);
        user_msg.value="";
    }
})

function appendMessage(data, status){
    let div= document.createElement('div');
    div.classList.add('message', status)
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `; 
    div.innerHTML=content;
    chats.appendChild(div)

    chats.scrollTop=chats.scrollHeight;
}

socket.on('message', (data)=>{
    appendMessage(data,'incoming')
})
