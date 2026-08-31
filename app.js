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

let payCalcCountry =
    localStorage.getItem("budgioPayCalcCountry") ||
    "nz";

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

const sevenDayForecast =
    document.getElementById("sevenDayForecast");

const forecastSummary =
    document.getElementById("forecastSummary");

const forecastOpenCalendarBtn =
    document.getElementById("forecastOpenCalendarBtn");

const upcomingPanel =
    document.getElementById("upcomingPanel");

const upcomingViewSwitch =
    document.getElementById("upcomingViewSwitch");

const upcomingViewTitle =
    document.getElementById("upcomingViewTitle");

const UPCOMING_VIEW_KEY =
    "budgioUpcomingView";

let upcomingView =
    localStorage.getItem(UPCOMING_VIEW_KEY) ===
    "forecast"
        ? "forecast"
        : "list";

const incomePeriodLabel =
    document.getElementById("incomePeriodLabel");

const paymentsPeriodLabel =
    document.getElementById("paymentsPeriodLabel");
	
const upcomingPayments =
    document.getElementById("upcomingPayments");

const upcomingPaymentsTally =
    document.getElementById("upcomingPaymentsTally");

const upcomingPaymentsTallySum =
    document.getElementById("upcomingPaymentsTallySum");

const upcomingPaymentsBankInput =
    document.getElementById("upcomingPaymentsBankInput");

const upcomingPaymentsBankLeft =
    document.getElementById("upcomingPaymentsBankLeft");

const clearUpcomingPaymentsSelectionBtn =
    document.getElementById("clearUpcomingPaymentsSelection");

const selectedUpcomingPaymentIds = new Set();

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

const payHourlyRateLabel =
    document.getElementById("payHourlyRateLabel");

const payHoursPerWeek =
    document.getElementById("payHoursPerWeek");

const payCalcIntro =
    document.getElementById("payCalcIntro");

const payCalcNote =
    document.getElementById("payCalcNote");

const payOptionsNz =
    document.getElementById("payOptionsNz");

const payOptionsUk =
    document.getElementById("payOptionsUk");

const payOptionsAu =
    document.getElementById("payOptionsAu");

const payOptionsUs =
    document.getElementById("payOptionsUs");

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

const payUkStudentLoan =
    document.getElementById("payUkStudentLoan");

const payUkPension =
    document.getElementById("payUkPension");

const payUkPensionOptions =
    document.getElementById("payUkPensionOptions");

const payUkPensionRate =
    document.getElementById("payUkPensionRate");

const payShowUkEmployerPension =
    document.getElementById("payShowUkEmployerPension");

const payAuHelp =
    document.getElementById("payAuHelp");

const payAuSuper =
    document.getElementById("payAuSuper");

const payAuSuperOptions =
    document.getElementById("payAuSuperOptions");

const payAuSuperRate =
    document.getElementById("payAuSuperRate");

const payShowAuEmployerSuper =
    document.getElementById("payShowAuEmployerSuper");

const payUsFilingStatus =
    document.getElementById("payUsFilingStatus");

const payUs401k =
    document.getElementById("payUs401k");

const payUs401kOptions =
    document.getElementById("payUs401kOptions");

const payUs401kRate =
    document.getElementById("payUs401kRate");

const payUsStateTax =
    document.getElementById("payUsStateTax");

const payNetLabel =
    document.getElementById("payNetLabel");

const payNetAmount =
    document.getElementById("payNetAmount");

const payGrossAmount =
    document.getElementById("payGrossAmount");

const payIncomeTaxLabel =
    document.getElementById("payIncomeTaxLabel");

const payIncomeTaxAmount =
    document.getElementById("payIncomeTaxAmount");

const payLevyRow =
    document.getElementById("payLevyRow");

const payLevyLabel =
    document.getElementById("payLevyLabel");

const payLevyAmount =
    document.getElementById("payLevyAmount");

const payMedicareRow =
    document.getElementById("payMedicareRow");

const payMedicareAmount =
    document.getElementById("payMedicareAmount");

const payStateTaxRow =
    document.getElementById("payStateTaxRow");

const payStateTaxLabel =
    document.getElementById("payStateTaxLabel");

const payStateTaxAmount =
    document.getElementById("payStateTaxAmount");

const payStudentLoanRow =
    document.getElementById("payStudentLoanRow");

const payStudentLoanLabel =
    document.getElementById("payStudentLoanLabel");

const payStudentLoanAmount =
    document.getElementById("payStudentLoanAmount");

const payRetirementRow =
    document.getElementById("payRetirementRow");

const payRetirementLabel =
    document.getElementById("payRetirementLabel");

const payRetirementAmount =
    document.getElementById("payRetirementAmount");

const payDeductionsAmount =
    document.getElementById("payDeductionsAmount");

const payEmployerBox =
    document.getElementById("payEmployerBox");

const payEmployerLabel =
    document.getElementById("payEmployerLabel");

const payEmployerAmount =
    document.getElementById("payEmployerAmount");

const payEffectiveRate =
    document.getElementById("payEffectiveRate");

const payNetHourly =
    document.getElementById("payNetHourly");

const paymentsPaidSummary =
    document.getElementById("paymentsPaidSummary");

const savingsProgressModal =
    document.getElementById("savingsProgressModal");

const savingsProgressTitle =
    document.getElementById("savingsProgressTitle");

const savingsProgressSubtitle =
    document.getElementById("savingsProgressSubtitle");

const savingsProgressForm =
    document.getElementById("savingsProgressForm");

const savingsProgressAmount =
    document.getElementById("savingsProgressAmount");

const savingsProgressNote =
    document.getElementById("savingsProgressNote");

const cancelSavingsProgressBtn =
    document.getElementById("cancelSavingsProgressBtn");

let loggingSavingsGoalId = null;
let editingContributionId = null;
	
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

async function startApp() {

    console.log("START APP 1");

    // Wait for optional Firebase bootstrap (no-op if disabled)
    if (window.BudgetCloudReady) {

        try {

            await window.BudgetCloudReady;

        } catch (error) {

            console.warn("Cloud ready failed:", error);

        }

    }

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

    // If already signed in (or signs in later), sync cloud ↔ local
    if (window.BudgetCloud?.authReady) {

        try {

            await window.BudgetCloud.authReady;

        } catch (error) {

            console.warn("Auth ready failed:", error);

        }

    }

    if (
        window.BudgetCloud &&
        window.BudgetCloud.isSignedIn()
    ) {

        await syncFromCloudOnLogin();

    }

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        startApp();
    });
} else {
    startApp();
}


// ============================================================
// EVENTS
// ============================================================

function setupBudgetSettingsToggle() {

    const panel =
        document.querySelector(
            ".mobile-budget-settings"
        );

    const toggle =
        document.getElementById(
            "budgetSettingsToggle"
        );


    if (!panel || !toggle) {

        return;

    }


    toggle.addEventListener(
        "click",
        () => {

            const open =
                panel.classList.toggle(
                    "is-open"
                );


            toggle.setAttribute(
                "aria-expanded",
                open ? "true" : "false"
            );

        }
    );

}



function setupEvents() {

    setupBudgetSettingsToggle();

    setupUpcomingPaymentsSelection();

    // Navigation
    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            showPage(button.dataset.page);

        });

    });

    setupSevenDayForecast();

    setupUpcomingViewSwitch();

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

    if (savingsProgressForm) {

        savingsProgressForm.addEventListener(
            "submit",
            saveSavingsProgress
        );

    }

    if (cancelSavingsProgressBtn) {

        cancelSavingsProgressBtn.addEventListener(
            "click",
            closeSavingsProgressModal
        );

    }

    if (savingsProgressModal) {

        savingsProgressModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    savingsProgressModal
                ) {

                    closeSavingsProgressModal();

                }

            }
        );

    }
	
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

            if (!budget.settings) {

                budget.settings = {};

            }

            budget.settings.anchorDate =
                budgetAnchorDate.value;

            // Setting a payday means this profile
            // uses budget periods
            if (budget.settings.anchorDate) {

                budget.settings.useBudgetPeriod =
                    true;

            }

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

    clearUpcomingPaymentSelection();

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
// CLOUD SYNC (Firebase)
// ============================================================

function applyStoragePayload(data) {

    if (
        !data ||
        !Array.isArray(data.profiles)
    ) {

        return false;

    }


    profiles = data.profiles;

    activeProfileId =
        data.activeProfileId;


    if (profiles.length === 0) {

        return false;

    }


    let activeProfile =
        profiles.find(
            profile =>
                profile.id ===
                activeProfileId
        );


    if (!activeProfile) {

        activeProfile = profiles[0];

        activeProfileId =
            activeProfile.id;

    }


    budget =
        activeProfile.budget;


    if (!budget) {

        budget = {
            income: [],
            payments: [],
            oneOffPayments: [],
            savingsGoals: [],
            settings: {
                schedule: "Fortnightly",
                anchorDate: ""
            }
        };

        activeProfile.budget = budget;

    }


    if (!Array.isArray(budget.income)) {

        budget.income = [];

    }


    if (!Array.isArray(budget.payments)) {

        budget.payments = [];

    }


    if (!Array.isArray(budget.oneOffPayments)) {

        budget.oneOffPayments = [];

    }


    if (!Array.isArray(budget.savingsGoals)) {

        budget.savingsGoals = [];

    }


    if (!budget.settings) {

        budget.settings = {};

    }


    if (
        typeof budget.settings.useBudgetPeriod !==
        "boolean"
    ) {

        budget.settings.useBudgetPeriod =
            !!budget.settings.anchorDate;

    }


    if (!budget.settings.schedule) {

        budget.settings.schedule =
            "Fortnightly";

    }


    if (!budget.settings.anchorDate) {

        budget.settings.anchorDate = "";

    }


    if (!budget.settings.paymentsSort) {

        budget.settings.paymentsSort =
            "custom";

    }


    return true;

}



