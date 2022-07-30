const socket=io('http://localhost:8000');


let form =document.getElementById('send-form');
let msgBox=document.getElementById('message');
let chat=document.getElementById('chat');
let userName=document.getElementById('userName');
let audio= new Audio('static/ting.mp3');

append_Joined=(message)=>{
    const joinedMsg=document.createElement('div');
    joinedMsg.innerText=message;
    joinedMsg.classList.add('info');
    chat.append(joinedMsg);
}

append_usrMsg=(html)=>{
    const usrMSg=document.createElement('div');
    usrMSg.innerHTML=html;
    usrMSg.classList.add('userMsg');
    chat.append(usrMSg);
}

append_myMsg=(html)=>{
    const Msg=document.createElement('div');
    Msg.innerHTML=html;
    Msg.classList.add('myMsg');
    chat.append(Msg);
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let htmlm=`<p>You</p>
               <p>${msgBox.value}</p>`
    append_myMsg(htmlm);
    socket.emit('send',msgBox.value);
    msgBox.value='';
});

const name=prompt('Enter Your Name To Join');
socket.emit('new-user-joined', name);
userName.innerText=name;

socket.on('user-joined', name=>{
    append_Joined(`${name} Joined Chat`);
})

socket.on('recive', data=>{
    let html=`<p>${data.name}</p>
              <p>${data.message}`;

    append_usrMsg(html);
    audio.play();
})

socket.on('left', name=>{
    append_Joined(`${name} Leaved Chat`);
})