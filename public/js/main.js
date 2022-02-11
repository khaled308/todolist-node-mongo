const addTask = document.querySelector('.todo-btn')
const field = document.querySelector('.todo-input')
const select = document.querySelector('.filter-todo')
let tasksContent = Array.from(document.querySelectorAll('ul li'))
let initialTasks = Array.from(document.querySelectorAll('ul .todo'))

function update(text,status){
    const url = location.href + 'update'
    const data = JSON.stringify({"field" : text ,"status" : status})
    fetch(url,{
        method : 'POST',
        body : data,
        headers : {'Content-Type': 'application/json'}
    })
}

function deleteTask(text){
    const url = location.href + 'delete'
    const data = JSON.stringify({"field" : text})
    fetch(url,{
        method : 'POST',
        body : data,
        headers : {'Content-Type': 'application/json'}
    })
}

addTask.addEventListener('click',e=>{
    e.preventDefault()
    const data = JSON.stringify({"field" : field.value.trim()})
    const url = location.href
    const found = tasksContent.filter(task=>task.textContent.trim() === field.value.trim())

    if(found.length == 0){
        fetch(url,{
            method : 'POST',
            body : data,
            headers : {'Content-Type': 'application/json'}
        })
        .then(res=>res.json())
        .then(data=>{
            const container = document.querySelector('.todo-container')
            let ul = container.children[0]
            if(!ul){
                ul = `<ul class='todo-list'></ul>`
                container.insertAdjacentHTML('beforeend',ul)
            }
            ul = document.querySelector('.todo-list')
            let html = `
            <div class="todo">
                <li class="todo-item">${data.item}</li>
                <button class="trash-btn">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="complete-btn">
                    <i class="fas fa-check"></i>
                </button>
            </div>
            `
                ul.insertAdjacentHTML('afterbegin',html)
                initialTasks = Array.from(document.querySelectorAll('ul .todo'))
                app()
        })
    }
    else{
        alert('task is already there go and finish it')
    }
    field.value = ''
})

function app(){
    initialTasks.forEach(task=>{
        task.addEventListener('click',e=>{
            if(e.target.classList.contains('complete-btn') || e.target.parentElement.classList.contains('complete-btn') ){
                task.classList.toggle('completed')
                const taskText = task.children[0].textContent.trim()
                const status = task.classList.contains('completed') ? 1 : 0
                update(taskText,status)
            }
    
            else if(e.target.classList.contains('trash-btn') || e.target.parentElement.classList.contains('trash-btn')){
                task.classList.add('fall')
                const taskText = task.children[0].textContent.trim()
                deleteTask(taskText)
                tasksContent = tasksContent.filter(item=>!item.parentElement.classList.contains('fall'))
            }
        })
    })
}

app()

select.parentElement.addEventListener('click',()=>{
    if(select.value.trim() !== 'all'){
        initialTasks.forEach(task=>{
            if(select.value.trim() == 'completed' && !task.classList.contains('completed')){
                task.style.display = 'none'
            }

            else if(select.value.trim() == 'uncompleted' && task.classList.contains('completed')){
                task.style.display = 'none'
            }
            else{
                task.style.display = 'flex'
            }
        })
    }
    else{
        initialTasks.forEach(task=>{
            task.style.display = 'flex'
        })
    }
})