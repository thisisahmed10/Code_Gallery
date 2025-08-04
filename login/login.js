window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      alert("❗ Please enter your email and password.");
      return;
    }

    localStorage.setItem("userData", JSON.stringify({ email, password }));
    window.location.href = "../home/home.html?showPreview=true"; 
  });

  
});