async function syncFromCloudOnLogin() {

    if (
        !window.BudgetCloud ||
        !window.BudgetCloud.isSignedIn()
    ) {

        return;

    }


    const cloudData =
        await window.BudgetCloud.loadUserData();


    if (
        cloudData &&
        Array.isArray(cloudData.profiles) &&
        cloudData.profiles.length > 0
    ) {

        applyStoragePayload(cloudData);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(getStoragePayload())
        );

        updateScheduleSelector();

        updateRecurringDates();

        renderProfiles();

        renderAll();

        console.log(
            "[BudgetCloud] Loaded budget from Firestore"
        );

        return;

    }


    const localPayload =
        getStoragePayload();


    await window.BudgetCloud.saveNow(
        localPayload
    );


    console.log(
        "[BudgetCloud] Uploaded local budget to Firestore"
    );

}



window.onBudgetAuthChanged = async function onBudgetAuthChanged(user) {

    if (user) {

        await syncFromCloudOnLogin();

        return;

    }


    if (window.BudgetCloud) {

        window.BudgetCloud.refreshAuthUi();

    }

};



// ============================================================
// STORAGE
// ============================================================

function getStoragePayload() {

    return {
        activeProfileId: activeProfileId,
        profiles: profiles
    };

}



function saveData() {

    const storageData =
        getStoragePayload();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(storageData)
    );

    // Mirror to Firestore when signed in (debounced in cloud.js)
    if (
        window.BudgetCloud &&
        window.BudgetCloud.isSignedIn()
    ) {

        window.BudgetCloud.queueSave(
            storageData
        );

    }

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


    if (page !== "dashboard") {

        clearUpcomingPaymentSelection();

    }


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


    const collection =
        editingType === "income"
            ? budget.income
            : budget.payments;


    const existing =
        editingId
            ? collection.find(
                entry =>
                    entry.id === editingId
            )
            : null;


    if (editingId && !existing) {

        alert(
            "Could not find the item you're editing."
        );

        return;

    }


    const item = {

        ...(existing || {}),

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


    if (editingType === "payment") {

        delete item.deductedBeforePay;

    }


    if (editingId) {

        const index =
            collection.findIndex(
                entry =>
                    entry.id === editingId
            );


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

function getPaymentPeriodKey() {

    const period =
        getCurrentBudgetPeriod();


    if (period && period.start) {

        return period.start;

    }


    // Fallback when payday isn't configured:
    // use the current calendar date as the period key
    return getTodayString();

}


function isPaymentPaidThisPeriod(payment) {

    if (!payment) {

        return false;

    }


    return (
        payment.paidPeriodStart ===
        getPaymentPeriodKey()
    );

}


function getPaymentsPaidSummary() {

    if (
        !Array.isArray(budget.payments) ||
        budget.payments.length === 0
    ) {

        return {
            paid: 0,
            total: 0
        };

    }


    const total =
        budget.payments.length;


    const paid =
        budget.payments.filter(
            item =>
                isPaymentPaidThisPeriod(item)
        ).length;


    return {
        paid,
        total
    };

}


function markPaid(id) {

    const payment =
        budget.payments.find(
            item => item.id === id
        );


    if (!payment) {

        return;

    }


    const periodKey =
        getPaymentPeriodKey();


    if (payment.paidPeriodStart === periodKey) {

        payment.paidPeriodStart = "";

    } else {

        payment.paidPeriodStart =
            periodKey;

    }


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

    renderSevenDayForecast();

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

                <td data-label="Name">
                    ${escapeHtml(item.name)}
                </td>

                <td data-label="Amount">
                    ${formatCurrency(item.amount)}
                </td>

                <td data-label="Frequency">
                    ${escapeHtml(item.frequency)}
                </td>

                <td data-label="Next Payment">
                    ${formatDate(item.nextDate)}
                </td>

                <td class="actions" data-label="Actions">

                    <div class="row-actions">

                        <button
                            type="button"
                            class="action-btn edit-btn"
                            onclick="editItem('income', '${item.id}')"
                            title="Edit"
                            aria-label="Edit">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            onclick="deleteItem('income', '${item.id}')"
                            title="Delete"
                            aria-label="Delete">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

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


    function isInteractiveTarget(target) {

        return Boolean(
            target &&
            target.closest(
                "button, a, input, select, textarea, label"
            )
        );

    }


    rows.forEach(row => {

        // Whole-row drag (no grip dots); skip when clicking controls
        row.draggable = true;


        row.addEventListener(
            "dragstart",
            event => {

                if (isInteractiveTarget(event.target)) {

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
                <td colspan="5">
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

            <tr data-payment-id="${item.id}">

                <td data-label="Name">
                    ${escapeHtml(item.name)}
                </td>

                <td data-label="Amount">
                    ${formatCurrency(item.amount)}
                </td>

                <td data-label="Frequency">
                    ${escapeHtml(item.frequency)}
                </td>

                <td class="${statusClass}" data-label="Next Due">
                    ${formatDate(item.nextDate)}
                </td>

                <td data-label="Actions">

                    <div class="row-actions">

                        <button
                            type="button"
                            class="action-btn edit-btn"
                            onclick="editItem('payment', '${item.id}')"
                            title="Edit"
                            aria-label="Edit">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            onclick="deleteItem('payment', '${item.id}')"
                            title="Delete"
                            aria-label="Delete">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

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

                <td data-label="Name">
                    ${escapeHtml(item.name)}
                </td>

                <td data-label="Amount">
                    ${formatCurrency(item.amount)}
                </td>

                <td data-label="Date">
                    ${formatDate(item.nextDate)}
                </td>

                <td data-label="Actions">

                    <div class="row-actions">

                        <button
                            type="button"
                            class="action-btn edit-btn"
                            onclick="editItem('oneoff', '${item.id}')"
                            title="Edit"
                            aria-label="Edit">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            onclick="deleteItem('oneoff', '${item.id}')"
                            title="Delete"
                            aria-label="Delete">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

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

        savedAmount:
            0,

        contributions:
            [],

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

        goal.savedAmount =
            Number(existing.savedAmount) || 0;

        goal.contributions =
            Array.isArray(existing.contributions)
                ? existing.contributions
                : [];


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


function getSavingsSavedAmount(goal) {

    return Math.max(
        0,
        Number(goal && goal.savedAmount) || 0
    );

}


function getSavingsProgress(goal) {

    const target =
        Math.max(
            0,
            Number(goal && goal.amount) || 0
        );

    const saved =
        getSavingsSavedAmount(goal);

    const remaining =
        Math.max(0, target - saved);

    const percent =
        target > 0
            ? Math.min(
                100,
                (saved / target) * 100
            )
            : 0;


    return {
        target,
        saved,
        remaining,
        percent,
        complete: target > 0 && saved >= target
    };

}


function openSavingsProgressModal(
    goalId,
    contributionId = null
) {

    ensureSavingsGoalsArray();


    const goal =
        budget.savingsGoals.find(
            item => item.id === goalId
        );


    if (!goal || !savingsProgressModal) {

        return;

    }


    loggingSavingsGoalId = goalId;

    editingContributionId = contributionId;


    const progress =
        getSavingsProgress(goal);


    if (savingsProgressTitle) {

        savingsProgressTitle.textContent =
            contributionId
                ? `Edit Contribution · ${goal.name}`
                : `Log Progress · ${goal.name}`;

    }


    if (savingsProgressSubtitle) {

        savingsProgressSubtitle.textContent =
            `${formatCurrency(progress.saved)} saved of ${formatCurrency(progress.target)} · ${formatCurrency(progress.remaining)} to go`;

    }


    if (savingsProgressForm) {

        savingsProgressForm.reset();

    }


    if (contributionId) {

        const contribution =
            (
                Array.isArray(goal.contributions)
                    ? goal.contributions
                    : []
            ).find(
                item => item.id === contributionId
            );


        if (contribution) {

            if (savingsProgressAmount) {

                savingsProgressAmount.value =
                    contribution.amount;

            }

            if (savingsProgressNote) {

                savingsProgressNote.value =
                    contribution.note || "";

            }

        }

    }


    const submitBtn =
        savingsProgressForm &&
        savingsProgressForm.querySelector(
            "button[type='submit']"
        );


    if (submitBtn) {

        const label =
            submitBtn.querySelector("span") ||
            submitBtn;


        if (submitBtn.querySelector("span")) {

            submitBtn.querySelector("span").textContent =
                contributionId
                    ? "Save Changes"
                    : "Add Progress";

        } else {

            submitBtn.innerHTML =
                contributionId
                    ? `<i class="fa-solid fa-floppy-disk"></i> Save Changes`
                    : `<i class="fa-solid fa-plus"></i> Add Progress`;

        }

    }


    if (savingsProgressAmount) {

        savingsProgressAmount.focus();

    }


    savingsProgressModal.classList.remove("hidden");

}


function closeSavingsProgressModal() {

    loggingSavingsGoalId = null;

    editingContributionId = null;


    if (savingsProgressForm) {

        savingsProgressForm.reset();

    }


    if (savingsProgressModal) {

        savingsProgressModal.classList.add("hidden");

    }

}


function recalculateSavingsSavedAmount(goal) {

    if (!goal) {

        return 0;

    }


    const contributions =
        Array.isArray(goal.contributions)
            ? goal.contributions
            : [];


    const total =
        contributions.reduce(
            (sum, item) =>
                sum + (Number(item.amount) || 0),
            0
        );


    goal.savedAmount = total;

    goal.contributions = contributions;


    return total;

}


function saveSavingsProgress(event) {

    event.preventDefault();


    ensureSavingsGoalsArray();


    const goal =
        budget.savingsGoals.find(
            item =>
                item.id === loggingSavingsGoalId
        );


    if (!goal) {

        alert("Could not find that savings goal.");

        closeSavingsProgressModal();

        return;

    }


    const amount =
        Number(
            savingsProgressAmount &&
                savingsProgressAmount.value
        );


    if (isNaN(amount) || amount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    const note =
        savingsProgressNote
            ? savingsProgressNote.value.trim()
            : "";


    if (!Array.isArray(goal.contributions)) {

        goal.contributions = [];

    }


    if (editingContributionId) {

        const index =
            goal.contributions.findIndex(
                item =>
                    item.id === editingContributionId
            );


        if (index === -1) {

            alert(
                "Could not find that contribution."
            );

            return;

        }


        goal.contributions[index] = {

            ...goal.contributions[index],

            amount: amount,

            note: note

        };

    } else {

        goal.contributions.push({

            id: generateId(),

            amount: amount,

            note: note,

            date: getTodayString()

        });

    }


    recalculateSavingsSavedAmount(goal);


    saveData();

    closeSavingsProgressModal();

    renderAll();

}


function editSavingsContribution(
    goalId,
    contributionId
) {

    openSavingsProgressModal(
        goalId,
        contributionId
    );

}


function deleteSavingsContribution(
    goalId,
    contributionId
) {

    ensureSavingsGoalsArray();


    const goal =
        budget.savingsGoals.find(
            item => item.id === goalId
        );


    if (!goal) {

        return;

    }


    const contribution =
        (
            Array.isArray(goal.contributions)
                ? goal.contributions
                : []
        ).find(
            item => item.id === contributionId
        );


    if (!contribution) {

        return;

    }


    const confirmed =
        confirm(
            `Delete contribution of ${formatCurrency(contribution.amount)}?`
        );


    if (!confirmed) {

        return;

    }


    goal.contributions =
        goal.contributions.filter(
            item => item.id !== contributionId
        );


    recalculateSavingsSavedAmount(goal);


    saveData();

    renderAll();

}


function resetSavingsProgress(goalId) {

    ensureSavingsGoalsArray();


    const goal =
        budget.savingsGoals.find(
            item => item.id === goalId
        );


    if (!goal) {

        return;

    }


    const confirmed =
        confirm(
            `Reset all progress for "${goal.name}"?`
        );


    if (!confirmed) {

        return;

    }


    goal.savedAmount = 0;

    goal.contributions = [];


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

        const progress =
            getSavingsProgress(goal);


        const breakdown =
            getSavingsBreakdown(
                progress.remaining > 0
                    ? progress.remaining
                    : goal.amount,
                goal.targetDate
            );


        const card =
            document.createElement("div");

        card.className =
            "savings-goal-card";


        const weeklyLabel =
            progress.complete
                ? "Goal reached"
                : breakdown.overdue
                    ? formatCurrency(progress.remaining) +
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

            <div class="savings-progress-block">

                <div class="savings-progress-bar">

                    <div
                        class="savings-progress-fill"
                        style="width: ${progress.percent.toFixed(1)}%;">
                    </div>

                </div>

                <div class="savings-progress-stats">

                    <span>
                        <strong>${formatCurrency(progress.saved)}</strong>
                        saved
                    </span>

                    <span>
                        <strong>${progress.percent.toFixed(0)}%</strong>
                    </span>

                    <span>
                        <strong>${formatCurrency(progress.remaining)}</strong>
                        to go
                    </span>

                </div>

                <div class="savings-progress-actions">

                    <button
                        type="button"
                        class="primary-btn"
                        data-log-savings="${goal.id}">

                        <i class="fa-solid fa-plus"></i>

                        Log Progress

                    </button>

                    ${
                        progress.saved > 0
                            ? `
                                <button
                                    type="button"
                                    class="secondary-btn"
                                    data-reset-savings="${goal.id}">

                                    Reset

                                </button>
                            `
                            : ""
                    }

                </div>

                <div class="savings-contribution-list">

                    <h5>Contribution History</h5>

                    ${
                        (
                            Array.isArray(goal.contributions) &&
                            goal.contributions.length > 0
                        )
                            ? [...goal.contributions]
                                .sort(
                                    (a, b) =>
                                        new Date(b.date) -
                                        new Date(a.date)
                                )
                                .map(contribution => `
                                    <div class="savings-contribution-item">

                                        <div>

                                            <strong>
                                                ${formatCurrency(contribution.amount)}
                                            </strong>

                                            <small>
                                                ${formatDate(contribution.date)}${
                                                    contribution.note
                                                        ? ` · ${escapeHtml(contribution.note)}`
                                                        : ""
                                                }
                                            </small>

                                        </div>

                                        <div class="row-actions">

                                            <button
                                                type="button"
                                                class="action-btn edit-btn"
                                                data-edit-contribution="${contribution.id}"
                                                data-goal-id="${goal.id}"
                                                title="Edit"
                                                aria-label="Edit contribution">

                                                <i class="fa-solid fa-pen"></i>

                                            </button>

                                            <button
                                                type="button"
                                                class="action-btn delete-btn"
                                                data-delete-contribution="${contribution.id}"
                                                data-goal-id="${goal.id}"
                                                title="Delete"
                                                aria-label="Delete contribution">

                                                <i class="fa-solid fa-trash"></i>

                                            </button>

                                        </div>

                                    </div>
                                `).join("")
                            : `<div class="savings-contribution-empty">No contributions logged yet.</div>`
                    }

                </div>

            </div>

            <div class="savings-goal-highlight">

                <span>
                    ${
                        progress.complete
                            ? "Completed"
                            : breakdown.overdue
                                ? "Goal date reached"
                                : "Required weekly savings"
                    }
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


    savingsGoalsList
        .querySelectorAll("[data-log-savings]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openSavingsProgressModal(
                        button.dataset.logSavings
                    );

                }
            );

        });


    savingsGoalsList
        .querySelectorAll("[data-reset-savings]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    resetSavingsProgress(
                        button.dataset.resetSavings
                    );

                }
            );

        });


    savingsGoalsList
        .querySelectorAll("[data-edit-contribution]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editSavingsContribution(
                        button.dataset.goalId,
                        button.dataset.editContribution
                    );

                }
            );

        });


    savingsGoalsList
        .querySelectorAll("[data-delete-contribution]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteSavingsContribution(
                        button.dataset.goalId,
                        button.dataset.deleteContribution
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


        const progress =
            getSavingsProgress(goal);


        if (progress.complete) {

            return;

        }


        const breakdown =
            getSavingsBreakdown(
                progress.remaining,
                goal.targetDate
            );


        if (!breakdown.valid) {

            return;

        }


        // If the date is already reached, treat the
        // remaining goal amount as due in this period
        if (breakdown.overdue) {

            total +=
                progress.remaining;

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
// PAY CALCULATOR (NZ / UK / US)
// ============================================================

const PAY_CALC_WEEKS = 52;

const NZ_PAY_TAX = {

    yearLabel: "2026/27",

    currency: "NZD",

    symbolHint: "$",

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

    employerKiwiSaverRate: 0.03

};


const UK_PAY_TAX = {

    yearLabel: "2025/26",

    currency: "GBP",

    symbolHint: "£",

    personalAllowance: 12570,

    paTaperStart: 100000,

    basicBand: 37700,

    higherLimit: 125140,

    basicRate: 0.20,

    higherRate: 0.40,

    additionalRate: 0.45,

    niPrimaryThreshold: 12570,

    niUpperLimit: 50270,

    niMainRate: 0.08,

    niUpperRate: 0.02,

    studentLoanThreshold: 28470,

    studentLoanRate: 0.09,

    employerPensionRate: 0.03

};


const US_PAY_TAX = {

    yearLabel: "2025",

    currency: "USD",

    symbolHint: "$",

    single: {
        standardDeduction: 15000,
        brackets: [
            { upTo: 11925, rate: 0.10 },
            { upTo: 48475, rate: 0.12 },
            { upTo: 103350, rate: 0.22 },
            { upTo: 197300, rate: 0.24 },
            { upTo: 250525, rate: 0.32 },
            { upTo: 626350, rate: 0.35 },
            { upTo: Infinity, rate: 0.37 }
        ],
        additionalMedicareThreshold: 200000
    },

    married: {
        standardDeduction: 30000,
        brackets: [
            { upTo: 23850, rate: 0.10 },
            { upTo: 96950, rate: 0.12 },
            { upTo: 206700, rate: 0.22 },
            { upTo: 394600, rate: 0.24 },
            { upTo: 501050, rate: 0.32 },
            { upTo: 751600, rate: 0.35 },
            { upTo: Infinity, rate: 0.37 }
        ],
        additionalMedicareThreshold: 250000
    },

    socialSecurityRate: 0.062,

    socialSecurityWageBase: 176100,

    medicareRate: 0.0145,

    additionalMedicareRate: 0.009

};


const AU_PAY_TAX = {

    yearLabel: "2025–26",

    currency: "AUD",

    symbolHint: "$",

    brackets: [
        { upTo: 18200, rate: 0 },
        { upTo: 45000, rate: 0.16 },
        { upTo: 135000, rate: 0.30 },
        { upTo: 190000, rate: 0.37 },
        { upTo: Infinity, rate: 0.45 }
    ],

    medicareRate: 0.02,

    medicareLowThreshold: 28011,

    medicareFullThreshold: 35014,

    litoMax: 700,

    litoLower: 37500,

    litoMid: 45000,

    litoUpper: 66667,

    helpThreshold: 67000,

    helpMid: 125000,

    helpTop: 179285,

    helpMidRate: 0.15,

    helpUpperRate: 0.17,

    helpTopFlatRate: 0.10,

    helpMidCapAmount: 8700,

    employerSuperRate: 0.12

};


function setupPayCalculatorEvents() {

    const inputs = [
        payHourlyRate,
        payHoursPerWeek,
        payStudentLoan,
        payKiwiSaver,
        payKiwiSaverRate,
        payShowEmployerKiwisaver,
        payAuHelp,
        payAuSuper,
        payAuSuperRate,
        payShowAuEmployerSuper,
        payUkStudentLoan,
        payUkPension,
        payUkPensionRate,
        payShowUkEmployerPension,
        payUsFilingStatus,
        payUs401k,
        payUs401kRate,
        payUsStateTax
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

                if (
                    input === payKiwiSaver ||
                    input === payAuSuper ||
                    input === payUkPension ||
                    input === payUs401k
                ) {

                    updatePayNestedOptions();

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


    document
        .querySelectorAll("[data-pay-country]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    setPayCalcCountry(
                        button.dataset.payCountry ||
                        "nz"
                    );

                }
            );

        });


    setPayCalcCountry(payCalcCountry, false);

    updatePayCalculator();

}


