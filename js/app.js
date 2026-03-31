const form = document.getElementById("repairForm");
const successMessage = document.getElementById("successMessage");

// Input references
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const deviceInput = document.getElementById("device");
const problemInput = document.getElementById("problem");
const serviceInput = document.getElementById("service");

// Load saved data (auto-fill)
window.onload = function () {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser) {
    nameInput.value = savedUser.name || "";
    phoneInput.value = savedUser.phone || "";
    deviceInput.value = savedUser.device || "";
    problemInput.value = savedUser.problem || "";
  }
};

// Submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameVal = nameInput.value.trim();
  const phoneVal = phoneInput.value.trim();
  const deviceVal = deviceInput.value.trim();
  const serviceVal = serviceInput.value;

  // Validation
  if (phoneVal.length < 10) {
    alert("Enter valid phone number");
    return;
  }

  if (!serviceVal) {
    alert("Select a service");
    return;
  }

  // Button loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerText = "Submitting...";
  submitBtn.disabled = true;

  // Save to Firebase
  db.collection("requests").add({
    name: nameVal,
    phone: phoneVal,
    device: deviceVal,
    problem: problemInput.value,
    service: serviceVal,
    time: new Date()
  })
  .then(() => {

    // Save locally
    localStorage.setItem("user", JSON.stringify({
      name: nameVal,
      phone: phoneVal,
      device: deviceVal,
      problem: problemInput.value
    }));

    // Show success UI
    document.getElementById("formContainer").style.display = "none";
    successMessage.style.display = "block";

  })
  .catch((error) => {
    alert("Error saving data");
    console.error(error);

    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  });

});

// Reset form
function resetForm() {
  form.reset();

  document.getElementById("formContainer").style.display = "block";
  successMessage.style.display = "none";

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerText = "Submit";
  submitBtn.disabled = false;
}

// Scroll function
function scrollToForm() {
  document.getElementById("form").scrollIntoView({
    behavior: "smooth"
  });
}
