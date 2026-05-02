// calender should be a li object
function generateMonth(month, year, active_date){ //fixed
    calender = document.querySelector(".days");
    startOfMonth = new Date(year, month-1, 1);
    day = startOfMonth.getDay();
    console.log(startOfMonth);
    console.log(day);
    daysInMonth = (month, year) => {
        if (month == 2) {
            return (year % 4 == 0) ? 29 : 28;
        }

        if ([4, 6, 9, 11].includes(month)) {
            return 30;
        }
        return 31;
    }
    totalDays = daysInMonth(month,year);
    calenderDates = document.getElementsByClassName("diet-calender-day");
    console.log(totalDays);
    console.log(day);

    for (i = 0; i < calenderDates.length; i++){
        if(i < day || i > totalDays+day-1){
            href = "#";
            content = "-";
        }
        else{
            href = `#`;
            content = i-day + 1
        }
        
        //console.log(href);
        calenderDates[i].textContent = content;
        calenderDates[i].href = href;
    }
}

monthArray = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];

function updateCalenderTitle(month, year){ //fixed
    monthText = byId("title-month");
    monthText.textContent = monthArray[month-1];
    yearText = document.createElement("span")
    yearText.style = "font-size:18px";
    yearText.textContent = year;
    monthText.appendChild(document.createElement("br"));
    monthText.appendChild(yearText);
    
}

function loadDishes(dishes, date,  element){
    buttons = element.querySelector(".day__container").querySelectorAll("button");
    document.querySelector(".day__header").text = date.getDate() + " " + monthArray[date.getMonth()];
    for (i=0; i<buttons.length;i++){
        buttons.textContent = dishes[i].food_title;
    }
    
}

// LOAD data when the page is first loaded
document.addEventListener("DOMContentLoaded", () => {
    fetch("./dietplan")
    .then(response => response.json())
    .then(data => {
        rows = data.records;
        console.log(rows);
        activedate = splitTimeStamp(data.active_date);
        console.log(activedate);
        generateMonth(activedate[1], activedate[0], activedate[2]);
        updateCalenderTitle(activedate[1], activedate[0]);
        // dayContainers = document.querySelectorAll(".day");

        // for (i = 0; i < dayContainers.length; i++){
        //     containerDate = active_date.getDate() + i;
        //     dishes = records.filter(record => record.date_logged == (containerDate));
        //     if (dishes){
        //         loadDishes(dishes, dayContainers[i]);
        //     }
        //     editButton = dayContainers[i].querySelector(".day__header__edit");
        //     editButton.href = "/editplan/" + containerDate;
        // }
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