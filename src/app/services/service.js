'use strict';

app.service("DataService", function ($http, $q, AppSettings) {

    var urlBase = AppSettings.UrlBase + '';

    this.getAll = function () {
        return $http.get(urlBase + '');
    }

    this.getGeoCode = function(address){
        var deferred = $q.defer();

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {

                var coords = {
                    lat : results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };

                deferred.resolve(coords);
            }
        });
        return deferred.promise;
    }

});
