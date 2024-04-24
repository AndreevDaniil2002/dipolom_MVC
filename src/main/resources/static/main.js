



$(document).ready( () => {
    const CONSTS = {
        BASE_HOST: location.origin,
        GET_INFO_URL: location.origin + '/user/login/',
        CHANGE_NAME: location.origin + '/api/v1/user/login/',
        GET_ALL_POINTS: location.origin + '/api/v1/points/?username=' + localStorage.getItem('userName')
    }
    if (location.pathname.includes("account")) {
        let username;
        fetch("/api/v1/user/login", {
            method: 'get'
        }).then(res => res.text())
            .then((res) => {
                console.log(res);
                $('#userName').text(res);
                $('#nameChanger').val(res);
                username = res;
            })

        fetch("/api/v1/user/role")
            .then(res => res.text())
            .then(role => {
        if (role === "USER") {
            let mockData = ' <div class="table-header bg-gray px-2 py-1"> ' +
                '<div id="pointName" class="inline-block w-10/12 font-medium">Название</div> ' +
                '<div id="pointStatus" class="inline-block py-1 px-3 font-medium">Cтатус</div>  ' +
                '</div>';
            fetch(`/api/v1/points?username=${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка HTTP: ' + response.status);
                    }
                    return response.text();
                })
                .then(pointsText => {
                    const points = JSON.parse(pointsText);
                    const pointsList = $(".table-custom");
                    points.forEach(point => {
                        mockData += ` <a href="/point-card?id=${point.id}" class="no-underline w-full">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="pointName" class="w-full font-light px-2 no-underline">
                                    ${point.latitude}
                                  </div>
                                    ${1 ?
                            ` <a
                                        href="point-card?id=${point.id}"
                                        class=""
                                        ><div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${point.statusForUser}
                                        </div></a
                                      >`
                                    : ''}
              
                                </div>
                              </a>`
                    });
                    pointsList.html(mockData)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        }
        if (role === "ADMIN") {

            // Функция для получения данных по URL и обновления списка пользователей
            function getUsers() {
                let mockData = ' <div class="table-header bg-gray px-2 py-1"> <div id="pointName" class="inline-block w-10/12 font-medium">Логин</div> <div id="pointStatus" class="inline-block py-1 px-3 font-medium">Роль</div>  </div>';
                fetch('/api/v1/users')
                    .then(response => response.json())
                    .then(data => {
                        const userList = $(".user-table");
                        data.forEach(user => {
                            mockData += ` <a href="/admin-user-role-change?id=${user.id}" class="no-underline w-full user-table-link" id="${user.id}">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="userName" class="w-full font-light px-2 no-underline user-profile">
                                    ${user.name}
                                  </div>
                                <div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${user.role}
                                        </div>
              
            </div>
          </a>`

                        });
                        userList.html(mockData)
                    })
                    .catch(error => {
                        console.error('Произошла ошибка:', error);
                        // Обработка ошибок
                    });
            }

            // Функция для получения данных по URL и обновления списка точек на проверке
            function getPoints() {
                let mockData = ' <div class="table-header bg-gray px-2 py-1"> <div id="pointName" class="inline-block w-10/12 font-medium">Название</div> <div id="pointStatus" class="inline-block py-1 px-3 font-medium">Cтатус</div>  </div>';
                fetch('/api/v1/points/admin')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ошибка HTTP: ' + response.status);
                        }
                        return response.text(); // Теперь ожидаем текстовый ответ
                    })
                    .then(pointsText => {
                        // Преобразуем текстовый ответ в JSON
                        const points = JSON.parse(pointsText);

                        // Полученные точки выводятся в список
                        const pointsList = $(".table-points");
                        points.forEach(point => {
                            mockData += ` <a href="/point-card?id=${point.id}" class="no-underline w-full">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="pointName" class="w-full font-light px-2 no-underline">
                                    ${point.latitude}
                                  </div>
                                    ${1 ?
                                ` <a
                                        href="point-card?id=${point.id}"
                                        class=""
                                        ><div
                                          id="pointStatusRow"
                                          class="py-1 px-3 text-center no-underline text-red"
                                        >
                                        ${point.statusForAdmin}
                                        </div></a
                                      >`
                                : ''}
              
            </div>
          </a>`

                        });
                        pointsList.html(mockData)
                    })
                    .catch(error => {
                        console.error('Произошла ошибка:', error);
                        // Обработка ошибок
                    });
            }

            // Вызываем функции для получения данных и обновления списков при загрузке страницы
            getUsers();
            getPoints();
        }
    }
            )}

    function handleChangeUserRoleSubmit(e){
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        const selectedRole = $('select#userRole option:selected').val()
        setTimeout(() => {
            fetch("api/v1/user/" + userId + "/" + selectedRole).then(() => {
                console.log("api/v1/user/" + userId + "/" + selectedRole)
            })
        }, 100000)

    }

    if (location.pathname.includes("role-change")){
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        fetch('/api/v1/personal-data/' + userId).then(res => res.json())
            .then((res) => {
                console.log("~~~~~~~~")
                let innerUserData = '';
                let select;
                let dataForSelect;
                fetch('/api/v1/roles')
                    .then(response => response.json())
                    .then(response => {
                        console.log(response)
                        response.map((item) => {
                            dataForSelect += `<option value="${item}">${item}</option>`
                        })
                        console.log(dataForSelect)
                        select = '<select class="block min-w-[200px] w-full message-no-input" name="userRole" id="userRole" value="USER">' + dataForSelect + '</select>';
                        innerUserData += `
                    <div class="form-row">
                        <label for="inputName">Логин</label>
                        <span class="my-1 block w-full message-no-input">${res.name}</span>
                    </div>
                     <div class="form-row">
                        <label for="inputName">Фамилия</label>
                        <span class="my-1 block w-full message-no-input">${res.lastName}</span>
                    </div>
                     <div class="form-row">
                        <label for="inputName">Имя</label>
                        <span class="my-1 block w-full message-no-input">${res.firstName}</span>
                    </div>
                    <div class="form-row">
                    <label for="inputName">Отчество</label>
                    <span class="my-1 block w-full message-no-input">${res.middleName}</span>
                    </div>
                    <div class="form-row">
                      <label for="inputName">Роль</label>
                      ${select}
                    </div>
                    <button class="ml-3 d-block  md:w-1/2 text-center rounded-md py-3 px-5 md:mx-auto bg-green text-white text-xl md:text-xl" type="submit" onclick="handleChangeUserRoleSubmit()">Изменить роль</button>
                    `
                        $('#userDataForAdmin').html(innerUserData);
                    })

            })

    }







    $('#searchUsersForm').off('submit').on('submit', (e) => {
        e.preventDefault();
        let search = $('#userSearch').val();
        $('user-table')
        let mockData = `<div class="table-header bg-gray px-2 py-1">
        <div id="pointName" class="inline-block w-10/12 font-medium">
          ИМЯ
        </div>
        <div id="pointStatus" class="inline-block py-1 px-3 font-medium">
          РОЛЬ
        </div>
      </div>`;

        fetch('/api/v1/user/name/' + search).then(res => res.text())
            .then((data) => {
                data = JSON.parse(data)
                data.map((item) => {
                    mockData += `
                <a href="#" class="no-underline w-full user-table-link">
                <div class="table-row-custom flex align-items-center px-2 py-1">
                  <div id="pointName" class="w-full font-light px-2 no-underline">
                    ${item.name}
                  </div>
                  <div id="pointStatusRow" class="text-green-500 py-1 px-3 text-center no-underline">
                   ${item.role}
                  </div>
                </div>
              </a>
                `
                })
                $('.user-table').html(mockData)


            })
    })








    $('#searchPointsForm').on('submit', (e) => {
        e.preventDefault();
        let selected = $('#userRole>option:selected').val();
        if (!selected) {
            alert('Выберете роль!')
        }
        let mockData = `<div class="table-header bg-gray px-2 py-1">
        <div id="pointName" class="inline-block w-10/12 font-medium">
          ТОЧКА
        </div>
        <div id="pointStatus" class="inline-block py-1 px-3 font-medium">
          СТАТУС
        </div>
      </div>`;

        fetch('api/v1/points/admin/' + selected).then(res => res.text())
            .then((data) => {
                data = JSON.parse(data)
                data.map((item) => {
                    mockData += `
                <a href="/card-page" class="no-underline w-full user-point-link">
                <div class="table-row-custom flex align-items-center px-2 py-1">
                  <div id="pointName" class="w-full font-light px-2 no-underline">
                    ${item.name}
                  </div>
                  <div id="pointStatusRow" class="text-green-500 py-1 px-3 text-center no-underline">
                   ${item.statusForAdmin}
                  </div>
                </div>
              </a>
                `
                })
                $('.table-points').html(mockData)
            })
    })
    $('.input-file input[type=file]').on('change', function () {
        let file = this.files[0];
        $(this).closest('.input-file').find('.input-file-text').html(file.name);
    });
    $('#edit').off('click').on('click', () => {
        $('#userName').toggleClass('hidden');
        $('#nameChanger').toggleClass('hidden');
        $('#edit').toggleClass('hidden');
        $('#done').toggleClass('hidden');
    })
    $('#done').off('click').on('click', () => {
        let postData = {
            name: $('#nameChanger').val(),
        }
        //alert(postData.name, CONSTS.CHANGE_NAME)
        console.log(CONSTS.CHANGE_NAME)
        fetch("/api/v1/user/login/change", {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
        }).then(() => {
            console.log(postData)
            //location.reload();
        })

        // $('#userName').toggleClass('hidden');
        // $('#nameChanger').toggleClass('hidden');
        // $('#done').toggleClass('hidden');
        // $('#edit').toggleClass('hidden');

    })
    if (location.pathname.includes('point-card')) {
        let point_latitude;
        let point_longitude;
        const urlParams = new URLSearchParams(window.location.search);
        const pointId = urlParams.get('id');
        // Используем Fetch API для получения данных
        fetch('/api/v1/points/' + pointId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const date = document.querySelector('.card-date-open span');
                const status = document.querySelector('.card-status span');
                const description = document.querySelector('.card-description span');
                const name = document.querySelector('.card-name span');

                date.innerText = new Date(data.date).toISOString().split('T')[0];
                status.innerText = data.statusForUser;
                description.innerText = data.description;
                point_latitude = data.latitude;
                point_longitude = data.longitude;
                name.innerText = data.name;

                ymaps.ready(init);

                function init() {
                    myMap = new ymaps.Map('map', {
                        center: [point_longitude, point_latitude], // Москва
                        zoom: 15
                    }, {
                        searchControlProvider: 'yandex#search'
                    });
                    var coordinates = [point_longitude, point_latitude];
                    var placemark = new ymaps.Placemark(coordinates);
                    myMap.geoObjects.add(placemark);
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });

        fetch("/api/v1/point/" + pointId + "/image")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Создаем элемент изображения
                const imgElement = document.querySelector('.card-img-user img');
                imgElement.src = 'data:' + data[0].contentType + ';base64,' + data[0].bytes;
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
        fetch("/api/v1/point/" + pointId + "/image/worker")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Создаем элемент изображения
                const imgElement = document.querySelector('.card-img-worker img');
                imgElement.src = 'data:' + data[0].contentType + ';base64,' + data[0].bytes;
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
    var $rows = $('.user-table a');
    $('#userSearch').keyup(function () {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
        $rows.show().filter(function () {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });
    // $(".user-table-link").on('click', (e) => {
    //     console.log("~~~~~~~~")
    //     let currentLinkID = e.target.attributes.id.value;
    //     e.preventDefault();
    //     let link = e.target.classList.value.includes('user-profile') ? e.target.closest('a').attributes.href.value : e.target.attributes.href.value;
    //     console.log(currentLinkID)
    //     let options;
    //     let innerUserData = '';
    //     let select;
    //     fetch('api/v1/user/' + currentLinkID + '/role')
    //         .then(res => res.text())
    //         .then(res => {
    //             let dataForSelect;
    //             let fOption = res;
    //             options = `<option value="${res}">${res}</option>`
    //             fetch('/api/v1/roles')
    //                 .then(response => response.json())
    //                 .then(response => {
    //                     console.log(response)
    //                     response.map((item) => {
    //                         console.log(fOption)
    //                         console.log("1234 " + item)
    //                         dataForSelect += item === fOption ? null : `<option value="${item}">${item}</option>`
    //                     })
    //                     options += dataForSelect;
    //                     console.log(options)
    //                 })
    //             //$('#userRole').html(options);
    //             select = "<select class=\"block min-w-[200px] w-full message-no-input\" name=\"userRole\" id=\"userRole\" value=\"USER\">" + options + "</select>"
    //
    //         })
    //     fetch('/api/v1/personal-data/' + currentLinkID).then(res => res.json())
    //         .then((res) => {
    //
    //             innerUserData += `
    //                 <div class="form-row">
    //                     <label for="inputName">Логин</label>
    //                     <span class="my-1 block w-full message-no-input">${res.name}</span>
    //                 </div>
    //                  <div class="form-row">
    //                     <label for="inputName">Фамилия</label>
    //                     <span class="my-1 block w-full message-no-input">${res.lastName}</span>
    //                 </div>
    //                  <div class="form-row">
    //                     <label for="inputName">Имя</label>
    //                     <span class="my-1 block w-full message-no-input">${res.firstName}</span>
    //                 </div>
    //                 <div class="form-row">
    //                 <label for="inputName">Отчество</label>
    //                 <span class="my-1 block w-full message-no-input">${res.middleName}</span>
    //                 </div>
    //                 <div class="form-row">
    //                   <label for="inputName">Роль</label>
    //                   ${select}
    //                 </div>
    //                 `
    //             $('#userDataForAdmin').html(innerUserData);
    //         })
    //
    //     $(`${link}`).addClass('d-block');
    //
    // })
    //
    // $("#userName").on('click', (e) => {
    //     console.log("~~~~~~~~")
    //     let currentLinkID = e.target.attributes.id.value;
    //     e.preventDefault();
    //     let link = e.target.classList.value.includes('user-profile') ? e.target.closest('a').attributes.href.value : e.target.attributes.href.value;
    //     console.log(currentLinkID)
    //     let options;
    //     let innerUserData = '';
    //     let select;
    //     fetch('api/v1/user/' + currentLinkID + '/role')
    //         .then(res => res.text())
    //         .then(res => {
    //             let dataForSelect;
    //             let fOption = res;
    //             options = `<option value="${res}">${res}</option>`
    //             fetch('/api/v1/roles')
    //                 .then(response => response.json())
    //                 .then(response => {
    //                     console.log(response)
    //                     response.map((item) => {
    //                         console.log(fOption)
    //                         console.log("1234 " + item)
    //                         dataForSelect += item === fOption ? null : `<option value="${item}">${item}</option>`
    //                     })
    //                     options += dataForSelect;
    //                     console.log(options)
    //                 })
    //             //$('#userRole').html(options);
    //             select = "<select class=\"block min-w-[200px] w-full message-no-input\" name=\"userRole\" id=\"userRole\" value=\"USER\">" + options + "</select>"
    //
    //         })
    //     fetch('/api/v1/personal-data/' + currentLinkID).then(res => res.json())
    //         .then((res) => {
    //
    //             innerUserData += `
    //                 <div class="form-row">
    //                     <label for="inputName">Логин</label>
    //                     <span class="my-1 block w-full message-no-input">${res.name}</span>
    //                 </div>
    //                  <div class="form-row">
    //                     <label for="inputName">Фамилия</label>
    //                     <span class="my-1 block w-full message-no-input">${res.lastName}</span>
    //                 </div>
    //                  <div class="form-row">
    //                     <label for="inputName">Имя</label>
    //                     <span class="my-1 block w-full message-no-input">${res.firstName}</span>
    //                 </div>
    //                 <div class="form-row">
    //                 <label for="inputName">Отчество</label>
    //                 <span class="my-1 block w-full message-no-input">${res.middleName}</span>
    //                 </div>
    //                 <div class="form-row">
    //                   <label for="inputName">Роль</label>
    //                   ${select}
    //                 </div>
    //                 `
    //             $('#userDataForAdmin').html(innerUserData);
    //         })
    //
    //     $(`${link}`).addClass('d-block');
    //
    // })

    //$(document).on('click',(e) => {
        //let link = e.target.classList.value.includes('user-profile') ? e.target.closest('a').attributes.href.value : null;

        // console.log(e.target.classList.value)
        //if (link) {
        //    let currentLinkID = e.target.closest('a').attributes.id.value;
        //    e.preventDefault();
        //    console.log(currentLinkID)
        //    let options;
        //    let innerUserData = '';
            // fetch('api/v1/user/' + currentLinkID + '/role')
            //     .then(res => res.text())
            //     .then(res => {
            //         let dataForSelect;
            //         let fOption = res;
            //         options = `<option value="${res}">${res}</option>`
            //         fetch('/api/v1/roles')
            //             .then(response => response.json())
            //             .then(response => {
            //                 console.log(response)
            //                 response.map((item) => {
            //                     console.log(fOption)
            //                     console.log("1234 " + item)
            //                     dataForSelect += item === fOption ? null : `<option value="${item}">${item}</option>`
            //                 })
            //                 options += dataForSelect;
            //                 console.log(options)
            //             })
            //         $('#userRole').html(options);
            //     })

        //     fetch('/api/v1/personal-data/' + currentLinkID).then(res => res.json())
        //         .then((res) => {
        //
        //             innerUserData += `
        //             <div class="form-row">
        //                 <label for="inputName">Логин</label>
        //                 <span class="my-1 block w-full message-no-input">${res.name}</span>
        //             </div>
        //              <div class="form-row">
        //                 <label for="inputName">Фамилия</label>
        //                 <span class="my-1 block w-full message-no-input">${res.lastName}</span>
        //             </div>
        //              <div class="form-row">
        //                 <label for="inputName">Имя</label>
        //                 <span class="my-1 block w-full message-no-input">${res.firstName}</span>
        //             </div>
        //             <div class="form-row">
        //             <label for="inputName">Отчество</label>
        //             <span class="my-1 block w-full message-no-input">${res.middleName}</span>
        //             </div>
        //             <div class="form-row">
        //               <label for="inputName">Роль</label>
        //               <select class="block min-w-[200px] w-full message-no-input" name="userRole" id="userRole" value="USER">
        //                 ${options}
        //               </select>
        //             </div>
        //             `
        //             $('#userDataForAdmin').html(innerUserData);
        //         })
        //
        //     $(`${link}`).addClass('d-block');
        //}
        //if(e.target.classList.value.includes('modal')) {
            // let currentID = e.target.attributes.id.value
            // let options;
            // if(currentID === 'changeUserProfile') {
            //     // fetch('api/v1/user/role')
            //     // .then(res => res.text())
            //     // .then(res => {
            //     //     let dataForSelect;
            //     //     let fOption = res;
            //     //     options = `<option value="${res}">${res}</option>`
            //     //     fetch('/api/v1/roles')
            //     //         .then(response => response.json())
            //     //         .then(response => {
            //     //             response.map((item) => {
            //     //                 dataForSelect += item === fOption ? '' : `<option value="${item}">${item}</option>`
            //     //             })
            //     //             options += dataForSelect;
            //     //         })
            //     // })
            //     // $('#userRole').html(options);
            // }
            // $(`#${currentID}`).addClass('d-block');
        //}
        //if(e.target.classList.value.includes('close__X')) {
        //    let currentModal = e.target.closest('.modal').attributes.id.value;
        //    $(`#${currentModal}`).removeClass('d-block');
        //}
   // })
})