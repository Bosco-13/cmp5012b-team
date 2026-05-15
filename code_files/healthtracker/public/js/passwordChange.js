document
  .getElementById("resetForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;

    const token = new URLSearchParams(window.location.search).get("token");

    const response = await fetch("/reset-password", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await response.json();

    alert(data.message);
  });
