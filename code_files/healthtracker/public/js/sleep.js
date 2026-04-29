console.log("running... sleep");
// returns duration in milli seconds
function getDuration(startTime, endTime){
    const end = splitTimeStamp(endTime);
    console.log(end);
    const start = splitTimeStamp(startTime);
    console.log(start);
    if(start[0] == end[0] && start[1] == end[1] && start[2] == end[2]){
        follow = 0;
        resultsecond = Number(end[5]) - Number(start[5]);
        if(resultsecond < 0){
            resultsecond = 60 + resultsecond;
            follow = 1;
        }
        resultminitues = Number(end[4]) - Number(start[4]) - follow;
        follow = 0;
        if(resultminitues < 0){
            resultminitues = 60 + resultminitues;
            follow = 1;
        }
        resulthour = Number(end[3]) - Number(start[3]) - follow;
        return [resulthour, resultminitues, resultsecond];
    }
    else{
        follow = 0;
        resultsecond = Number(end[5]) - Number(start[5]);
        if(resultsecond < 0){
            resultsecond = 60 + resultsecond;
            follow = 1;
        }
        resultminitues = Number(end[4]) - Number(start[4]) - follow;
        follow = 0;
        if(resultminitues < 0){
            resultminitues = 60 + resultminitues;
            follow = 1;
        }
        resulthour = (Number(end[3]) + 24) - Number(start[3]) - follow;
        return [resulthour, resultminitues, resultsecond];
    }
}

function splitTimeStamp(timeStamp){
    dateTime = timeStamp.split("T");
    date = dateTime[0];
    time = dateTime[1].slice(0, -1);
    datesplit = date.split("-");
    timesplit = time.split(":");
    return datesplit.concat(timesplit); //[year, month, day, hour, minitues, seconds]
}

// score and lastScore are integer both parameter == -999 means no record found
function updateScore(score, lastScore){ //fixed
    scoreNum = document.getElementById("score");
    scoreNum.text = score;
    scoreDiff = score - lastScore;
    scoreText = document.getElementById("score-text");
    if(score == -999 && lastScore == -999){
        scoreText.textContent = "No record of score yet.";
        scoreNum.textContent = "--";
    }
    else if (scoreDiff < 0){
        scoreText.textContent = `decrease of ${scoreDiff} points from yesterday!`;
    }
    else if(scoreDiff > 0){
        scoreText.textContent = `increase of ${scoreDiff} points from yesterday!`;
    }
    else {
        scoreText.textContent = `same`;
    }
}
// dates is array of date if no record found date input as null
function updateStreak(dates){ //fixed
    streakText = byId("streak");
    if(!dates){
        streakText.textContent = `0 nights`;
    }
     else{
        streak = 0;
        dates.sort((a, b) => b - a);
        for(i = 1; i<dates.length; i++){
            current = splitTimeStamp(dates[i])[2];
            privous = splitTimeStamp(dates[i-1])[2];
            diff = current - privous;
            if (diff == 0 || diff == 1  || diff == 6) {
                streak++;
            }
            else{
                break
            }
        }
        streakText.textContent = `${streak} nights`;
    }
}

// if no data found time == -999
function updateTargetSleep(hour, minitues){ //fixed
    timeElement = byId("target");
    if (hour == -999 && minitues == -999){
        timeElement.textContent = "Target not set"
    }
    else{
        timeElement.textContent = `${hour}h ${minitues}m`;
    }
}

//target and time should both be int in int in milli seconds
function updateProgress(target, time){ //fixed
    bar = document.getElementsByClassName("progress");
    progressText = document.querySelector("#record-time")
    if (target == -999 || time == -999){
        progressText.textContent = `No record yet.`;
    }
    else{
        targetInSecond = target[0] * 60 * 60 + target[1] * 60 + target[2]
        timeInSecond = time[0] * 60 *60 + time[1] * 60 + time[2];
        diff = targetInSecond - timeInSecond;
        if(diff < 0){
            bar.width = "100%";
        }
        else{
        percentage = (diff / targetInSecond) * 100;
        bar.width = percentage + "%";
    }   
        console.log(`${time[0]}h ${time[1]}m recorded (Goal: ${target[0]}h ${target[1]}m)`)
        progressText.textContent = `${time[0]}h ${time[1]}m recorded (Goal: ${target[0]}h ${target[1]}m)`;
    }
    
}

// week should be an sorted array of dates with the record sleep time of each day of the week
days = ["Monday", "Tuesday", "Wedesday", "Thursday", "Friday", "Saturday", "Sunday"]
function updateWeekStatus(week, target){
    console.log(target);
    console.log(time);
    console.log("We are one")
    bars = document.getElementsByClassName("bar");
    barsText = document.getElementsByClassName("bar-text");
    if (week != null || target != null){
        for(i = 0; i < week.length; i++){
            percentage = ((target - week[i])/target) *100;
            bars[i].height = percentage + "px";
            day = new Date(splitTimeStamp(week[i])[0], splitTimeStamp(week[i])[1], splitTimeStamp(week[i])[2])
            barsText[i].textContent = days[day.getDay()];

    }}
}

//load data when page is load
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/sleep")
    .then(response => response.json())
    .then(data => {
        if (data.records.length == 0 || data.target.length == 0){
            console.log("Not enough data fetched.");
            updateScore(-999, -999);
            updateStreak(null);
            updateTargetSleep(-999, -999);
            updateProgress(-999, -999);
            console.log("Not enough data fetched this time.");
        }
        else{
            rows = data.records;
            rows.sort((a,b) => a.sleep_id - b.sleep_id); // sort from past to present
            const day = new Date();
            day.setDate(day.getDate() - 1)
            const currentDate = new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
            );
            todayRecord = rows[rows.length-1];
            target = data.target[0];
            target1 = [target.target_sleep_hour, target.target_sleep_minitues, 0];
            dateArray = rows.map(record => record.start_time);
            updateScore(999, 998); // place holder
            updateStreak(dateArray);
            updateTargetSleep(target.target_sleep_hour, target.target_sleep_minitues); // place holder
            console.log(getDuration(todayRecord.start_time, todayRecord.end_time));
            updateProgress(target1, getDuration(todayRecord.start_time, todayRecord.end_time));
            updateWeekStatus(dateArray.slice(-7)); 
        }
    })
    
});