
$(document).ready(() => {
    $('.registry-form').on('submit', function login(e) {
        e.preventDefault();
        const userName = $('#userLoginForm').val();
        const userPassword = $('#userPasswordForm').val();
        const userFirstName = $('#userFirstNameForm').val();
        const userLastName = $('#userLastNameForm').val();
        const userPatronymicName = $('#userPatronymicForm').val();
        const userData = {
            name: userName,
            password: userPassword,
            firstName: userFirstName,
            lastName: userLastName,
            middleName: userPatronymicName
        }
        console.log(userName,userPassword,userFirstName,userLastName,userPatronymicName )
        fetch('/api/v1/new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.text();
            })
            .then(data => {
                // Обработка успешного ответа
                alert(data); // Всплывающее окно с сообщением
                window.location.href = '/account'; // Редирект на страницу /welcome
            })
            .catch(error => {
                // Обработка ошибки
                if (error.message === "422") {
                    alert('Error: ' + "Пользователь с таким Login уже существует"); // Всплывающее окно с сообщением об ошибке
                } else {
                    alert('Error: ' + error); // Всплывающее окно с сообщением об ошибке
                }
            });
    })    
})
