// Set starting coordinates
var map1 = L.map('map').setView([37.0902, -95.7129], 4);

// Beer Icon styling
var beerIcon = L.icon({
    iconUrl: 'icons/colormug.jpg',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10],
  
});
// User icon
var userIcon = L.icon({
    iconUrl: 'icons/male-solid.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10]
 });


//array for brewery
var coord = [];

//array for seatgeek
var coordsarr = [];




// Dont touch map stuff
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoib3NjYXI2IiwiYSI6ImNqcHc0Nm1iejAxYmozeGxzcDM3MmQ1ZmYifQ.SpDPryg7o1dzi6sgVlO0GQ',

}).addTo(map1);

map1.locate({
    setView: true,
    maxZoom: 12
});

// Locates user 
function onLocationFound(e) {
    var radius = e.accuracy / 1;

    L.marker(e.latlng, {icon: userIcon})
        .bindPopup("You are here").openPopup().addTo(map1);

    L.circle(e.latlng, radius).addTo(map1);
}

map1.on('locationfound', onLocationFound);













// Blue marker. Iniate on search function.
function venueMarker(lat, long, name, title) {
    var latlngVenue = L.latLng(lat, long)

    L.marker(latlngVenue, {
        bounceOnAdd: true
    }).
    bindPopup(`<h6>${name}</h6>` + `<b>${title}</b>`).
    openPopup().addTo(map1);
}
// end venueMarker()






var onClickLatLngBrewery = []
console.log(onClickLatLngBrewery)
//add Brewery markers
function addBreweryMarkers(lat, long, name, street, city, state, postal) {
    var latlngBrewery = L.latLng(lat, long)
    onClickLatLngBrewery.push(latlngBrewery)

    L.marker(latlngBrewery, {
        icon: beerIcon,
        bounceOnAdd: true
    }).bindPopup(`<b>${name}</b> <a href="https://www.google.com/maps?q=${street},${city},${state},${postal}"> <br> ${street} <br> ${city}, ${state} ${postal} </a>`).openPopup().addTo(map1)
}
//end addBreweryMarkers()








function openBreweryApi(city){
                ///john brewery api code
                
                var openBreweryDB = `https://api.openbrewerydb.org/breweries?page=1&per_page=50&by_city=${city}`;
                
                
                $.get(openBreweryDB)
                    .done((result) => {
                        console.log(result)
                        $.each(result, function (index, value) {

                            if (value.longitude == null) {

                                return;
                            } 
                            
                            else {

                                var set = {}

                                set["lat"] = parseFloat(value.latitude)

                                set["lng"] = parseFloat(value.longitude)

                                set["brewery"] = value.name

                                set["street"] = value.street

                                set["city"] = value.city

                                set["state"] = value.state

                                set["postal"] = value.postal

                                
                                coord.push(set)

                            };
                            
                        });
                        // console.log(coord)
                        // console.log(coordsarr)
                        // console.log(coordsarr[0])
                        // console.log(coord[0])
                        // console.log(coord[0].lat)
                        // console.log(coord[0].lng)
                        // console.log(coord[1].lat)
                        // console.log(coord[1].lng)
                       
                        
                        coord.map(function (arr, index) {
                            
                            addBreweryMarkers(arr['lat'], arr['lng'], arr['brewery'], arr['street'], arr['city'], arr['state'], arr['postal'])

                    })
                    
                    });
                    
                    
                    
                }




//Search bar js 
    $('#button-addon2').click(function () {
        $('li').remove()
    

        let interest = $('#event').val()
        let usercity = $("#city").val()
        let $unorder = $("#unorder-list")
        $.get(`https://api.seatgeek.com/2/events?q=${interest}&client_id=MTQ0OTYyNTZ8MTU0NTI2OTM2NS4yNg`)
            .done(result => {
                // console.log(result)
                $.each(result.events, function (index, value) {
                    
                    date = new Date(value.datetime_local)
                    
                    $unorder.append(`<li><div class='card bg-info text-white'> 
                        <div class='card-body'> <a style='color:white' id=${value.venue.id} href='#'> 
                        <p> ${value.title}</p>
                        <p> ${new Date(value.datetime_utc)}</p>
                        <p> ${value.venue.address}  ${value.venue.extended_address}</p>
                        </a></div></div><br></li>`) 
                        // end of append
                    let coords = {}
                    coords['lat'] = value.venue.location.lat
                    coords['lon'] = value.venue.location.lon
                    coords['id'] = value.venue.id
                    coords['venue'] = value.venue.name
                    coords['city'] = value.venue.city
                    coords['title'] = value.title
                    coordsarr.push(coords)
                }) 
                // end of each

                anchorClick()
            }) //end of done
            

    }) //end of click   

function anchorClick(){
    $("a").click(function (event) {
        event.preventDefault()

    
        var idval = $(this).attr('id');

        
        coordsarr.map(function (arr, index) {
            if (arr['id'] == idval) {
                venueMarker(arr['lat'], arr['lon'], arr['venue'], arr['title'])
                $('li').remove()

                openBreweryApi(arr['city'])
                map1.panTo(new L.LatLng(arr['lat'], arr['lon'], arr['venue'], 8));
            }

            
        })
        // console.log(coordsarr)
        // console.log(coord)
    })

}