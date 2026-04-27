// calender should be a li object
function generateMonth(month, year, active_date){
    calender = document.querySelector(".days");
    startOfMonth = new Date(year, month, 1);
    day = startOfMonth.getWeek();
    daysInMonth = (month, year) => {
        if (month == 2) {
            return (year % 4 == 0) ? 29 : 28;
        }

        if ([4, 6, 9, 11].includes(month)) {
            return 30;
        }
        return 31;
    }

    calenderDates = calender.querySelectorAll("li");

    for (i = 0; i < daysInMonth; i++){
        calenderDates[startOfMonth + i].text = i+1;
        calenderDates[startOfMonth + i].querySelector("a").href = "/" + i;
        if (i == active_date){
            calenderDates[startOfMonth + i].classList.add("active");
        }
    }
}

monthArray = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];

function updateCalenderTitle(month, year){
    monthText = byId("month");
    monthText = monthArray[month-1];
    yearText = byId("year");
    yearText.text = year;
}

function loadDishes(dishes, date,  element){
    buttons = element.querySelector(".day__container").querySelectorAll("button");
    document.querySelector(".day__header").text = date.getDate() + " " + monthArray[date.getMonth()];
    for (i=0; i<buttons.length;i++){
        buttons.text = dishes[i].food_title;
    }
    
}

// LOAD data when the page is first loaded
document.addEventListener("DOMContentLoaded", () => {
    fetch("./routes/dietplan")
    .then(response => response.json())
    .then(data => {
        activeMonth = res.active_date.getMonth();
        activeYear = res.active_date.getFullYear();
        activeDay = res.active_date.getDate();
        generateMonth(activeMonth, activeYear, activeDay);
        updateCalenderTitle(activeMonth, activeYear);
        dayContainers = document.querySelectorAll(".day");

        for (i = 0; i < dayContainers.length; i++){
            containerDate = active_date.getDate() + i;
            dishes = records.filter(record => record.date_logged == (containerDate));
            if (dishes){
                loadDishes(dishes, dayContainers[i]);
            }
            editButton = dayContainers[i].querySelector(".day__header__edit");
            editButton.href = "/editplan/" + containerDate;
        }
    })
})

// update the calender when prev or next button is pressed
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

next.addEventListener("click", () => {
    nextMonth = activeMonth + 1;
    if (nextMonth > 12){
        nextMonth = 1;
        nextYear = activeYear + 1;
        activeMonth = nextMonth;
        activeYear = nextYear;
    }
    updateCalenderTitle(activeMonth, activeYear);
})

prev.addEventListener("click", () => {
    nextMonth = activeMonth - 1;
    if (nextMonth < 1){
        nextMonth = 12;
        nextYear = activeYear - 1;
        activeMonth = nextMonth;
        activeYear = nextYear;
    }
    updateCalenderTitle(activeMonth, activeYear);
})