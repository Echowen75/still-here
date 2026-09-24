/* =========================================================
   STILL HERE — COMPLETE APP SCRIPT
   ========================================================= */


/* =========================================================
   APP STATE
   ========================================================= */

let currentUser = null;

let currentFeeling = null;
let currentIntensity = null;
let currentSituation = null;
let currentNote = "";

let currentFaith = null;
let currentSupport = null;


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadDarkMode();
    loadExistingUser();
    loadNotificationSettings();

});


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem("stillHereUsers") || "{}"
        );

    } catch {

        return {};

    }

}


function saveUsers(users) {

    localStorage.setItem(
        "stillHereUsers",
        JSON.stringify(users)
    );

}


function getUserStorageKey(name) {

    return `stillHere_${name}_${currentUser || "Guest"}`;

}


/* =========================================================
   ACCOUNT SYSTEM
   ========================================================= */

function createAccount() {

    const username =
        document.getElementById("createUsername").value.trim();

    const password =
        document.getElementById("createPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const error =
        document.getElementById("createError");

    error.textContent = "";


    if (!username) {

        error.textContent =
            "Please choose a username.";

        return;

    }


    if (username.length < 3) {

        error.textContent =
            "Your username needs at least 3 characters.";

        return;

    }


    if (password.length < 6) {

        error.textContent =
            "Your password needs at least 6 characters.";

        return;

    }


    if (password !== confirmPassword) {

        error.textContent =
            "The passwords don't match.";

        return;

    }


    const users = getUsers();
    const key = username.toLowerCase();


    if (users[key]) {

        error.textContent =
            "That username already exists.";

        return;

    }


    users[key] = {

        username: username,

        password: password,

        createdAt:
            new Date().toISOString()

    };


    saveUsers(users);

    currentUser = username;


    localStorage.setItem(
        "stillHereCurrentUser",
        currentUser
    );


    openApp();

}


/* =========================================================
   LOGIN
   ========================================================= */

function loginUser() {

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const error =
        document.getElementById("loginError");

    error.textContent = "";


    const users = getUsers();

    const user =
        users[username.toLowerCase()];


    if (!user) {

        error.textContent =
            "We couldn't find that account.";

        return;

    }


    if (user.password !== password) {

        error.textContent =
            "That password isn't correct.";

        return;

    }


    currentUser = user.username;


    localStorage.setItem(
        "stillHereCurrentUser",
        currentUser
    );


    openApp();

}


/* =========================================================
   GUEST
   ========================================================= */

function continueAsGuest() {

    currentUser = "Guest";

    localStorage.setItem(
        "stillHereCurrentUser",
        "Guest"
    );

    openApp();

}


/* =========================================================
   OPEN APP
   ========================================================= */

function openApp() {

    const auth =
        document.getElementById("authScreen");

    const app =
        document.getElementById("app");


    if (auth) {

        auth.classList.add("hidden");

    }


    if (app) {

        app.classList.remove("hidden");

    }


    updateAccountUI();

    loadJournalEntries();

    loadHistory();

    loadNotificationSettings();

    showPage("checkInPage");

    resetCheckIn();

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "stillHereCurrentUser"
    );


    const app =
        document.getElementById("app");

    const auth =
        document.getElementById("authScreen");


    if (app) {

        app.classList.add("hidden");

    }


    if (auth) {

        auth.classList.remove("hidden");

    }


    showLogin();

}


/* =========================================================
   LOAD SAVED USER
   ========================================================= */

function loadExistingUser() {

    const saved =
        localStorage.getItem(
            "stillHereCurrentUser"
        );


    if (saved) {

        currentUser = saved;

        openApp();

    }

}


/* =========================================================
   LOGIN / ACCOUNT SCREENS
   ========================================================= */

function showCreateAccount() {

    const login =
        document.getElementById("loginForm");

    const create =
        document.getElementById("createAccountForm");


    if (login) {

        login.classList.add("hidden");

    }


    if (create) {

        create.classList.remove("hidden");

    }

}


function showLogin() {

    const login =
        document.getElementById("loginForm");

    const create =
        document.getElementById("createAccountForm");


    if (create) {

        create.classList.add("hidden");

    }


    if (login) {

        login.classList.remove("hidden");

    }

}


/* =========================================================
   ACCOUNT UI
   ========================================================= */

function updateAccountUI() {

    const welcome =
        document.getElementById(
            "welcomeUsername"
        );

    const settings =
        document.getElementById(
            "settingsUsername"
        );


    if (welcome) {

        welcome.textContent =
            currentUser || "Guest";

    }


    if (settings) {

        settings.textContent =
            currentUser || "Guest";

    }

}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function (page) {

        page.classList.add("hidden");

    });


    const page =
        document.getElementById(pageId);


    if (page) {

        page.classList.remove("hidden");

    }


    if (pageId === "journalPage") {

        loadJournalEntries();

    }


    if (pageId === "historyPage") {

        loadHistory();

    }


    if (pageId === "settingsPage") {

        loadNotificationSettings();

    }

}


/* =========================================================
   CHECK-IN FLOW
   STEP 1 — FEELING
   ========================================================= */

function selectFeeling(feeling) {

    currentFeeling = feeling;

    currentIntensity = null;
    currentSituation = null;
    currentNote = "";
    currentFaith = null;
    currentSupport = null;


    const checkIn =
        document.getElementById(
            "checkInSection"
        );

    const details =
        document.getElementById(
            "moodDetailsSection"
        );

    const faith =
        document.getElementById(
            "faithSection"
        );

    const support =
        document.getElementById(
            "supportChoiceSection"
        );

    const response =
        document.getElementById(
            "responseSection"
        );


    if (checkIn) {

        checkIn.classList.add("hidden");

    }


    if (details) {

        details.classList.add("hidden");

    }


    if (support) {

        support.classList.add("hidden");

    }


    if (response) {

        response.classList.add("hidden");

    }


    /*
       IMPORTANT:

       FEELING ALWAYS GOES TO FAITH FIRST.
    */

    if (faith) {

        faith.classList.remove("hidden");

    }

}


/* =========================================================
   CHECK-IN FLOW
   STEP 2 — FAITH
   ========================================================= */

function selectFaith(faith) {

    currentFaith = faith;


    const faithSection =
        document.getElementById(
            "faithSection"
        );

    const details =
        document.getElementById(
            "moodDetailsSection"
        );

    const support =
        document.getElementById(
            "supportChoiceSection"
        );

    const response =
        document.getElementById(
            "responseSection"
        );


    if (faithSection) {

        faithSection.classList.add(
            "hidden"
        );

    }


    if (support) {

        support.classList.add(
            "hidden"
        );

    }


    if (response) {

        response.classList.add(
            "hidden"
        );

    }


    /*
       FAITH → INTENSITY / SITUATION
    */

    if (details) {

        details.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   CHECK-IN FLOW
   STEP 3 — INTENSITY
   ========================================================= */

function selectIntensity(number) {

    currentIntensity = number;


    const buttons =
        document.querySelectorAll(
            ".moodScale button"
        );


    buttons.forEach(function (button) {

        button.classList.remove(
            "selected"
        );

    });


    const selected =
        Array.from(buttons).find(
            button =>
                button.textContent.trim() ===
                String(number)
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );

    }

}


/* =========================================================
   CHECK-IN FLOW
   STEP 3 — SITUATION
   ========================================================= */

function selectSituation(situation) {

    currentSituation =
        situation;


    const buttons =
        document.querySelectorAll(
            ".situationOptions button"
        );


    buttons.forEach(function (button) {

        button.classList.remove(
            "selected"
        );

    });


    const selected =
        Array.from(buttons).find(
            button =>
                button.textContent
                    .toLowerCase()
                    .includes(
                        situation.toLowerCase()
                    )
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );

    }

}


/* =========================================================
   CHECK-IN FLOW
   STEP 4 — DETAILS → SUPPORT
   ========================================================= */

function continueCheckIn() {

    const note =
        document.getElementById(
            "checkInNote"
        );


    currentNote =
        note
            ? note.value.trim()
            : "";


    const details =
        document.getElementById(
            "moodDetailsSection"
        );

    const support =
        document.getElementById(
            "supportChoiceSection"
        );


    if (details) {

        details.classList.add(
            "hidden"
        );

    }


    /*
       IMPORTANT:

       Faith is ALREADY selected,
       so we do NOT return to faith.
    */

    if (support) {

        support.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   CHECK-IN FLOW
   STEP 5 — SUPPORT
   ========================================================= */

function chooseSupport(type) {

    currentSupport =
        type;


    saveCheckIn();


    const support =
        document.getElementById(
            "supportChoiceSection"
        );

    const response =
        document.getElementById(
            "responseSection"
        );


    if (support) {

        support.classList.add(
            "hidden"
        );

    }


    if (response) {

        response.classList.remove(
            "hidden"
        );

    }


    showResponse();

}


/* =========================================================
   GENERAL RESPONSES
   ========================================================= */

const generalResponses = {

    Good: {

        title:
            "I'm glad you're having a good moment. 🌱",

        message:
            "Take a moment to appreciate what's going well. Good moments matter too."

    },


    Okay: {

        title:
            "Okay is okay. 💙",

        message:
            "You don't have to feel amazing every day. Take things one step at a time."

    },


    Sad: {

        title:
            "I'm sorry things feel heavy right now. 🫂",

        message:
            "You don't have to handle difficult feelings completely alone. Consider talking with someone you trust."

    },


    Stressed: {

        title:
            "Take this one step at a time. 🌿",

        message:
            "You don't have to solve everything right now. Focus on what you can handle next."

    },


    Angry: {

        title:
            "Give yourself some space before reacting. 💙",

        message:
            "It's okay to acknowledge anger. You can choose what you do with it next."

    },


    Lonely: {

        title:
            "You deserve connection. 🫂",

        message:
            "Consider reaching out to someone you trust, even if it's just to say you could use some company."

    },


    Anxious: {

        title:
            "Slow the moment down. 🌿",

        message:
            "Take a breath and focus on what you can handle right now."

    },


    Overwhelmed: {

        title:
            "You don't have to carry everything at once. 🌊",

        message:
            "Pick one small thing to focus on. The rest can wait."

    },


    Numb: {

        title:
            "You don't have to force yourself to feel okay. 💙",

        message:
            "Be patient with yourself and stay connected with people who care about you."

    },


    Confused: {

        title:
            "You don't need every answer right now. 🌱",

        message:
            "Take things one decision at a time."

    },


    Exhausted: {

        title:
            "Rest matters. 😴",

        message:
            "Give yourself permission to slow down and take care of yourself."

    },


    Excited: {

        title:
            "Enjoy that excitement! 🥳",

        message:
            "Good moments deserve to be noticed."

    },


    Grateful: {

        title:
            "Gratitude is worth noticing. 🙏",

        message:
            "Take a moment to appreciate one thing you're thankful for."

    },


    Hopeful: {

        title:
            "Hold onto that hope. 🌱",

        message:
            "Let that hope give you energy for the next step."

    }

};


/* =========================================================
   FAITH RESPONSES
   ========================================================= */

const faithResponses = {

    Christian: {

        Good: {
            encouragement:
                "“This is the day the Lord has made; let us rejoice and be glad in it.”",
            reference:
                "Psalm 118:24"
        },

        Okay: {
            encouragement:
                "“My grace is sufficient for you.”",
            reference:
                "2 Corinthians 12:9"
        },

        Sad: {
            encouragement:
                "“The Lord is close to the brokenhearted.”",
            reference:
                "Psalm 34:18"
        },

        Stressed: {
            encouragement:
                "“Cast all your anxiety on him because he cares for you.”",
            reference:
                "1 Peter 5:7"
        },

        Angry: {
            encouragement:
                "“Be quick to listen, slow to speak and slow to become angry.”",
            reference:
                "James 1:19"
        },

        Lonely: {
            encouragement:
                "“Two are better than one.”",
            reference:
                "Ecclesiastes 4:9"
        },

        Anxious: {
            encouragement:
                "“When anxiety was great within me, your consolation brought me joy.”",
            reference:
                "Psalm 94:19"
        },

        Overwhelmed: {
            encouragement:
                "“Come to me, all you who are weary and burdened, and I will give you rest.”",
            reference:
                "Matthew 11:28"
        },

        Numb: {
            encouragement:
                "“The Lord is close to the brokenhearted.”",
            reference:
                "Psalm 34:18"
        },

        Confused: {
            encouragement:
                "“If any of you lacks wisdom, you should ask God.”",
            reference:
                "James 1:5"
        },

        Exhausted: {
            encouragement:
                "“He grants sleep to those he loves.”",
            reference:
                "Psalm 127:2"
        },

        Excited: {
            encouragement:
                "“A cheerful heart is good medicine.”",
            reference:
                "Proverbs 17:22"
        },

        Grateful: {
            encouragement:
                "“Give thanks in all circumstances.”",
            reference:
                "1 Thessalonians 5:18"
        },

        Hopeful: {
            encouragement:
                "“May the God of hope fill you with all joy and peace.”",
            reference:
                "Romans 15:13"
        }

    },


    Muslim: {

        Good: {
            encouragement:
                "Remembering Allah can bring peace to the heart.",
            reference:
                "Qur'an 13:28"
        },

        Okay: {
            encouragement:
                "Allah does not burden a soul beyond what it can bear.",
            reference:
                "Qur'an 2:286"
        },

        Sad: {
            encouragement:
                "Indeed, with hardship comes ease.",
            reference:
                "Qur'an 94:5"
        },

        Stressed: {
            encouragement:
                "Remembering Allah can bring peace to the heart.",
            reference:
                "Qur'an 13:28"
        },

        Lonely: {
            encouragement:
                "Believers are described as brothers and sisters to one another.",
            reference:
                "Qur'an 49:10"
        },

        Anxious: {
            encouragement:
                "Remembering Allah can bring peace to the heart.",
            reference:
                "Qur'an 13:28"
        },

        Overwhelmed: {
            encouragement:
                "Allah does not burden a soul beyond what it can bear.",
            reference:
                "Qur'an 2:286"
        },

        Hopeful: {
            encouragement:
                "Indeed, with hardship comes ease.",
            reference:
                "Qur'an 94:5"
        }

    },


    Jewish: {

        Good: {
            encouragement:
                "Take a moment to recognize and give thanks for the good in your life.",
            reference:
                "Jewish tradition of gratitude"
        },

        Okay: {
            encouragement:
                "You can give yourself room for reflection and connection.",
            reference:
                "Jewish tradition of reflection"
        },

        Sad: {
            encouragement:
                "You don't have to carry difficult feelings completely alone.",
            reference:
                "Jewish tradition of community and prayer"
        },

        Stressed: {
            encouragement:
                "Make space for rest, reflection, and connection.",
            reference:
                "Jewish tradition of Shabbat and rest"
        },

        Lonely: {
            encouragement:
                "Community and connection can provide important support.",
            reference:
                "Jewish tradition of community"
        },

        Hopeful: {
            encouragement:
                "Hope and repair are important themes throughout Jewish tradition.",
            reference:
                "Jewish tradition"
        }

    },


    Hindu: {

        Good: {
            encouragement:
                "Take a moment for gratitude and reflection.",
            reference:
                "Hindu traditions of gratitude and reflection"
        },

        Okay: {
            encouragement:
                "Give yourself a quiet moment for reflection and compassion.",
            reference:
                "Hindu traditions of reflection"
        },

        Sad: {
            encouragement:
                "Make space for compassion toward yourself and connection with others.",
            reference:
                "Hindu traditions of compassion"
        },

        Stressed: {
            encouragement:
                "A quiet moment of breathing, reflection, prayer, or meditation may help you regain some calm.",
            reference:
                "Hindu traditions of meditation"
        },

        Lonely: {
            encouragement:
                "Compassion and connection can help during difficult moments.",
            reference:
                "Hindu traditions of compassion"
        },

        Hopeful: {
            encouragement:
                "Use reflection and compassion to stay grounded as you move forward.",
            reference:
                "Hindu traditions of reflection"
        }

    }

};


/* =========================================================
   SHOW FINAL RESPONSE
   ========================================================= */

function showResponse() {

    const title =
        document.getElementById(
            "responseTitle"
        );

    const message =
        document.getElementById(
            "responseMessage"
        );

    const verseCard =
        document.getElementById(
            "verseCard"
        );

    const verseText =
        document.getElementById(
            "verseText"
        );

    const verseReference =
        document.getElementById(
            "verseReference"
        );


    if (!title || !message || !verseCard) {

        return;

    }


    const base =
        generalResponses[currentFeeling] ||
        {

            title:
                "Thanks for checking in. 💙",

            message:
                "Whatever you're feeling right now, you deserve support."

        };


    title.textContent =
        base.title;


    let finalMessage =
        base.message;


    if (
        currentIntensity &&
        currentIntensity >= 8
    ) {

        finalMessage +=
            " Since this feels especially strong right now, consider reaching out to someone you trust so you don't have to carry it alone.";

    }


    if (currentSituation) {

        finalMessage +=
            ` It sounds like ${currentSituation.toLowerCase()} may be part of what's weighing on you.`;

    }


    if (currentSupport === "write") {

        finalMessage +=
            " Writing some of this down may help you put words around what you're experiencing.";

    }


    if (currentSupport === "reach") {

        finalMessage +=
            " Reaching out to a trusted person can be a good next step.";

    }


    if (currentSupport === "talk") {

        finalMessage +=
            " You deserve to be heard, and talking with someone you trust can help.";

    }


    message.textContent =
        finalMessage;


    /*
       No religious content.
    */

    if (
        currentFaith === "None" ||
        currentFaith === "Other" ||
        currentFaith === "Unsure" ||
        !currentFaith
    ) {

        verseCard.classList.add(
            "hidden"
        );

        return;

    }


    const faith =
        faithResponses[currentFaith];


    if (!faith) {

        verseCard.classList.add(
            "hidden"
        );

        return;

    }


    const recommendation =
        faith[currentFeeling] ||
        faith.Okay;


    if (!recommendation) {

        verseCard.classList.add(
            "hidden"
        );

        return;

    }


    verseCard.classList.remove(
        "hidden"
    );


    verseText.textContent =
        recommendation.encouragement;


    verseReference.textContent =
        recommendation.reference;

}


/* =========================================================
   RESET CHECK-IN
   ========================================================= */

function resetCheckIn() {

    currentFeeling = null;
    currentIntensity = null;
    currentSituation = null;
    currentNote = "";
    currentFaith = null;
    currentSupport = null;


    const sections = [

        "checkInSection",
        "moodDetailsSection",
        "faithSection",
        "supportChoiceSection",
        "responseSection"

    ];


    sections.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.classList.add(
                "hidden"
            );

        }

    });


    const checkIn =
        document.getElementById(
            "checkInSection"
        );


    if (checkIn) {

        checkIn.classList.remove(
            "hidden"
        );

    }


    const note =
        document.getElementById(
            "checkInNote"
        );


    if (note) {

        note.value = "";

    }


    document
        .querySelectorAll(".selected")
        .forEach(function (element) {

            element.classList.remove(
                "selected"
            );

        });

}


