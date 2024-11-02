(function(){

    let todoArr = [];

    function createAppTitle(title){
        let appTitle = document.createElement('h2');
        appTitle.innerText = title;
        return appTitle;
    };

    function createTodoItemForm(){
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group','mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');

        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        button.setAttribute('disabled',true);
        input.addEventListener('input',()=>{
            button.removeAttribute('disabled');
        })
        
        return {
            form,
            input,
            button,
        };
    }

    function createTodoList(){
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list
    }

    function createTodoItem(obj){
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item','d-flex','justify-content-between','align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group','btn-group-sm');
        doneButton.classList.add('btn','btn-success');
        doneButton.innerText = 'Готово';
        deleteButton.classList.add('btn','btn-danger');
        deleteButton.innerText = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        };

    }

    function createTodoApp(container, title = 'Список дел',listName){

        let todoApptitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoApptitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if(localStorage.getItem(listName)){
            addElementsFromLocalStorage() ;
        }

        todoItemForm.form.addEventListener('submit',(e)=>{
            e.preventDefault();

            let todoItem = createTodoItem({name: todoItemForm.input.value, done: false});
            todoArr.push({id: arrCreateId(todoArr)+1, name: todoItemForm.input.value, done: false})  // добавления дела в массив дел 

            let findStr = todoItemForm.input.value;  // Костыль так как функция поиска хочет отрабатывать и не принемает никакое значение имени типа todoItemForm.input.value


            todoItem.doneButton.addEventListener('click', ()=>{                  //  обработчик кнопки выполнено
                todoItem.item.classList.toggle('list-group-item-success');
                todoArr[arrFind(todoArr,findStr)].done = !todoArr[arrFind(todoArr,findStr)].done;
                addToLocalStoraje(todoArr,listName);
            });

            todoItem.deleteButton.addEventListener('click',()=>{                //  обработчик кнопки удалить
                if(confirm('Вы уверенны?')){
                    todoArr.splice(arrFind(todoArr,findStr),1);
                    todoItem.item.remove();
                    addToLocalStoraje(todoArr,listName);
                }
            })

            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;                //скидываем кнопку формы в начальное состояние
            addToLocalStoraje(todoArr,listName);                      // добавить наш массив в локал стораже
        })

        function arrCreateId(arr){                              // Функция которая новый ID для того что бы добавить новый элемент в массиве
            let max = 0;
            arr.forEach(element => {
                max = Math.max(element['id'],max)
            });
            return max
        }

        function arrFind(arr,name){                                 // Функция которая возвращет ID искомого ( строки введенной в инпут)
            for (let i = 0; i < arr.length; i++) {
                if(arr[i]['name'] == name){
                    return i
                }
            }
        }


        function addToLocalStoraje(arrObj,key){                         // Функция добавления во времененное хранилище
            localStorage.setItem(key, JSON.stringify(arrObj));
        }
    
        function getFromLocalStorage(key){                              // Функция возвращает данные из временного хранения
            return JSON.parse(localStorage.getItem(key));
        }

        function addElementsFromLocalStorage() {                            // Функция для отрисовывания элементов из временного хранилища
            let arrFromLocalStorage = getFromLocalStorage(listName);

            arrFromLocalStorage.forEach(element => {                //созжание нашего массива дел из локалсторедж
                todoArr.push(element);
            });
            arrFromLocalStorage.forEach(element => {

                let todoItem = createTodoItem({name: element.name, done: element.done});

                if(element.done){
                    todoItem.item.classList.add('list-group-item-success');
                }

                todoItem.doneButton.addEventListener('click',()=>{                  //  обработчик кнопки выполнено
                    todoItem.item.classList.toggle('list-group-item-success');
                    todoArr[arrFind(todoArr,element.name)].done = !todoArr[arrFind(todoArr,element.name)].done;
                    addToLocalStoraje(todoArr,listName);
                });


                todoItem.deleteButton.addEventListener('click',()=>{                //  обработчик кнопки удалить
                    if(confirm('Вы уверенны?')){
                        todoArr.splice(arrFind(todoArr,element.name),1);
                        todoItem.item.remove();
                        addToLocalStoraje(todoArr,listName);
                    }
                })
                todoList.append(todoItem.item);
            });

        }
    }



    window.createTodoApp = createTodoApp;

})();