function setPayCalcCountry(country, recalculate = true) {

    const allowed = ["nz", "au", "uk", "us"];

    const next =
        allowed.includes(country)
            ? country
            : "nz";


    payCalcCountry = next;

    try {

        localStorage.setItem(
            "budgioPayCalcCountry",
            next
        );

    } catch (error) {

        // Ignore storage failures (private mode, etc).

    }


    document
        .querySelectorAll("[data-pay-country]")
        .forEach(button => {

            const active =
                button.dataset.payCountry === next;

            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-selected",
                active ? "true" : "false"
            );

        });


    document
        .querySelectorAll("[data-pay-country-panel]")
        .forEach(panel => {

            panel.classList.toggle(
                "hidden",
                panel.dataset.payCountryPanel !== next
            );

        });


    updatePayCountryCopy();

    updatePayNestedOptions();


    if (recalculate) {

        updatePayCalculator();

    }

}


function updatePayCountryCopy() {

    const meta = getPayCountryMeta(payCalcCountry);


    if (payCalcIntro) {

        payCalcIntro.textContent = meta.intro;

    }


    if (payCalcNote) {

        payCalcNote.textContent = meta.note;

    }


    if (payHourlyRateLabel) {

        payHourlyRateLabel.textContent =
            `Hourly Rate (${meta.symbolHint})`;

    }


    if (payHourlyRate) {

        payHourlyRate.placeholder = meta.placeholder;

    }

}


function getPayCountryMeta(country) {

    if (country === "au") {

        return {
            intro:
                "Enter your hourly rate to estimate Australian take-home pay " +
                `using ${AU_PAY_TAX.yearLabel} resident tax rates, Medicare levy, ` +
                "HELP/HECS, and Super Guarantee. Estimate only — not ATO advice.",
            note:
                "Based on 52 paid weeks. Assumes Australian resident, tax-free " +
                "threshold claimed, simple LITO estimate, and no Medicare surcharge. " +
                "Employer SG (12%) is shown separately and is not taken from wages.",
            symbolHint: "$",
            placeholder: "e.g. 35.00"
        };

    }


    if (country === "uk") {

        return {
            intro:
                "Enter your hourly rate to estimate UK take-home pay " +
                `(England/NI/Wales ${UK_PAY_TAX.yearLabel} income tax & Class 1 NI). ` +
                "Scotland uses different bands. Estimate only — not HMRC advice.",
            note:
                "Based on 52 paid weeks. Assumes standard Personal Allowance, " +
                "England/Wales/NI tax bands, and employee Class 1 NI. " +
                "Pension uses relief-at-source style estimate.",
            symbolHint: "£",
            placeholder: "e.g. 18.50"
        };

    }


    if (country === "us") {

        return {
            intro:
                `Enter your hourly rate to estimate US take-home pay using ${US_PAY_TAX.yearLabel} ` +
                "federal income tax brackets, Social Security, and Medicare. " +
                "State tax is a simple % estimate. Not IRS advice.",
            note:
                "Based on 52 paid weeks. Assumes W-2 wages, standard deduction only " +
                "(no itemizing/credits), and traditional 401(k) if enabled. " +
                "FICA still applies to 401(k) deferrals.",
            symbolHint: "$",
            placeholder: "e.g. 25.00"
        };

    }


    return {
        intro:
            "Enter your hourly rate to estimate take-home pay using " +
            `${NZ_PAY_TAX.yearLabel} New Zealand PAYE, ACC, Student Loan, and KiwiSaver rates. ` +
            "This is an estimate only — use IRD tools for official figures.",
        note:
            "Based on 52 paid weeks per year. Assumes primary " +
            "employment tax code (M / M SL).",
        symbolHint: "$",
        placeholder: "e.g. 32.50"
    };

}


function updatePayNestedOptions() {

    if (payKiwiSaverOptions && payKiwiSaver) {

        payKiwiSaverOptions.classList.toggle(
            "hidden",
            !payKiwiSaver.checked
        );

    }


    if (payUkPensionOptions && payUkPension) {

        payUkPensionOptions.classList.toggle(
            "hidden",
            !payUkPension.checked
        );

    }


    if (payUs401kOptions && payUs401k) {

        payUs401kOptions.classList.toggle(
            "hidden",
            !payUs401k.checked
        );

    }


    if (payAuSuperOptions && payAuSuper) {

        payAuSuperOptions.classList.toggle(
            "hidden",
            !payAuSuper.checked
        );

    }

}


