// Inicjalizacja listy z localStorage
document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.querySelector(".item-list")
    const addItemInput = document.querySelector(".add-item input[type='text']")
    const addDateInput = document.querySelector(".add-item input[type='date']")
    const addButton = document.querySelector(".add-item button")
    const searchInput = document.getElementById("search")

    // Załaduj dane z localStorage
    loadTasks()

    // Dodaj nowy wpis
    addButton.addEventListener("click", () => {
        const taskName = addItemInput.value.trim()
        const taskDate = addDateInput.value
        if (taskName && taskDate) {
            addTask(taskName, taskDate)
            saveTask(taskName, taskDate)
            addItemInput.value = "" // Wyczyść pola
            addDateInput.value = ""
        }
    })

    // Wyszukiwanie z podświetleniem
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase()
        const items = document.querySelectorAll(".item-list li")

        items.forEach(item => {
            const taskName = item.querySelector("span").textContent.toLowerCase()
            if (taskName.includes(searchTerm)) {
                const highlightedName = highlightText(taskName, searchTerm)
                item.querySelector("span").innerHTML = highlightedName
                item.style.display = "flex"
            } else {
                item.style.display = "none"
            }
        })
    })

    // Podświetlenie tekstu
    function highlightText(text, term) {
        const index = text.indexOf(term)
        if (index >= 0) {
            return text.substring(0, index) + `<mark>${text.substring(index, index + term.length)}</mark>` + text.substring(index + term.length)
        }
        return text
    }

    // Funkcja dodająca wpis do HTML
    function addTask(name, date) {
        const li = document.createElement("li")

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"

        const span = document.createElement("span")
        span.textContent = name
        span.addEventListener("click", () => {
            editTask(span)
        })

        const dateSpan = document.createElement("span")
        dateSpan.className = "date"
        dateSpan.textContent = date
        dateSpan.addEventListener("click", () => {
            editDate(dateSpan, name)
        })

        const deleteButton = document.createElement("button")
        deleteButton.className = "delete-btn"
        deleteButton.textContent = "🗑️"
        deleteButton.addEventListener("click", () => {
            removeTask(name, li)
        })

        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(dateSpan)
        li.appendChild(deleteButton)

        taskList.appendChild(li)
    }

    // Funkcja do zapisu do localStorage
    function saveTask(name, date) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []
        tasks.push({ name, date })
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    // Funkcja do załadowania z localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []
        tasks.forEach(task => {
            addTask(task.name, task.date)
        })
    }

    // Funkcja do usuwania zadań
    function removeTask(name, listItem) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || []
        tasks = tasks.filter(task => task.name !== name)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        listItem.remove()
    }

    // Funkcja do edytowania zadań (nazwa)
    function editTask(spanElement) {
        const originalText = spanElement.textContent
        const input = document.createElement("input")
        input.type = "text"
        input.value = originalText

        // Zmień tekst na input
        spanElement.replaceWith(input)
        input.focus()

        // Po zatwierdzeniu edycji
        input.addEventListener("blur", () => {
            const newText = input.value.trim()
            if (newText) {
                spanElement.textContent = newText
                updateTaskText(originalText, newText)
            }
            input.replaceWith(spanElement)
        })
    }

    // Funkcja do edytowania daty
    function editDate(dateSpan, taskName) {
        const originalDate = dateSpan.textContent
        const input = document.createElement("input")
        input.type = "date"
        input.value = originalDate

        // Zmień datę na input
        dateSpan.replaceWith(input)
        input.focus()

        // Po zatwierdzeniu edycji
        input.addEventListener("blur", () => {
            const newDate = input.value.trim()
            if (newDate) {
                dateSpan.textContent = newDate
                updateTaskDate(taskName, newDate)
            }
            input.replaceWith(dateSpan)
        })
    }

    // Aktualizacja nazwy zadania w localStorage
    function updateTaskText(originalName, newName) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []
        const task = tasks.find(task => task.name === originalName)
        if (task) {
            task.name = newName
            localStorage.setItem("tasks", JSON.stringify(tasks))
        }
    }

    // Aktualizacja daty zadania w localStorage
    function updateTaskDate(taskName, newDate) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []
        const task = tasks.find(task => task.name === taskName)
        if (task) {
            task.date = newDate
            localStorage.setItem("tasks", JSON.stringify(tasks))
        }
    }
})
