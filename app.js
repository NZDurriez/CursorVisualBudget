// ============================================================
// BUDGET DASHBOARD - MINIMAL VERSION
// ============================================================

const STORAGE_KEY = "budgetDashboard";

let budget = {
    income: [],
    payments: [],
    oneOffPayments: [],
    savingsGoals: [],
    settings: {
        schedule: "Fortnightly",
        anchorDate: ""
    }
};

let profiles = [];

let activeProfileId = null;

let editingType = null;
let editingId = null;
let editingSavingsGoalId = null;
let editingProfileId = null;
let payCalcPeriod = "weekly";

let calendarDate = new Date();


// ============================================================
// DOM ELEMENTS
// ============================================================

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");

const pageTitle = document.getElementById("pageTitle");
const currentDate = document.getElementById("currentDate");

const monthlyIncome = document.getElementById("monthlyIncome");
const monthlyPayments = document.getElementById("monthlyPayments");
const remainingIncome = document.getElementById("remainingIncome");
const nextIncome = document.getElementById("nextIncome");

const incomePeriodLabel =
    document.getElementById("incomePeriodLabel");

const paymentsPeriodLabel =
    document.getElementById("paymentsPeriodLabel");
	
const upcomingPayments =
    document.getElementById("upcomingPayments");

const currentBudgetPeriod =
    document.getElementById("currentBudgetPeriod");

const budgetPeriodBox =
    document.getElementById("budgetPeriodBox");
	
const incomeTable =
    document.getElementById("incomeTable");

const paymentTable =
    document.getElementById("paymentTable");

const paymentsSort =
    document.getElementById("paymentsSort");

const addIncomeBtn =
    document.getElementById("addIncomeBtn");

const addPaymentBtn =
    document.getElementById("addPaymentBtn");

const addOneOffBtn =
    document.getElementById("addOneOffBtn");

const oneOffTable =
    document.getElementById("oneOffTable");

const addSavingsGoalBtn =
    document.getElementById("addSavingsGoalBtn");

const cancelSavingsGoalBtn =
    document.getElementById("cancelSavingsGoalBtn");

const savingsGoalFormCard =
    document.getElementById("savingsGoalFormCard");

const savingsGoalForm =
    document.getElementById("savingsGoalForm");

const savingsGoalFormTitle =
    document.getElementById("savingsGoalFormTitle");

const savingsGoalName =
    document.getElementById("savingsGoalName");

const savingsGoalAmount =
    document.getElementById("savingsGoalAmount");

const savingsGoalDate =
    document.getElementById("savingsGoalDate");

const savingsGoalIncludeInBudget =
    document.getElementById("savingsGoalIncludeInBudget");

const savingsPreviewWeeks =
    document.getElementById("savingsPreviewWeeks");

const savingsPreviewWeekly =
    document.getElementById("savingsPreviewWeekly");

const savingsPreviewFortnightly =
    document.getElementById("savingsPreviewFortnightly");

const savingsGoalsEmpty =
    document.getElementById("savingsGoalsEmpty");

const savingsGoalsList =
    document.getElementById("savingsGoalsList");

const payHourlyRate =
    document.getElementById("payHourlyRate");

const payHoursPerWeek =
    document.getElementById("payHoursPerWeek");

const payStudentLoan =
    document.getElementById("payStudentLoan");

const payKiwiSaver =
    document.getElementById("payKiwiSaver");

const payKiwiSaverOptions =
    document.getElementById("payKiwiSaverOptions");

const payKiwiSaverRate =
    document.getElementById("payKiwiSaverRate");

const payShowEmployerKiwisaver =
    document.getElementById("payShowEmployerKiwisaver");

const payNetLabel =
    document.getElementById("payNetLabel");

const payNetAmount =
    document.getElementById("payNetAmount");

const payGrossAmount =
    document.getElementById("payGrossAmount");

const payIncomeTaxAmount =
    document.getElementById("payIncomeTaxAmount");

const payAccAmount =
    document.getElementById("payAccAmount");

const payStudentLoanRow =
    document.getElementById("payStudentLoanRow");

const payStudentLoanAmount =
    document.getElementById("payStudentLoanAmount");

const payKiwiSaverRow =
    document.getElementById("payKiwiSaverRow");

const payKiwiSaverLabel =
    document.getElementById("payKiwiSaverLabel");

const payKiwiSaverAmount =
    document.getElementById("payKiwiSaverAmount");

const payDeductionsAmount =
    document.getElementById("payDeductionsAmount");

const payEmployerKiwisaverBox =
    document.getElementById("payEmployerKiwisaverBox");

const payEmployerKiwisaverAmount =
    document.getElementById("payEmployerKiwisaverAmount");

const payEffectiveRate =
    document.getElementById("payEffectiveRate");

const payNetHourly =
    document.getElementById("payNetHourly");
	
const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const itemForm =
    document.getElementById("itemForm");

const itemName =
    document.getElementById("itemName");

const itemAmount =
    document.getElementById("itemAmount");

const itemFrequency =
    document.getElementById("itemFrequency");

const frequencyGroup =
    document.getElementById("frequencyGroup");
	
const itemDate =
    document.getElementById("itemDate");

const itemDateLabel =
    document.getElementById("itemDateLabel");
	
const cancelBtn =
    document.getElementById("cancelBtn");

const deleteItemBtn =
    document.getElementById("deleteItemBtn");
	
const calendarGrid =
    document.getElementById("calendarGrid");

const calendarMonth =
    document.getElementById("calendarMonth");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const budgetSchedule =
    document.getElementById("budgetSchedule");

const budgetAnchorDate =
    document.getElementById("budgetAnchorDate");

const budgetScheduleContainer =
    budgetSchedule?.closest(".schedule-selector");

const budgetAnchorDateContainer =
    budgetAnchorDate?.closest(".schedule-selector");
	
const profileSelector =
    document.getElementById("profileSelector");	
	
const manageProfilesBtn =
    document.getElementById("manageProfilesBtn");

const profileModal =
    document.getElementById("profileModal");

const profileList =
    document.getElementById("profileList");

const createProfileBtn =
    document.getElementById("createProfileBtn");

const closeProfileModalBtn =
    document.getElementById("closeProfileModalBtn");

const profileManagerView =
    document.getElementById("profileManagerView");

const profileCreateView =
    document.getElementById("profileCreateView");

const profileFormTitle =
    document.getElementById("profileFormTitle");

const profileSubmitBtn =
    document.getElementById("profileSubmitBtn");

const profileForm =
    document.getElementById("profileForm");

const profileName =
    document.getElementById("profileName");

const profilePaydayYes =
    document.getElementById("profilePaydayYes");

const profilePaydayNo =
    document.getElementById("profilePaydayNo");

const profilePaydaySettings =
    document.getElementById("profilePaydaySettings");

const profileSchedule =
    document.getElementById("profileSchedule");

const profileAnchorDate =
    document.getElementById("profileAnchorDate");

const cancelCreateProfileBtn =
    document.getElementById("cancelCreateProfileBtn");
	
const calendarAddMenu =
    document.getElementById("calendarAddMenu");

const calendarAddDate =
    document.getElementById("calendarAddDate");

const calendarAddIncome =
    document.getElementById("calendarAddIncome");

const calendarAddPayment =
    document.getElementById("calendarAddPayment");

const calendarAddOneOff =
    document.getElementById("calendarAddOneOff");

const calendarAddCancel =
    document.getElementById("calendarAddCancel");


// ============================================================
// STARTUP
// ============================================================

function startApp() {

    console.log("START APP 1");

    loadData();

    console.log("START APP 2");

    setupEvents();

    console.log("START APP 3");

	setupTheme();
	
    updateRecurringDates();

    console.log("START APP 4");

    updateCurrentDate();

    console.log("START APP 5");

    updateScheduleSelector();

    console.log("START APP 6");

    renderProfiles();

    console.log("START APP 7");

    renderAll();

    console.log("START APP 8");

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
} else {
    startApp();
}


// ============================================================
// EVENTS
// ============================================================

function setupEvents() {

    // Navigation
    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            showPage(button.dataset.page);

        });

    });

    // Add Income
    if (addIncomeBtn) {

        addIncomeBtn.addEventListener("click", () => {

            openModal("income");

        });

    }

    // Add Payment
    if (addPaymentBtn) {

        addPaymentBtn.addEventListener("click", () => {

            openModal("payment");

        });

    }

    // Payments sort
    if (paymentsSort) {

        paymentsSort.addEventListener(
            "change",
            () => {

                setPaymentsSortMode(
                    paymentsSort.value
                );

                renderPayments();

            }
        );

    }

	// Add One-Off Payment
	if (addOneOffBtn) {

		addOneOffBtn.addEventListener("click", () => {

			openModal("oneoff");

		});

	}

    // Savings Calculator
    if (addSavingsGoalBtn) {

        addSavingsGoalBtn.addEventListener(
            "click",
            () => {

                openSavingsGoalForm();

            }
        );

    }

    if (cancelSavingsGoalBtn) {

        cancelSavingsGoalBtn.addEventListener(
            "click",
            () => {

                closeSavingsGoalForm();

            }
        );

    }

    if (savingsGoalForm) {

        savingsGoalForm.addEventListener(
            "submit",
            saveSavingsGoal
        );

    }

    [
        savingsGoalAmount,
        savingsGoalDate
    ].forEach(input => {

        if (!input) {

            return;

        }

        input.addEventListener(
            "input",
            updateSavingsGoalPreview
        );

    });

    setupPayCalculatorEvents();
	
	// Budget Schedule
	if (budgetSchedule) {

		budgetSchedule.addEventListener(
        "change",
        () => {

            budget.settings.schedule =
                budgetSchedule.value;

            saveData();

            renderAll();

        }
    );

}

// Budget Anchor Date
if (budgetAnchorDate) {

    budgetAnchorDate.addEventListener(
        "change",
        () => {

            budget.settings.anchorDate =
                budgetAnchorDate.value;

            saveData();

            renderAll();

        }
    );

}

// Current Budget Period → set next pay day
if (budgetPeriodBox) {

    budgetPeriodBox.addEventListener(
        "click",
        () => {

            if (
                !budgetPeriodBox.classList.contains(
                    "is-actionable"
                )
            ) {

                return;

            }

            openNextPayDayPicker();

        }
    );

    budgetPeriodBox.addEventListener(
        "keydown",
        (event) => {

            if (
                !budgetPeriodBox.classList.contains(
                    "is-actionable"
                )
            ) {

                return;

            }

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openNextPayDayPicker();

            }

        }
    );

}

    // Save form
    if (itemForm) {

        itemForm.addEventListener(
            "submit",
            saveItem
        );

    }

    // Cancel
    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeModal
        );

    }

    // Calendar previous
    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            () => {

                calendarDate.setMonth(
                    calendarDate.getMonth() - 1
                );

                renderCalendar();

            }
        );

    }

    // Calendar next
    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            () => {

                calendarDate.setMonth(
                    calendarDate.getMonth() + 1
                );

                renderCalendar();

            }
        );

    }

// Delete item from modal
if (deleteItemBtn) {

    deleteItemBtn.addEventListener(
        "click",
        () => {

            if (
                !editingType ||
                !editingId
            ) {

                return;

            }

            const confirmed =
                confirm(
                    "Are you sure you want to delete this item?"
                );

            if (!confirmed) {

                return;

            }

            const type =
                editingType;

            const id =
                editingId;

            closeModal();

            deleteItem(
                type,
                id
            );

        }
    );

}


// ========================================================
// PROFILE
// ========================================================

if (profileSelector) {

    profileSelector.addEventListener(
        "change",
        () => {

            switchProfile(
                profileSelector.value
            );

        }
    );

}

if (manageProfilesBtn) {

    manageProfilesBtn.addEventListener(
        "click",
        openProfileManager
    );

}

