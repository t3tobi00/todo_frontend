import { Task } from "./Task.js";

class Todos{
    #tasks = []
    #backend_url = ''

    constructor(url){
        this.#backend_url = url
    }

    getTasks = () => {
        return new Promise(async(resolve, reject)=>{
            fetch(this.#backend_url)
            .then(response => response.json())
            .then(json => {
                this.#readJson(json)
                resolve(this.#tasks)
            },(error)=>{
                reject(error)
            })
        })
    }

    #readJson = (taskAsJson) => {
        taskAsJson.forEach(node=>{
            const task = new Task(node.id, node.description)
            this.#tasks.push(task)
        })
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text)
        this.#tasks.push(task)
        return task
    }

    addTask = (text) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({description: text})
            fetch(this.#backend_url + 'new', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: json
            })
            .then(res=> res.json())
            .then(json=>{
                resolve(this.#addToArray(json.id, text))
            }, err => {
                reject(err)
            })
        })
    }

    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id)
        this.#tasks = arrayWithoutRemoved
    }

    removeTask = (id) => {
        return new Promise(async(resolve, reject)=>{
            fetch(this.#backend_url + 'delete/' + id, {
                method: 'delete'
            })
            .then(res => res.json())
            .then(json => {
                this.#removeFromArray(id)
                resolve(json.id)
            }, error => {
                reject(error)
            })
        })
    }

}

export { Todos }