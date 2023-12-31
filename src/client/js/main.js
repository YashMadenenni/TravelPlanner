console.log(window.location.href);

window.onload = async function () {
  await top10();
  var params = new URLSearchParams(window.location.search);
  var userName = params.get("userName");
  var userEmail = params.get("userEmail");



  var favlink = `http://localhost:8000/forhome/favoriteslist.html?userEmail=` + encodeURIComponent(userEmail) + "&userName=" +
    encodeURIComponent(userName);
  var addActivitylink = `http://localhost:8000/forhome/addactivity.html?userEmail=` + encodeURIComponent(userEmail) + "&userName=" +
    encodeURIComponent(userName);



  console.log(favlink);
  document.getElementById("favourites").href = favlink;
  document.getElementById("activity").href = addActivitylink;
  favourBtnEvent()
  DetailBtnEvent()
  setRegion("2019")

}

function checkLogin(userEmail) {
  if (userEmail == "null") {
    window.alert("Login Again");
  }
}
var results;
async function top10() {
  const response = await fetch("http://localhost:8000/activity/get/5star",
    { method: "GET" });
  const responseData = await response.json();
  console.log(responseData);

  objects = responseData;
  results = responseData;

  for (let i = 0; i < objects.length; i++) {
    var divRow = document.getElementById("searchTopresults")
    // divRow.appendChild(activityCards);
    divRow.innerHTML += '<div class="col-sm-4 col-md-4 col-lg-4 mb-3">' +
      `
    <div id="${objects[i].activityName}-card" class="card" style="width: 18rem" style="cursor: pointer">
      <img src="${objects[i].images[0]}" class="card-img-top" style="width: 100%; object-fit: cover;height:200px;">
      <div class="card-body">
        <h5 class="card-title">${objects[i].activityName}</h5>
        <p class="card-text">Location: ${objects[i].location}</p>
        <div class="row">
        <div class="col-sm-5 col-lg-5 col-md-5">
        <button id='${objects[i].activityName}-detail-btn' class="btn btn-warning detail-btn">View Detail</button>
        
        </div>
        <div class="col-sm-7 col-lg-7 col-md-7">
        <button id='${objects[i].activityName}-favour-btn' class="btn btn-secondary favour-btn" >Add to Favourites</button>
        
        </div>
        </div>
      </div>
    </div></div>`

  }


}


// function search() {
// // const searchLat = document.getElementById("lat").value;
//     // const searchLong = document.getElementById("long").value;

//     const R = 6371; // radius of the Earth in km
//     const lat1 = toRadians(document.getElementById("lat").value); //56.33963, long: -2.78847 //document.getElementById("lat").value;
//     const lon1 = toRadians(document.getElementById("long").value);//document.getElementById("long").value;
//     // const points = [];
//     const radiusKm = 8; //10->8 , 15->12, 20->11
// console.log(lat1+""+lon1)
//     // calculate the latitudinal distance covered by 10km radius
//     const latDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1));

//     // calculate the longitudinal distance covered by 10km radius
//     const lonDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1)) / Math.cos(lat1);

//     // calculate the corner coordinates
//     const topLeftLat = toDegrees(lat1 + latDist / 2);
//     const topLeftLon = toDegrees(lon1 - lonDist / 2);
//     const bottomRightLat = toDegrees(lat1 - latDist / 2);
//     const bottomRightLon = toDegrees(lon1 + lonDist / 2);

//     console.log([[topLeftLat, topLeftLon], [bottomRightLat, bottomRightLon]]);
//     //getDistanceFromLatLonInKm()
//     // console.log( points);

//     searchFromServer(topLeftLat, topLeftLon, bottomRightLat, bottomRightLon);

//     // fetch("http://localhost:8000/activity/search", { method: "POST" }, { body: JSON.stringify({ topLeftLat: topLeftLat, topLeftLon: topLeftLon, bottomRightLat: bottomRightLat, bottomRightLon: bottomRightLon }) })
//     //     .then(res => res.json())
//     //     .then(data => { console.log(data) }).then( data=>
//     //         localStorage.setItem("myData", JSON.stringify(data)));
//     //         const data = JSON.parse(localStorage.getItem("myData"));
//     //         console.log(data);
//     //         window.location.href = "http://localhost:8000/results.html";

