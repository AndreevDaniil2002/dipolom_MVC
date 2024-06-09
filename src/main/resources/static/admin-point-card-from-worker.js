$(document).ready(() => {
    let point_latitude;
    let point_longitude;
    const urlParams = new URLSearchParams(window.location.search);
    const pointId = urlParams.get('id');
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
            status.innerText = data.statusForAdmin;
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
            const imgElement = document.querySelector('.card-img-worker img');
            imgElement.src = 'data:' + data[0].contentType + ';base64,' + data[0].bytes;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });

    $('#aprove-point-worker').on('click', (e) => {
        e.preventDefault()
        window.location.href = "/aprove-point-worker" + "?id=" + pointId
    })

    $('#reject-point-worker').on('click', (e) => {
        e.preventDefault()
        window.location.href = "/reject-point-worker" + "?id=" + pointId
    })

})