function $(selector) {
    return document.querySelector(selector);
  }
  
  function $all(selector) {
    return document.querySelectorAll(selector);
  }
  
  function byId(id) {
    return document.getElementById(id);
  }
  
  function showText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }
  
  function goTo(url) {
    window.location.href = url;
  }
  
  function formToObject(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
  }
  
  async function getJson(url) {
    const response = await fetch(url);
    return await response.json();
  }
  
  async function postJson(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  
    const result = await response.json();
    return { response, result };
  }

  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
    document.querySelectorAll('nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
  });

  function splitTimeStamp(timeStamp){
    dateTime = timeStamp.split("T");
    date = dateTime[0];
    time = dateTime[1].slice(0, -1);
    datesplit = date.split("-");
    timesplit = time.split(":");
    return datesplit.concat(timesplit); //[year, month, day, hour, minitues, seconds]
  }