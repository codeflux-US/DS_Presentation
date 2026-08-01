const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzwGKfywGT0ytLrQ75EHnxLa8Yz-pCdoVKsUqCqZI1_xgWE4ZlE_vFT6jVaE3mLLoK-ZA/exec";


const sectionSelect = document.getElementById("section");
const teamSizeGroup = document.getElementById("teamSizeGroup");
const teamSizeSelect = document.getElementById("teamSize");
const membersContainer = document.getElementById("membersContainer");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("registrationForm");
const statusMessage = document.getElementById("statusMessage");


let isSubmitting = false;


const TEAM_SIZE_MAP = {
  Solo: 1,
  Five: 5,
  Ten: 10
};


sectionSelect.addEventListener("change", () => {
  if (sectionSelect.value) {
    teamSizeGroup.classList.remove("hidden");
  }
  
  teamSizeSelect.value = "";
  membersContainer.innerHTML = "";
  submitBtn.classList.add("hidden");
  hideStatus();
});


teamSizeSelect.addEventListener("change", () => {
  const count = TEAM_SIZE_MAP[teamSizeSelect.value];
  renderMemberFields(count);
  submitBtn.classList.toggle("hidden", !count);
  hideStatus();
});


function renderMemberFields(count) {
  membersContainer.innerHTML = "";

  if (!count) return;

  for (let i = 1; i <= count; i++) {
    const card = document.createElement("div");
    card.className = "member-card";

    const heading = count === 1 ? "Member Details" : `Member ${i}`;

    card.innerHTML = `
      <h4>${heading}</h4>
      <div class="member-fields">
        <div class="form-group" style="margin-bottom:0;">
          <label for="memberName${i}">Name <span class="required">*</span></label>
          <input type="text" id="memberName${i}" name="memberName${i}" placeholder="Enter full name" required />
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label for="memberRoll${i}">Roll Number <span class="required">*</span></label>
          <input type="text" id="memberRoll${i}" name="memberRoll${i}" placeholder="e.g. 101" required />
        </div>
      </div>
    `;

    membersContainer.appendChild(card);
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return; 

  hideStatus();

  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const section = sectionSelect.value;
  const teamSize = teamSizeSelect.value;
  const count = TEAM_SIZE_MAP[teamSize];

  const members = [];
  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`memberName${i}`).value.trim();
    const roll = document.getElementById(`memberRoll${i}`).value.trim();

    if (!name || !roll) {
      showStatus("Please fill in all member details.", "error");
      return;
    }
    members.push({ name, roll });
  }

  const payload = { section, teamSize, members };

  setSubmitting(true);

  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.result === "success") {
      showStatus("✅ Registration submitted successfully!", "success");
      form.reset();
      membersContainer.innerHTML = "";
      teamSizeGroup.classList.add("hidden");
      submitBtn.classList.add("hidden");
    } else {
      showStatus(result.message || "Something went wrong. Please try again.", "error");
    }
  } catch (err) {
    showStatus("Network error. Please check your connection and try again.", "error");
  } finally {
    setSubmitting(false);
  }
});

function setSubmitting(state) {
  isSubmitting = state;
  submitBtn.disabled = state;
  submitBtn.classList.toggle("loading", state);
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

function hideStatus() {
  statusMessage.className = "status-message hidden";
}