if (createProfileBtn) {

    createProfileBtn.addEventListener(
        "click",
        openCreateProfileForm
    );

}

if (profileForm) {

	profileForm.addEventListener(
		"submit",
		saveProfile
	);

}

if (profilePaydayYes) {

    profilePaydayYes.addEventListener(
        "click",
        () => {

            profilePaydayYes.classList.add("active");

            profilePaydayNo.classList.remove("active");

            profilePaydaySettings.style.display = "";

        }
    );

}

if (profilePaydayNo) {

    profilePaydayNo.addEventListener(
        "click",
        () => {

            profilePaydayNo.classList.add("active");

            profilePaydayYes.classList.remove("active");

            profilePaydaySettings.style.display = "none";

        }
    );

}

if (cancelCreateProfileBtn) {

    cancelCreateProfileBtn.addEventListener(
        "click",
        () => {

            showProfileManagerView();

        }
    );

}

if (closeProfileModalBtn) {

    closeProfileModalBtn.addEventListener(
        "click",
        closeProfileManager
    );

}

if (profileModal) {

    profileModal.addEventListener(
        "click",
        event => {

            if (event.target === profileModal) {

                closeProfileManager();

            }

        }
    );

}

    // Close modal when clicking outside
    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {

                    closeModal();

                }

            }
        );

    }

}


// ============================================================
// SWITCH PROFILE
// ============================================================

function switchProfile(profileId) {

    const selectedProfile =
        profiles.find(
            profile =>
                profile.id === profileId
        );

    if (!selectedProfile) {

        console.error(
            "Could not find profile:",
            profileId
        );

        return;

    }

    activeProfileId =
        selectedProfile.id;

    budget =
        selectedProfile.budget;

    updateScheduleSelector();

    updateRecurringDates();

    renderProfiles();

    renderAll();

    saveData();

    console.log(
        "Switched to profile:",
        selectedProfile.name
    );

}	

// ============================================================
// STORAGE
// ============================================================

function saveData() {

    const storageData = {
        activeProfileId: activeProfileId,
        profiles: profiles
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storageData)
    );

}

function loadData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);


    // ========================================================
    // NO SAVED DATA
    // ========================================================

    if (!saved) {

        const newProfile = {

            id: generateId(),

            name: "My Budget",

            budget: {

                income: [],

                payments: [],

                oneOffPayments: [],

                savingsGoals: [],

                settings: {

				useBudgetPeriod: true,

				schedule: "Fortnightly",

				anchorDate: ""

			}

            }

        };


        profiles = [newProfile];

        activeProfileId =
            newProfile.id;

        budget =
            newProfile.budget;

        saveData();

        return;

    }


    // ========================================================
    // LOAD SAVED DATA
    // ========================================================

    try {

        const data =
            JSON.parse(saved);


        // ====================================================
        // NEW PROFILE FORMAT
        // ====================================================

        if (
            Array.isArray(data.profiles)
        ) {

            profiles =
                data.profiles;


            activeProfileId =
                data.activeProfileId;


            // Make sure there is always at least
            // one profile

            if (profiles.length === 0) {

                const newProfile = {

                    id: generateId(),

                    name: "My Budget",

                    budget: {

                        income: [],

                        payments: [],

                        oneOffPayments: [],

                        savingsGoals: [],

                        settings: {

                            schedule:
                                "Fortnightly",

                            anchorDate: ""

                        }

                    }

                };


                profiles.push(
                    newProfile
                );

                activeProfileId =
                    newProfile.id;

            }


            // Make sure active profile exists

            let activeProfile =
                profiles.find(
                    profile =>
                        profile.id ===
                        activeProfileId
                );


            if (!activeProfile) {

                activeProfile =
                    profiles[0];

                activeProfileId =
                    activeProfile.id;

            }


            budget =
                activeProfile.budget;


            // Safety checks

            if (!Array.isArray(budget.income)) {

                budget.income = [];

            }


            if (!Array.isArray(budget.payments)) {

                budget.payments = [];

            }


            if (
                !Array.isArray(
                    budget.oneOffPayments
                )
            ) {

                budget.oneOffPayments = [];

            }


            if (
                !Array.isArray(
                    budget.savingsGoals
                )
            ) {

                budget.savingsGoals = [];

            }


            if (!budget.settings) {

                budget.settings = {};

            }

			if (
				typeof budget.settings.useBudgetPeriod !== "boolean"
			) {

				budget.settings.useBudgetPeriod =
					!!budget.settings.anchorDate;

			}

            if (!budget.settings.schedule) {

                budget.settings.schedule =
                    "Fortnightly";

            }


            if (!budget.settings.anchorDate) {

                budget.settings.anchorDate =
                    "";

            }


            if (!budget.settings.paymentsSort) {

                budget.settings.paymentsSort =
                    "custom";

            }


            return;

        }


        // ====================================================
        // OLD FORMAT
        // ====================================================
        //
        // This is the important migration section.
        //
        // Your current budget is stored directly as:
        //
        // {
        //     income: [],
        //     payments: [],
        //     oneOffPayments: [],
        //     settings: {}
        // }
        //
        // We automatically turn that into
        // the first profile.
        // ====================================================

        const migratedBudget = {

            income:
                Array.isArray(data.income)
                    ? data.income
                    : [],

            payments:
                Array.isArray(data.payments)
                    ? data.payments
                    : [],

            oneOffPayments:
                Array.isArray(
                    data.oneOffPayments
                )
                    ? data.oneOffPayments
                    : [],

            savingsGoals:
                Array.isArray(
                    data.savingsGoals
                )
                    ? data.savingsGoals
                    : [],

            settings: {

                schedule:
                    data.settings &&
                    data.settings.schedule
                        ? data.settings.schedule
                        : "Fortnightly",

                anchorDate:
                    data.settings &&
                    data.settings.anchorDate
                        ? data.settings.anchorDate
                        : ""

            }

        };


        const newProfile = {

            id: generateId(),

            name: "My Budget",

            budget:
                migratedBudget

        };


        profiles = [
            newProfile
        ];


        activeProfileId =
            newProfile.id;


        budget =
            newProfile.budget;


        saveData();


        console.log(
            "Existing budget migrated to profile system."
        );


    } catch (error) {

        console.error(
            "Could not load saved budget data:",
            error
        );


        const newProfile = {

            id: generateId(),

            name: "My Budget",

            budget: {

                income: [],

                payments: [],

                oneOffPayments: [],

                savingsGoals: [],

                settings: {

                    schedule:
                        "Fortnightly",

                    anchorDate:
                        ""

                }

            }

        };


        profiles = [
            newProfile
        ];


        activeProfileId =
            newProfile.id;


        budget =
            newProfile.budget;

    }

}

function updateScheduleSelector() {

    const useBudgetPeriod =
        budget.settings &&
        budget.settings.useBudgetPeriod;


    // ========================================================
    // BUDGET SCHEDULE
    // Always available
    // ========================================================

    if (budgetScheduleContainer) {

        budgetScheduleContainer.style.display = "";

    }

    if (budgetSchedule) {

        budgetSchedule.value =
            budget.settings.schedule ||
            "Fortnightly";

    }


    // ========================================================
    // NEXT PAY DAY
    // Only available when payday is enabled
    // ========================================================

    if (useBudgetPeriod) {

        if (budgetAnchorDateContainer) {

            budgetAnchorDateContainer.style.display = "";

        }

        if (budgetAnchorDate) {

            budgetAnchorDate.value =
                budget.settings.anchorDate || "";

        }

    } else {

        if (budgetAnchorDateContainer) {

            budgetAnchorDateContainer.style.display = "none";

        }

    }

}

// ============================================================
// PROFILES
// ============================================================

function renderProfiles() {

    if (!profileSelector) {
        return;
    }

    profileSelector.innerHTML = "";

    profiles.forEach(profile => {

        const option =
            document.createElement("option");

        option.value =
            profile.id;

        option.textContent =
            profile.name;

        if (profile.id === activeProfileId) {

            option.selected = true;

        }

        profileSelector.appendChild(option);

    });

}

// ============================================================
// PROFILE MANAGEMENT
// ============================================================

function openProfileManager() {

    showProfileManagerView();

    renderProfileManager();

    profileModal.classList.remove("hidden");

}


function closeProfileManager() {

    editingProfileId = null;

    showProfileManagerView();

    profileModal.classList.add("hidden");

}


function showProfileManagerView() {

    editingProfileId = null;


    if (profileManagerView) {

        profileManagerView.classList.remove("hidden");

    }


    if (profileCreateView) {

        profileCreateView.classList.add("hidden");

    }

}


function showProfileFormView() {

    if (profileManagerView) {

        profileManagerView.classList.add("hidden");

    }


    if (profileCreateView) {

        profileCreateView.classList.remove("hidden");

    }

}


// ============================================================
// RENDER PROFILE MANAGEMENT LIST
// ============================================================