function goBack() {

    resetCheckIn();

}


/* =========================================================
   SAVE CHECK-IN
   ========================================================= */

function saveCheckIn() {

    const key =
        getUserStorageKey(
            "history"
        );


    const history =
        JSON.parse(
            localStorage.getItem(key) || "[]"
        );


    history.unshift({

        feeling:
            currentFeeling,

        intensity:
            currentIntensity,

        situation:
            currentSituation,

        note:
            currentNote,

        faith:
            currentFaith,

        support:
            currentSupport,

        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(

        key,

        JSON.stringify(
            history.slice(0, 100)
        )

    );

}


/* =========================================================
   HISTORY
   ========================================================= */

function loadHistory() {

    const container =
        document.getElementById(
            "historyEntries"
        );

    const summary =
        document.getElementById(
            "historySummary"
        );


    if (!container) {

        return;

    }


    const history =
        JSON.parse(
            localStorage.getItem(
                getUserStorageKey("history")
            ) || "[]"
        );


    container.innerHTML = "";


    if (summary) {

        summary.innerHTML =
            history.length
                ? `<p>You have ${history.length} saved check-in${history.length === 1 ? "" : "s"}.</p>`
                : "";

    }


    if (!history.length) {

        container.innerHTML = `

            <div class="historyEmpty">

                🌱

                <p>
                    No check-ins yet.
                    Your first one can start here.
                </p>

            </div>

        `;

        return;

    }


    history.forEach(function (entry) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "historyEntry";


        div.innerHTML = `

            <h3>
                ${escapeHTML(entry.feeling)}
            </h3>

            <p>
                <strong>Date:</strong>
                ${escapeHTML(entry.date)}
            </p>

            ${
                entry.intensity
                    ? `
                        <p>
                            <strong>Intensity:</strong>
                            ${entry.intensity}/10
                        </p>
                    `
                    : ""
            }

            ${
                entry.situation
                    ? `
                        <p>
                            <strong>Affecting you:</strong>
                            ${escapeHTML(entry.situation)}
                        </p>
                    `
                    : ""
            }

            ${
                entry.faith
                    ? `
                        <p>
                            <strong>Faith preference:</strong>
                            ${escapeHTML(entry.faith)}
                        </p>
                    `
                    : ""
            }

            ${
                entry.support
                    ? `
                        <p>
                            <strong>Support choice:</strong>
                            ${escapeHTML(entry.support)}
                        </p>
                    `
                    : ""
            }

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   CLEAR HISTORY
   ========================================================= */

function clearHistory() {

    if (
        !confirm(
            "Clear your check-in history?"
        )
    ) {

        return;

    }


    localStorage.removeItem(
        getUserStorageKey("history")
    );


    loadHistory();

}


/* =========================================================
   JOURNAL
   ========================================================= */

function saveJournalEntry() {

    const input =
        document.getElementById(
            "journalInput"
        );


    if (!input) {

        return;

    }


    const text =
        input.value.trim();


    if (!text) {

        alert(
            "Write something first."
        );

        return;

    }


    const key =
        getUserStorageKey(
            "journal"
        );


    const entries =
        JSON.parse(
            localStorage.getItem(key) || "[]"
        );


    entries.unshift({

        text:
            text,

        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(

        key,

        JSON.stringify(
            entries.slice(0, 100)
        )

    );


    input.value = "";

    loadJournalEntries();

}


/* =========================================================
   LOAD JOURNAL
   ========================================================= */

function loadJournalEntries() {

    const container =
        document.getElementById(
            "journalEntries"
        );


    if (!container) {

        return;

    }


    const entries =
        JSON.parse(
            localStorage.getItem(
                getUserStorageKey("journal")
            ) || "[]"
        );


    container.innerHTML = "";


    if (!entries.length) {

        container.innerHTML = `

            <div class="historyEmpty">

                📝

                <p>
                    Your journal is empty.
                </p>

            </div>

        `;

        return;

    }


    entries.forEach(function (entry, index) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "journalEntry";


        div.innerHTML = `

            <h3>
                ${escapeHTML(entry.date)}
            </h3>

            <p>
                ${escapeHTML(entry.text)}
            </p>

            <button
                class="deleteEntryButton"
                onclick="deleteJournalEntry(${index})"
            >
                Delete
            </button>

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   DELETE JOURNAL ENTRY
   ========================================================= */

function deleteJournalEntry(index) {

    const key =
        getUserStorageKey(
            "journal"
        );


    const entries =
        JSON.parse(
            localStorage.getItem(key) || "[]"
        );


    entries.splice(
        index,
        1
    );


    localStorage.setItem(

        key,

        JSON.stringify(entries)

    );


    loadJournalEntries();

}


/* =========================================================
   JOURNAL PROMPTS
   ========================================================= */

function showJournalPrompt() {

    const prompts = [

        "What is something you wish someone understood about you?",

        "What made today a little easier?",

        "What are you looking forward to?",

        "What is something you need to give yourself permission to feel?",

        "Who are you thankful for?",

        "What is one small thing you can do for yourself today?",

        "What would you tell a friend who was feeling the way you feel right now?"

    ];


    const prompt =
        prompts[
            Math.floor(
                Math.random() *
                prompts.length
            )
        ];


    showPage(
        "journalPage"
    );


    const input =
        document.getElementById(
            "journalInput"
        );


    if (input) {

        input.placeholder =
            prompt;

        input.focus();

    }

}


/* =========================================================
   TOOLS
   ========================================================= */

function startCalmExercise() {

    const output =
        document.getElementById(
            "toolOutput"
        );


    if (!output) {

        return;

    }


    output.classList.remove(
        "hidden"
    );


    output.innerHTML = `

        <h3>🌿 Slow down for a moment</h3>

        <p>
            Sit somewhere comfortable.
        </p>

        <p>
            Take a slow breath in,
            then slowly breathe out.
        </p>

        <p>
            Notice a few things you can see,
            hear, and physically feel around you.
        </p>

        <p>
            You don't have to solve everything
            in this exact moment.
        </p>

    `;

}


function showReflectionPrompt() {

    const output =
        document.getElementById(
            "toolOutput"
        );


    if (!output) {

        return;

    }


    output.classList.remove(
        "hidden"
    );


    output.innerHTML = `

        <h3>💭 Reflection</h3>

        <p>
            What is one thing happening in your life
            that you wish you could talk about
            with someone you trust?
        </p>

    `;

}


function showFaithTool() {

    const output =
        document.getElementById(
            "toolOutput"
        );


    if (!output) {

        return;

    }


    output.classList.remove(
        "hidden"
    );


    output.innerHTML = `

        <h3>🙏 Faith & Reflection</h3>

        <p>
            Take a quiet moment to think about
            what gives you hope, meaning, or strength.
        </p>

        <p>
            If faith is important to you,
            consider connecting with someone
            from your faith community.
        </p>

    `;

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

async function requestNotifications() {

    if (!("Notification" in window)) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    const permission =
        await Notification.requestPermission();


    if (permission === "granted") {

        alert(
            "Notifications are enabled for this browser."
        );

    } else {

        alert(
            "Notifications were not enabled."
        );

    }

}


function saveNotificationSetting() {

    const daily =
        document.getElementById(
            "dailyReminderToggle"
        );

    const encouragement =
        document.getElementById(
            "encouragementToggle"
        );

    const time =
        document.getElementById(
            "notificationTime"
        );


    const settings = {

        daily:
            daily
                ? daily.checked
                : false,

        encouragement:
            encouragement
                ? encouragement.checked
                : false,

        time:
            time
                ? time.value
                : "19:00"

    };


    localStorage.setItem(

        getUserStorageKey(
            "notifications"
        ),

        JSON.stringify(
            settings
        )

    );

}


function loadNotificationSettings() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                getUserStorageKey(
                    "notifications"
                )
            ) || "{}"
        );


    const daily =
        document.getElementById(
            "dailyReminderToggle"
        );

    const encouragement =
        document.getElementById(
            "encouragementToggle"
        );

    const time =
        document.getElementById(
            "notificationTime"
        );


    if (daily) {

        daily.checked =
            Boolean(saved.daily);

    }


    if (encouragement) {

        encouragement.checked =
            Boolean(saved.encouragement);

    }


    if (time) {

        time.value =
            saved.time ||
            "19:00";

    }

}


/* =========================================================
   DARK MODE
   ========================================================= */

function toggleDarkMode() {

    document.body.classList.toggle(
        "darkMode"
    );


    localStorage.setItem(

        "stillHereDarkMode",

        document.body.classList.contains(
            "darkMode"
        )
            ? "true"
            : "false"

    );

}


function loadDarkMode() {

    if (
        localStorage.getItem(
            "stillHereDarkMode"
        ) === "true"
    ) {

        document.body.classList.add(
            "darkMode"
        );

    }

}


/* =========================================================
   DELETE LOCAL DATA
   ========================================================= */

function clearAllLocalData() {

    if (
        !confirm(
            "This will delete the Still Here data stored in this browser. Continue?"
        )
    ) {

        return;

    }


    const users =
        getUsers();


    if (
        currentUser &&
        currentUser !== "Guest"
    ) {

        delete users[
            currentUser.toLowerCase()
        ];

    }


    saveUsers(users);


    Object.keys(
        localStorage
    ).forEach(function (key) {

        if (
            key.startsWith("stillHere_")
        ) {

            localStorage.removeItem(
                key
            );

        }

    });


    localStorage.removeItem(
        "stillHereCurrentUser"
    );


    location.reload();

}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}