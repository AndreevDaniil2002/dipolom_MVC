$(document).ready(() => {
    const date = new Date().toJSON().split('T')[0]
    $('#pointCardDate').val(date)
    var map;
    ymaps.ready(function() {
        map = new ymaps.Map('map', {
            center: [55, 34],
            zoom: 25
        }, {
            searchControlProvider: 'yandex#search'
        });

        var geolocation = ymaps.geolocation
        geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            result.geoObjects.options.set('preset', 'islands#redCircleIcon');
            map.geoObjects.add(result.geoObjects);
        });
        fetch('/api/v1/points')
            .then(response => response.json())
            .then(data => {
                data.forEach(point => {
                    var coordinates = [point.longitude, point.latitude];
                    var placemark = new ymaps.Placemark(coordinates);
                    map.geoObjects.add(placemark);
                });
            })
            .catch(error => {
                console.error('Error fetching points:', error);
            });
    });
    var form = document.querySelector('#addPointForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем отправку формы по умолчанию

        ymaps.geolocation.get({
            mapStateAutoApply: true,
            provider: 'browser'
        }).then(function (result) {
            var userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
            var formData = new FormData();
            console.log(userCoodinates)
            const description = document.querySelector("#pointCardDescription").value
            const name = document.querySelector("#pointCardName").value
            const file = document.querySelector("#pointCardFile")
            formData.append('file', file.files[0]);
            formData.append('name', name);
            formData.append('latitude', userCoodinates[1])
            formData.append('longitude', userCoodinates[0])
            formData.append('description', description)
            console.log(formData)
            fetch('/api/v1/points', {
                    method: 'POST',
                    body: formData
                }
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.text();
                })
                .then(data => {
                    alert(data);
                    window.location.href = '/';
                })
                .catch(error => {
                    alert('Error: ' + error); // Всплывающее окно с сообщением об ошибке
                });
        });
    });
})