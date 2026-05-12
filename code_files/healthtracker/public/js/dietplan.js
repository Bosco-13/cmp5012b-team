daysInMonth = (month, year) => {
    if (month == 2) {
        return (year % 4 == 0) ? 29 : 28;
    }
    if ([4, 6, 9, 11].includes(month)) {
        return 30;
    }
    return 31;
}

// calender should be a li object
function generateMonth(month, year, active_date){ //fixed
    calender = document.querySelector(".days");
    startOfMonth = new Date(year, month-1, 1);
    day = startOfMonth.getDay();
    totalDays = daysInMonth(month,year);
    calenderDates = document.getElementsByClassName("diet-calender-day");
    for (i = 0; i < calenderDates.length; i++){
        if(i < day || i > totalDays+day-1){
            href = "#";
            content = " ";
        }
        else{
            href = `#`;
            content = i-day + 1
        }
        
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

// get date a number
function setActiveDate(element){
    element.classList.add("active");
}

weekdays = ["Monday", "Tuesday", "Wedesday", "Thursday", "Friday", "Saturday", "Sunday"]
function loadDateTitle(date, element){ //fixed
    weekday = new Date(date[0], date[1], date[2]);
    week  = weekday.getDay();
    if (week==0){
        week = 7;
    }
    element.textContent = `${date[2]}/${monthArray[date[1]-1]} ${weekdays[week-1]}`;
}

function loadDietPlan(activeDate, data){
    dates = [];
    dayTitles = document.getElementsByClassName("day__header");
	dayPlanLists = document.getElementsByClassName("day__contentlist")
    for(let i = 0; i<5; i++){
        toClear = dayPlanLists[i].lastElementChild;
        while(toClear){ //clear the lists
            dayPlanLists[i].removeChild(toClear);
            toClear = dayPlanLists[i].lastElementChild;
        }
	    nextDate = [Number(activedate[0]), Number(activedate[1]), Number(activedate[2])];
		nextDate[2] = nextDate[2] + i;
		if(nextDate[2]>daysInMonth(nextDate[1], nextDate[0])){
			nextDate[2] = nextDate[2] - daysInMonth(nextDate[1], nextDate[0]);
			nextDate[1] =nextDate[1] + 1;
			if(nextDate[1] > 12){
				nextDate[0] = nextDate[0] + 1;
				nextDate[1] = 1;
				}
		}
		loadDateTitle(nextDate,dayTitles[i].querySelector('h3'));
		formatedDate = `${nextDate[0]}-${String(nextDate[1]).padStart(2, '0')}-${String(nextDate[2]).padStart(2, '0')}`;
        console.log(formatedDate);
        result = data.filter(data => data.date_logged.startsWith(formatedDate));
        if(result.length > 0){
        for(let j = 0; j<result.length; j++){
            button = document.createElement("button");
            button.textContent = result[j].food_title;
            button.classList.add("dish_button")
            button.addEventListener("click", function(){
                id = result[j].dish_id;
                sessionStorage.setItem("dish_id", id);
                console.log(id);
                //window.location.href = "/nutrition.html";
            })
            dayPlanLists[i].appendChild(button);
        }}
        else{
            for(j = 0; j<4; j++){
                button = document.createElement("button");
                button.textContent = "  ";
                dayPlanLists[i].appendChild(button);
            }
        }
	}
    
    for(i = 0; i<dates.length; i++){

    }
}

let activedate;

// LOAD data when the page is first loaded
let nId; // for url at the nutrition page
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.startsWith("/dietplan")){
        nId = null;
        fetch("./dietplan")
        .then(response => response.json())
        .then(data => {
            rows = data.records;
            rows.sort((a,b) =>{ return new Date(a.date_logged) - new Date(b.date_logged);});
            console.log(rows);
            // for debug uses
            activedate = ["2026", "4", "29", "00", "00","00"];
            //activedate = splitTimeStamp(data.active_date);
            console.log(activedate);
            calender = document.getElementsByClassName("days")[0].querySelectorAll("li");
            startOfMonth = new Date(activedate[0], activedate[1]-1, 1);
            day = startOfMonth.getDay();
            for(let i = 0; i < calender.length; i++){
                if(activedate[2] == i-day + 1){
                    setActiveDate(calender[i]);
                }
                else{
                    calender[i].classList.remove("active");
                }
            }
            
            //if data found
            //load calender
            generateMonth(activedate[1], activedate[0], activedate[2]);
            updateCalenderTitle(activedate[1], activedate[0]);
            //load diet plan
            loadDietPlan(activedate, rows);
           
            // update the calender when prev or next button is pressed
            const next = document.querySelector(".next");
            const prev = document.querySelector(".prev");
            nextTitle = [Number(activedate[0]), Number(activedate[1])];
            next.addEventListener("click", () => { //fixed
                nextTitle[1] = nextTitle[1] + 1;
                if (nextTitle[1] > 12){
                    nextTitle[1] = 1;
                    nextTitle[0] += 1;
                }
                updateCalenderTitle(nextTitle[1], nextTitle[0]);
                generateMonth(nextTitle[1], nextTitle[0]);
            })
            prev.addEventListener("click", () => { //fixed
                nextTitle[1] = nextTitle[1] - 1;
                if (nextTitle[1] < 1){
                    nextTitle[1] = 12;
                    nextTitle[0] -= 1;
                }
                updateCalenderTitle(nextTitle[1], nextTitle[0]);
                generateMonth(nextTitle[1], nextTitle[0]);
            })
            // update diet plan section when date is pressed
            dateButtonArray = document.getElementsByClassName("diet-calender-day");
            for(let i = 0; i < dateButtonArray.length; i++){
                dateButtonArray[i].addEventListener("click", function () {
                    if(this.textContent != " "){ //update active_date
                        titleMonth = document.querySelector("#title-month");
                        titleYear = titleMonth.querySelector("span");
                        liArray  = document.querySelector(".days").querySelectorAll("li");
                        activeMonth = monthArray.indexOf(titleMonth.childNodes[0].textContent.trim()) + 1;
                        activedate = [titleYear.textContent, String(activeMonth), this.textContent];
                        for (j = 0; j < liArray.length; j++){
                            liArray[j].classList.remove("active");    
                        }
                        setActiveDate(liArray[i]);
                        console.log(activedate);
                        loadDietPlan(activedate, rows); 
                    }
                    else{
                        console.log("-: " + i);
                    }
                    //load diet plan
                    
                })
            }
        })
    }
})