// }

async function searchFromServer() {
  // const response = await fetch("http://localhost:8000/activity/search",
  // { method: "POST" ,
  // headers: { 'Content-Type': 'application/json' },
  // body: JSON.stringify(
  //         {
  //             LAT: document.getElementById("lat").value,
  //             LONG: document.getElementById("long").value,

  //         })
  // });
  // const responseData = await response.json();
  // console.log(responseData);
  // localStorage.setItem("myData", JSON.stringify(responseData));
  // const localStoragedata = JSON.parse(localStorage.getItem("myData"));
  // console.log("localStoragedata"+localStoragedata);

  var params = new URLSearchParams(window.location.search);
  var userName = params.get("userName");
  var userEmail = params.get("userEmail");

  const hiddenParams = {
    userName: userName,
    userEmail: userEmail,
  };
  checkLogin(userEmail)
  window.location.href =
    `http://localhost:8000/searchresults.html?LAT=` +
    encodeURIComponent(document.getElementById("lat").value) +
    "&LONG=" +
    encodeURIComponent(document.getElementById("long").value) +
    "&dist=" +
    encodeURIComponent(document.getElementById("distance").value) + "&" + new URLSearchParams(hiddenParams);
  // console.log(window.location.href);
  // console.log(window.location.href);
  // window.location.href = "http://localhost:8000/searchresults.html";
}
function favourBtnEvent() {
  var favourBtn = document.getElementsByClassName("favour-btn");
  //console.log(favourBtn)
  for (let i = 0; i < favourBtn.length; i++) {
    favourBtn[i].addEventListener("click", function () {
      var activityName = this.id.split("-")[0];
      console.log(activityName);
      addToFavourite(activityName);

    })
  }
}

async function addToFavourite(actvityName) {
  // userEmail = localStorage.getItem("userEmail");

  var params = new URLSearchParams(window.location.search);

  var userEmail = params.get("userEmail");

  checkLogin(userEmail)
  userEmail = userEmail;

  const response = await fetch(`/favourite/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: userEmail, activityName: actvityName })
  });
  const responseMsg = await response.json()
  console.log(responseMsg);
  window.alert(responseMsg.message);
}



function DetailBtnEvent() {
  var detailBtn = document.getElementsByClassName("detail-btn");
  console.log(detailBtn)
  for (let i = 0; i < detailBtn.length; i++) {
    detailBtn[i].addEventListener("click", function () {
      var activityName = this.id.split("-")[0];
      console.log(activityName)

      var selectedData = findSeletedActivity(results, activityName)
      console.log(selectedData);

      localStorage.setItem("selectedActivity", JSON.stringify(selectedData));
      // const localStoragedata = JSON.parse(localStorage.getItem("selectedActivity"));
      // console.log(localStoragedata);
      var params = new URLSearchParams(window.location.search);
      var userName = params.get("userName");
      var userEmail = params.get("userEmail");

      const hiddenParams = {
        userName: userName,
        userEmail: userEmail,
      };


      window.location.href = `http://localhost:8000/forhome/activitydetail.html?` + new URLSearchParams(hiddenParams);
    })
  }
}


function findSeletedActivity(json, activityName) {
  var selectedActivity = json.find(item => item.activityName === activityName);
  return selectedActivity ? selectedActivity : null;
}
// function toRadians(degrees) {
//     return degrees * Math.PI / 180;
// }

// function toDegrees(radians) {
//     return radians * 180 / Math.PI;
// }

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // radius of the Earth in km
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     console.log(distance);
//     //return distance;
// }

// var player = videojs('video');
// player.on('ended', function() {
//     player.play();
//   });

//https://github.com/videojs/videojs-playlist/blob/main/docs/api.md
//https://github.com/videojs/videojs-playlist