function renderProfileManager() {

    if (!profileList) {

        return;

    }

    profileList.innerHTML = "";

    profiles.forEach(profile => {

        const row =
            document.createElement("div");

        row.className =
            "profile-management-row";

        const isActive =
            profile.id === activeProfileId;

        row.innerHTML = `

            <div class="profile-management-name">

                <i class="fa-solid fa-user"></i>

                <span>
                    ${escapeHtml(profile.name)}
                </span>

                ${
                    isActive
                        ? `<small>Active</small>`
                        : ""
                }

            </div>

            <div class="profile-management-actions">

                <button
                    type="button"
                    class="action-btn edit-btn"
                    onclick="editProfile('${profile.id}')"
                    title="Edit">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    type="button"
                    class="action-btn delete-btn"
                    onclick="deleteProfile('${profile.id}')"
                    title="Delete">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

        profileList.appendChild(row);

    });

}


// ============================================================
// OPEN CREATE / EDIT PROFILE FORM
// ============================================================

function setProfilePaydayMode(useBudgetPeriod) {

    if (
        !profilePaydayYes ||
        !profilePaydayNo ||
        !profilePaydaySettings
    ) {

        return;

    }


    if (useBudgetPeriod) {

        profilePaydayYes.classList.add("active");

        profilePaydayNo.classList.remove("active");

        profilePaydaySettings.style.display = "";

    } else {

        profilePaydayNo.classList.add("active");

        profilePaydayYes.classList.remove("active");

        profilePaydaySettings.style.display = "none";

    }

}


function updateProfileFormMode(isEditing) {

    if (profileFormTitle) {

        profileFormTitle.textContent =
            isEditing
                ? "Edit Profile"
                : "Create New Profile";

    }


    if (profileSubmitBtn) {

        const icon =
            profileSubmitBtn.querySelector("i");

        const label =
            profileSubmitBtn.querySelector("span");


        if (icon) {

            icon.className =
                isEditing
                    ? "fa-solid fa-floppy-disk"
                    : "fa-solid fa-plus";

        }


        if (label) {

            label.textContent =
                isEditing
                    ? "Save Changes"
                    : "Create Profile";

        }

    }

}


function openCreateProfileForm() {

    editingProfileId = null;


    if (profileForm) {

        profileForm.reset();

    }


    setProfilePaydayMode(true);


    if (profileSchedule) {

        profileSchedule.value = "Fortnightly";

    }


    if (profileAnchorDate) {

        profileAnchorDate.value =
            getTodayString();

    }


    updateProfileFormMode(false);

    showProfileFormView();


    if (profileName) {

        profileName.focus();

    }

}


function editProfile(profileId) {

    const profile =
        profiles.find(
            entry => entry.id === profileId
        );


    if (!profile) {

        return;

    }


    editingProfileId = profileId;


    if (profileForm) {

        profileForm.reset();

    }


    if (profileName) {

        profileName.value =
            profile.name || "";

    }


    const settings =
        profile.budget &&
        profile.budget.settings
            ? profile.budget.settings
            : {};


    const useBudgetPeriod =
        typeof settings.useBudgetPeriod === "boolean"
            ? settings.useBudgetPeriod
            : !!settings.anchorDate;


    setProfilePaydayMode(useBudgetPeriod);


    if (profileSchedule) {

        profileSchedule.value =
            settings.schedule || "Fortnightly";

    }


    if (profileAnchorDate) {

        profileAnchorDate.value =
            settings.anchorDate ||
            getTodayString();

    }


    updateProfileFormMode(true);

    showProfileFormView();


    if (profileName) {

        profileName.focus();

        profileName.select();

    }

}


// Keep older name working if referenced elsewhere
function renameProfile(profileId) {

    editProfile(profileId);

}


// ============================================================
// CREATE PROFILE
// ============================================================


// ============================================================
// SAVE PROFILE
// ============================================================

function saveProfile(event) {

    event.preventDefault();

    const name =
        profileName.value.trim();

    const useBudgetPeriod =
		profilePaydayYes.classList.contains("active");

    let schedule = null;
    let anchorDate = null;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!name) {

        alert("Please enter a profile name.");

        profileName.focus();

        return;

    }


    // ========================================================
    // PAYDAY SETTINGS
    // ========================================================

    if (useBudgetPeriod) {

        schedule =
            profileSchedule.value;

        anchorDate =
            profileAnchorDate.value;


        if (!schedule) {

            alert("Please select a budget schedule.");

            return;

        }


        if (!anchorDate) {

            alert("Please select your next payday.");

            return;

        }

    }


    // ========================================================
    // EDIT EXISTING PROFILE
    // ========================================================

    if (editingProfileId) {

        const profile =
            profiles.find(
                entry =>
                    entry.id === editingProfileId
            );


        if (!profile) {

            alert(
                "Could not find the profile you're editing."
            );

            return;

        }


        if (!profile.budget) {

            profile.budget = {
                income: [],
                payments: [],
                oneOffPayments: [],
                savingsGoals: [],
                settings: {}
            };

        }


        if (!profile.budget.settings) {

            profile.budget.settings = {};

        }


        profile.name = name;

        profile.budget.settings.useBudgetPeriod =
            useBudgetPeriod;

        profile.budget.settings.schedule =
            useBudgetPeriod
                ? schedule
                : (
                    profile.budget.settings.schedule ||
                    "Fortnightly"
                );

        profile.budget.settings.anchorDate =
            useBudgetPeriod
                ? anchorDate
                : "";


        // If the edited profile is active, refresh
        // the live budget reference/settings UI
        if (profile.id === activeProfileId) {

            budget = profile.budget;

            updateScheduleSelector();

            updateRecurringDates();

            renderAll();

        }


        saveData();

        editingProfileId = null;

        renderProfiles();

        renderProfileManager();

        showProfileManagerView();


        console.log(
            "Updated profile:",
            name,
            profile
        );

        return;

    }


    // ========================================================
    // CREATE PROFILE
    // ========================================================

    const newProfile = {

        id:
            generateId(),

        name:
            name,

        budget: {

            income: [],

            payments: [],

            oneOffPayments: [],

            savingsGoals: [],

            settings: {

                useBudgetPeriod:
                    useBudgetPeriod,

                schedule:
                    schedule || "Fortnightly",

                anchorDate:
                    anchorDate || ""

            }

        }

    };


    profiles.push(newProfile);

    activeProfileId =
        newProfile.id;

    budget =
        newProfile.budget;


    // ========================================================
    // SAVE
    // ========================================================

    saveData();


    // ========================================================
    // REFRESH APP
    // ========================================================

    updateScheduleSelector();

    updateRecurringDates();

    renderProfiles();

    renderProfileManager();

    renderAll();


    // ========================================================
    // RETURN TO PROFILE LIST
    // ========================================================

    showProfileManagerView();


    console.log(
        "Created profile:",
        name,
        newProfile
    );

}


// ============================================================
// DELETE PROFILE
// ============================================================

function deleteProfile(profileId) {

    const profile =
        profiles.find(
            profile =>
                profile.id === profileId
        );

    if (!profile) {

        return;

    }


    // Don't allow the last profile to be deleted

    if (profiles.length === 1) {

        alert(
            "You must keep at least one profile."
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete the profile "${profile.name}"? This will permanently delete all of its budget data.`
        );

    if (!confirmed) {

        return;

    }


    const wasActive =
        profile.id === activeProfileId;


    profiles =
        profiles.filter(
            profile =>
                profile.id !== profileId
        );


    // If deleting the active profile,
    // switch to the first remaining profile

    if (wasActive) {

        const newActiveProfile =
            profiles[0];

        activeProfileId =
            newActiveProfile.id;

        budget =
            newActiveProfile.budget;

        updateScheduleSelector();

        updateRecurringDates();

    }


    saveData();

    renderProfiles();

    renderProfileManager();

    renderAll();


    console.log(
        "Deleted profile:",
        profile.name
    );

}

// ============================================================
// NAVIGATION
// ============================================================

function showPage(page) {

    pages.forEach(section => {

        section.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(page);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    navButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === page) {

            button.classList.add("active");

        }

    });


    pageTitle.textContent =
        page === "payments"
            ? "Recurring Payments"
            : page === "oneoff"
                ? "One-Off Payments"
                : page === "savings"
                    ? "Savings Calculator"
                    : page === "paycalc"
                        ? "Pay Calculator"
                        : page.charAt(0).toUpperCase() + page.slice(1);


    if (page === "calendar") {

        renderCalendar();

    }

    if (page === "savings") {

        renderSavingsGoals();

    }

    if (page === "paycalc") {

        updatePayCalculator();

    }

}


// ============================================================
// MODAL
// ============================================================

function openModal(type, id = null) {

    editingType = type;
    editingId = id;

    itemForm.reset();

// Show delete button only when editing
if (deleteItemBtn) {

    if (id) {

        deleteItemBtn.classList.remove("hidden");

    } else {

        deleteItemBtn.classList.add("hidden");

    }

}

    // Show/hide frequency depending on item type
    if (type === "oneoff") {

    frequencyGroup.style.display = "none";

    itemDateLabel.textContent = "Date";

    modalTitle.textContent = id
        ? "Edit One-Off Payment"
        : "Add One-Off Payment";

} else {

    frequencyGroup.style.display = "flex";

    itemDateLabel.textContent = "Next Date";

    modalTitle.textContent =
        type === "income"
            ? "Add Income"
            : "Add Payment";

}


    // Editing existing item
    if (id) {

        let collection;

        if (type === "income") {

            collection = budget.income;

        } else if (type === "payment") {

            collection = budget.payments;

        } else if (type === "oneoff") {

            collection = budget.oneOffPayments;

        }


        const item =
            collection.find(
                entry => entry.id === id
            );


        if (!item) {

            console.error(
                "Could not find item:",
                type,
                id
            );

            return;

        }


        itemName.value =
            item.name;

        itemAmount.value =
            item.amount;

        itemDate.value =
            item.nextDate;


        // Frequency only exists on recurring items
        if (type !== "oneoff") {

            itemFrequency.value =
                item.frequency;

        }

    } else {

        // New item
        itemDate.value =
            getTodayString();

    }


    modal.classList.remove("hidden");

}


function closeModal() {

    modal.classList.add("hidden");

    editingType = null;
    editingId = null;

}


// ============================================================
// ADD / EDIT
// ============================================================

function saveItem(event) {

    event.preventDefault();

    console.log("SAVE BUTTON PRESSED");

    const name =
        itemName.value.trim();

    const amount =
        Number(itemAmount.value);

    const frequency =
        itemFrequency.value;

    const date =
        itemDate.value;


    console.log("Form values:", {

        name,
        amount,
        frequency,
        date,
        editingType,
        editingId

    });


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!name) {

        alert("Please enter a name.");

        return;

    }


    if (isNaN(amount) || amount < 0) {

        alert("Please enter a valid amount.");

        return;

    }


    if (!date) {

        alert("Please select a date.");

        return;

    }


    // Frequency is only required for recurring items

    if (
        editingType !== "oneoff" &&
        !frequency
    ) {

        alert("Please select a frequency.");

        return;

    }


    // ========================================================
    // ONE-OFF PAYMENT
    // ========================================================

    if (editingType === "oneoff") {

        if (!Array.isArray(budget.oneOffPayments)) {

            budget.oneOffPayments = [];

        }


        const item = {

            id:
                editingId ||
                generateId(),

            name:
                name,

            amount:
                amount,

            nextDate:
                date

        };


        if (editingId) {

            const index =
                budget.oneOffPayments.findIndex(
                    entry =>
                        entry.id === editingId
                );


            if (index === -1) {

                alert(
                    "Could not find the one-off payment you're editing."
                );

                return;

            }


            budget.oneOffPayments[index] =
                item;

        } else {

            budget.oneOffPayments.push(item);

        }


        saveData();

        renderAll();

        closeModal();

        console.log(
            "One-off payment saved successfully."
        );

        return;

    }


    // ========================================================
    // RECURRING ITEMS
    // ========================================================

    if (editingType === "income") {

        if (!Array.isArray(budget.income)) {

            budget.income = [];

        }

    } else if (editingType === "payment") {

        if (!Array.isArray(budget.payments)) {

            budget.payments = [];

        }

    } else {

        console.error(
            "Invalid editingType:",
            editingType
        );

        alert(
            "Something went wrong. Please close the window and try again."
        );

        return;

    }


    const item = {

        id:
            editingId ||
            generateId(),

        name:
            name,

        amount:
            amount,

        frequency:
            frequency,

        nextDate:
            date

    };


    const collection =
        editingType === "income"
            ? budget.income
            : budget.payments;


    if (editingId) {

        const index =
            collection.findIndex(
                entry =>
                    entry.id === editingId
            );


        if (index === -1) {

            alert(
                "Could not find the item you're editing."
            );

            return;

        }


        collection[index] =
            item;

    } else {

        collection.push(item);

    }


    saveData();

    renderAll();

    closeModal();

    console.log(
        "Item saved successfully."
    );

}


// ============================================================
// DELETE
// ============================================================

function deleteItem(type, id) {

    let message;

    if (type === "income") {

        message = "Delete this income?";

    } else if (type === "payment") {

        message = "Delete this payment?";

    } else if (type === "oneoff") {

        message = "Delete this one-off payment?";

    }


    // Delete item from modal
if (deleteItemBtn) {

    deleteItemBtn.addEventListener(
        "click",
        () => {

            if (
                !editingType ||
                !editingId
            ) {

                return;

            }

            const type =
                editingType;

            const id =
                editingId;

            closeModal();

            deleteItem(
                type,
                id
            );

        }
    );

}


    if (type === "income") {

        budget.income =
            budget.income.filter(
                item =>
                    item.id !== id
            );

    } else if (type === "payment") {

        budget.payments =
            budget.payments.filter(
                item =>
                    item.id !== id
            );

    } else if (type === "oneoff") {

        budget.oneOffPayments =
            budget.oneOffPayments.filter(
                item =>
                    item.id !== id
            );

    }


    saveData();

    renderAll();

}


// ============================================================
// MARK PAYMENT PAID
// ============================================================

function markPaid(id) {

    const payment =
        budget.payments.find(
            item => item.id === id
        );


    if (!payment) {

        return;

    }


    payment.nextDate =
        calculateNextDate(
            payment.nextDate,
            payment.frequency
        );


    saveData();

    renderAll();

}


// ============================================================
// RECURRING DATE LOGIC
// ============================================================

function updateRecurringDates() {

    let changed = false;


    budget.income.forEach(item => {

        const next =
            calculateNextDate(
                item.nextDate,
                item.frequency
            );

        if (next !== item.nextDate) {

            item.nextDate = next;

            changed = true;

        }

    });


    budget.payments.forEach(item => {

        const next =
            calculateNextDate(
                item.nextDate,
                item.frequency
            );

        if (next !== item.nextDate) {

            item.nextDate = next;

            changed = true;

        }

    });


    if (changed) {

        saveData();

    }

}