function calculateProgressiveTax(annualIncome, brackets) {

    let remaining =
        Math.max(0, Number(annualIncome) || 0);

    let previousCap = 0;

    let tax = 0;


    brackets.forEach(bracket => {

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


function calculateNzIncomeTax(annualIncome) {

    return calculateProgressiveTax(
        annualIncome,
        NZ_PAY_TAX.brackets
    );

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
        weeklyGross * PAY_CALC_WEEKS;


    const annualIncomeTax =
        calculateNzIncomeTax(annualGross);


    const accLiable =
        Math.min(
            annualGross,
            NZ_PAY_TAX.accMaxEarnings
        );

    const annualLevy =
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

    const annualRetirement =
        annualGross * kiwiSaverRate;


    const annualEmployer =
        hasKiwiSaver && showEmployerKiwiSaver
            ? annualGross *
              NZ_PAY_TAX.employerKiwiSaverRate
            : 0;


    const annualDeductions =
        annualIncomeTax +
        annualLevy +
        annualStudentLoan +
        annualRetirement;


    const annualNet =
        annualGross - annualDeductions;


    return {

        country: "nz",
        currency: NZ_PAY_TAX.currency,
        hourly,
        hours,
        weeklyGross,
        annualGross,
        annualIncomeTax,
        annualLevy,
        annualMedicare: 0,
        annualStateTax: 0,
        annualStudentLoan,
        annualRetirement,
        annualEmployer,
        annualDeductions,
        annualNet,
        annualTaxForEffective:
            annualIncomeTax + annualLevy,
        hasStudentLoan,
        hasRetirement: hasKiwiSaver,
        retirementPercent:
            hasKiwiSaver
                ? Number(kiwiSaverPercent) || 0
                : 0,
        showEmployer:
            !!(hasKiwiSaver && showEmployerKiwiSaver),
        stateTaxPercent: 0,
        incomeTaxLabel: "Income tax (PAYE)",
        levyLabel: "ACC earner levy",
        studentLoanLabel: "Student loan",
        retirementLabel:
            hasKiwiSaver
                ? `KiwiSaver (${Number(kiwiSaverPercent) || 0}%)`
                : "KiwiSaver",
        employerLabel: "Employer KiwiSaver (3%)",
        showLevy: true,
        showMedicare: false,
        showStateTax: false

    };

}


function calculateUkIncomeTax(annualGross) {

    let personalAllowance =
        UK_PAY_TAX.personalAllowance;


    if (annualGross > UK_PAY_TAX.paTaperStart) {

        const reduction =
            (annualGross - UK_PAY_TAX.paTaperStart) / 2;

        personalAllowance =
            Math.max(
                0,
                UK_PAY_TAX.personalAllowance - reduction
            );

    }


    let remaining =
        Math.max(0, annualGross - personalAllowance);

    let tax = 0;


    const basicSlice =
        Math.min(remaining, UK_PAY_TAX.basicBand);

    tax += basicSlice * UK_PAY_TAX.basicRate;

    remaining -= basicSlice;


    const higherBandWidth =
        Math.max(
            0,
            UK_PAY_TAX.higherLimit -
                UK_PAY_TAX.basicBand
        );

    const higherSlice =
        Math.min(remaining, higherBandWidth);

    tax += higherSlice * UK_PAY_TAX.higherRate;

    remaining -= higherSlice;


    if (remaining > 0) {

        tax += remaining * UK_PAY_TAX.additionalRate;

    }


    return tax;

}


function calculateUkNationalInsurance(annualGross) {

    const gross =
        Math.max(0, Number(annualGross) || 0);


    if (gross <= UK_PAY_TAX.niPrimaryThreshold) {

        return 0;

    }


    const mainBand =
        Math.min(
            gross,
            UK_PAY_TAX.niUpperLimit
        ) - UK_PAY_TAX.niPrimaryThreshold;


    const upperBand =
        Math.max(
            0,
            gross - UK_PAY_TAX.niUpperLimit
        );


    return (
        Math.max(0, mainBand) *
            UK_PAY_TAX.niMainRate +
        upperBand * UK_PAY_TAX.niUpperRate
    );

}


function calculateUkPayBreakdown({
    hourlyRate,
    hoursPerWeek,
    hasStudentLoan,
    hasPension,
    pensionPercent,
    showEmployerPension
}) {

    const hourly =
        Math.max(0, Number(hourlyRate) || 0);

    const hours =
        Math.max(0, Number(hoursPerWeek) || 0);

    const weeklyGross =
        hourly * hours;

    const annualGross =
        weeklyGross * PAY_CALC_WEEKS;


    const annualIncomeTax =
        calculateUkIncomeTax(annualGross);

    const annualLevy =
        calculateUkNationalInsurance(annualGross);


    const annualStudentLoan =
        hasStudentLoan
            ? Math.max(
                0,
                annualGross -
                    UK_PAY_TAX.studentLoanThreshold
              ) * UK_PAY_TAX.studentLoanRate
            : 0;


    const pensionRate =
        hasPension
            ? (Number(pensionPercent) || 0) / 100
            : 0;

    const annualRetirement =
        annualGross * pensionRate;


    const annualEmployer =
        hasPension && showEmployerPension
            ? annualGross *
              UK_PAY_TAX.employerPensionRate
            : 0;


    const annualDeductions =
        annualIncomeTax +
        annualLevy +
        annualStudentLoan +
        annualRetirement;


    const annualNet =
        annualGross - annualDeductions;


    return {

        country: "uk",
        currency: UK_PAY_TAX.currency,
        hourly,
        hours,
        weeklyGross,
        annualGross,
        annualIncomeTax,
        annualLevy,
        annualMedicare: 0,
        annualStateTax: 0,
        annualStudentLoan,
        annualRetirement,
        annualEmployer,
        annualDeductions,
        annualNet,
        annualTaxForEffective:
            annualIncomeTax + annualLevy,
        hasStudentLoan,
        hasRetirement: hasPension,
        retirementPercent:
            hasPension
                ? Number(pensionPercent) || 0
                : 0,
        showEmployer:
            !!(hasPension && showEmployerPension),
        stateTaxPercent: 0,
        incomeTaxLabel: "Income tax (PAYE)",
        levyLabel: "National Insurance",
        studentLoanLabel: "Student loan (Plan 2)",
        retirementLabel:
            hasPension
                ? `Pension (${Number(pensionPercent) || 0}%)`
                : "Pension",
        employerLabel: "Employer pension (3%)",
        showLevy: true,
        showMedicare: false,
        showStateTax: false

    };

}


function calculateUsFederalTax(taxableIncome, brackets) {

    return calculateProgressiveTax(
        taxableIncome,
        brackets
    );

}


function calculateUsPayBreakdown({
    hourlyRate,
    hoursPerWeek,
    filingStatus,
    has401k,
    deferralPercent,
    stateTaxPercent
}) {

    const hourly =
        Math.max(0, Number(hourlyRate) || 0);

    const hours =
        Math.max(0, Number(hoursPerWeek) || 0);

    const weeklyGross =
        hourly * hours;

    const annualGross =
        weeklyGross * PAY_CALC_WEEKS;


    const statusKey =
        filingStatus === "married"
            ? "married"
            : "single";

    const statusRules =
        US_PAY_TAX[statusKey];


    const deferralRate =
        has401k
            ? (Number(deferralPercent) || 0) / 100
            : 0;

    const annualRetirement =
        annualGross * deferralRate;


    const federalTaxable =
        Math.max(
            0,
            annualGross -
                annualRetirement -
                statusRules.standardDeduction
        );


    const annualIncomeTax =
        calculateUsFederalTax(
            federalTaxable,
            statusRules.brackets
        );


    const ssLiable =
        Math.min(
            annualGross,
            US_PAY_TAX.socialSecurityWageBase
        );

    const annualLevy =
        ssLiable * US_PAY_TAX.socialSecurityRate;


    let annualMedicare =
        annualGross * US_PAY_TAX.medicareRate;


    if (
        annualGross >
        statusRules.additionalMedicareThreshold
    ) {

        annualMedicare +=
            (annualGross -
                statusRules.additionalMedicareThreshold) *
            US_PAY_TAX.additionalMedicareRate;

    }


    const stateRate =
        Math.max(
            0,
            Math.min(
                15,
                Number(stateTaxPercent) || 0
            )
        ) / 100;

    const annualStateTax =
        Math.max(
            0,
            annualGross - annualRetirement
        ) * stateRate;


    const annualDeductions =
        annualIncomeTax +
        annualLevy +
        annualMedicare +
        annualStateTax +
        annualRetirement;


    const annualNet =
        annualGross - annualDeductions;


    const statePctDisplay =
        Math.max(
            0,
            Math.min(
                15,
                Number(stateTaxPercent) || 0
            )
        );


    return {

        country: "us",
        currency: US_PAY_TAX.currency,
        hourly,
        hours,
        weeklyGross,
        annualGross,
        annualIncomeTax,
        annualLevy,
        annualMedicare,
        annualStateTax,
        annualStudentLoan: 0,
        annualRetirement,
        annualEmployer: 0,
        annualDeductions,
        annualNet,
        annualTaxForEffective:
            annualIncomeTax +
            annualLevy +
            annualMedicare +
            annualStateTax,
        hasStudentLoan: false,
        hasRetirement: has401k,
        retirementPercent:
            has401k
                ? Number(deferralPercent) || 0
                : 0,
        showEmployer: false,
        stateTaxPercent: statePctDisplay,
        incomeTaxLabel: "Federal income tax",
        levyLabel: "Social Security",
        studentLoanLabel: "Student loan",
        retirementLabel:
            has401k
                ? `401(k) (${Number(deferralPercent) || 0}%)`
                : "401(k)",
        employerLabel: "Employer contribution",
        showLevy: true,
        showMedicare: true,
        showStateTax: statePctDisplay > 0

    };

}


function calculateAuLito(taxableIncome) {

    const income =
        Math.max(0, Number(taxableIncome) || 0);


    if (income <= AU_PAY_TAX.litoLower) {

        return AU_PAY_TAX.litoMax;

    }


    if (income <= AU_PAY_TAX.litoMid) {

        return Math.max(
            0,
            AU_PAY_TAX.litoMax -
                0.05 * (income - AU_PAY_TAX.litoLower)
        );

    }


    if (income < AU_PAY_TAX.litoUpper) {

        const atMid =
            AU_PAY_TAX.litoMax -
            0.05 *
                (AU_PAY_TAX.litoMid -
                    AU_PAY_TAX.litoLower);

        return Math.max(
            0,
            atMid -
                0.015 *
                    (income - AU_PAY_TAX.litoMid)
        );

    }


    return 0;

}


function calculateAuMedicareLevy(taxableIncome) {

    const income =
        Math.max(0, Number(taxableIncome) || 0);


    if (income <= AU_PAY_TAX.medicareLowThreshold) {

        return 0;

    }


    if (income >= AU_PAY_TAX.medicareFullThreshold) {

        return income * AU_PAY_TAX.medicareRate;

    }


    // Shade-in between low and full thresholds.
    const reductionFactor =
        AU_PAY_TAX.medicareFullThreshold /
        (AU_PAY_TAX.medicareFullThreshold -
            AU_PAY_TAX.medicareLowThreshold);

    return (
        (income - AU_PAY_TAX.medicareLowThreshold) *
        AU_PAY_TAX.medicareRate *
        reductionFactor
    );

}


function calculateAuHelpRepayment(repaymentIncome) {

    const income =
        Math.max(0, Number(repaymentIncome) || 0);


    if (income <= AU_PAY_TAX.helpThreshold) {

        return 0;

    }


    if (income <= AU_PAY_TAX.helpMid) {

        return (
            (income - AU_PAY_TAX.helpThreshold) *
            AU_PAY_TAX.helpMidRate
        );

    }


    if (income <= AU_PAY_TAX.helpTop) {

        return (
            AU_PAY_TAX.helpMidCapAmount +
            (income - AU_PAY_TAX.helpMid) *
                AU_PAY_TAX.helpUpperRate
        );

    }


    return income * AU_PAY_TAX.helpTopFlatRate;

}


function calculateAuPayBreakdown({
    hourlyRate,
    hoursPerWeek,
    hasHelp,
    hasSalarySacrifice,
    sacrificePercent,
    showEmployerSuper
}) {

    const hourly =
        Math.max(0, Number(hourlyRate) || 0);

    const hours =
        Math.max(0, Number(hoursPerWeek) || 0);

    const weeklyGross =
        hourly * hours;

    const annualGross =
        weeklyGross * PAY_CALC_WEEKS;


    const sacrificeRate =
        hasSalarySacrifice
            ? (Number(sacrificePercent) || 0) / 100
            : 0;

    const annualRetirement =
        annualGross * sacrificeRate;


    const taxableIncome =
        Math.max(0, annualGross - annualRetirement);


    const rawIncomeTax =
        calculateProgressiveTax(
            taxableIncome,
            AU_PAY_TAX.brackets
        );

    const lito =
        calculateAuLito(taxableIncome);

    const annualIncomeTax =
        Math.max(0, rawIncomeTax - lito);


    const annualLevy =
        calculateAuMedicareLevy(taxableIncome);


    const annualStudentLoan =
        hasHelp
            ? calculateAuHelpRepayment(annualGross)
            : 0;


    const annualEmployer =
        showEmployerSuper
            ? annualGross *
              AU_PAY_TAX.employerSuperRate
            : 0;


    const annualDeductions =
        annualIncomeTax +
        annualLevy +
        annualStudentLoan +
        annualRetirement;


    const annualNet =
        annualGross - annualDeductions;


    return {

        country: "au",
        currency: AU_PAY_TAX.currency,
        hourly,
        hours,
        weeklyGross,
        annualGross,
        annualIncomeTax,
        annualLevy,
        annualMedicare: 0,
        annualStateTax: 0,
        annualStudentLoan,
        annualRetirement,
        annualEmployer,
        annualDeductions,
        annualNet,
        annualTaxForEffective:
            annualIncomeTax + annualLevy,
        hasStudentLoan: hasHelp,
        hasRetirement: hasSalarySacrifice,
        retirementPercent:
            hasSalarySacrifice
                ? Number(sacrificePercent) || 0
                : 0,
        showEmployer: !!showEmployerSuper,
        stateTaxPercent: 0,
        incomeTaxLabel: "Income tax (PAYG)",
        levyLabel: "Medicare levy",
        studentLoanLabel: "HELP / HECS",
        retirementLabel:
            hasSalarySacrifice
                ? `Salary sacrifice (${Number(sacrificePercent) || 0}%)`
                : "Salary sacrifice",
        employerLabel: "Employer Super Guarantee (12%)",
        showLevy: true,
        showMedicare: false,
        showStateTax: false

    };

}


function scalePayAmount(annualAmount, period) {

    switch (period) {

        case "weekly":
            return annualAmount / PAY_CALC_WEEKS;

        case "fortnightly":
            return annualAmount / (PAY_CALC_WEEKS / 2);

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


function formatPayCurrency(value, currency) {

    const code =
        currency === "GBP" ||
        currency === "USD" ||
        currency === "AUD"
            ? currency
            : "NZD";


    return new Intl.NumberFormat(
        undefined,
        {
            style: "currency",
            currency: code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(Number(value) || 0);

}


function buildCurrentPayBreakdown() {

    const hourlyRate =
        payHourlyRate
            ? payHourlyRate.value
            : 0;

    const hoursPerWeek =
        payHoursPerWeek
            ? payHoursPerWeek.value
            : 40;


    if (payCalcCountry === "au") {

        return calculateAuPayBreakdown({
            hourlyRate,
            hoursPerWeek,
            hasHelp:
                !!(payAuHelp && payAuHelp.checked),
            hasSalarySacrifice:
                !!(payAuSuper && payAuSuper.checked),
            sacrificePercent:
                payAuSuperRate
                    ? payAuSuperRate.value
                    : 3,
            showEmployerSuper:
                !!(
                    payShowAuEmployerSuper &&
                    payShowAuEmployerSuper.checked
                )
        });

    }


    if (payCalcCountry === "uk") {

        return calculateUkPayBreakdown({
            hourlyRate,
            hoursPerWeek,
            hasStudentLoan:
                !!(payUkStudentLoan &&
                    payUkStudentLoan.checked),
            hasPension:
                !!(payUkPension &&
                    payUkPension.checked),
            pensionPercent:
                payUkPensionRate
                    ? payUkPensionRate.value
                    : 5,
            showEmployerPension:
                !!(
                    payShowUkEmployerPension &&
                    payShowUkEmployerPension.checked
                )
        });

    }


    if (payCalcCountry === "us") {

        return calculateUsPayBreakdown({
            hourlyRate,
            hoursPerWeek,
            filingStatus:
                payUsFilingStatus
                    ? payUsFilingStatus.value
                    : "single",
            has401k:
                !!(payUs401k && payUs401k.checked),
            deferralPercent:
                payUs401kRate
                    ? payUs401kRate.value
                    : 5,
            stateTaxPercent:
                payUsStateTax
                    ? payUsStateTax.value
                    : 0
        });

    }


    return calculateNzPayBreakdown({
        hourlyRate,
        hoursPerWeek,
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

}


function updatePayCalculator() {

    if (!payNetAmount) {

        return;

    }


    updatePayNestedOptions();


    const breakdown =
        buildCurrentPayBreakdown();


    const period =
        payCalcPeriod || "weekly";


    const setMoney = (element, annualValue) => {

        if (!element) {

            return;

        }

        element.textContent =
            formatPayCurrency(
                scalePayAmount(
                    annualValue,
                    period
                ),
                breakdown.currency
            );

    };


    if (payNetLabel) {

        payNetLabel.textContent =
            `Net pay / ${getPayPeriodLabel(period)}`;

    }


    if (payIncomeTaxLabel) {

        payIncomeTaxLabel.textContent =
            breakdown.incomeTaxLabel;

    }


    if (payLevyLabel) {

        payLevyLabel.textContent =
            breakdown.levyLabel;

    }


    if (payStudentLoanLabel) {

        payStudentLoanLabel.textContent =
            breakdown.studentLoanLabel;

    }


    if (payRetirementLabel) {

        payRetirementLabel.textContent =
            breakdown.retirementLabel;

    }


    if (payEmployerLabel) {

        payEmployerLabel.textContent =
            breakdown.employerLabel;

    }


    if (payStateTaxLabel) {

        payStateTaxLabel.textContent =
            breakdown.stateTaxPercent > 0
                ? `State tax (${breakdown.stateTaxPercent}%)`
                : "State tax";

    }


    setMoney(payNetAmount, breakdown.annualNet);

    setMoney(payGrossAmount, breakdown.annualGross);

    setMoney(
        payIncomeTaxAmount,
        breakdown.annualIncomeTax
    );

    setMoney(payLevyAmount, breakdown.annualLevy);

    setMoney(
        payMedicareAmount,
        breakdown.annualMedicare
    );

    setMoney(
        payStateTaxAmount,
        breakdown.annualStateTax
    );

    setMoney(
        payStudentLoanAmount,
        breakdown.annualStudentLoan
    );

    setMoney(
        payRetirementAmount,
        breakdown.annualRetirement
    );

    setMoney(
        payDeductionsAmount,
        breakdown.annualDeductions
    );

    setMoney(
        payEmployerAmount,
        breakdown.annualEmployer
    );


    if (payLevyRow) {

        payLevyRow.hidden = !breakdown.showLevy;

        payLevyRow.style.display =
            breakdown.showLevy ? "" : "none";

    }


    if (payMedicareRow) {

        payMedicareRow.hidden =
            !breakdown.showMedicare;

        payMedicareRow.style.display =
            breakdown.showMedicare ? "" : "none";

    }


    if (payStateTaxRow) {

        payStateTaxRow.hidden =
            !breakdown.showStateTax;

        payStateTaxRow.style.display =
            breakdown.showStateTax ? "" : "none";

    }


    if (payStudentLoanRow) {

        payStudentLoanRow.style.display =
            breakdown.hasStudentLoan
                ? ""
                : "none";

    }


    if (payRetirementRow) {

        payRetirementRow.style.display =
            breakdown.hasRetirement
                ? ""
                : "none";

    }


    if (payEmployerBox) {

        payEmployerBox.classList.toggle(
            "hidden",
            !breakdown.showEmployer
        );

    }


    if (payEffectiveRate) {

        const rate =
            breakdown.annualGross > 0
                ? (
                    breakdown.annualTaxForEffective /
                    breakdown.annualGross
                  ) * 100
                : 0;


        payEffectiveRate.textContent =
            `${rate.toFixed(1)}%`;

    }


    if (payNetHourly) {

        payNetHourly.textContent =
            breakdown.hours > 0
                ? formatPayCurrency(
                    breakdown.annualNet /
                    (breakdown.hours *
                        PAY_CALC_WEEKS),
                    breakdown.currency
                  )
                : formatPayCurrency(
                    0,
                    breakdown.currency
                  );

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
// 7-DAY FORECAST
// ============================================================

const FORECAST_VISIBLE_EVENTS = 3;


function openForecastCalendar() {

    calendarDate = new Date();

    showPage("calendar");

}


function applyUpcomingView(view) {

    upcomingView =
        view === "forecast"
            ? "forecast"
            : "list";


    localStorage.setItem(
        UPCOMING_VIEW_KEY,
        upcomingView
    );


    if (upcomingPanel) {

        upcomingPanel.dataset.view =
            upcomingView;

    }


    document
        .querySelectorAll("[data-upcoming-view]")
        .forEach(button => {

            const isActive =
                button.dataset.upcomingView ===
                upcomingView;


            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive ? "true" : "false"
            );

        });


    if (upcomingViewTitle) {

        upcomingViewTitle.textContent =
            upcomingView === "forecast"
                ? "7-day forecast"
                : "Upcoming Payments";

    }

}


function setupUpcomingViewSwitch() {

    applyUpcomingView(upcomingView);


    if (upcomingViewSwitch) {

        upcomingViewSwitch.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-upcoming-view]"
                    );

                if (button) {

                    applyUpcomingView(
                        button.dataset.upcomingView
                    );

                }

            }
        );

    }

}


function setupSevenDayForecast() {

    if (sevenDayForecast) {

        sevenDayForecast.addEventListener(
            "click",
            event => {

                const eventButton =
                    event.target.closest(
                        "[data-edit-type]"
                    );

                if (eventButton) {

                    editItem(
                        eventButton.dataset.editType,
                        eventButton.dataset.editId
                    );

                    return;

                }


                if (
                    event.target.closest(
                        "[data-open-calendar]"
                    )
                ) {

                    openForecastCalendar();

                }

            }
        );

    }


    if (forecastOpenCalendarBtn) {

        forecastOpenCalendarBtn.addEventListener(
            "click",
            () => {

                openForecastCalendar();

            }
        );

    }

}


function getForecastEventFlow(event) {

    if (!event) {

        return "out";

    }


    if (event.editType === "income") {

        return "in";

    }


    if (
        event.editType === "savings" &&
        String(event.name).startsWith("Goal:")
    ) {

        return "info";

    }


    return "out";

}


function formatSignedCurrency(value) {

    const amount =
        Number(value) || 0;


    if (amount === 0) {

        return formatCurrency(0);

    }


    const formatted =
        formatCurrency(Math.abs(amount));


    return amount > 0
        ? `+${formatted}`
        : `−${formatted}`;

}


function getForecastDayLabel(date, offset) {

    if (offset === 0) {

        return "Today";

    }


    if (offset === 1) {

        return "Tomorrow";

    }


    return date.toLocaleDateString(
        "en-NZ",
        {
            weekday: "short"
        }
    );

}


function renderSevenDayForecast() {

    if (!sevenDayForecast) {

        return;

    }


    const start =
        new Date();

    start.setHours(0, 0, 0, 0);


    const days = [];

    let incomingTotal = 0;

    let outgoingTotal = 0;

    let billCount = 0;

    let paydayLabel = "";


    for (
        let offset = 0;
        offset < 7;
        offset++
    ) {

        const date =
            new Date(start);

        date.setDate(
            start.getDate() + offset
        );


        const dateString =
            formatDateForInput(date);


        const events =
            getCalendarEvents(dateString);


        let incoming = 0;

        let outgoing = 0;

        let hasIncome = false;


        events.forEach(event => {

            const flow =
                getForecastEventFlow(event);

            const amount =
                Number(event.amount) || 0;


            if (flow === "in") {

                incoming += amount;

                hasIncome = true;

            }


            if (flow === "out") {

                outgoing += amount;

                billCount += 1;

            }

        });


        incomingTotal += incoming;

        outgoingTotal += outgoing;


        if (hasIncome && !paydayLabel) {

            paydayLabel =
                getForecastDayLabel(
                    date,
                    offset
                );

        }


        days.push({
            date,
            dateString,
            offset,
            events,
            incoming,
            outgoing,
            net: incoming - outgoing,
            hasIncome
        });

    }


    if (forecastSummary) {

        if (
            incomingTotal === 0 &&
            outgoingTotal === 0 &&
            billCount === 0
        ) {

            forecastSummary.textContent =
                "Quiet week ahead";

        } else if (paydayLabel && billCount > 0) {

            forecastSummary.textContent =
                `Payday ${paydayLabel} · ${billCount} ${billCount === 1 ? "bill" : "bills"}`;

        } else if (paydayLabel) {

            forecastSummary.textContent =
                `Payday ${paydayLabel}`;

        } else {

            forecastSummary.textContent =
                `${billCount} ${billCount === 1 ? "bill" : "bills"} · ${formatCurrency(outgoingTotal)} out`;

        }

    }


    sevenDayForecast.innerHTML =
        days.map(day => {

            const weekday =
                getForecastDayLabel(
                    day.date,
                    day.offset
                );


            const dateLabel =
                day.date.toLocaleDateString(
                    "en-NZ",
                    {
                        day: "numeric",
                        month: "short"
                    }
                );


            const dayClasses = [
                "forecast-day",
                day.offset === 0 ? "is-today" : "",
                day.hasIncome ? "has-income" : ""
            ].filter(Boolean).join(" ");


            const visibleEvents =
                day.events.slice(
                    0,
                    FORECAST_VISIBLE_EVENTS
                );


            const hiddenCount =
                day.events.length -
                visibleEvents.length;


            let netClass = "";

            let netLabel = "";


            if (day.events.length > 0) {

                if (day.net > 0) {

                    netClass = "is-in";

                    netLabel =
                        formatSignedCurrency(day.net);

                } else if (day.net < 0) {

                    netClass = "is-out";

                    netLabel =
                        formatSignedCurrency(day.net);

                } else {

                    netClass = "is-clear";

                    netLabel =
                        formatCurrency(0);

                }

            }


            const eventsHtml =
                visibleEvents.map(event => `

                    <button
                        type="button"
                        class="forecast-event calendar-event ${escapeHtml(event.type)}"
                        data-edit-type="${escapeHtml(event.editType)}"
                        data-edit-id="${escapeHtml(String(event.id))}"
                        title="Click to edit">

                        <span class="forecast-event-name">
                            ${escapeHtml(event.name)}
                        </span>

                        <span class="forecast-event-amount">
                            ${formatCurrency(event.amount)}
                        </span>

                    </button>

                `).join("");


            const moreHtml =
                hiddenCount > 0
                    ? `
                        <button
                            type="button"
                            class="forecast-more"
                            data-open-calendar="true">
                            +${hiddenCount} more
                        </button>
                    `
                    : "";


            return `

                <article
                    class="${dayClasses}"
                    role="listitem">

                    <header>

                        <span class="forecast-weekday">
                            ${escapeHtml(weekday)}
                        </span>

                        <span class="forecast-date">
                            ${escapeHtml(dateLabel)}
                        </span>

                    </header>

                    ${
                        netLabel
                            ? `<p class="forecast-net ${netClass}">
                                ${escapeHtml(netLabel)}
                            </p>`
                            : ""
                    }

                    <div class="forecast-events">
                        ${eventsHtml}
                        ${moreHtml}
                    </div>

                </article>

            `;

        }).join("");

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


    const budgetPeriodElement =
        budgetPeriodBox ||
        currentBudgetPeriod.closest(".budget-period");


    if (!budget.settings) {

        budget.settings = {};

    }


    // If a payday exists, treat budget periods as enabled
    if (
        budget.settings.anchorDate &&
        budget.settings.useBudgetPeriod !== true
    ) {

        budget.settings.useBudgetPeriod = true;

    }


    // Profile does not use a payday/budget period
    if (
        !budget.settings.useBudgetPeriod &&
        !budget.settings.anchorDate
    ) {

        currentBudgetPeriod.textContent =
            "Set your next pay day";

        if (budgetPeriodElement) {

            budgetPeriodElement.style.display = "";

        }

        setBudgetPeriodActionable(true);

        return;

    }


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

function getVisibleUpcomingPayments() {

    if (
        !Array.isArray(budget.payments) ||
        budget.payments.length === 0
    ) {

        return [];

    }


    return [...budget.payments]
        .sort(
            (a, b) =>
                new Date(a.nextDate) -
                new Date(b.nextDate)
        )
        .slice(0, 8);

}


function setupUpcomingPaymentsSelection() {

    if (upcomingPayments) {

        upcomingPayments.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".paid-status-btn"
                    )
                ) {

                    return;

                }


                const row =
                    event.target.closest(
                        "tr[data-payment-id]"
                    );


                if (!row) {

                    return;

                }


                toggleUpcomingPaymentSelection(
                    row.dataset.paymentId
                );

            }
        );


        upcomingPayments.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;

                }


                if (
                    event.target.closest(
                        ".paid-status-btn"
                    )
                ) {

                    return;

                }


                const row =
                    event.target.closest(
                        "tr[data-payment-id]"
                    );


                if (!row) {

                    return;

                }


                event.preventDefault();

                toggleUpcomingPaymentSelection(
                    row.dataset.paymentId
                );

            }
        );

    }


    if (clearUpcomingPaymentsSelectionBtn) {

        clearUpcomingPaymentsSelectionBtn.addEventListener(
            "click",
            () => {

                clearUpcomingPaymentSelection();

            }
        );

    }


    if (upcomingPaymentsBankInput) {

        upcomingPaymentsBankInput.addEventListener(
            "input",
            updateUpcomingPaymentsTally
        );

    }

}


