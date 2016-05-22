'use strict';

app.controller('DashboardCtrl', function ($scope, $rootScope, $state, $q, $filter,  DataService) {

    // navbar search
    $rootScope.selectedPratice = null;
    $rootScope.praticers = [];
    $rootScope.onSelectedPratice = onPraticeSelected;

    // create map
    var mapOptions = { zoom: 7, center: new google.maps.LatLng(51.87916, -4.32910) };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var infoWindow = new google.maps.InfoWindow();
    var markers = [];

    loadData();

    function loadData()
    {
        DataService.getAll().success(function (response) {

            var promises = [];
            var deferredItemList = $q.defer();

            angular.forEach(response, function(value, key) {

                $rootScope.praticers.push(value.university);
                DataService.getGeoCode(value.university).then(function(result){

                    var place = {
                        lat : result.lat,
                        lng: result.lng,
                        desc: value.university,
                        city: value.university    
                    };

                    createMarker(place);
                    deferredItemList.resolve();
                });

                promises.push(deferredItemList.promise);
            });

            $q.all(promises).then( function() {

                createClusters();
            });

        }).error(function (error) {
            $scope.errorMsg = error.Message;
        }).finally(function () {
        });
    }

    function createMarker(info){

        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: info.city
        });

        marker.setIcon('images/pin.png')
        marker.content = '<div class="infoWindowContent">' + info.desc + '<br>' + info.desc + '<br>' + info.desc + '<br>' + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    }  

    function createClusters()
    {
        var markerCluster = new MarkerClusterer(map, markers, {
            minimumClusterSize: 4,
        });
    }

    function onPraticeSelected($item, $model, $label) {

        var marker = $filter('filter')(markers, function (d) {return d.title === $item;})[0];

        map.setCenter(marker.position);
        map.setZoom(9);

        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        infoWindow.open(map, marker);
    }


    // custom map style
    var mapstyle = [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#444444"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2f2f2"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#18a6d3"
                },
                {
                    "visibility": "on"
                }
            ]
        }
    ];

    map.setOptions({styles: mapstyle});

});