let map;
let marker;
let searchBox;
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
  mapDiv.style.display = "block";

  const location = { lat: lat, lng: lon };

  // Initialize map ONLY ONCE
  if (!map) {
    map = new google.maps.Map(mapDiv, {
      center: location,
      zoom: 17
    });

    marker = new google.maps.Marker({
      map: map
    });

    initSearch(); // 🔥 attach search here
  }

  // Update position
  map.setCenter(location);
  marker.setPosition(location);
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
function initSearch() {
  const input = document.getElementById("map-search");

  searchBox = new google.maps.places.SearchBox(input);

  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (!places || places.length === 0) return;

    const place = places[0];

    if (!place.geometry) return;

    const location = place.geometry.location;

    // Move map
    map.setCenter(location);
    map.setZoom(17);

    // Move marker
    marker.setPosition(location);

    // Save to your system
    userLocation = {
      lat: location.lat(),
      lon: location.lng()
    };

    // Update address text
    locationText.innerText = place.formatted_address || "Location selected";
  });
}
window.onload = function () {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser) {
    nameInput.value = savedUser.name || "";
    phoneInput.value = savedUser.phone || "";
    deviceInput.value = savedUser.device || "";
    problemInput.value = savedUser.problem || "";
  }

  // Show default map
  showMap(10.8505, 76.2711);
};
