var activitiy = JSON.parse(localStorage.getItem("selectedActivity"));
console.log(activitiy);

// const userNameLogged = JSON.parse(localStorage.getItem("userName"));


window.onload = displayActivity(activitiy);


function displayActivity(activitiy) {
    
    console.log(activitiy)
    // console.log(userNameLogged)
    document.getElementById("activityName").innerHTML = activitiy.activityName;
    document.getElementById("location").innerHTML = "<strong>Location:</strong> " + activitiy.location;
    document.getElementById("age").innerHTML = "<strong>Age:</strong> " + activitiy.age;
    document.getElementById("type").innerHTML = "<strong>Type:</strong> " + activitiy.type;
    document.getElementById("price").innerHTML = "<strong>Price:</strong> $" + activitiy.price;
    document.getElementById("description").innerHTML = activitiy.decription;

    var images = document.getElementById("images");
    for (var i = 0; i < activitiy.images.length; i++) {
        var image = activitiy.images[i];
        var item = document.createElement("div");
        if (image !== "") {
            item.className = i == 0 ? "carousel-item active" : "carousel-item";
            item.innerHTML = "<img src='" + image + "' class='d-block w-100' alt=''>";
            images.querySelector(".carousel-inner").appendChild(item);
        }
    }


    var reviews = document.getElementById("reviews");
   
    for (var i = 0; i < activitiy.reviews.length; i++) {
        var review = activitiy.reviews[i];
        let stars = '';
        for (let i = 0; i < review.rating; i++) {
            stars += '&#9733;';
          }
        
        var item = document.createElement("div");
        item.className = "card mb-3";
        item.innerHTML = "<div class='card-body'><h5 class='card-title'>" + review.userName + "</h5><p class='card-text'>" + review.comment + "</p><p class='card-text'><small class='text-muted'>Rating: " + stars + "</small></p></div>";
        reviews.appendChild(item);
    }
    setNavLinks()
}

function setNavLinks(){

  //links to nav bar

  const params = new URLSearchParams(window.location.search);
  const valueLAT = params.get('LAT');
  const valueLONG = params.get('LONG');
  const valueDist = params.get('dist');

  var userName = params.get("userName");
  var userEmail = params.get("userEmail");

  const hiddenParams = {
    userName: userName,
    userEmail: userEmail,
  };

  var homeLink = `http://localhost:8000/mainpage1.html?userEmail=` + encodeURIComponent(userEmail)+`&userName=`+ encodeURIComponent(userName);
  var resultsLink =
    `http://localhost:8000/searchresults.html?LAT=` +
    encodeURIComponent(valueLAT) +
    "&LONG=" +
    encodeURIComponent(valueLONG) +
    "&dist=" +
    encodeURIComponent(valueDist) + "&" + new URLSearchParams(hiddenParams);
    var addactivityLink =
    `http://localhost:8000/addactivity.html?LAT=` +
    encodeURIComponent(valueLAT) +
    "&LONG=" +
    encodeURIComponent(valueLONG) +
    "&dist=" +
    encodeURIComponent(valueDist) + "&" + new URLSearchParams(hiddenParams);
    var favLink = 
    `http://localhost:8000/favoriteslist.html?LAT=` +
    encodeURIComponent(valueLAT) +
    "&LONG=" +
    encodeURIComponent(valueLONG) +
    "&dist=" +
    encodeURIComponent(valueDist) + "&" + new URLSearchParams(hiddenParams);

       document.getElementById("home").href = homeLink;
   document.getElementById("activity").href = addactivityLink;
   document.getElementById("favourites").href = favLink;
    document.getElementById("results").href = resultsLink;

 //links to nav bar
}

async function AddComment() {
    var params = new URLSearchParams(window.location.search);
    var userName = params.get("userName");
   
  

    var userName = userName;
    var userComment = document.getElementById("userComment").value;
    var rantingValue = document.getElementById("rating").value;
    // var userRating = "3";
    var userRating = parseInt(rantingValue).toString()
    
    const data = {
        userName: userName,
        userComment: userComment,
        userRating: userRating
    }

    console.log(activitiy._id)

    // add comment to server
    const request = await fetch(`http://localhost:8000/review/add/${activitiy._id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    let reposnse = await request.json();

    if(request.ok){
        console.log("Added Comment");
        // get activity again
        getActivity(activitiy._id)
    }else{
        console.log(reposnse)
    }

}



function getActivity(id) {
    fetch(`http://localhost:8000/activity/get/${id}`, {
        method: "GET"
    })
        .then(res => res.text())
        .then(txt => {
            console.log(txt)
            // store new fetched activity to local storage
            localStorage.setItem("selectedActivity", txt);
            // reload page and display new activity data
            window.location.reload();
        })
        .catch(err => console.log(err))
}

console.log("activitiy._id is ", activitiy._id)

// set up map API
let map;
let geocoder;
function initMap() {
    fetch(`http://localhost:8000/activity/get/${activitiy._id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch activities.");
        }
      })
      .then((data) => {
        console.log("data is ", data);

        map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: data.lat, lng: data.long },
                zoom: 13,
        })
        let activityLAT = data.lat;
        let activityLONG = data.long;
        let activityLanLng = new google.maps.LatLng(activityLAT, activityLONG);
        const contentString = data.activityName;
        placeMarkerAndPanTo(activityLanLng, map, activityName, contentString);
        geocoder = new google.maps.Geocoder();
      })
      .catch((error) => {
        console.log("Fetching error", error);
      });
}

function geoCodeLocation(){
  var address = document.getElementById("address").value;
  geocoder.geocode({'address': address}, function(results, status){
    if(status === 'OK'){
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(results[0].geometry.location.lat())
      console.log(results[0].geometry.location.lng())
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

let currentPosition; // set a variable for current position

// showing lat & lng when clicking on the map
function placeMarkerAndPanTo(latLng, map, activityName, contentString) {
    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: activityName
    });
    console.log("latLng is ", latLng)


    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: `activityName`,
    });

    marker.addListener("click", () => {
      infowindow.open({
      anchor: marker,
      map: map,
  });        
})
    map.panTo(latLng);
    var selectedLatAndLng = {latitude: latLng.lat(), longitude: latLng.lng()}
    return latLng;
}