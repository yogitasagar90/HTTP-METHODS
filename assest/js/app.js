let cl = console.log;

// GET  >>  to get data from database
// POST  >>  to create/send new data in database
// DELETE  >>  to delete/remove data from database
// PATCH/PUT  >> to update data in database

// PUT >> if we want to update whole objects in database
// PATCH >> if we want to update specific or whole objects in database

let baseUrl = `https://jsonplaceholder.typicode.com/posts`;

const postContainer = document.getElementById("postContainer");
const postsForm = document.getElementById("postForm")
const titleControl = document.getElementById("title")
const updateBtn = document.getElementById("updateBtn")
const submitBtn = document.getElementById("submitBtn")
const contentControl = document.getElementById("content")

const createCard = (obj) => {
    let cardDiv = document.createElement("div");
    cardDiv.className = "card mb-4";
    cardDiv.id = obj.id;
    cardDiv.innerHTML = `
            <div class ="card-header">
                <h3>${obj.title}</h3>
            </div>
            <div class="card-body">
                <p>${obj.body}</p>
            </div>
            <div class="card-footer text-right">
                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-danger"  onclick="onDelete(this)">Delete</button>
            </div>
    `;
    postContainer.prepend(cardDiv)
}

const updateCard = (body) => {
    let getId = localStorage.getItem("updatId")
    let card = document.getElementById(getId);
    let child = [...card.children];
    child[0]. innerHTML = body.title;
    child[1]. innerHTML = body.body;
}

const deleteCard = ()=> {
    let getId = localStorage.getItem("deleteId")
    document.getElementById(getId).remove();
}

const templating = (arr) => {
    let result = '';
    arr.forEach(obj => {
        result += `
            <div class="card mb-4" id="${obj.id}">
                <div class="card-header">
                    <h4>${obj.title}</h4>
                </div>
                <div class="card-body">
                    <p>${obj.body}
                </div>
                <div class="card-footer text-right">
                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-danger"  onclick="onDelete(this)">Delete</button>
                </div>
            </div>
        `
    });
    postContainer.innerHTML = result;
}

// using function
const makeApiCall = (methodName, apiUrl, body) => {

    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl)
    xhr.onload = function () {
        if (xhr.status === 200) {    // status 200(GET) and 201(POST) >> api Success       
            let data = JSON.parse(xhr.response)
            if (Array.isArray(data)) {
                templating(data)
            } else {
               if(methodName === "GET"){
                   // cl(data)
                   titleControl.value = data.title;
                   contentControl.value = data.body;
               }
               else if(methodName === "PATCH"){
                    cl(data)
                    updateCard(body)
                }else{
                    deleteCard()
                }
            }
        }
        else if (xhr.status === 201) {
            cl(xhr.response);
            createCard(body)
        }
    }
    xhr.send(JSON.stringify(body));
}
makeApiCall("GET", baseUrl, null)

const onPostSubmit = (eve) => {
    eve.preventDefault();
    let obj = {
        title: titleControl.value,
        body: contentControl.value,
        userID: Math.ceil(Math.random() * 10)
    }
    cl(obj);
    postsForm.reset()
    makeApiCall("POST", baseUrl, obj)
}
const onEdit = (ele => {
    let getEditedId = ele.closest(".card").id;
    // cl(getEditedId)
    localStorage.setItem("updatId", getEditedId)
    let getEditUrl = `${baseUrl}/${getEditedId}`;
    // cl(getEditUrl)
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
    makeApiCall("GET", getEditUrl)
})
const onDelete = (ele => {
    let getDeleteId = ele.closest('.card').id;
    // cl(getDeleteId);
    localStorage.setItem("deleteId",getDeleteId);
    let deleteUrl =`${baseUrl}/${getDeleteId}`;
    makeApiCall("DELETE", deleteUrl);
})
const onPostUpdate = (ele => {
    let getupdteId = localStorage.getItem("updatId");
    let updateUrl = `${baseUrl}/${getupdteId}`
    let updateObj = {
        title : titleControl.value,
        body : contentControl.value 
    }
    postsForm .reset();
    makeApiCall("PATCH",updateUrl , updateObj)
    updateBtn.classList.add("d-none")
    submitBtn.classList.remove("d-none")
})
postsForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate)