
function openFeatures() {

    // OPEN CARD
    document.querySelectorAll(".elem").forEach((elem) => {
       elem.addEventListener("click", () => {
    const selector = elem.dataset.target;
const page = document.querySelector(selector);


    page.style.display = "block";
    document.body.classList.add("no-scroll");
    window.scrollTo(0, 0);

    // 🔥 initialize pomodoro ONLY when opened
    if (page.classList.contains("pomodoro-fullpage")) {
        pomodoroTimer();
    }
});

    });

    // CLOSE CARD (ALL BACK BUTTONS)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("back")) {
            e.target.closest(".fullElem").style.display = "none";
            document.body.classList.remove("no-scroll");
            window.scrollTo(0, 0);
        }
    });
}

openFeatures();
function resetDailyGoalsAtMidnight() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("lastResetDate");

    if (lastReset !== today) {
        let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];

        goals = goals.map(goal => ({
    ...goal,
    done: false
}));


        localStorage.setItem("dailyGoals", JSON.stringify(goals));
        localStorage.setItem("lastResetDate", today);
    }
}


function openCard(cardClass) {
    document.querySelector(cardClass).style.display = "block";
    document.body.classList.add("no-scroll");
}





function todoList() {

    var currentTask = []

    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    } else {
        console.log('Task list is Empty');
    }



    function renderTask() {

        var allTask = document.querySelector('.allTask')

        var sum = ''

        currentTask.forEach(function (elem, idx) {
            sum += `
<div class="task">
    <div class="task-left">
        <h5>
            ${elem.task}
            ${elem.imp ? `<span class="imp">imp</span>` : ""}
        </h5>

        <p class="task-details">${elem.details}</p>
    </div>

    <div class="task-right">
        <button class="view-btn">View Details</button>
        <button class="done-btn" data-id="${idx}">Completed</button>
    </div>
</div>
`

        })

        allTask.innerHTML = sum

        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        document.querySelectorAll(".task").forEach((taskElem, index) => {

    const viewBtn = taskElem.querySelector(".view-btn")
    const details = taskElem.querySelector(".task-details")
    const doneBtn = taskElem.querySelector(".done-btn")

    viewBtn.addEventListener("click", () => {
        details.classList.toggle("show")
    })

    doneBtn.addEventListener("click", () => {
        currentTask.splice(index, 1)
        renderTask()
    })
})

    }
    renderTask()

    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('.addTask form #task-input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckbox = document.querySelector('.addTask form #check')

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            }
        )
        renderTask()

        taskCheckbox.checked = false
        taskInput.value = ''
        taskDetailsInput.value = ''
    })



}

todoList()


function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    function formatTime(hour) {
    const period = hour >= 12 && hour < 24 ? "PM" : "AM";
    let h = hour % 12;
    if (h === 0) h = 12;
    return `${h}:00 ${period}`;
}

var hours = [];

// 6 AM (6) to 12 AM (24)
for (let hour = 6; hour < 24; hour++) {
    const from = formatTime(hour);
    const to = formatTime(hour + 1);
    hours.push(`${from} - ${to}`);
}




    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''
        let statusClass = savedData ? "completed" : "pending";

wholeDaySum += `
<div class="time-block ${statusClass}">
    <span class="time">${elem}</span>
    <input 
        id="${idx}" 
        type="text" 
        placeholder="Plan this hour..." 
        value="${savedData}"
    >
</div>
`;

    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')

   dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
        dayPlanData[elem.id] = elem.value;
        localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));

        const parent = elem.closest(".time-block");

        if (elem.value.trim() !== "") {
            parent.classList.add("completed");
            parent.classList.remove("pending");
        } else {
            parent.classList.add("pending");
            parent.classList.remove("completed");
        }
    });
});

}

dailyPlanner()


document.addEventListener("DOMContentLoaded", () => {

    

    const fakeAuthors = [
  "Anonymous",
  "Unknown Thinker",
  "Daily Motivation",
  "Mind Booster",
  "Life Coach",
  "Inner Voice",
  "Success Guru",
  "Positive Mind",
  "Motivation Spark",
  "Dream Builder"
];
function getRandomAuthor() {
  const index = Math.floor(Math.random() * fakeAuthors.length);
  return fakeAuthors[index];
}

   const motivationQuoteContent = document.querySelector(".motivation-2 h1");
const motivationAuthor = document.querySelector(".motivation-3 h2");

async function motivationalQuote() {
  try {
    // First API
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    motivationQuoteContent.innerText = data.content;
    motivationAuthor.innerText = `— ${getRandomAuthor()}`;

  } catch (error) {
    console.log("First API failed, trying second API...");

    try {
      // Second API (fallback)
      const response2 = await fetch(
        "https://motivational-spark-api.vercel.app/api/quotes/random"
      );
      const data2 = await response2.json();

      motivationQuoteContent.innerText = data2.quote;
      motivationAuthor.innerText = `— ${data2.author}`;

    } catch (err) {
      // Final fallback (if both APIs fail)
      motivationQuoteContent.innerText = "Keep going. You are doing great.";
      motivationAuthor.innerText = "— Motivation Bot";
      console.error("Both APIs failed:", err);
    }
  }
}

motivationalQuote();
});

    let pomodoroInitialized = false
function pomodoroTimer() {
;


    if (pomodoroInitialized) return;
    pomodoroInitialized = true;


    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 25 * 60 
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {

            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                    totalSeconds = 5 * 60 
                }
            }, 1000)
        } else {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = 25 * 60
                }
            }, 1000)
        }

    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }
    function resetTimer() {
        totalSeconds = 25 * 60
        clearInterval(timerInterval)
        updateTimer()

    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)



}





function weatherFunctionality() {


    // I have removed API key for security purpose
    var apiKey = null
    var city = 'Surat'



    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    var data = null

    async function weatherAPICall() {
        var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
        data = await response.json()

        header2Temp.innerHTML = `${data.current.temp_c}°C`
        header2Condition.innerHTML = `${data.current.condition.text}`
        wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
        humidity.innerHTML = `Humidity: ${data.current.humidity}%`
        precipitation.innerHTML = `Heat Index : ${data.current.heatindex_c}%`
    }

    weatherAPICall()


    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${month}, ${year}`

        if (hours > 12) {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} PM`

        } else {
            header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} AM`
        }
    }

    setInterval(() => {
        timeDate()
    }, 1000);

}

weatherFunctionality()


function changeTheme() {
    const themeBtn = document.querySelector(".theme")

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark")
    })
}

changeTheme()


document.addEventListener("DOMContentLoaded", () => {
    const goalsPage = document.querySelector(".daily-goals-fullpage");
    goalsPage.style.display = "none"; 

    // Initial HTML (UI)
    goalsPage.innerHTML = `
        <button class="back">Close</button>
        <h2>Daily Goals</h2>

        <div class="goals-container">
            <form class="goal-form">
                <input type="text" placeholder="Enter your goal..." required />
                <button type="submit">Add Goal</button>
            </form>

            <div class="goals-list"></div>
        </div>
    `;

    const form = document.querySelector(".goal-form");
    const input = form.querySelector("input");
    const list = document.querySelector(".goals-list");

    // Load goals from localStorage OR default
    let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];

    // Render goals
    function renderGoals() {
        list.innerHTML = "";

        goals.forEach((goal, index) => {
            const goalDiv = document.createElement("div");
            goalDiv.className = "goal-item";

           goalDiv.innerHTML = `
    <input type="checkbox" ${goal.done ? "checked" : ""} />
    <p>${goal.text}</p>
    <button class="remove-btn">Remove</button>
`;
const checkbox = goalDiv.querySelector("input");

checkbox.addEventListener("change", () => {
    goal.done = checkbox.checked;
    saveAndRender();
});



            // Remove goal
            goalDiv.querySelector(".remove-btn").addEventListener("click", () => {
                goals.splice(index, 1);
                saveAndRender();
            });

            list.appendChild(goalDiv);
        });
    }

   function saveAndRender() {
    localStorage.setItem("dailyGoals", JSON.stringify(goals));
    renderGoals();
}


    // Add new goal
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const value = input.value.trim();
        if (value === "") return;

        goals.push({
    text: value,
    done: false
});
  // 👉 add AFTER existing goals
        input.value = "";
        saveAndRender();
    });
    
    resetDailyGoalsAtMidnight();

    renderGoals();
});


