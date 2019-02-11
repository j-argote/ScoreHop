// Set starting coordinates
var map1 = L.map("map").setView([29.7604, -95.3698], 12);

// Dont touch
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1Ijoib3NjYXI2IiwiYSI6ImNqcHc0Nm1iejAxYmozeGxzcDM3MmQ1ZmYifQ.SpDPryg7o1dzi6sgVlO0GQ"
  }
).addTo(map1);

// Blue marker. Iniate on search function.
function venueMarker(lat, log, name) {
  L.marker([lat, log], { bounceOnAdd: false })
    .bindPopup(`<b>${name}</b>`)
    .openPopup()
    .addTo(map1);
}
// L.marker([29.7522, -95.3524], {bounceOnAdd: false}).bindPopup("<b>BBVA Compass Stadium</b>").openPopup().addTo(map1);

// Beer Icon styling
var beerIcon = L.icon({
  iconUrl: "../icons/colormug.jpg",
  iconSize: [30, 30],
  // color: rgb(255,69,0),
  iconAnchor: [15, 15],
  popupAnchor: [0, -10]
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94]
});

// Hard coded brewery examples
L.marker([29.7487, -95.356], { icon: beerIcon, bounceOnAdd: true })
  .bindPopup("<b>8th Wonder Brewery</b>")
  .openPopup()
  .addTo(map1);
L.marker([29.7492, -95.3435], { icon: beerIcon, bounceOnAdd: true })
  .bindPopup("<b>Sigma Brewing Company</b>")
  .openPopup()
  .addTo(map1);
L.marker([29.8058, -95.4608], { icon: beerIcon, bounceOnAdd: true })
  .bindPopup("<b>Karbach Brewing Co.</b>")
  .openPopup()
  .addTo(map1);
L.marker([29.7711, -95.3486], { icon: beerIcon, bounceOnAdd: true })
  .bindPopup("<b>Saint Arnold Brewing Company</b>")
  .openPopup()
  .addTo(map1);

// Logo Watermark
// logo position: bottomright, topright, topleft, bottomleft
var logo = L.control({ position: "topleft" });
logo.onAdd = function(map1) {
  var div = L.DomUtil.create("div", "myclass");
  div.innerHTML = "<img src='../icons/logofinal.png'/>";
  return div;
};
logo.addTo(map1);

//Search bar js

$(function() {
  $("#button-addon2").click(function() {
    $("li").remove();
    let coordsarr = [];

    let interest = $("#event").val();
    let usercity = $("#city").val();
    let $unorder = $("#unorder-list");
    //   $.get(`https://api.seatgeek.com/2/events?client_id=MTQ0OTYyNTZ8MTU0NTI2OTM2NS4yNg`)
    $.get(
      `https://api.seatgeek.com/2/events?q=${interest}&client_id=MTQ0OTYyNTZ8MTU0NTI2OTM2NS4yNg`
    ).done(result => {
      console.log(result);
      $.each(result.events, function(index, value) {
        //    if(value.venue.city==usercity){
        console.log(value.title);
        console.log(value.venue.name);
        console.log(new Date(value.datetime_utc));
        //  console.log(new Date(value.datetime_local))
        date = new Date(value.datetime_local);
        console.log(value.venue.address + " " + value.venue.extended_address);
        console.log(value.venue.id);
        console.log(`lat=` + value.venue.location.lat);
        console.log(`lon=` + value.venue.location.lon);
        // $unorder.append("<li><div class='card bg-info text-white'>"+
        // "<div class='card-body'>"+"<a style='color:white' id="+value.venue.id+" href='#'>"+
        // "<p>"+value.title+"</p>"+
        //  "<p>"+new Date(value.datetime_utc)+"</p>"+
        //  "<p>"+value.venue.address+" "+value.venue.extended_address+"</p>"+
        //  "</a></div></div><br></li>")
        $unorder.append(`<li><div class='card bg-info text-white'>
    <div class='card-body'><a style='color:white' id=${value.venue.id} href='#'>
    <p>${value.title}</p>
    <p>${new Date(value.datetime_utc)}</p>
     <p>${value.venue.address} ${value.venue.extended_address}</p>
     </a></div></div><br></li>`); // end of append
        var coords = {};
        coords["lat"] = value.venue.location.lat;
        coords["lon"] = value.venue.location.lon;
        coords["id"] = value.venue.id;
        coords["venue"] = value.venue.name;
        coordsarr.push(coords);
        console.log(coords);
        console.log(coordsarr);
        //    }
      }); // end of each

      $("a").click(function(event) {
        event.preventDefault();

        console.log(coordsarr);
        console.log(event);
        //var idval=this.id
        let idval = $(this).attr("id");
        //
        coordsarr.map(function(arr, index) {
          if (arr["id"] == idval) {
            venueMarker(arr["lat"], arr["lon"], arr["venue"]);
            $("li").remove();
            console.log(arr["lat"]);
            console.log(arr["lon"]);
            console.log(arr["venue"]);
          }
        });
      });
    }); //end of done
  }); //end of click
}); //end of Jquery
