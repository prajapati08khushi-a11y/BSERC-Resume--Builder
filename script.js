const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const skillsInput = document.getElementById("skills");
const educationInput = document.getElementById("education");
const projectsInput = document.getElementById("projects");
const templateInput = document.getElementById("template");

const previewName = document.getElementById("previewName");
const previewEmail = document.getElementById("previewEmail");
const previewSkills = document.getElementById("previewSkills");
const previewEducation = document.getElementById("previewEducation");
const previewProjects = document.getElementById("previewProjects");

const resumePreview = document.getElementById("resumePreview");
const previewSections = document.getElementById("previewSections");

const sectionList = document.getElementById("sectionList");


// 1. LIVE RESUME PREVIEW

function updatePreview() {
    previewName.textContent = nameInput.value || "Your Name";
    previewEmail.textContent = emailInput.value || "your.email@example.com";

    previewSkills.textContent = skillsInput.value || "Your skills";
    previewEducation.textContent = educationInput.value || "Your education details";
    previewProjects.textContent = projectsInput.value || "Your projects";
}

nameInput.addEventListener("input", updatePreview);
emailInput.addEventListener("input", updatePreview);
skillsInput.addEventListener("input", updatePreview);
educationInput.addEventListener("input", updatePreview);
projectsInput.addEventListener("input", updatePreview);


// 2. CHANGE RESUME TEMPLATE

templateInput.addEventListener("change", function () {
    resumePreview.className = "resume " + templateInput.value;
});


// 3. REARRANGE RESUME SECTIONS

let draggedItem = null;

const sectionItems = document.querySelectorAll(".section-item");

sectionItems.forEach(function (item) {

    item.addEventListener("dragstart", function () {
        draggedItem = item;
    });

    item.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    item.addEventListener("drop", function (event) {
        event.preventDefault();

        if (draggedItem && draggedItem !== item) {
            const items = Array.from(sectionList.children);

            const draggedIndex = items.indexOf(draggedItem);
            const targetIndex = items.indexOf(item);

            if (draggedIndex < targetIndex) {
                item.after(draggedItem);
            } else {
                item.before(draggedItem);
            }

            updateSectionOrder();
        }
    });
});

function updateSectionOrder() {

    const items = sectionList.querySelectorAll(".section-item");

    items.forEach(function (item) {

        const sectionName = item.dataset.section;

        const sectionElement = document.getElementById(
            sectionName + "Section"
        );

        if (sectionElement) {
            previewSections.appendChild(sectionElement);
        }
    });
}


// 4. EXPORT RESUME AS PDF

document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
});


// 5. SAVE RESUME DATA TO A FILE

document.getElementById("saveBtn").addEventListener("click", function () {

    const resumeData = {
        name: nameInput.value,
        email: emailInput.value,
        skills: skillsInput.value,
        education: educationInput.value,
        projects: projectsInput.value,
        template: templateInput.value,
        sectionOrder: Array.from(sectionList.children).map(function (item) {
            return item.dataset.section;
        })
    };

    const data = JSON.stringify(resumeData, null, 2);

    const file = new Blob([data], {
        type: "application/json"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(file);
    link.download = "my-resume-data.json";

    link.click();

    URL.revokeObjectURL(link.href);
});


// 6. LOAD SAVED RESUME DATA

document.getElementById("loadFile").addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const resumeData = JSON.parse(e.target.result);

            nameInput.value = resumeData.name || "";
            emailInput.value = resumeData.email || "";
            skillsInput.value = resumeData.skills || "";
            educationInput.value = resumeData.education || "";
            projectsInput.value = resumeData.projects || "";

            templateInput.value = resumeData.template || "template1";

            resumePreview.className = "resume " + templateInput.value;

            if (Array.isArray(resumeData.sectionOrder)) {

                resumeData.sectionOrder.forEach(function (sectionName) {

                    const item = sectionList.querySelector(
                        '[data-section="' + sectionName + '"]'
                    );

                    if (item) {
                        sectionList.appendChild(item);
                    }
                });

                updateSectionOrder();
            }

            updatePreview();

            alert("Resume data loaded successfully!");

        } catch (error) {

            alert("Unable to load this file. Please select a valid resume data file.");

        }
    };

    reader.readAsText(file);
});


// INITIAL PREVIEW

updatePreview();