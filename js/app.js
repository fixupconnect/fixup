const form = document.getElementById("repairForm");
const successMessage = document.getElementById("successMessage");

// Inputs
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const deviceInput = document.getElementById("device");
const problemInput = document.getElementById("problem");
const serviceInput = document.getElementById("service");
const locationText = document.getElementById("locationText");

let userLocation = null;

// Load saved data
window.onload = function () {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser) {
    nameInput.value = savedUser.name || "";
    phoneInput.value = savedUser.phone || "";
    deviceInput.value = savedUser.device || "";
    problemInput.value = savedUser.problem || "";
  }
};

// Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!userLocation) {
    alert("Please select location first");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerText = "Submitting...";
  submitBtn.disabled = true;

  db.collection("requests").add({
    name: nameInput.value,
    phone: phoneInput.value,
    device: deviceInput.value,
    problem: problemInput.value,
    service: serviceInput.value,
    location: userLocation,
    time: new Date()
  })
  .then(() => {
    localStorage.setItem("user", JSON.stringify({
      name: nameInput.value,
      phone: phoneInput.value,
      device: deviceInput.value,
      problem: problemInput.value
    }));

    document.getElementById("formContainer").style.display = "none";
    successMessage.style.display = "block";
  })
  .catch((error) => {
    console.error(error);
    alert("Error saving data");
    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  });
});

// Reset
function resetForm() {
  form.reset();
  userLocation = null;
  locationText.innerText = "Location not selected";

  document.getElementById("formContainer").style.display = "block";
  successMessage.style.display = "none";
}

// Location
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      userLocation = { lat, lon };

      showMap(lat, lon);
      getAddress(lat, lon);
    },
    () => alert("Location access denied")
  );
}

// Address
function getAddress(lat, lon) {
  const apiKey = "AIzaSyCsDSkyIxVIaXMqnMXDaiC7SKxRctK73wI";

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length > 0) {
        locationText.innerText = data.results[0].formatted_address;
      } else {
        locationText.innerText = "Address not found";
      }
    });
}

// Map
function showMap(lat, lon) {
  const mapDiv = document.getElementById("map");

  // Force display and height before initializing
  mapDiv.style.display = "block";
  
  const map = new google.maps.Map(mapDiv, {
    center: { lat: lat, lng: lon },
    zoom: 17
  });

  let marker = new google.maps.Marker({
    position: { lat: lat, lng: lon },
    map: map
  });

  // Use the 'idle' listener: it's more reliable than setTimeout on mobile
  google.maps.event.addListenerOnce(map, 'idle', function() {
    google.maps.event.trigger(map, 'resize');
    map.setCenter({ lat: lat, lng: lon });
  });
}

// Menu
function toggleMenu() {
  // Toggle the side menu and overlay
  document.getElementById("sideMenu").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  
  // Toggle the icon transformation (the 3 bars to X)
  document.querySelector(".menu-icon").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("sideMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  
  // Ensure the icon reverts back to 3 bars
  document.querySelector(".menu-icon").classList.remove("active");
}

// Scroll
function scrollToForm() {
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

