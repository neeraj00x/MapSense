//====================================================================================================
//                     Adding basemap and scale
//====================================================================================================

var bingKey = 'AtDkwBBKtDzN5YZi0sy7cSB48oOx5h-mVrJMFGtjQQjIlGe6Jhj4mSr0RtWSzhJO',
    options = {
        bingMapsKey: bingKey,
        imagerySet: 'AerialWithLabels',
    };

var map = L.map('map', {
    center: [23.010051, 80.526142],
    zoom: 4.5,
    zoomSnap: 0.25
});
L.tileLayer.bing(options).addTo(map)

var geojsonMarkerOptions = {
    fillColor: "#ff7800",
    color: "#00FFff",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
var latlng = L.latLng(26.250051, 80.226142)
L.control.scale().addTo(map);

//====================================================================================================
//                     Adding GeoJson data of indian states
//====================================================================================================

var geojson = L.geoJSON(stateData, {
    style: function (featureObject) {
        return {
            fillColor: getRandomColor(featureObject.properties.cartodb_id),
            color: "#00ffff",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };
    },
    onEachFeature: function (feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    },
}).bindPopup(function (layer) {
    return layer.feature.properties.st_nm;
}).addTo(map);

//====================================================================================================
//                     Functions
//====================================================================================================

function getRandomColor(d) {
    var letters = '0123456789ABCDEF';
    let r = d * 113;
    var color = '#' + r.toString(16);
    console.log(color)
    return color;
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#ffffff',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds(15));
};


//====================================================================================================
//                     Custom Info
//====================================================================================================
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Indian Sates</h4>' + (props ?
        `<b>State Name: ${props.st_nm}</b><p>State Code: ${props.state_code}</p>`
        : 'Hover over a state');
};
info.addTo(map);
// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'Card'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// info.update = function (props) {
//     this._div.innerHTML = `<div class="CardInner">
//     <label>Search for your favourite food</label>
//     <div class="container">
//       <div class="Icon">
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#657789" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
//       </div>
//       <div class="InputContainer">
//         <input placeholder="It just can't be pizza..."/>
//       </div>
//     </div>
//    </div>`;
// };


//====================================================================================================
//                     Marker for users current location
//====================================================================================================

window.onload = function getLocation() {
        navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
    L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
        .bindPopup('You are here')
        .openPopup();
}

function error() {
    L.marker([28.6139, 77.2090]).addTo(map)
            .bindPopup('New Delhi')
            .openPopup();
}