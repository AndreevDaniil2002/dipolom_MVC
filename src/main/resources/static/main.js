



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
            let mockData = ' <div class="table-header bg-gray px-2 py-1"> <div id="pointName" class="inline-block w-10/12 font-medium">Название</div> <div id="pointStatus" class="inline-block py-1 px-3 font-medium">Cтатус</div>  </div>';
            fetch(`/api/v1/points?username=${username}`)

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
                    // Обработка ошибок
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
                            mockData += ` <a href="#changeUserProfile" class="no-underline w-full" id="${user.id}">
                                <div class="table-row-custom flex align-items-center px-2 py-1">
                                  <div id="pointName" class="w-full font-light px-2 no-underline user-profile">
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
                <a href="/card-page" class="no-underline w-full">
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
                <a href="/card-page" class="no-underline w-full">
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

                // Заполняем элементы данными из полученного объекта
                date.innerText = new Date(data.date).toISOString().split('T')[0];
                status.innerText = data.statusForUser;
                description.innerText = data.description;
                point_latitude = data.latitude;
                point_longitude = data.longitude;
                name.innerText = data.name;
                //console.log(point_latitude, point_longitude)\var myMap;

                // Дождёмся загрузки API и готовности DOM.
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
                const imgElement = document.querySelector('.card-img img');
                console.log(data[0])
                console.log(data[0].contentType, data[0].originalFileName)
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
    $(document).on('click',(e) => {
        let link = e.target.classList.value.includes('user-profile') ? e.target.closest('a').attributes.href.value : null;
        console.log(link)
        // console.log(e.target.classList.value)
        if (link) {
            let currentLinkID = e.target.closest('a').attributes.id.value;
            e.preventDefault();
            console.log(currentLinkID)
            let options;
            let innerUserData = '';
            fetch('api/v1/user/' + currentLinkID + '/role')
                .then(res => res.text())
                .then(res => {
                    let dataForSelect;
                    let fOption = res;
                    options = `<option value="${res}">${res}</option>`
                    fetch('/api/v1/roles')
                        .then(response => response.json())
                        .then(response => {
                            console.log(response)
                            response.map((item) => {
                                console.log(fOption)
                                dataForSelect += item.role === fOption ? '' : `<option value="${item}">${item}</option>`
                            })
                            options += dataForSelect;
                            console.log(options)
                        })
                    $('#userRole').html(options);
                })

            fetch('/api/v1/personal-data/' + currentLinkID).then(res => res.json())
                .then((res) => {

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
                      <select class="block min-w-[200px] w-full message-no-input" name="userRole" id="userRole" value="USER">
                        ${options}
                      </select>
                    </div>
                    `
                    $('#userDataForAdmin').html(innerUserData);
                })

            $(`${link}`).addClass('d-block');
        }
        if(e.target.classList.value.includes('modal')) {
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
        }
        if(e.target.classList.value.includes('close__X')) {
            let currentModal = e.target.closest('.modal').attributes.id.value;
            $(`#${currentModal}`).removeClass('d-block');
        }
    })
})