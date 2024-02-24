const groupList=document.getElementById("grouplist")
const sentMessage=document.getElementById("message")
const createGroup=document.getElementById("groupbutton-1")
const createGroupContainer=document.getElementById("creategroup")
const token=localStorage.getItem("token")

const socket=io({auth:{token:localStorage.getItem("token")}})
socket.on("recieve-message",message=>{
    for(let i=0;i<groupList.children.length;i++){
        if(groupList.children[i].id===message.chat.groupId)
        {
            if(groupList.children[i].children.length>1 && groupList.children[i].children[1].children[0].children.length>0)
            {
                const chatListItem=document.createElement("li")
                chatListItem.id=message.chat.id
                chatListItem.className="list-group-item"
                if(message.chat.type==="text")
                {
                    chatListItem.appendChild(document.createTextNode(`${message.user.name}: ${message.chat.message}`))
                }
                else
                {
                    const link = document.createElement('a');
                    link.textContent = message.chat.filename;
                    link.href = message.chat.message;
                    link.download = message.chat.filename
                    chatListItem.innerHTML=`${message.user.name}: ${link}`
                }
                groupList.children[i].lastElementChild.appendChild(chatListItem)
                break;
            }
            else
            break;
        }
    }
})
socket.on("display-group",group=>showgroupsonscreen(group))
socket.on("display-admin",id=>{
    for(let i=0;i<groupList.children.length;i++){
        if(groupList.children[i].id===id)
        {
            if(groupList.children[i].children.length>1)
            {
                const li=document.createElement("li")
                li.className="list-group-item"
                li.innerHTML=`<form id='formAdd${id}' onsubmit='addmember(event)'><input type='text'placeholder='Enter Email to add member' id='addMember${id}' required><input type='submit' value='Add Member'></form><br><p id='addMembermsg${id}'></p><form id='formAdmin${id}'onsubmit='makeadmin(event)'><input type='text'placeholder='Enter Email to make member an admin' id='makeAdmin${id}' required><input type='submit' value='Make Admin'></form><br><p id='makeAdminmsg${id}'></p><form id='formremove${id}'onsubmit='removemember(event)'><input type='text'placeholder='Enter Email to remove member' id='removeMember${id}' required><input type='submit' value='Remove Member'></form><br><p id='removeMembermsg${id}'></p>`
                groupList.children[i].children[1].appendChild(li)
                break;
            }
            else
            break;
        }
    }
})
socket.on("remove-member",id=>{
    for(let i=0;i<groupList.children.length;i++){
        if(groupList.children[i].id===id)
        {
            if(groupList.children[i].children.length>1)
            {
                groupList.children[i].children[1].innerHTML='<li style="list-style:none">you are no longer a member of this group</li>'
                break;
            }
            else
            {
                groupList.children[i].remove()
                break;
            }
           
        }
    }
})
function showgroupsonscreen(group)
{
    const groupListItem=document.createElement("li")
    groupListItem.id=group.id
    groupListItem.className="list-group-item"
    groupListItem.appendChild(document.createTextNode(`${group.name}`))
    const groupButton=document.createElement("button")
    groupButton.setAttribute("value","Open")
    groupButton.appendChild(document.createTextNode("Open"))
    groupListItem.appendChild(groupButton)
    groupList.appendChild(groupListItem)
}