function toggleUpcomingPaymentSelection(id) {

    if (!id) {

        return;

    }


    if (selectedUpcomingPaymentIds.has(id)) {

        selectedUpcomingPaymentIds.delete(id);

    } else {

        selectedUpcomingPaymentIds.add(id);

    }


    updateUpcomingPaymentSelectionUI();

}


function clearUpcomingPaymentSelection() {

    selectedUpcomingPaymentIds.clear();

    updateUpcomingPaymentSelectionUI();

}


function pruneUpcomingPaymentSelection(visiblePayments) {

    const validIds =
        new Set(
            visiblePayments.map(
                payment => payment.id
            )
        );


    selectedUpcomingPaymentIds.forEach(id => {

        if (!validIds.has(id)) {

            selectedUpcomingPaymentIds.delete(id);

        }

    });

}


function getUpcomingPaymentsSelectionTotal() {

    let total = 0;


    budget.payments.forEach(payment => {

        if (selectedUpcomingPaymentIds.has(payment.id)) {

            total += Number(payment.amount) || 0;

        }

    });


    return total;

}


function getUpcomingPaymentsBankBalance() {

    if (!upcomingPaymentsBankInput) {

        return null;

    }


    const raw =
        upcomingPaymentsBankInput.value.trim();


    if (raw === "") {

        return null;

    }


    const value =
        Number(raw);


    if (!Number.isFinite(value)) {

        return null;

    }


    return value;

}


