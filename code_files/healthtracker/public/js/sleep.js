console.log("running... sleep");

// returns duration in milli seconds
function getDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffMs = end - start;
    const totalSeconds = Math.floor(diffMs / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds];
}

function durationToMinutes(duration) {
    return duration[0] * 60 + duration[1];
}

function calculateSleepScore(recordMinutes, targetMinutes) {
    if (
        recordMinutes == null ||
        targetMinutes == null ||
        targetMinutes <= 0
    ) {
        return -999;
    }

    let score;

    if (recordMinutes <= targetMinutes) {
        score = (recordMinutes / targetMinutes) * 100;
    }
    else {
        const extraMinutes = recordMinutes - targetMinutes;
        const penalty = (extraMinutes / targetMinutes) * 50;
        score = 100 - penalty;
    }

    if (score > 100) {
        score = 100;
    }

    if (score < 0) {
        score = 0;
    }

    return Math.round(score);
}

// score and lastScore are integer both parameter == -999 means no record found
function updateScore(score, lastScore) { //fixed
    const scoreNum = document.getElementById("score");
    const scoreText = document.getElementById("score-text");

    if (!scoreNum || !scoreText) {
        return;
    }

    if (score == -999 && lastScore == -999) {
        scoreText.textContent = "No record of score yet.";
        scoreNum.textContent = "--";
        return;
    }

    scoreNum.textContent = score;

    if (lastScore == -999) {
        scoreText.textContent = "No previous score to compare.";
        return;
    }

    const scoreDiff = score - lastScore;

    if (scoreDiff < 0) {
        scoreText.textContent = `decrease of ${Math.abs(scoreDiff)} points from yesterday!`;
    }
    else if (scoreDiff > 0) {
        scoreText.textContent = `increase of ${scoreDiff} points from yesterday!`;
    }
    else {
        scoreText.textContent = `same score as yesterday`;
    }
}

function updateStreak(streak) {
    const streakText = byId("streak");

    if (!streakText) {
        return;
    }

    const n = streak || 0;
    streakText.textContent = `${n} night${n === 1 ? '' : 's'}`;
}

// if no data found time == -999
function updateTargetSleep(hour, minitues) { //fixed
    const timeElement = byId("target");

    if (!timeElement) {
        return;
    }

    if (hour == -999 && minitues == -999) {
        timeElement.textContent = "Target not set";
    }
    else {
        timeElement.textContent = `${hour}h ${minitues}m`;
    }
}

//target and time should both be int in int in milli seconds
function updateProgress(target, time) { //fixed
    const bar = document.querySelector(".progress");
    const progressText = document.querySelector("#record-time");

    if (!bar || !progressText) {
        return;
    }

    if (target == -999 || time == -999) {
        bar.style.width = "0%";
        progressText.textContent = `No record yet.`;
    }
    else {
        const targetInSecond = target[0] * 60 * 60 + target[1] * 60 + target[2];
        const timeInSecond = time[0] * 60 * 60 + time[1] * 60 + time[2];

        let percentage = (timeInSecond / targetInSecond) * 100;

        if (percentage > 100) {
            percentage = 100;
        }

        bar.style.width = percentage + "%";

        progressText.textContent = `${time[0]}h ${time[1]}m recorded (Goal: ${target[0]}h ${target[1]}m)`;
    }
}

