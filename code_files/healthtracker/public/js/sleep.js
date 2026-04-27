const { response } = require("express");
console.log("running... sleep");
// returns duration in milli seconds
function getDuration(startTime, endTime){
    return endTime-startTime;
}

// score and lastScore are integer both parameter == -999 means no record found
function updateScore(score, lastScore){
    score = byId("score");
    score.text = score;
    scoreDiff = score - lastScore;
    scoreText = byId("score-text");
    if (scoreDiff > 0){
        scoreText.text = `increase of ${scoreDiff} points from yesterday!`;
    }
    else if (scoreDiff < 0){
        scoreText.text = `decrease of ${scoreDiff} points from yesterday!`;
    }
    else if(score == -999 && lastScore == -999){
        scoreText.text = "No record of score yet.";
        score.text = "--";
    }
    else {
        scoreText.text = `same`;
    }
}
// dates is array of date if no record found date input as null
function updateStreak(dates){
    let streak = 0;
    streakText = byId("streak");
    dates.sort((a, b) => b - a);
    if (dates == null){
        streakText.text = `0 nights`;
    }
    else{
        for(i = 1; i<dates.length; i++){
            current = dates[i];
            privous = dates[i-1];
            diff = current.getDay() - privous.getDay();
            if (diff == 0 || diff == 1  || diff == 6) {
                break;
            }
            else{
                streak = i;
            }
        }
        streakText.text = `${streak} nights`;
    }
    
}
// if no data found time == -999
function updateTargetSleep(time){
    time = byId("target");
    if (time == -999){
        time.text = "Target not set"
    }
    else{
        const targetHour = Math.floor(target / (1000 * 60 * 60));
        const targetMintues = Math.floor((target / (1000 * 60)) % 60);
        time.text = `${targetHour}h ${targetMintues}m`;
    }
}

//target and time should both be int in int in milli seconds
function updateProgress(target, time){
    bar = document.getElementsByClassName("progress");
    diff = target - time;
    percentage = (diff / target) * 100;
    bar.stye.width = percentage + "%";
    
    if (target == -999 || time == -999){
        progressText.text = `No record yet.`;
    }
    else{
        progressText = byId("record-time");
        const targetHour = Math.floor(target / (1000 * 60 * 60));
        const targetMintues = Math.floor((target / (1000 * 60)) % 60);
        const timeHour = Math.floor(time / (1000 * 60 * 60));
        const timeMintues = Math.floor((time / (1000 * 60)) % 60);
        progressText.text = `${timeHour}h ${timeMintues}m recorded (Goal: ${targetHour}h ${targetMintues}m)`;
    }
    
}

// week should be an sorted array of dates with the record sleep time of each day of the week
days = ["Monday", "Tuesday", "Wedesday", "Thursday", "Friday", "Saturday", "Sunday"]
function updateWeekStatus(week, target){
    bars = document.getElementsByClassName("bar");
    barsText = document.getElementsByClassName("bar-text");
    if (week != null || target != null){
        for(i = 0; i < week.length; i++){
            percentage = ((target - week[i])/target) *100;
            bars[i].stye.height = percentage + "px";
            bar[i].text = days[week[i].getDay()];

    }}
}

//load data when page is load
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/sleep")
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        if (data.records == null){
            updateScore(-999, -999);
            updateStreak(null);
            updateTargetSleep(-999);
            updateProgress(-999, -999);
        }
        else{
            rows = data.records.rows;
            rows.sort((a,b) => a.sleep_id - b.sleep_id); // sort from early to present
            const now = Date.now();
            todayRecord = data.records[rows.length-1];
            target = data.target;
            dateArray = data.records.map(record => record.start_date);
            updateScore(999, 998); // place holder
            updateStreak(dateArray);
            updateTagretSleep(target); // place holder
            updateProgress(target, getDuration(todayRecord.start_time, todayRecord.end_time));
            updateWeekStatus(dateArray.slice(0,7));
        }
    })
    
});