function updateUpcomingPaymentsTally() {

    if (
        !upcomingPaymentsTally ||
        !upcomingPaymentsTallySum
    ) {

        return;

    }


    const count =
        selectedUpcomingPaymentIds.size;


    if (count === 0) {

        upcomingPaymentsTally.hidden = true;

        upcomingPaymentsTallySum.textContent = "";


        if (upcomingPaymentsBankLeft) {

            upcomingPaymentsBankLeft.textContent = "—";

            upcomingPaymentsBankLeft.classList.remove(
                "is-negative"
            );

        }

        return;

    }


    const selectedTotal =
        getUpcomingPaymentsSelectionTotal();


    upcomingPaymentsTally.hidden = false;

    upcomingPaymentsTallySum.textContent =
        formatCurrency(selectedTotal);


    if (!upcomingPaymentsBankLeft) {

        return;

    }


    const bank =
        getUpcomingPaymentsBankBalance();


    if (bank === null) {

        upcomingPaymentsBankLeft.textContent = "—";

        upcomingPaymentsBankLeft.classList.remove(
            "is-negative"
        );

        return;

    }


    const left =
        bank - selectedTotal;


    upcomingPaymentsBankLeft.textContent =
        formatCurrency(left);

    upcomingPaymentsBankLeft.classList.toggle(
        "is-negative",
        left < 0
    );

}


