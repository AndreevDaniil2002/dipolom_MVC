$(document).ready(() => {
    var map;
    ymaps.ready(function() {
        map = new ymaps.Map('map', {
            center: [55.718498, 37.795159],
            zoom: 16
        }, {
            searchControlProvider: 'yandex#search'
        });

        result = [55.718498, 37.795159]
        var placemark = new ymaps.Placemark(result, {}, {preset: "islands#redCircleIcon"})
        map.geoObjects.add(placemark);
        // 55.718498, 37.795159

        fetch('/api/v1/points')
        .then(response => response.json())
        .then(data => {
        data.forEach(point => {
            var coordinates = [point.longitude, point.latitude];
            var placemark;
            var preset = point.statusForUser === 'Закрыта' ?
                'islands#greenCircleDotIcon' : 'islands#redCircleDotIcon';
            placemark = new ymaps.Placemark(coordinates, {}, {
                preset: preset
            });
            map.geoObjects.add(placemark);
        });
        const groupedPoints = {};
        data.forEach(point => {
            if (point.cluster !== -1) {
                if (!groupedPoints[point.cluster]) {
                    groupedPoints[point.cluster] = [];
                }
                groupedPoints[point.cluster].push(point);
            }
        });

        Object.values(groupedPoints).forEach(clusterPoints => {
            const filteredPoints = clusterPoints.filter(point => point.place !== -1);
            filteredPoints.sort((a, b) => a.place - b.place);
            const coordinates = filteredPoints.map(point => [point.longitude, point.latitude]);
            const polygon = new ymaps.Polygon([coordinates], {}, {
                fillColor: '#d35a5a',
                strokeColor: '#e30909',
                opacity: 0.5,
                strokeWidth: 2
            });
            map.geoObjects.add(polygon);
        });
        })
        .catch(error => {
            console.error('Error fetching points:', error);
        });
    });
})