function calculateNextDate(
    dateString,
    frequency
) {

    if (!dateString) {

        return getTodayString();

    }


    const date =
        new Date(dateString + "T00:00:00");

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    while (date < today) {

        switch (frequency) {

            case "Weekly":

                date.setDate(
                    date.getDate() + 7
                );

                break;


            case "Fortnightly":

                date.setDate(
                    date.getDate() + 14
                );

                break;


            case "Monthly":

                date.setMonth(
                    date.getMonth() + 1
                );

                break;


            case "Quarterly":

                date.setMonth(
                    date.getMonth() + 3
                );

                break;


            case "Yearly":

                date.setFullYear(
                    date.getFullYear() + 1
                );

                break;


            default:

                return dateString;

        }

    }


    return formatDateForInput(date);

}


// ============================================================
// RENDER EVERYTHING
// ============================================================

function renderAll() {

    let settingsChanged = false;


    if (rollForwardNextPayDay()) {

        settingsChanged = true;

    }


    if (clearOneOffPaymentsFromPreviousPeriods()) {

        settingsChanged = true;

    }


    if (settingsChanged) {

        saveData();

    }

    renderIncome();

    renderPayments();

    renderOneOffPayments();

    renderSavingsGoals();

    renderDashboard();

    renderUpcomingPayments();

    renderCalendar();

    updateBudgetPeriodDisplay();

    updateScheduleSelector();

}


// ============================================================
// INCOME TABLE
// ============================================================