function updateUpcomingPaymentSelectionUI() {

    if (upcomingPayments) {

        upcomingPayments
            .querySelectorAll("tr[data-payment-id]")
            .forEach(row => {

                const selected =
                    selectedUpcomingPaymentIds.has(
                        row.dataset.paymentId
                    );


                row.classList.toggle(
                    "is-selected",
                    selected
                );

                row.setAttribute(
                    "aria-selected",
                    selected ? "true" : "false"
                );

                row.title =
                    selected
                        ? "Click to remove from this total"
                        : "Click to add to this total";

            });

    }


    updateUpcomingPaymentsTally();

}


function renderUpcomingPayments() {

    if (!upcomingPayments) {

        return;

    }


    upcomingPayments.innerHTML = "";


    if (paymentsPaidSummary) {

        const summary =
            getPaymentsPaidSummary();


        paymentsPaidSummary.textContent =
            summary.total > 0
                ? `${summary.paid}/${summary.total} paid this period`
                : "";

    }


    const displayed =
        getVisibleUpcomingPayments();


    pruneUpcomingPaymentSelection(displayed);


    if (displayed.length === 0) {

        upcomingPayments.innerHTML = `
            <tr>
                <td colspan="4">
                    No upcoming payments.
                </td>
            </tr>
        `;

        updateUpcomingPaymentsTally();

        return;

    }


    displayed.forEach(payment => {

        const days =
            getDaysUntil(payment.nextDate);


        let label;
        let className = "status-good";


        if (days < 0) {

            const overdueDays = Math.abs(days);

            label =
                overdueDays === 1
                    ? "Overdue by 1 day"
                    : `Overdue by ${overdueDays} days`;

            className = "status-danger";

        } else if (days === 0) {

            label = "today";

            className = "status-warning";

        } else if (days === 1) {

            label = "1 day";

            className = "status-warning";

        } else if (days <= 7) {

            label = `${days} days`;

            className = "status-warning";

        } else {

            label = `${days} days`;

        }


        const paidThisPeriod =
            isPaymentPaidThisPeriod(payment);


        const isSelected =
            selectedUpcomingPaymentIds.has(
                payment.id
            );


        const rowClasses = [
            paidThisPeriod ? "is-paid" : "",
            isSelected ? "is-selected" : ""
        ].filter(Boolean).join(" ");


        upcomingPayments.innerHTML += `

            <tr
                class="${rowClasses}"
                data-payment-id="${escapeHtml(payment.id)}"
                aria-selected="${isSelected ? "true" : "false"}"
                tabindex="0"
                title="${isSelected ? "Click to remove from this total" : "Click to add to this total"}">

                <td data-label="Name">
                    ${escapeHtml(payment.name)}
                </td>

                <td data-label="Amount">
                    ${formatCurrency(payment.amount)}
                </td>

                <td data-label="Paid">

                    <button
                        type="button"
                        class="paid-status-btn ${paidThisPeriod ? "is-paid" : "is-unpaid"}"
                        onclick="event.stopPropagation(); markPaid('${payment.id}')"
                        title="${paidThisPeriod ? "Undo paid for this period" : "Mark paid for this period"}">

                        ${paidThisPeriod ? "Paid" : "Mark paid"}

                    </button>

                </td>

                <td class="${className}" data-label="Due in">
                    ${label}
                </td>

            </tr>

        `;

    });


    updateUpcomingPaymentsTally();

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
        !budget.settings.anchorDate
    ) {

        return false;

    }


    // Payday set implies budget periods are in use
    budget.settings.useBudgetPeriod = true;


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

    if (!budget.settings) {

        return null;

    }


    // Allow period calculation whenever a payday is set,
    // even if the flag was previously left unset
    if (
        !budget.settings.useBudgetPeriod &&
        !budget.settings.anchorDate
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

            const paidThisPeriod =
                isPaymentPaidThisPeriod(item);


            events.push({

                type:
                    paidThisPeriod
                        ? "payment-event paid-event"
                        : "payment-event",

                editType: "payment",

                id: item.id,

                name:
                    paidThisPeriod
                        ? `${item.name} (Paid)`
                        : item.name,

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


    date.setHours(0, 0, 0, 0);

    target.setHours(0, 0, 0, 0);


    // Show every weekly contribution from the goal
    // start through the day before the deadline so
    // the current month still lists earlier saves.
    if (date >= target) {

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

function calendarDateModulo(value, period) {

    return (
        (
            (value % period) +
            period
        ) % period
    );

}


function occursOnRecurringMonthDay(
    anchorDate,
    targetDate
) {

    const anchorDay =
        anchorDate.getDate();

    const lastDayOfMonth =
        new Date(
            targetDate.getFullYear(),
            targetDate.getMonth() + 1,
            0
        ).getDate();


    return (
        targetDate.getDate() ===
        Math.min(anchorDay, lastDayOfMonth)
    );

}


function isRecurringOnDate(item, targetDate) {

    if (
        !item ||
        !item.nextDate
    ) {

        return false;

    }


    const anchorDate =
        new Date(item.nextDate + "T00:00:00");

    const date =
        new Date(targetDate);


    if (
        Number.isNaN(anchorDate.getTime()) ||
        Number.isNaN(date.getTime())
    ) {

        return false;

    }


    date.setHours(0, 0, 0, 0);

    anchorDate.setHours(0, 0, 0, 0);


    // nextDate rolls forward after each due date, but
    // it stays on the same series. Project backward so
    // this month still shows pay and bills that already
    // occurred.
    const diffDays =
        Math.round(
            (date - anchorDate) /
            (1000 * 60 * 60 * 24)
        );


    switch (item.frequency) {


        case "Weekly":

            return calendarDateModulo(diffDays, 7) === 0;


        case "Fortnightly":

            return calendarDateModulo(diffDays, 14) === 0;


        case "Monthly":

            return occursOnRecurringMonthDay(
                anchorDate,
                date
            );


        case "Quarterly":

            const monthDifference =
                (
                    date.getFullYear() -
                    anchorDate.getFullYear()
                ) * 12 +
                (
                    date.getMonth() -
                    anchorDate.getMonth()
                );


            return (
                calendarDateModulo(monthDifference, 3) === 0 &&
                occursOnRecurringMonthDay(
                    anchorDate,
                    date
                )
            );


        case "Yearly":

            return (
                date.getMonth() ===
                anchorDate.getMonth() &&
                occursOnRecurringMonthDay(
                    anchorDate,
                    date
                )
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

function applyDocumentColorScheme() {

    const isLight =
        document.body.classList.contains("light-mode");

    document.documentElement.style.colorScheme =
        isLight ? "light" : "dark";

}


function setupTheme() {

    const themeSwitch =
        document.getElementById("themeSwitch");

    const savedTheme = localStorage.getItem("budgetTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

    }

    applyDocumentColorScheme();

    updateThemeButton();


    if (!themeSwitch) return;

    themeSwitch.addEventListener("click", (event) => {

        const option =
            event.target.closest("[data-theme]");

        if (!option) return;

        const wantLight =
            option.dataset.theme === "light";

        document.body.classList.toggle(
            "light-mode",
            wantLight
        );

        localStorage.setItem(
            "budgetTheme",
            wantLight ? "light" : "dark"
        );

        applyDocumentColorScheme();

        updateThemeButton();

    });

}


function updateThemeButton() {

    const isLight =
        document.body.classList.contains("light-mode");

    document.querySelectorAll(".theme-switch-option").forEach((option) => {

        const isActive =
            (option.dataset.theme === "light") === isLight;

        option.classList.toggle("is-active", isActive);

        option.setAttribute(
            "aria-pressed",
            isActive ? "true" : "false"
        );

    });

}

// ============================================================
// INITIALISE SMART TOOLTIPS
// ============================================================

setupSmartTooltips();