

window.onload = previewImage();
function previewImage() {
    document.getElementById("imageInput").addEventListener("change", () => {
        const fileInput = document.getElementById("imageInput").files[0];

        const fileReader = new FileReader();

        fileReader.onload = () => {
            document.getElementById("preview").innerHTML = '<img class="preview" src=' + fileReader.result + '>'
        }
        fileReader.readAsDataURL(fileInput);
    });
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
    // var resultsLink =
    //   `http://localhost:8000/searchresults.html?LAT=` +
    //   encodeURIComponent(valueLAT) +
    //   "&LONG=" +
    //   encodeURIComponent(valueLONG) +
    //   "&dist=" +
    //   encodeURIComponent(valueDist) + "&" + new URLSearchParams(hiddenParams);
      var addactivityLink =
      `http://localhost:8000/forhome/addactivity.html?LAT=` +
      encodeURIComponent(valueLAT) +
      "&LONG=" +
      encodeURIComponent(valueLONG) +
      "&dist=" +
      encodeURIComponent(valueDist) + "&" + new URLSearchParams(hiddenParams);
      var favLink = 
      `http://localhost:8000/forhome/favoriteslist.html?LAT=` +
      encodeURIComponent(valueLAT) +
      "&LONG=" +
      encodeURIComponent(valueLONG) +
      "&dist=" +
      encodeURIComponent(valueDist) + "&" + new URLSearchParams(hiddenParams);
  
         document.getElementById("home").href = homeLink;
     document.getElementById("activity").href = addactivityLink;
     document.getElementById("favourites").href = favLink;
    //   document.getElementById("results").href = resultsLink;
  
   //links to nav bar
  }

  let imageUrl ="";
  async function uploadFile(event) {
      event.preventDefault();
      const formData = new FormData(document.getElementById('uploadFormImage'));
    const request =  await fetch('http://localhost:8000/activity/image', {
        method: 'POST',
        body: formData
      });
  const response = await request.json();
  if (request.ok) {
      window.alert("file uploaded")
  }else{
      window.alert('failed')
  }
  imageUrl = response.url;
  console.log(imageUrl)
     
      }
  
      
  
  
  async function activitySubmit(event) {
      
      event.preventDefault();
      
      
  
      // Get the input values from the form fields
      const params = new URLSearchParams(window.location.search);
      var userName = params.get("userName");
      const form = document.getElementById('uploadForm');
      var review = [{ userName: userName, comment: "I recommmend this", rating: form.elements.rating.value }];
  
      const image = imageUrl;
  
      // if (!imageUrl=="") {
          // make the lan and lng into float for accurate location (by 220022259)
      let latFloat = parseFloat(form.elements.lat.value);
      let longFloat = parseFloat(form.elements.lon.value);
  
      var newActivity = {
  
          activityName: form.elements.activityName.value,
          lat: latFloat,
          long: longFloat,
          location: form.elements.location.value,
          age: form.elements.age.value,
          type: form.elements.type.value,
          price: form.elements.price.value,
          description: form.elements.description.value,
          images: [image],
          reviews: review
  
      }
  console.log(newActivity)
    const request =   await fetch('http://localhost:8000/activity/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newActivity)
      });
      var response = await request.json()  
          //.then(txt => alert(txt))
      console.log(response)
      if (request.ok) {
          window.alert(response.msg);
      }else{
          window.alert(response.msg);
      }
  
      
      //console.log(activityName, activityType, latitude, longitude);
      // console.log(document.getElementById('uploadForm'));
      // }
      // else{
      //     window.alert("upload Image")
      // }
      
  
  }