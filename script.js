let selectedFeeling = "";
let selectedFaith = "";


// =========================
// EMOTION COLORS
// =========================

function changeEmotionColor(feeling) {

    const colors = {
        Good: "#fff7df",
        Okay: "#eaf4f0",
        Sad: "#e8f1f8",
        Stressed: "#e6f3f3",
        Angry: "#e8f2eb",
        Lonely: "#f0ebf7",
        Anxious: "#e9f1f6",
        Overwhelmed: "#e5f1f2",
        Numb: "#edf0f2",
        Confused: "#f0edf6",
        Exhausted: "#e9eef3",
        Excited: "#fff4df",
        Grateful: "#edf4e9",
        Hopeful: "#e8f3ea"
    };

    document.body.style.background =
        colors[feeling] || "#eaf4f0";
}


// =========================
// NAVIGATION
// =========================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.add("hidden");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.remove("hidden");
    }
}


// =========================
// FEELING
// =========================

function selectFeeling(feeling) {

    selectedFeeling = feeling;

    changeEmotionColor(feeling);

    document
        .getElementById("checkInSection")
        .classList.add("hidden");

    document
        .getElementById("faithSection")
        .classList.remove("hidden");
}


// =========================
// FAITH
// =========================

function selectFaith(faith) {

    selectedFaith = faith;

    document
        .getElementById("faithSection")
        .classList.add("hidden");

    document
        .getElementById("supportChoiceSection")
        .classList.remove("hidden");
}


// =========================
// SUPPORT CHOICE
// =========================

function chooseSupport(choice) {

    document
        .getElementById("supportChoiceSection")
        .classList.add("hidden");


    // TALK

    if (choice === "talk") {

        document
            .getElementById("responseSection")
            .classList.remove("hidden");

        document
            .getElementById("responseTitle")
            .textContent =
            "You don't have to keep everything inside.";

        document
            .getElementById("responseMessage")
            .textContent =
            "Consider talking with someone you trust about what you're going through. You can also use your journal if writing feels easier.";

        document
            .getElementById("verseCard")
            .classList.add("hidden");

        return;
    }


    // WRITE

    if (choice === "write") {

        showPage("journalPage");

        const journalInput =
            document.getElementById("journalInput");

        if (journalInput) {
            journalInput.focus();
        }

        return;
    }


    // REACH SOMEONE

    if (choice === "reach") {

        showPage("supportPage");

        return;
    }


    // FAITH

    if (choice === "faith") {

        showFaithResponse();

        return;
    }
}


// =========================
// FAITH RESPONSE
// =========================

function showFaithResponse() {

    const responseSection =
        document.getElementById("responseSection");

    const responseTitle =
        document.getElementById("responseTitle");

    const responseMessage =
        document.getElementById("responseMessage");

    const verseCard =
        document.getElementById("verseCard");

    const verseText =
        document.getElementById("verseText");

    const verseReference =
        document.getElementById("verseReference");


    responseSection.classList.remove("hidden");

    responseTitle.textContent =
        "A little encouragement for you";


    const selectedResponse =
        responses[selectedFaith]?.[selectedFeeling];


    if (selectedResponse) {

        responseMessage.textContent =
            selectedResponse.message;


        if (
            selectedResponse.verse &&
            selectedResponse.reference
        ) {

            verseText.textContent =
                selectedResponse.verse;

            verseReference.textContent =
                selectedResponse.reference;

            verseCard.classList.remove("hidden");

        } else {

            verseCard.classList.add("hidden");
        }

    } else {

        responseMessage.textContent =
            "Whatever you're feeling today, you deserve kindness and support.";

        verseCard.classList.add("hidden");
    }
}


// =========================
// BACK
// =========================

function goBack() {

    document
        .getElementById("faithSection")
        .classList.add("hidden");

    document
        .getElementById("supportChoiceSection")
        .classList.add("hidden");

    document
        .getElementById("responseSection")
        .classList.add("hidden");

    document
        .getElementById("checkInSection")
        .classList.remove("hidden");

    selectedFeeling = "";
    selectedFaith = "";
}


// =========================
// JOURNAL
// =========================

let journalEntries =
    JSON.parse(
        localStorage.getItem("stillHereJournal")
    ) || [];


// =========================
// SAVE JOURNAL ENTRY
// =========================

function saveJournalEntry() {

    const input =
        document.getElementById("journalInput");

    const text =
        input.value.trim();


    if (text === "") {
        return;
    }


    const now = new Date();


    journalEntries.unshift({

        text: text,

        date: now.toLocaleDateString(),

        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })

    });


    localStorage.setItem(
        "stillHereJournal",
        JSON.stringify(journalEntries)
    );


    input.value = "";

    displayJournalEntries();
}


// =========================
// DISPLAY JOURNAL ENTRIES
// =========================

function displayJournalEntries() {

    const container =
        document.getElementById("journalEntries");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    journalEntries.forEach(function(entry, index) {

        const box =
            document.createElement("div");

        box.className =
            "journalEntry";


        const dateTitle =
            document.createElement("h3");

        dateTitle.textContent =
            entry.date +
            (entry.time ? " • " + entry.time : "");


        const text =
            document.createElement("p");

        text.textContent =
            entry.text;


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "deleteEntryButton";

        deleteButton.textContent =
            "🗑️ Delete";


        deleteButton.onclick =
            function() {

                deleteJournalEntry(index);

            };


        box.appendChild(dateTitle);

        box.appendChild(text);

        box.appendChild(deleteButton);


        container.appendChild(box);

    });
}


// =========================
// DELETE JOURNAL ENTRY
// =========================

function deleteJournalEntry(index) {

    journalEntries.splice(index, 1);


    localStorage.setItem(
        "stillHereJournal",
        JSON.stringify(journalEntries)
    );


    displayJournalEntries();
}


// =========================
// LOAD JOURNAL
// =========================

displayJournalEntries();