async function addmsg(e)
        {
            e.preventDefault()
            try{
                const groupId=e.target.parentElement.parentElement.parentElement.id
                const msg=document.getElementById(`message${groupId}`)
                const res=await axios.post("http://3.110.88.239:3000/chats",{message:msg.value,groupId:groupId},{headers:{Authorization:token}})
                socket.emit("send-message",res.data)
                msg.value=""
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }
async function addfile(e)
        {
            e.preventDefault()
            try{
                const groupId=e.target.parentElement.parentElement.parentElement.id
                const fileInput=document.getElementById(`file${groupId}`)
                const file=fileInput.files[0]
                const formData=new FormData()
                formData.append('file',file)
                formData.append('groupId',groupId)
                const res=await axios.post("http://3.110.88.239:3000/chats/uploadfile",formData,{headers:{Authorization:token}})
                socket.emit("send-message",res.data)
                fileInput.value=""
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }        

    async function addmember(e)
        {
            e.preventDefault()
            try{
                const groupId=e.target.parentElement.parentElement.parentElement.id
                const email=document.getElementById(`addMember${groupId}`)
                const res=await axios.post("http://3.110.88.239:3000/groups/addMember",{email:email.value,groupId:groupId},{headers:{Authorization:token}})
                document.getElementById(`addMembermsg${groupId}`).textContent=res.data
                setTimeout(()=>document.getElementById(`addMembermsg${groupId}`).innerHTML="",10000)
                const group={name:e.target.parentElement.parentElement.parentElement.firstChild.textContent,id:groupId}
                if(res.status===201)
                {
                    socket.emit("add-member",group,email.value)
                }
                email.value=""
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }
        async function makeadmin(e)
        {
            e.preventDefault()
            try{
                const groupId=e.target.parentElement.parentElement.parentElement.id
                const email=document.getElementById(`makeAdmin${groupId}`)
                const res=await axios.post("http://3.110.88.239:3000/groups/makeAdmin",{email:email.value,groupId:groupId},{headers:{Authorization:token}})
                socket.emit("make-admin",groupId,email.value)
                email.value=""
                document.getElementById(`makeAdminmsg${groupId}`).textContent=res.data
                setTimeout(()=>document.getElementById(`makeAdminmsg${groupId}`).innerHTML="",10000)

            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }
        async function removemember(e)
        {
            e.preventDefault()
            try{
                const groupId=e.target.parentElement.parentElement.parentElement.id
                const email=document.getElementById(`removeMember${groupId}`)
                const res=await axios.post("http://3.110.88.239:3000/groups/removeMember",{email:email.value,groupId:groupId},{headers:{Authorization:token}})
                socket.emit("send-removemember",groupId,email.value)
                email.value=""
                console.log(res)
                document.getElementById(`removeMembermsg${groupId}`).textContent=res.data
                setTimeout(()=>document.getElementById(`removeMembermsg${groupId}`).innerHTML="",10000)
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }

window.addEventListener("DOMContentLoaded",async () =>{
    try{
        
    // let oldmessages=JSON.parse(localStorage.getItem("messages"))
    // let lastMessageId
    // if(oldmessages)
    // {
    // lastMessageId=oldmessages[oldmessages.length-1].id
    // }
    // else
    // {
    // lastMessageId=-1
    // oldmessages=[]
    // }
     
    // const res=await axios.get(`http://3.110.88.239:3000/chats?lastMessageId=${lastMessageId}`,{headers:{Authorization:token}})
    // console.log(res)
    // let  mergeMessagedArray=oldmessages.concat(res.data)
    // if(mergeMessagedArray.length>10)
    // {
    //     mergeMessagedArray=mergeMessagedArray.slice(mergeMessagedArray.length-10)
    // }
    // localStorage.setItem("messages",JSON.stringify(mergeMessagedArray))
    // JSON.parse(localStorage.getItem("messages")).forEach(data=>showChatsOnScreen(data))
    const res=await axios.get("http://3.110.88.239:3000/groups?lastGroupId=-1",{headers:{Authorization:token}})
    res.data.forEach(group=>showgroupsonscreen(group))

}
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something Went Wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }
})

createGroup.addEventListener("click",async()=>{
    createGroupContainer.innerHTML="<form id='creategroupform'><input type='text' id='groupname' placeholder='Enter Group Name'><input type='submit' value='Create Group'></form>"
    document.getElementById("creategroupform").addEventListener("submit",creategroup)
})


async function creategroup(e)
{
    e.preventDefault()
    try{
        const groupName=document.getElementById("groupname")
        const res=await axios.post("http://3.110.88.239:3000/groups/create",{groupName:groupName.value},{headers:{Authorization:token}})
        createGroupContainer.textContent=`${groupName.value} group is created`
        setTimeout(()=>createGroupContainer.innerHTML="",10000)
        showgroupsonscreen(res.data.group)
    }
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something Went Wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }
}



groupList.addEventListener("click",async(e)=>{
try{
    if (e.target.value==="Open")
    {
        const id=e.target.parentElement.id
        const token=localStorage.getItem("token")
        const res=await axios.get(`http://3.110.88.239:3000/chats?groupId=${id}&lastMessageId=-1`,{headers:{Authorization:token}})
        const ul=document.createElement("ul")
        const li=document.createElement("li")
        li.className="list-group-item"
        li.innerHTML=`<form id='formMsg${id}'onsubmit='addmsg(event)'><input type='text' placeholder='type a message' id='message${id}' required><input type='submit' value='Send Message'></form>`
        li.innerHTML=li.innerHTML+`<form id='formFile${id}'onsubmit='addfile(event)'><input type='file' placeholder='select a file' id='file${id}' required><input type='submit' value='Send File'></form>`
        ul.appendChild(li)
        if (res.data.admin===true)
        {
            const li=document.createElement("li")
            li.className="list-group-item"
            li.innerHTML=`<form id='formAdd${id}' onsubmit='addmember(event)'><input type='text'placeholder='Enter Email to add member' id='addMember${id}' required><input type='submit' value='Add Member'></form><br><p id='addMembermsg${id}'></p><form id='formAdmin${id}'onsubmit='makeadmin(event)'><input type='text'placeholder='Enter Email to make member an admin' id='makeAdmin${id}' required><input type='submit' value='Make Admin'></form><br><p id='makeAdminmsg${id}'></p><form id='formremove${id}'onsubmit='removemember(event)'><input type='text'placeholder='Enter Email to remove member' id='removeMember${id}' required><input type='submit' value='Remove Member'></form><br><p id='removeMembermsg${id}'></p>`
            ul.appendChild(li)
        }
        e.target.parentElement.appendChild(ul)
        const chatList=document.createElement("ul")
        res.data.chats.forEach(chat=>showChatsOnScreen(chat))
        
        
        function showChatsOnScreen(chat)
    {
        const chatListItem=document.createElement("li")
        chatListItem.id=chat.id
        chatListItem.className="list-group-item"
        if(chat.type==="text")
        {
        chatListItem.appendChild(document.createTextNode(`${chat.user.name}: ${chat.message}`))
       }
        else
        {
        const link = document.createElement('a');
        link.textContent = chat.filename;
        link.href = chat.message;
        link.download = chat.filename
        chatListItem.innerHTML=`${chat.user.name}: ${link}`
    }
    chatList.appendChild(chatListItem)
    }
    e.target.parentElement.appendChild(chatList)

        // setInterval(async ()=>{
        //     try{
        //         let lastMessageId
        //         if(chatList.lastElementChild)
        //         {
        //             lastMessageId=chatList.lastElementChild.id
        //         }
        //         else
        //         {
        //             lastMessageId=-1
        //         }
        //         const token=localStorage.getItem("token")
        //         const res=await axios.get(`http://3.110.88.239:3000/chats?groupId=${id}&lastMessageId=${lastMessageId}`,{headers:{Authorization:token}},{groupId:e.target.parentElement.id})
        //         //chatList.innerHTML=""
                
        //         res.data.chats.forEach(data=>showChatsOnScreen(data))
        //         }
        //         catch(err)
        //         {
        //             document.getElementById("errmsg").textContent="Something Went Wrong"
        //             setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
        //         }
        // },1000)
    }
}
catch(err)
{
    document.getElementById("errmsg").textContent=err
    setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
}
})


// setInterval(async ()=>{
//     try{
//         let lastGroupId
//         if(groupList.lastElementChild)
//         {
//             lastGroupId=groupList.lastElementChild.id
//         }
//         else
//         {
//             lastGroupId=-1
//         }
//         const token=localStorage.getItem("token")
//         const res=await axios.get(`http://3.110.88.239:3000/groups?lastGroupId=${lastGroupId}`,{headers:{Authorization:token}})
//         res.data.forEach(data=>showgroupsonscreen(data))
//         }
//         catch(err)
//         {
//             document.getElementById("errmsg").textContent="Something Went Wrong"
//             setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
//         }}
//         ,1000)
