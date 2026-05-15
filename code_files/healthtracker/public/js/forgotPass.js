document
  .getElementById("forgotForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const response = await fetch("/forgot-password", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    alert(data.message);
  });
