const SHEETDB_URL = "https://sheetdb.io/api/v1/9nfdvpa2aypak";

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

  const memberStrings = [];
  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`memberName${i}`).value.trim();
    const roll = document.getElementById(`memberRoll${i}`).value.trim();

    if (!name || !roll) {
      showStatus("Please fill in all member details.", "error");
      return;
    }
    memberStrings.push(`${name} (${roll})`);
  }

  const now = new Date();
  const timestamp = formatTimestamp(now);

  const payload = {
    data: {
      "Timestamp": timestamp,
      "Section": section,
      "Team Size": teamSize,
      "Group Members": memberStrings.join(", ")
    }
  };

  setSubmitting(true);

  try {
    const response = await fetch(SHEETDB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      showStatus("✅ Registration submitted successfully!", "success");
      form.reset();
      membersContainer.innerHTML = "";
      teamSizeGroup.classList.add("hidden");
      submitBtn.classList.add("hidden");
    } else {
      const errData = await response.json().catch(() => ({}));
      showStatus(errData.message || "Something went wrong. Please try again.", "error");
    }
  } catch (err) {
    showStatus("Network error. Please check your connection and try again.", "error");
  } finally {
    setSubmitting(false);
  }
});

function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}-${month}-${year} ${pad(hours)}:${minutes} ${ampm}`;
}

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