function renderIncome() {

    incomeTable.innerHTML = "";

    if (budget.income.length === 0) {

        incomeTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No income added yet.
                </td>
            </tr>
        `;

        return;

    }

    const sorted =
        [...budget.income].sort(
            (a, b) =>
                new Date(a.nextDate) -
                new Date(b.nextDate)
        );

    sorted.forEach(item => {

        incomeTable.innerHTML += `

            <tr>

                <td>
                    ${escapeHtml(item.name)}
                </td>

                <td>
                    ${formatCurrency(item.amount)}
                </td>

                <td>
                    ${escapeHtml(item.frequency)}
                </td>

                <td>
                    ${formatDate(item.nextDate)}
                </td>

                <td class="actions">

                    <button
                        class="action-btn edit-btn"
                        onclick="editItem('income', '${item.id}')"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteItem('income', '${item.id}')"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}


// ============================================================
// PAYMENTS TABLE
// ============================================================

function getPaymentsSortMode() {

    if (!budget.settings) {

        budget.settings = {};

    }


    return budget.settings.paymentsSort || "custom";

}


function setPaymentsSortMode(mode) {

    if (!budget.settings) {

        budget.settings = {};

    }


    budget.settings.paymentsSort =
        mode || "custom";


    saveData();


    if (paymentsSort) {

        paymentsSort.value =
            budget.settings.paymentsSort;

    }

}


function getFrequencySortValue(frequency) {

    switch (frequency) {

        case "Weekly":
            return 1;

        case "Fortnightly":
            return 2;

        case "Monthly":
            return 3;

        case "Quarterly":
            return 4;

        case "Yearly":
            return 5;

        default:
            return 99;

    }

}


function getSortedPayments() {

    if (!Array.isArray(budget.payments)) {

        budget.payments = [];

    }


    const items =
        [...budget.payments];


    const mode =
        getPaymentsSortMode();


    switch (mode) {

        case "amount-desc":

            return items.sort(
                (a, b) =>
                    (Number(b.amount) || 0) -
                    (Number(a.amount) || 0)
            );


        case "amount-asc":

            return items.sort(
                (a, b) =>
                    (Number(a.amount) || 0) -
                    (Number(b.amount) || 0)
            );


        case "name-asc":

            return items.sort(
                (a, b) =>
                    String(a.name || "")
                        .localeCompare(
                            String(b.name || ""),
                            undefined,
                            { sensitivity: "base" }
                        )
            );


        case "name-desc":

            return items.sort(
                (a, b) =>
                    String(b.name || "")
                        .localeCompare(
                            String(a.name || ""),
                            undefined,
                            { sensitivity: "base" }
                        )
            );


        case "date-desc":

            return items.sort(
                (a, b) =>
                    new Date(b.nextDate) -
                    new Date(a.nextDate)
            );


        case "frequency-asc":

            return items.sort(
                (a, b) => {

                    const frequencyDiff =
                        getFrequencySortValue(
                            a.frequency
                        ) -
                        getFrequencySortValue(
                            b.frequency
                        );


                    if (frequencyDiff !== 0) {

                        return frequencyDiff;

                    }


                    return String(a.name || "")
                        .localeCompare(
                            String(b.name || ""),
                            undefined,
                            { sensitivity: "base" }
                        );

                }
            );


        case "date-asc":

            return items.sort(
                (a, b) =>
                    new Date(a.nextDate) -
                    new Date(b.nextDate)
            );


        case "custom":
        default:

            return items;

    }

}


function reorderPaymentsByIds(orderedIds) {

    if (!Array.isArray(budget.payments)) {

        budget.payments = [];

        return;

    }


    const paymentMap =
        new Map(
            budget.payments.map(item => [
                item.id,
                item
            ])
        );


    const reordered = [];


    orderedIds.forEach(id => {

        const item =
            paymentMap.get(id);


        if (item) {

            reordered.push(item);

            paymentMap.delete(id);

        }

    });


    // Keep any leftover items just in case
    paymentMap.forEach(item => {

        reordered.push(item);

    });


    budget.payments = reordered;

}


function setupPaymentsDragAndDrop() {

    if (!paymentTable) {

        return;

    }


    const rows =
        [
            ...paymentTable.querySelectorAll(
                "tr[data-payment-id]"
            )
        ];


    let draggedId = null;


    rows.forEach(row => {

        const handle =
            row.querySelector(".drag-handle");


        // Only allow dragging from the grip handle
        row.draggable = false;


        if (handle) {

            handle.addEventListener(
                "mousedown",
                () => {

                    row.draggable = true;

                }
            );


            handle.addEventListener(
                "mouseup",
                () => {

                    row.draggable = false;

                }
            );

        }


        row.addEventListener(
            "dragstart",
            event => {

                if (!row.draggable) {

                    event.preventDefault();

                    return;

                }


                draggedId =
                    row.dataset.paymentId;


                row.classList.add("dragging");


                if (event.dataTransfer) {

                    event.dataTransfer.effectAllowed =
                        "move";

                    event.dataTransfer.setData(
                        "text/plain",
                        draggedId
                    );

                }

            }
        );


        row.addEventListener(
            "dragend",
            () => {

                row.classList.remove("dragging");

                row.draggable = false;


                paymentTable
                    .querySelectorAll(".drag-over")
                    .forEach(entry => {

                        entry.classList.remove(
                            "drag-over"
                        );

                    });


                draggedId = null;

            }
        );


        row.addEventListener(
            "dragover",
            event => {

                event.preventDefault();


                if (
                    !draggedId ||
                    row.dataset.paymentId ===
                        draggedId
                ) {

                    return;

                }


                rows.forEach(entry => {

                    entry.classList.toggle(
                        "drag-over",
                        entry === row
                    );

                });


                if (event.dataTransfer) {

                    event.dataTransfer.dropEffect =
                        "move";

                }

            }
        );


        row.addEventListener(
            "dragleave",
            () => {

                row.classList.remove("drag-over");

            }
        );


        row.addEventListener(
            "drop",
            event => {

                event.preventDefault();


                row.classList.remove("drag-over");


                const sourceId =
                    draggedId ||
                    (
                        event.dataTransfer &&
                        event.dataTransfer.getData(
                            "text/plain"
                        )
                    );


                const targetId =
                    row.dataset.paymentId;


                if (
                    !sourceId ||
                    !targetId ||
                    sourceId === targetId
                ) {

                    return;

                }


                const currentIds =
                    getSortedPayments().map(
                        item => item.id
                    );


                const fromIndex =
                    currentIds.indexOf(sourceId);

                const toIndex =
                    currentIds.indexOf(targetId);


                if (
                    fromIndex === -1 ||
                    toIndex === -1
                ) {

                    return;

                }


                currentIds.splice(fromIndex, 1);

                currentIds.splice(
                    toIndex,
                    0,
                    sourceId
                );


                reorderPaymentsByIds(currentIds);

                setPaymentsSortMode("custom");

                saveData();

                renderPayments();

            }
        );

    });

}


function renderPayments() {

    if (!paymentTable) {

        return;

    }


    paymentTable.innerHTML = "";


    if (paymentsSort) {

        paymentsSort.value =
            getPaymentsSortMode();

    }


    if (
        !Array.isArray(budget.payments) ||
        budget.payments.length === 0
    ) {

        paymentTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No recurring payments added yet.
                </td>
            </tr>
        `;

        return;

    }


    const sorted =
        getSortedPayments();


    sorted.forEach(item => {

        const days =
            getDaysUntil(item.nextDate);


        let statusClass = "";


        if (days < 0) {

            statusClass = "bad";

        } else if (days <= 7) {

            statusClass = "warning";

        } else {

            statusClass = "good";

        }


        paymentTable.innerHTML += `

            <tr
                data-payment-id="${item.id}">

                <td class="drag-col">

                    <span
                        class="drag-handle"
                        title="Drag to reorder"
                        aria-label="Drag to reorder">

                        <i class="fa-solid fa-grip-vertical"></i>

                    </span>

                </td>

                <td>
                    ${escapeHtml(item.name)}
                </td>

                <td>
                    ${formatCurrency(item.amount)}
                </td>

                <td>
                    ${escapeHtml(item.frequency)}
                </td>

                <td class="${statusClass}">
                    ${formatDate(item.nextDate)}
                </td>

                <td>

                    <button
                        class="action-btn paid-btn"
                        onclick="markPaid('${item.id}')">

                        ✓

                    </button>

                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick="editItem('payment', '${item.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteItem('payment', '${item.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });


    setupPaymentsDragAndDrop();

}

// ============================================================
// ONE-OFF PAYMENTS TABLE
// ============================================================

function renderOneOffPayments() {

    if (!oneOffTable) {

        return;

    }


    oneOffTable.innerHTML = "";


    if (
        !Array.isArray(budget.oneOffPayments) ||
        budget.oneOffPayments.length === 0
    ) {

        oneOffTable.innerHTML = `
            <tr>
                <td colspan="4">
                    No one-off payments added yet.
                </td>
            </tr>
        `;

        return;

    }


    const sorted =
        [...budget.oneOffPayments].sort(
            (a, b) =>
                new Date(a.nextDate) -
                new Date(b.nextDate)
        );


    sorted.forEach(item => {

        oneOffTable.innerHTML += `

            <tr>

                <td>
                    ${escapeHtml(item.name)}
                </td>

                <td>
                    ${formatCurrency(item.amount)}
                </td>

                <td>
                    ${formatDate(item.nextDate)}
                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick="editItem('oneoff', '${item.id}')"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteItem('oneoff', '${item.id}')"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}


// ============================================================
// SAVINGS CALCULATOR
// ============================================================

function ensureSavingsGoalsArray() {

    if (!Array.isArray(budget.savingsGoals)) {

        budget.savingsGoals = [];

    }

}


function getSavingsBreakdown(amount, targetDate) {

    const goalAmount =
        Number(amount) || 0;


    if (!targetDate || goalAmount <= 0) {

        return {
            valid: false,
            weeks: 0,
            days: 0,
            weekly: 0,
            fortnightly: 0,
            overdue: false
        };

    }


    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const target =
        new Date(targetDate + "T00:00:00");

    target.setHours(0, 0, 0, 0);


    const diffMs =
        target.getTime() - today.getTime();

    const days =
        Math.ceil(
            diffMs / (1000 * 60 * 60 * 24)
        );


    if (days <= 0) {

        return {
            valid: true,
            weeks: 0,
            days: days,
            weekly: goalAmount,
            fortnightly: goalAmount,
            overdue: true
        };

    }


    const weeks =
        Math.max(
            1,
            Math.ceil(days / 7)
        );


    const weekly =
        goalAmount / weeks;


    return {
        valid: true,
        weeks: weeks,
        days: days,
        weekly: weekly,
        fortnightly: weekly * 2,
        overdue: false
    };

}


function formatSavingsWeeksLabel(breakdown) {

    if (!breakdown || !breakdown.valid) {

        return "—";

    }


    if (breakdown.overdue) {

        return "Date reached";

    }


    if (breakdown.weeks === 1) {

        return "1 week";

    }


    return `${breakdown.weeks} weeks`;

}


function updateSavingsGoalPreview() {

    if (
        !savingsPreviewWeeks ||
        !savingsPreviewWeekly ||
        !savingsPreviewFortnightly
    ) {

        return;

    }


    const breakdown =
        getSavingsBreakdown(
            savingsGoalAmount &&
                savingsGoalAmount.value,
            savingsGoalDate &&
                savingsGoalDate.value
        );


    if (!breakdown.valid) {

        savingsPreviewWeeks.textContent = "—";

        savingsPreviewWeekly.textContent = "—";

        savingsPreviewFortnightly.textContent = "—";

        return;

    }


    savingsPreviewWeeks.textContent =
        formatSavingsWeeksLabel(breakdown);


    savingsPreviewWeekly.textContent =
        breakdown.overdue
            ? formatCurrency(breakdown.weekly) + " left"
            : formatCurrency(breakdown.weekly);


    savingsPreviewFortnightly.textContent =
        breakdown.overdue
            ? formatCurrency(breakdown.fortnightly) + " left"
            : formatCurrency(breakdown.fortnightly);

}


function openSavingsGoalForm(id = null) {

    ensureSavingsGoalsArray();


    if (!savingsGoalFormCard || !savingsGoalForm) {

        return;

    }


    editingSavingsGoalId = id;


    savingsGoalForm.reset();


    if (savingsGoalIncludeInBudget) {

        savingsGoalIncludeInBudget.checked = false;

    }


    if (savingsGoalDate) {

        const tomorrow =
            new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const tomorrowString =
            formatDateForInput(tomorrow);

        savingsGoalDate.min =
            tomorrowString;

        savingsGoalDate.value =
            tomorrowString;

    }


    if (id) {

        const goal =
            budget.savingsGoals.find(
                item => item.id === id
            );


        if (!goal) {

            alert(
                "Could not find that savings goal."
            );

            editingSavingsGoalId = null;

            return;

        }


        if (savingsGoalFormTitle) {

            savingsGoalFormTitle.textContent =
                "Edit Savings Goal";

        }


        if (savingsGoalName) {

            savingsGoalName.value =
                goal.name;

        }


        if (savingsGoalAmount) {

            savingsGoalAmount.value =
                goal.amount;

        }


        if (savingsGoalDate) {

            savingsGoalDate.value =
                goal.targetDate;

            savingsGoalDate.min = "";

        }


        if (savingsGoalIncludeInBudget) {

            savingsGoalIncludeInBudget.checked =
                !!goal.includeInBudget;

        }

    } else if (savingsGoalFormTitle) {

        savingsGoalFormTitle.textContent =
            "New Savings Goal";

    }


    savingsGoalFormCard.classList.remove("hidden");


    updateSavingsGoalPreview();


    if (savingsGoalName) {

        savingsGoalName.focus();

    }

}


function closeSavingsGoalForm() {

    editingSavingsGoalId = null;


    if (savingsGoalForm) {

        savingsGoalForm.reset();

    }


    if (savingsGoalIncludeInBudget) {

        savingsGoalIncludeInBudget.checked = false;

    }


    if (savingsGoalFormCard) {

        savingsGoalFormCard.classList.add("hidden");

    }


    updateSavingsGoalPreview();

}


function saveSavingsGoal(event) {

    event.preventDefault();


    ensureSavingsGoalsArray();


    const name =
        savingsGoalName
            ? savingsGoalName.value.trim()
            : "";

    const amount =
        Number(
            savingsGoalAmount &&
                savingsGoalAmount.value
        );

    const targetDate =
        savingsGoalDate
            ? savingsGoalDate.value
            : "";

    const includeInBudget =
        !!(
            savingsGoalIncludeInBudget &&
            savingsGoalIncludeInBudget.checked
        );


    if (!name) {

        alert("Please enter a goal name.");

        return;

    }


    if (isNaN(amount) || amount <= 0) {

        alert(
            "Please enter a valid target amount."
        );

        return;

    }


    if (!targetDate) {

        alert("Please select a target date.");

        return;

    }


    const breakdown =
        getSavingsBreakdown(
            amount,
            targetDate
        );


    if (!breakdown.valid || breakdown.overdue) {

        alert(
            "Please choose a future date for your savings goal."
        );

        return;

    }


    const goal = {

        id:
            editingSavingsGoalId ||
            generateId(),

        name:
            name,

        amount:
            amount,

        targetDate:
            targetDate,

        startDate:
            getTodayString(),

        includeInBudget:
            includeInBudget

    };


    if (editingSavingsGoalId) {

        const index =
            budget.savingsGoals.findIndex(
                item =>
                    item.id ===
                    editingSavingsGoalId
            );


        if (index === -1) {

            alert(
                "Could not find the savings goal you're editing."
            );

            return;

        }


        const existing =
            budget.savingsGoals[index];


        goal.startDate =
            existing.startDate ||
            goal.startDate;


        budget.savingsGoals[index] =
            goal;

    } else {

        budget.savingsGoals.push(goal);

    }


    saveData();

    closeSavingsGoalForm();

    renderAll();

}


function deleteSavingsGoal(id) {

    ensureSavingsGoalsArray();


    const goal =
        budget.savingsGoals.find(
            item => item.id === id
        );


    if (!goal) {

        return;

    }


    const confirmed =
        confirm(
            `Delete savings goal "${goal.name}"?`
        );


    if (!confirmed) {

        return;

    }


    budget.savingsGoals =
        budget.savingsGoals.filter(
            item => item.id !== id
        );


    if (editingSavingsGoalId === id) {

        closeSavingsGoalForm();

    }


    saveData();

    renderAll();

}


function renderSavingsGoals() {

    ensureSavingsGoalsArray();


    if (!savingsGoalsList || !savingsGoalsEmpty) {

        return;

    }


    savingsGoalsList.innerHTML = "";


    if (budget.savingsGoals.length === 0) {

        savingsGoalsEmpty.classList.remove(
            "hidden"
        );

        return;

    }


    savingsGoalsEmpty.classList.add("hidden");


    const sorted =
        [...budget.savingsGoals].sort(
            (a, b) =>
                new Date(a.targetDate) -
                new Date(b.targetDate)
        );


    sorted.forEach(goal => {

        const breakdown =
            getSavingsBreakdown(
                goal.amount,
                goal.targetDate
            );


        const card =
            document.createElement("div");

        card.className =
            "savings-goal-card";


        const weeklyLabel =
            breakdown.overdue
                ? formatCurrency(goal.amount) +
                  " still needed"
                : formatCurrency(
                      breakdown.weekly
                  ) + " / week";


        card.innerHTML = `

            <div class="savings-goal-top">

                <div>

                    <h4>
                        ${escapeHtml(goal.name)}
                    </h4>

                </div>

                <div class="savings-goal-actions">

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        data-edit-savings="${goal.id}"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        data-delete-savings="${goal.id}"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

            <div class="savings-goal-highlight">

                <span>
                    ${breakdown.overdue ? "Goal date reached" : "Required weekly savings"}
                </span>

                <strong>
                    ${weeklyLabel}
                </strong>

            </div>

            <div class="savings-goal-meta">

                <div>

                    <span>Target</span>

                    <strong>
                        ${formatCurrency(goal.amount)}
                    </strong>

                </div>

                <div>

                    <span>Save By</span>

                    <strong>
                        ${formatDate(goal.targetDate)}
                    </strong>

                </div>

                <div>

                    <span>Time Left</span>

                    <strong>
                        ${formatSavingsWeeksLabel(breakdown)}
                    </strong>

                </div>

                <div>

                    <span>Fortnightly</span>

                    <strong>
                        ${formatCurrency(breakdown.fortnightly)}
                    </strong>

                </div>

            </div>

            <div class="savings-goal-badge ${goal.includeInBudget ? "is-included" : "is-tracker"}">

                <i class="fa-solid ${goal.includeInBudget ? "fa-calendar-check" : "fa-calculator"}"></i>

                ${
                    goal.includeInBudget
                        ? "On calendar · affects Remaining"
                        : "Tracker only"
                }

            </div>

        `;


        savingsGoalsList.appendChild(card);

    });


    savingsGoalsList
        .querySelectorAll("[data-edit-savings]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openSavingsGoalForm(
                        button.dataset.editSavings
                    );

                }
            );

        });


    savingsGoalsList
        .querySelectorAll("[data-delete-savings]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSavingsGoal(
                        button.dataset.deleteSavings
                    );

                }
            );

        });

}


function getSavingsGoalsPeriodTotal() {

    ensureSavingsGoalsArray();


    const schedule =
        budget.settings.schedule || "Fortnightly";


    let total = 0;


    budget.savingsGoals.forEach(goal => {

        if (!goal.includeInBudget) {

            return;

        }


        const breakdown =
            getSavingsBreakdown(
                goal.amount,
                goal.targetDate
            );


        if (!breakdown.valid) {

            return;

        }


        // If the date is already reached, treat the
        // remaining goal amount as due in this period
        if (breakdown.overdue) {

            total +=
                Number(goal.amount) || 0;

            return;

        }


        switch (schedule) {

            case "Weekly":

                total +=
                    breakdown.weekly;

                break;


            case "Monthly":

                total +=
                    breakdown.weekly * 52 / 12;

                break;


            case "Fortnightly":
            default:

                total +=
                    breakdown.fortnightly;

                break;

        }

    });


    return total;

}


// ============================================================
// NZ PAY CALCULATOR (2026/27)
// ============================================================

const NZ_PAY_TAX = {

    yearLabel: "2026/27",

    brackets: [
        { upTo: 15600, rate: 0.105 },
        { upTo: 53500, rate: 0.175 },
        { upTo: 78100, rate: 0.30 },
        { upTo: 180000, rate: 0.33 },
        { upTo: Infinity, rate: 0.39 }
    ],

    accRate: 0.0175,

    accMaxEarnings: 156641,

    studentLoanRate: 0.12,

    studentLoanThreshold: 24128,

    employerKiwiSaverRate: 0.03,

    weeksPerYear: 52

};


function setupPayCalculatorEvents() {

    const inputs = [
        payHourlyRate,
        payHoursPerWeek,
        payStudentLoan,
        payKiwiSaver,
        payKiwiSaverRate,
        payShowEmployerKiwisaver
    ];


    inputs.forEach(input => {

        if (!input) {

            return;

        }

        const eventName =
            input.tagName === "SELECT" ||
            input.type === "checkbox"
                ? "change"
                : "input";


        input.addEventListener(
            eventName,
            () => {

                if (input === payKiwiSaver) {

                    updatePayKiwiSaverOptions();

                }

                updatePayCalculator();

            }
        );

    });


    document
        .querySelectorAll("[data-pay-period]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    payCalcPeriod =
                        button.dataset.payPeriod ||
                        "weekly";


                    document
                        .querySelectorAll("[data-pay-period]")
                        .forEach(entry => {

                            entry.classList.toggle(
                                "active",
                                entry === button
                            );

                        });


                    updatePayCalculator();

                }
            );

        });


    updatePayKiwiSaverOptions();

    updatePayCalculator();

}


function updatePayKiwiSaverOptions() {

    if (!payKiwiSaverOptions || !payKiwiSaver) {

        return;

    }


    payKiwiSaverOptions.classList.toggle(
        "hidden",
        !payKiwiSaver.checked
    );

}


function calculateNzIncomeTax(annualIncome) {

    let remaining =
        Math.max(0, Number(annualIncome) || 0);

    let previousCap = 0;

    let tax = 0;


    NZ_PAY_TAX.brackets.forEach(bracket => {

        if (remaining <= 0) {

            return;

        }


        const bandSize =
            bracket.upTo === Infinity
                ? remaining
                : Math.max(
                    0,
                    Math.min(
                        remaining,
                        bracket.upTo - previousCap
                    )
                );


        tax += bandSize * bracket.rate;

        remaining -= bandSize;

        previousCap = bracket.upTo;

    });


    return tax;

}


function calculateNzPayBreakdown({
    hourlyRate,
    hoursPerWeek,
    hasStudentLoan,
    hasKiwiSaver,
    kiwiSaverPercent,
    showEmployerKiwiSaver
}) {

    const hourly =
        Math.max(0, Number(hourlyRate) || 0);

    const hours =
        Math.max(0, Number(hoursPerWeek) || 0);

    const weeklyGross =
        hourly * hours;

    const annualGross =
        weeklyGross * NZ_PAY_TAX.weeksPerYear;


    const annualIncomeTax =
        calculateNzIncomeTax(annualGross);


    const accLiable =
        Math.min(
            annualGross,
            NZ_PAY_TAX.accMaxEarnings
        );

    const annualAcc =
        accLiable * NZ_PAY_TAX.accRate;


    const annualStudentLoan =
        hasStudentLoan
            ? Math.max(
                0,
                annualGross -
                    NZ_PAY_TAX.studentLoanThreshold
              ) * NZ_PAY_TAX.studentLoanRate
            : 0;


    const kiwiSaverRate =
        hasKiwiSaver
            ? (Number(kiwiSaverPercent) || 0) / 100
            : 0;

    const annualKiwiSaver =
        annualGross * kiwiSaverRate;


    const annualEmployerKiwiSaver =
        hasKiwiSaver && showEmployerKiwiSaver
            ? annualGross *
              NZ_PAY_TAX.employerKiwiSaverRate
            : 0;


    const annualDeductions =
        annualIncomeTax +
        annualAcc +
        annualStudentLoan +
        annualKiwiSaver;


    const annualNet =
        annualGross - annualDeductions;


    return {

        hourly,
        hours,
        weeklyGross,
        annualGross,
        annualIncomeTax,
        annualAcc,
        annualStudentLoan,
        annualKiwiSaver,
        annualEmployerKiwiSaver,
        annualDeductions,
        annualNet,
        hasStudentLoan,
        hasKiwiSaver,
        kiwiSaverPercent:
            hasKiwiSaver
                ? Number(kiwiSaverPercent) || 0
                : 0,
        showEmployerKiwiSaver:
            !!(hasKiwiSaver && showEmployerKiwiSaver)

    };

}


function scalePayAmount(annualAmount, period) {

    switch (period) {

        case "weekly":
            return annualAmount / NZ_PAY_TAX.weeksPerYear;

        case "fortnightly":
            return annualAmount / (NZ_PAY_TAX.weeksPerYear / 2);

        case "monthly":
            return annualAmount / 12;

        case "annual":
        default:
            return annualAmount;

    }

}


function getPayPeriodLabel(period) {

    switch (period) {

        case "weekly":
            return "week";

        case "fortnightly":
            return "fortnight";

        case "monthly":
            return "month";

        case "annual":
        default:
            return "year";

    }

}


function updatePayCalculator() {

    if (!payNetAmount) {

        return;

    }


    updatePayKiwiSaverOptions();


    const breakdown =
        calculateNzPayBreakdown({
            hourlyRate:
                payHourlyRate
                    ? payHourlyRate.value
                    : 0,
            hoursPerWeek:
                payHoursPerWeek
                    ? payHoursPerWeek.value
                    : 40,
            hasStudentLoan:
                !!(payStudentLoan &&
                    payStudentLoan.checked),
            hasKiwiSaver:
                !!(payKiwiSaver &&
                    payKiwiSaver.checked),
            kiwiSaverPercent:
                payKiwiSaverRate
                    ? payKiwiSaverRate.value
                    : 3.5,
            showEmployerKiwiSaver:
                !!(
                    payShowEmployerKiwisaver &&
                    payShowEmployerKiwisaver.checked
                )
        });


    const period =
        payCalcPeriod || "weekly";


    const setMoney = (element, annualValue) => {

        if (!element) {

            return;

        }

        element.textContent =
            formatCurrency(
                scalePayAmount(
                    annualValue,
                    period
                )
            );

    };


    if (payNetLabel) {

        payNetLabel.textContent =
            `Net pay / ${getPayPeriodLabel(period)}`;

    }


    setMoney(payNetAmount, breakdown.annualNet);

    setMoney(payGrossAmount, breakdown.annualGross);

    setMoney(
        payIncomeTaxAmount,
        breakdown.annualIncomeTax
    );

    setMoney(payAccAmount, breakdown.annualAcc);

    setMoney(
        payStudentLoanAmount,
        breakdown.annualStudentLoan
    );

    setMoney(
        payKiwiSaverAmount,
        breakdown.annualKiwiSaver
    );

    setMoney(
        payDeductionsAmount,
        breakdown.annualDeductions
    );

    setMoney(
        payEmployerKiwisaverAmount,
        breakdown.annualEmployerKiwiSaver
    );


    if (payStudentLoanRow) {

        payStudentLoanRow.style.display =
            breakdown.hasStudentLoan
                ? ""
                : "none";

    }


    if (payKiwiSaverRow) {

        payKiwiSaverRow.style.display =
            breakdown.hasKiwiSaver
                ? ""
                : "none";

    }


    if (payKiwiSaverLabel) {

        payKiwiSaverLabel.textContent =
            breakdown.hasKiwiSaver
                ? `KiwiSaver (${breakdown.kiwiSaverPercent}%)`
                : "KiwiSaver";

    }


    if (payEmployerKiwisaverBox) {

        payEmployerKiwisaverBox.classList.toggle(
            "hidden",
            !breakdown.showEmployerKiwiSaver
        );

    }


    if (payEffectiveRate) {

        const rate =
            breakdown.annualGross > 0
                ? (
                    (
                        breakdown.annualIncomeTax +
                        breakdown.annualAcc
                    ) /
                    breakdown.annualGross
                  ) * 100
                : 0;


        payEffectiveRate.textContent =
            `${rate.toFixed(1)}%`;

    }


    if (payNetHourly) {

        payNetHourly.textContent =
            breakdown.hours > 0
                ? formatCurrency(
                    breakdown.annualNet /
                    (breakdown.hours *
                        NZ_PAY_TAX.weeksPerYear)
                  )
                : formatCurrency(0);

    }

}


// ============================================================
// EDIT
// ============================================================

function editItem(type, id) {

    if (type === "savings") {

        showPage("savings");

        openSavingsGoalForm(id);

        return;

    }

    openModal(type, id);

}


// ============================================================
// DASHBOARD LABELS
// ============================================================

function updateDashboardLabels() {

    const schedule =
        budget.settings.schedule || "Fortnightly";


    if (incomePeriodLabel) {

        incomePeriodLabel.textContent =
            `${schedule} Income`;

    }


    if (paymentsPeriodLabel) {

        paymentsPeriodLabel.textContent =
            `${schedule} Expenses`;

    }

}

// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard() {

	updateDashboardLabels();
	
    const income =
    getBudgetPeriodTotal(
        budget.income
    );

    const recurringPayments =
    getBudgetPeriodTotal(
        budget.payments
    );


    const oneOffPayments =
    getOneOffPaymentsTotal();

    const savingsContributions =
    getSavingsGoalsPeriodTotal();

    const payments =
        recurringPayments +
        oneOffPayments +
        savingsContributions;

    const remaining =
        income -
        payments;


    monthlyIncome.textContent =
        formatCurrency(income);


    monthlyPayments.textContent =
        formatCurrency(payments);


    remainingIncome.textContent =
        formatCurrency(remaining);


    if (budget.income.length === 0) {

        nextIncome.textContent =
            "No income added";

        return;

    }


    const sorted =
        [...budget.income].sort(
            (a, b) =>
                new Date(a.nextDate) -
                new Date(b.nextDate)
        );


    const next =
        sorted[0];


    nextIncome.innerHTML = `

        <strong>
            ${escapeHtml(next.name)}
        </strong>

        <br>

        <small>
            ${formatCurrency(next.amount)}
            ·
            ${formatDate(next.nextDate)}
        </small>

    `;

}

// ============================================================
// UPDATE CURRENT BUDGET PERIOD DISPLAY
// ============================================================

function setBudgetPeriodActionable(isActionable) {

    const budgetPeriodElement =
        budgetPeriodBox ||
        (
            currentBudgetPeriod &&
            currentBudgetPeriod.closest(".budget-period")
        );


    if (!budgetPeriodElement) {

        return;

    }


    if (isActionable) {

        budgetPeriodElement.classList.add(
            "is-actionable"
        );

        budgetPeriodElement.setAttribute(
            "role",
            "button"
        );

        budgetPeriodElement.setAttribute(
            "tabindex",
            "0"
        );

        budgetPeriodElement.setAttribute(
            "title",
            "Click to set your next pay day"
        );

        budgetPeriodElement.setAttribute(
            "aria-label",
            "Set your next pay day"
        );

    } else {

        budgetPeriodElement.classList.remove(
            "is-actionable"
        );

        budgetPeriodElement.removeAttribute("role");

        budgetPeriodElement.removeAttribute("tabindex");

        budgetPeriodElement.removeAttribute("title");

        budgetPeriodElement.removeAttribute(
            "aria-label"
        );

    }

}


function openNextPayDayPicker() {

    if (!budget.settings) {

        budget.settings = {};

    }


    // Ensure payday/budget period mode is enabled
    // so the Next Pay Day field is visible
    budget.settings.useBudgetPeriod = true;


    updateScheduleSelector();


    if (!budgetAnchorDate) {

        return;

    }


    budgetAnchorDateContainer &&
        (budgetAnchorDateContainer.style.display = "");


    budgetAnchorDate.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });


    budgetAnchorDate.focus();


    // Native date picker where supported
    if (
        typeof budgetAnchorDate.showPicker ===
        "function"
    ) {

        try {

            budgetAnchorDate.showPicker();

        } catch (error) {

            // Some browsers only allow showPicker
            // after a direct user gesture; focus is
            // still enough as a fallback.
            console.warn(
                "Could not open date picker:",
                error
            );

        }

    }

}


function updateBudgetPeriodDisplay() {

    if (!currentBudgetPeriod) {

        return;

    }


    // Profile does not use a payday/budget period
    if (
        !budget.settings ||
        !budget.settings.useBudgetPeriod
    ) {

        currentBudgetPeriod.textContent = "";

        const budgetPeriodElement =
            budgetPeriodBox ||
            currentBudgetPeriod.closest(".budget-period");

        if (budgetPeriodElement) {

            budgetPeriodElement.style.display = "none";

        }

        setBudgetPeriodActionable(false);

        return;

    }


    const budgetPeriodElement =
        budgetPeriodBox ||
        currentBudgetPeriod.closest(".budget-period");

    if (budgetPeriodElement) {

        budgetPeriodElement.style.display = "";

    }


    const period =
        getCurrentBudgetPeriod();


    if (!period) {

        currentBudgetPeriod.textContent =
            "Set your next pay day";

        setBudgetPeriodActionable(true);

        return;

    }


    currentBudgetPeriod.textContent =
        `${formatDate(period.start)} → ${formatDate(period.end)}`;

    setBudgetPeriodActionable(false);

}

// ============================================================
// BUDGET PERIOD CALCULATIONS
// ============================================================

function getBudgetPeriodTotal(items) {

    const schedule =
        budget.settings.schedule || "Fortnightly";

    let total = 0;


    items.forEach(item => {

        switch (schedule) {

            // =================================================
            // WEEKLY
            // =================================================

            case "Weekly":

                switch (item.frequency) {

                    case "Weekly":

                        total +=
                            item.amount;

                        break;


                    case "Fortnightly":

                        total +=
                            item.amount / 2;

                        break;


                    case "Monthly":

                        total +=
                            item.amount * 12 / 52;

                        break;


                    case "Quarterly":

                        total +=
                            item.amount * 4 / 52;

                        break;


                    case "Yearly":

                        total +=
                            item.amount / 52;

                        break;

                }

                break;


            // =================================================
            // FORTNIGHTLY
            // =================================================

            case "Fortnightly":

                switch (item.frequency) {

                    case "Weekly":

                        total +=
                            item.amount * 2;

                        break;


                    case "Fortnightly":

                        total +=
                            item.amount;

                        break;


                    case "Monthly":

                        total +=
                            item.amount * 12 / 26;

                        break;


                    case "Quarterly":

                        total +=
                            item.amount * 4 / 26;

                        break;


                    case "Yearly":

                        total +=
                            item.amount / 26;

                        break;

                }

                break;


            // =================================================
            // MONTHLY
            // =================================================

            case "Monthly":

                switch (item.frequency) {

                    case "Weekly":

                        total +=
                            item.amount * 52 / 12;

                        break;


                    case "Fortnightly":

                        total +=
                            item.amount * 26 / 12;

                        break;


                    case "Monthly":

                        total +=
                            item.amount;

                        break;


                    case "Quarterly":

                        total +=
                            item.amount / 3;

                        break;


                    case "Yearly":

                        total +=
                            item.amount / 12;

                        break;

                }

                break;

        }

    });


    return total;

}

// ============================================================
// MONTHLY CALCULATIONS
// ============================================================

function getMonthlyTotal(items) {

    let total = 0;


    items.forEach(item => {

        switch (item.frequency) {

            case "Weekly":

                total +=
                    item.amount * 52 / 12;

                break;


            case "Fortnightly":

				total +=
					item.amount * 2;

				break;


            case "Monthly":

                total +=
                    item.amount;

                break;


            case "Quarterly":

                total +=
                    item.amount / 3;

                break;


            case "Yearly":

                total +=
                    item.amount / 12;

                break;

        }

    });


    return total;

}

// ============================================================
// FORTNIGHTLY CALCULATIONS
// ============================================================

function getFortnightlyTotal(items) {

    let total = 0;

    items.forEach(item => {

        switch (item.frequency) {

            case "Weekly":
                total += item.amount * 2;
                break;

            case "Fortnightly":
                total += item.amount;
                break;

            case "Monthly":
                total += item.amount * 12 / 26;
                break;

            case "Quarterly":
                total += item.amount * 4 / 26;
                break;

            case "Yearly":
                total += item.amount / 26;
                break;

        }

    });

    return total;
}

// ============================================================
// UPCOMING PAYMENTS
// ============================================================

function renderUpcomingPayments() {

    upcomingPayments.innerHTML = "";


    if (budget.payments.length === 0) {

        upcomingPayments.innerHTML =
            "<p>No upcoming payments.</p>";

        return;

    }


    const sorted =
        [...budget.payments].sort(
            (a, b) =>
                new Date(a.nextDate) -
                new Date(b.nextDate)
        );


    sorted.slice(0, 8).forEach(payment => {

        const days =
            getDaysUntil(payment.nextDate);


        let label;
        let className = "good";


        if (days < 0) {

            label = "Overdue";

            className = "bad";

        } else if (days === 0) {

            label = "Today";

            className = "warning";

        } else if (days === 1) {

            label = "Tomorrow";

            className = "warning";

        } else if (days <= 7) {

            label = `${days} days`;

            className = "warning";

        } else {

            label = `${days} days`;

        }


        upcomingPayments.innerHTML += `

            <div class="payment-item">

                <div>

                    <strong>
                        ${escapeHtml(payment.name)}
                    </strong>

                    <br>

                    <small>
                        ${formatCurrency(payment.amount)}
                    </small>

                </div>

                <span class="${className}">
                    ${label}
                </span>

            </div>

        `;

    });

}

// ============================================================
// CURRENT BUDGET PERIOD
// ============================================================

function advancePayDayDate(date, schedule) {

    switch (schedule) {

        case "Weekly":

            date.setDate(date.getDate() + 7);

            break;


        case "Fortnightly":

            date.setDate(date.getDate() + 14);

            break;


        case "Monthly":

            date.setMonth(date.getMonth() + 1);

            break;


        default:

            date.setDate(date.getDate() + 14);

            break;

    }


    return date;

}


function getRolledNextPayDayString(
    anchorDateString,
    schedule
) {

    if (!anchorDateString) {

        return "";

    }


    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    let payDay =
        new Date(
            anchorDateString + "T00:00:00"
        );


    if (Number.isNaN(payDay.getTime())) {

        return "";

    }


    payDay.setHours(0, 0, 0, 0);


    // Keep advancing until payday is today or
    // still in the future
    while (payDay < today) {

        advancePayDayDate(
            payDay,
            schedule || "Fortnightly"
        );

    }


    return formatDateForInput(payDay);

}


function rollForwardNextPayDay() {

    if (
        !budget.settings ||
        !budget.settings.useBudgetPeriod ||
        !budget.settings.anchorDate
    ) {

        return false;

    }


    const schedule =
        budget.settings.schedule || "Fortnightly";


    const nextPayDay =
        getRolledNextPayDayString(
            budget.settings.anchorDate,
            schedule
        );


    if (
        !nextPayDay ||
        nextPayDay === budget.settings.anchorDate
    ) {

        return false;

    }


    budget.settings.anchorDate =
        nextPayDay;


    if (budgetAnchorDate) {

        budgetAnchorDate.value =
            nextPayDay;

    }


    console.log(
        "Next Pay Day rolled forward to",
        nextPayDay
    );


    return true;

}


function getCurrentBudgetPeriod() {

    if (
        !budget.settings ||
        !budget.settings.useBudgetPeriod
    ) {

        return null;

    }


    const schedule =
        budget.settings.schedule || "Fortnightly";

    const anchorDateString =
        budget.settings.anchorDate;


    // No anchor date set yet
    if (!anchorDateString) {

        return null;

    }


    const nextPayDayString =
        getRolledNextPayDayString(
            anchorDateString,
            schedule
        );


    if (!nextPayDayString) {

        return null;

    }


    const periodEnd =
        new Date(
            nextPayDayString + "T00:00:00"
        );


    periodEnd.setHours(0, 0, 0, 0);


    // ========================================================
    // CALCULATE PERIOD START
    // ========================================================

    const periodStart =
        new Date(periodEnd);


    switch (schedule) {

        case "Weekly":

            periodStart.setDate(
                periodStart.getDate() - 6
            );

            break;


        case "Fortnightly":

            periodStart.setDate(
                periodStart.getDate() - 13
            );

            break;


        case "Monthly":

            periodStart.setMonth(
                periodStart.getMonth() - 1
            );

            periodStart.setDate(
                periodStart.getDate() + 1
            );

            break;

    }


    return {

        start:
            formatDateForInput(periodStart),

        end:
            formatDateForInput(periodEnd)

    };

}

// ============================================================
// ONE-OFF PAYMENTS TOTAL
// ============================================================

function getOneOffPaymentsTotal() {

    if (
        !Array.isArray(budget.oneOffPayments) ||
        budget.oneOffPayments.length === 0
    ) {

        return 0;

    }


    let total = 0;


    budget.oneOffPayments.forEach(item => {

        total +=
            Number(item.amount) || 0;

    });


    return total;

}


// Keep older name working for any remaining callers
function getCurrentPeriodOneOffTotal() {

    return getOneOffPaymentsTotal();

}


// ============================================================
// CLEAR ONE-OFF PAYMENTS WHEN A NEW BUDGET CYCLE BEGINS
// ============================================================

function clearOneOffPaymentsFromPreviousPeriods() {

    if (
        !Array.isArray(budget.oneOffPayments)
    ) {

        budget.oneOffPayments = [];

        return false;

    }


    if (!budget.settings) {

        budget.settings = {};

    }


    const period =
        getCurrentBudgetPeriod();


    // Without a configured budget period we cannot
    // safely detect cycle rollover
    if (!period) {

        return false;

    }


    const lastSeenPeriodStart =
        budget.settings.lastSeenPeriodStart || "";


    // First time seeing a period for this profile —
    // record it, but do not delete existing one-offs yet
    if (!lastSeenPeriodStart) {

        budget.settings.lastSeenPeriodStart =
            period.start;

        return true;

    }


    // Period has not advanced
    if (lastSeenPeriodStart === period.start) {

        return false;

    }


    // Period moved backwards (e.g. schedule/anchor edited) —
    // just sync the tracker
    if (period.start < lastSeenPeriodStart) {

        budget.settings.lastSeenPeriodStart =
            period.start;

        return true;

    }


    // New fortnight/week/month cycle has begun —
    // remove one-offs from the previous cycle
    const previousCount =
        budget.oneOffPayments.length;


    budget.oneOffPayments =
        budget.oneOffPayments.filter(item => {

            if (!item || !item.nextDate) {

                return false;

            }


            return item.nextDate >= period.start;

        });


    budget.settings.lastSeenPeriodStart =
        period.start;


    console.log(
        "New budget cycle detected. Cleared",
        previousCount - budget.oneOffPayments.length,
        "one-off payment(s) from the previous period."
    );


    return true;

}

// ============================================================
// CALENDAR DOUBLE-CLICK MENU
// ============================================================

// ============================================================
// CALENDAR ADD MENU
// ============================================================

let calendarAddDateString = null;


function openCalendarAddMenu(
    dateString,
    clickX,
    clickY
) {

    calendarAddDateString =
        dateString;


    calendarAddDate.textContent =
        formatDate(dateString);


    calendarAddMenu.classList.remove(
        "hidden"
    );


    // ========================================================
    // POSITION MENU
    // ========================================================

    const menuWidth =
        calendarAddMenu.offsetWidth;

    const menuHeight =
        calendarAddMenu.offsetHeight;

    const padding = 10;


    let left =
        clickX;

    let top =
        clickY;


    // Prevent going off the right side
    if (
        left + menuWidth >
        window.innerWidth - padding
    ) {

        left =
            window.innerWidth -
            menuWidth -
            padding;

    }


    // Prevent going off the bottom
    if (
        top + menuHeight >
        window.innerHeight - padding
    ) {

        top =
            window.innerHeight -
            menuHeight -
            padding;

    }


    calendarAddMenu.style.left =
        `${left}px`;

    calendarAddMenu.style.top =
        `${top}px`;

}


// ============================================================
// CLOSE CALENDAR ADD MENU
// ============================================================

function closeCalendarAddMenu() {

    calendarAddMenu.classList.add(
        "hidden"
    );

    calendarAddDateString = null;

}


// ============================================================
// CALENDAR ADD MENU EVENTS
// ============================================================

calendarAddIncome.addEventListener(
    "click",
    () => {

        const date =
            calendarAddDateString;

        closeCalendarAddMenu();

        openModal("income");

        itemDate.value =
            date;

    }
);


calendarAddPayment.addEventListener(
    "click",
    () => {

        const date =
            calendarAddDateString;

        closeCalendarAddMenu();

        openModal("payment");

        itemDate.value =
            date;

    }
);


calendarAddOneOff.addEventListener(
    "click",
    () => {

        const date =
            calendarAddDateString;

        closeCalendarAddMenu();

        openModal("oneoff");

        itemDate.value =
            date;

    }
);


calendarAddCancel.addEventListener(
    "click",
    closeCalendarAddMenu
);


// Close menu if clicking elsewhere
document.addEventListener(
    "click",
    event => {

        if (
            !calendarAddMenu.contains(event.target) &&
            !event.target.closest(".calendar-day")
        ) {

            closeCalendarAddMenu();

        }

    }
);

// ============================================================
// CALENDAR
// ============================================================

function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    calendarMonth.textContent =
        new Date(
            year,
            month,
            1
        ).toLocaleDateString(
            "en-NZ",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarGrid.innerHTML = "";


    // ========================================================
    // DAY HEADINGS
    // ========================================================

    const dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    dayNames.forEach(day => {

        const heading =
            document.createElement("div");

        heading.className =
            "calendar-day calendar-heading";

        heading.innerHTML = `
            <div class="calendar-number">
                ${day}
            </div>
        `;

        calendarGrid.appendChild(heading);

    });


    // ========================================================
    // CALENDAR INFORMATION
    // ========================================================

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // ========================================================
    // EMPTY CELLS BEFORE MONTH STARTS
    // ========================================================

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        calendarGrid.innerHTML += `
            <div class="calendar-day empty"></div>
        `;

    }


    // ========================================================
    // ACTUAL DAYS
    // ========================================================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            formatDateForInput(date);


        const events =
            getCalendarEvents(
                dateString
            );


        const today =
            getTodayString();


        const todayClass =
            dateString === today
                ? "today"
                : "";


        let eventHtml = "";


        events.forEach(event => {

    eventHtml += `

        <div
            class="calendar-event ${event.type}"
            data-edit-type="${event.editType}"
            data-edit-id="${event.id}"
            title="Click to edit"
        >

            ${escapeHtml(event.name)}

            <br>

            <small>
                ${formatCurrency(event.amount)}
            </small>

        </div>

    `;

});




        // ====================================================
        // CREATE CALENDAR DAY
        // ====================================================

        const calendarDay =
            document.createElement("div");


        calendarDay.className =
            `calendar-day ${todayClass}`;


        calendarDay.innerHTML = `

            <div class="calendar-number">
                ${day}
            </div>

            ${eventHtml}

        `;

// ========================================================
// CLICK CALENDAR EVENT TO EDIT
// ========================================================

calendarDay
    .querySelectorAll(".calendar-event")
    .forEach(eventElement => {

        eventElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const editType =
                    eventElement.dataset.editType;

                const editId =
                    eventElement.dataset.editId;

                editItem(
                    editType,
                    editId
                );

            }
        );

    });

        // ====================================================
        // DOUBLE-CLICK CALENDAR DATE
        // ====================================================

		calendarDay.addEventListener(
    "dblclick",
    event => {

        openCalendarAddMenu(
            dateString,
            event.clientX,
            event.clientY
        );

    }
);


        calendarGrid.appendChild(
            calendarDay
        );

    }

}


// ============================================================
// CALENDAR EVENTS
// ============================================================

// ============================================================
// CALENDAR EVENTS
// ============================================================

function getCalendarEvents(dateString) {

    const events = [];

    const targetDate =
        new Date(
            dateString + "T00:00:00"
        );


    // ----------------------------------------
    // INCOME
    // ----------------------------------------

    budget.income.forEach(item => {

        if (isRecurringOnDate(item, targetDate)) {

            events.push({

                type: "income-event",

                editType: "income",

                id: item.id,

                name: item.name,

                amount: item.amount

            });

        }

    });


    // ----------------------------------------
    // RECURRING PAYMENTS
    // ----------------------------------------

    budget.payments.forEach(item => {

        if (isRecurringOnDate(item, targetDate)) {

            events.push({

                type: "payment-event",

                editType: "payment",

                id: item.id,

                name: item.name,

                amount: item.amount

            });

        }

    });


    // ----------------------------------------
    // ONE-OFF PAYMENTS
    // ----------------------------------------

    budget.oneOffPayments.forEach(item => {

        if (item.nextDate === dateString) {

            events.push({

                type: "oneoff-event",

                editType: "oneoff",

                id: item.id,

                name: item.name,

                amount: item.amount

            });

        }

    });


    // ----------------------------------------
    // SAVINGS GOALS
    // ----------------------------------------

    if (Array.isArray(budget.savingsGoals)) {

        budget.savingsGoals.forEach(item => {

            if (!item.includeInBudget) {

                return;

            }


            const breakdown =
                getSavingsBreakdown(
                    item.amount,
                    item.targetDate
                );


            // Deadline / goal target date
            if (item.targetDate === dateString) {

                events.push({

                    type: "savings-event",

                    editType: "savings",

                    id: item.id,

                    name: `Goal: ${item.name}`,

                    amount: item.amount

                });

                return;

            }


            // Weekly contribution dates leading up
            // to the goal so they appear on the
            // current calendar month as well
            if (
                !breakdown.valid ||
                breakdown.overdue
            ) {

                return;

            }


            if (
                isSavingsContributionOnDate(
                    item,
                    dateString
                )
            ) {

                events.push({

                    type: "savings-event",

                    editType: "savings",

                    id: item.id,

                    name: `Save: ${item.name}`,

                    amount: breakdown.weekly

                });

            }

        });

    }


    return events;

}


// ============================================================
// SAVINGS CONTRIBUTION DATES
// ============================================================

function isSavingsContributionOnDate(
    goal,
    dateString
) {

    if (
        !goal ||
        !goal.targetDate ||
        !dateString
    ) {

        return false;

    }


    const date =
        new Date(dateString + "T00:00:00");

    const target =
        new Date(goal.targetDate + "T00:00:00");

    const today =
        new Date(getTodayString() + "T00:00:00");


    date.setHours(0, 0, 0, 0);

    target.setHours(0, 0, 0, 0);

    today.setHours(0, 0, 0, 0);


    // Only show from today through the day before
    // the deadline (deadline has its own event)
    if (date < today || date >= target) {

        return false;

    }


    const startDateString =
        goal.startDate || getTodayString();

    const startDate =
        new Date(startDateString + "T00:00:00");

    startDate.setHours(0, 0, 0, 0);


    // If the stored start is in the future, wait
    // until then; if in the past, align weekly
    // from that original start date
    if (date < startDate) {

        return false;

    }


    const diffDays =
        Math.round(
            (date - startDate) /
            (1000 * 60 * 60 * 24)
        );


    return diffDays % 7 === 0;

}

	

// ============================================================
// CHECK RECURRING EVENT DATE
// ============================================================

function isRecurringOnDate(item, targetDate) {

    const startDate =
        new Date(item.nextDate + "T00:00:00");


    targetDate.setHours(0, 0, 0, 0);

    startDate.setHours(0, 0, 0, 0);


    // Don't show events before their starting date

    if (targetDate < startDate) {

        return false;

    }


    const diffDays =
        Math.round(
            (targetDate - startDate) /
            (1000 * 60 * 60 * 24)
        );


    switch (item.frequency) {


        case "Weekly":

            return diffDays % 7 === 0;


        case "Fortnightly":

            return diffDays % 14 === 0;


        case "Monthly":

            return (
                targetDate.getDate() ===
                startDate.getDate()
            );


        case "Quarterly":

            const monthDifference =
                (
                    targetDate.getFullYear() -
                    startDate.getFullYear()
                ) * 12 +
                (
                    targetDate.getMonth() -
                    startDate.getMonth()
                );


            return (
                monthDifference >= 0 &&
                monthDifference % 3 === 0 &&
                targetDate.getDate() ===
                startDate.getDate()
            );


        case "Yearly":

            return (
                targetDate.getMonth() ===
                startDate.getMonth() &&
                targetDate.getDate() ===
                startDate.getDate()
            );


        default:

            return false;

    }

}


// ============================================================
// DATE HELPERS
// ============================================================

function getTodayString() {

    return formatDateForInput(
        new Date()
    );

}


function formatDateForInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    return new Date(
        dateString + "T00:00:00"
    ).toLocaleDateString(
        "en-NZ",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function getDaysUntil(dateString) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const due =
        new Date(
            dateString + "T00:00:00"
        );


    due.setHours(
        0,
        0,
        0,
        0
    );


    return Math.round(
        (due - today) /
        (1000 * 60 * 60 * 24)
    );

}


// ============================================================
// MISC HELPERS
// ============================================================

function generateId() {

    if (
        window.crypto &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-NZ",
        {
            style: "currency",
            currency: "NZD"
        }
    ).format(Number(value) || 0);

}

function updateCurrentDate() {

    if (!currentDate) {
        return;
    }

    const now = new Date();

    currentDate.textContent =
    "Today's Date • " +
    now.toLocaleDateString(
        "en-NZ",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

// ============================================================
// DEBUG
// ============================================================

window.budget = budget;

console.log(
    "Budget Dashboard loaded."
);

console.log(
    "Current budget period:",
    getCurrentBudgetPeriod()
);

// ============================================================
// SMART TOOLTIPS
// ============================================================

function setupSmartTooltips() {

    const tooltips =
        document.querySelectorAll(".tooltip");


    tooltips.forEach(tooltip => {

        tooltip.addEventListener(
            "mouseenter",
            () => {

                positionTooltip(tooltip);

            }
        );

    });

}


function positionTooltip(tooltip) {

    // Reset previous positioning
    tooltip.classList.remove(
        "tooltip-bottom",
        "tooltip-left",
        "tooltip-right"
    );


    const tooltipText =
        tooltip.querySelector(".tooltip-text");


    if (!tooltipText) {

        return;

    }


    // Temporarily reveal for accurate measurement
    const previousOpacity =
        tooltipText.style.opacity;

    const previousVisibility =
        tooltipText.style.visibility;


    tooltipText.style.opacity = "1";

    tooltipText.style.visibility = "hidden";


    const rect =
        tooltip.getBoundingClientRect();


    const tooltipWidth =
        tooltipText.offsetWidth || 240;


    const tooltipHeight =
        tooltipText.offsetHeight || 80;


    tooltipText.style.opacity =
        previousOpacity;

    tooltipText.style.visibility =
        previousVisibility;


    const spacing = 8;


    // ========================================================
    // CHECK VERTICAL SPACE
    // Prefer above; only flip below when needed
    // ========================================================

    const spaceAbove =
        rect.top;


    const spaceBelow =
        window.innerHeight - rect.bottom;


    if (
        spaceAbove <
            tooltipHeight + spacing
        &&
        spaceBelow >=
            tooltipHeight + spacing
    ) {

        tooltip.classList.add(
            "tooltip-bottom"
        );

    }


    // ========================================================
    // CHECK HORIZONTAL SPACE
    // ========================================================

    const tooltipLeft =
        rect.left +
        (rect.width / 2) -
        (tooltipWidth / 2);


    const tooltipRight =
        tooltipLeft +
        tooltipWidth;


    // Too far left
    if (tooltipLeft < 8) {

        tooltip.classList.add(
            "tooltip-right"
        );

    }


    // Too far right
    else if (
        tooltipRight >
        window.innerWidth - 8
    ) {

        tooltip.classList.add(
            "tooltip-left"
        );

    }

}

/* ==========================================================
   THEME
========================================================== */

function setupTheme() {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("budgetTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

    }

    updateThemeButton();


    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        localStorage.setItem(
            "budgetTheme",
            isLight ? "light" : "dark"
        );

        updateThemeButton();

    });

}


function updateThemeButton() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;

    const icon =
        themeToggle.querySelector("i");

    const isLight =
        document.body.classList.contains("light-mode");


    if (isLight) {

        icon.className =
            "fa-solid fa-moon";

        themeToggle.title =
            "Switch to dark mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    } else {

        icon.className =
            "fa-solid fa-sun";

        themeToggle.title =
            "Switch to light mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    }

}

// ============================================================
// INITIALISE SMART TOOLTIPS
// ============================================================

setupSmartTooltips();