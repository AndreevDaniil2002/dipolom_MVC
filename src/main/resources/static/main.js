

$(document).ready(() => {
    const CONSTS = {
        BASE_HOST: location.origin,
        GET_INFO_URL: location.origin + '/user/login/',
        CHANGE_NAME: location.origin + '/api/v1/user/login/',
        GET_ALL_POINTS: location.origin + '/api/v1/points/?username=' + localStorage.getItem('userName')
    }
    let username;
    let mockData = ' <div class="table-header bg-gray px-2 py-1"> <div id="pointName" class="inline-block w-10/12 font-medium">Название</div> <div id="pointStatus" class="inline-block py-1 px-3 font-medium">Cтатус</div>  </div>';
    fetch("/api/v1/user/login", {
        method: 'get'
    }).then(res => res.text())
        .then((res) => {
            console.log(res);
            $('#userName').text(res);
            $('#nameChanger').val(res);
            username = res;
        })
        .then(res => {
            // Получаем имя пользователя
            // Получение списка точек для указанного пользователя
            return fetch(`/api/v1/points?username=${username}`);
        })
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
    $('.input-file input[type=file]').on('change', function(){
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
})