// week should be an sorted array of dates with the record sleep time of each day of the week
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function updateWeekStatus(week, targetMinutes) {
    const bars = document.getElementsByClassName("bar");
    const barsText = document.getElementsByClassName("bar-text");

    for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = "10px";
        barsText[i].textContent = "";
    }

    if (week != null && targetMinutes != null) {
        for (let i = 0; i < week.length && i < bars.length; i++) {
            const duration = getDuration(week[i].start_time, week[i].end_time);
            const sleepMinutes = durationToMinutes(duration);

            let percentage = (sleepMinutes / targetMinutes) * 100;

            if (percentage > 100) {
                percentage = 100;
            }

            bars[i].style.height = percentage + "px";

            const day = new Date(week[i].start_time);
            barsText[i].textContent = days[day.getDay()];
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadSleepData();

    const form = document.getElementById("sleep-log-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const hours = parseInt(document.getElementById("sleep-hours").value, 10);
            const minutes = parseInt(document.getElementById("sleep-minutes").value, 10);
            const msg = document.getElementById("sleep-log-msg");

            if (
                Number.isNaN(hours) ||
                Number.isNaN(minutes) ||
                hours < 0 ||
                hours > 24 ||
                minutes < 0 ||
                minutes > 59 ||
                (hours === 24 && minutes > 0)
            ) {
                msg.textContent = "Enter a valid sleep duration.";
                return;
            }

            try {
                const { response, result } = await postJson("/sleep", { hours, minutes });

                if (!response.ok) {
                    msg.textContent = result.message || "Something went wrong.";
                    return;
                }

                updateStreak(result.streak);

                msg.textContent = result.met_goal
                    ? `Goal met! Streak is now ${result.streak}`
                    : `Below goal. Streak reset to 0.`;

                form.reset();

                loadSleepData();
            }
            catch (error) {
                console.error("Sleep form error:", error);
                msg.textContent = "Could not log sleep. Check the console.";
            }
        });
    }
});

function loadSleepData() {
    fetch("/sleep", {
        credentials: "same-origin"
    })
    .then(response => response.json().then(data => ({ response, data })))
    .then(({ response, data }) => {
        if (!response.ok) {
            console.error("Sleep load error:", data.message);

            updateScore(-999, -999);
            updateStreak(0);
            updateTargetSleep(-999, -999);
            updateProgress(-999, -999);

            return;
        }

        if (data.target.length == 0) {
            updateScore(-999, -999);
            updateStreak(0);
            updateTargetSleep(-999, -999);
            updateProgress(-999, -999);

            return;
        }

        const target = data.target[0];

        const targetHour = Number(target.target_sleep_hour);
        const targetMinitues = Number(target.target_sleep_minitues);

        if (
            Number.isNaN(targetHour) ||
            Number.isNaN(targetMinitues)
        ) {
            updateScore(-999, -999);
            updateStreak(target.sleep_streak || 0);
            updateTargetSleep(-999, -999);
            updateProgress(-999, -999);

            return;
        }

        const target1 = [
            targetHour,
            targetMinitues,
            0
        ];

        const targetMinutes = targetHour * 60 + targetMinitues;

        updateTargetSleep(target.target_sleep_hour, target.target_sleep_minitues);
        updateStreak(target.sleep_streak || 0);

        if (data.records.length == 0) {
            updateScore(-999, -999);
            updateProgress(-999, -999);
            updateWeekStatus([], targetMinutes);

            return;
        }

        const rows = data.records;

        rows.sort((a, b) => {
            return new Date(a.start_time) - new Date(b.start_time);
        });

        const todayRecord = rows[rows.length - 1];
        const todayDuration = getDuration(todayRecord.start_time, todayRecord.end_time);
        const todayMinutes = durationToMinutes(todayDuration);
        const todayScore = calculateSleepScore(todayMinutes, targetMinutes);

        let yesterdayScore = -999;

        if (rows.length >= 2) {
            const yesterdayRecord = rows[rows.length - 2];
            const yesterdayDuration = getDuration(yesterdayRecord.start_time, yesterdayRecord.end_time);
            const yesterdayMinutes = durationToMinutes(yesterdayDuration);

            yesterdayScore = calculateSleepScore(yesterdayMinutes, targetMinutes);
        }

        updateScore(todayScore, yesterdayScore);
        updateProgress(target1, todayDuration);
        updateWeekStatus(rows.slice(-7), targetMinutes);
    })
    .catch(error => {
        console.error("Sleep load error:", error);

        updateScore(-999, -999);
        updateStreak(0);
        updateTargetSleep(-999, -999);
        updateProgress(-999, -999);
    });
}