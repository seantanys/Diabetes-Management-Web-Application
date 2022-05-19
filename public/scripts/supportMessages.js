window.addEventListener('DOMContentLoaded', (event) => {
    const messages = JSON.parse(document.getElementById("sp-hidden").value);
    const patients = Object.keys(messages);
    const receiverInput = document.getElementById('support-msg-receiver');
    const receiverIdInput = document.getElementById('hidden-support-msg-receiver');
    const patientDivs = document.querySelectorAll(".message-patient-contact");
    const messageBubble = document.querySelector('.msg-bubble')
    const currentMsgContainer = document.getElementById('msg-recipient')
    const mainBody = document.querySelector(".support-message-main");
    
    patientDivs.forEach(patient => {
        patient.addEventListener('click', switchPatient);
    });

    function switchPatient() {
        // remove message
        messageBubble.removeChild(messageBubble.lastChild);
        
        // remove previous button to patient overview
        if (mainBody.childNodes[0].tagName === "A") {
            mainBody.removeChild(mainBody.childNodes[0]);
        }

        // change patient displayed name and set tab to active
        var patientName = this.innerText
        toggleActivePatient(patientName);

        receiverInput.value = patientName;
        receiverIdInput.value = messages[patientName][0];
        
        var currMsg = document.createElement('p');
        currMsg.innerText = messages[patientName][1];

        // add the button to patient overview
        var btn = document.createElement('button');
        var toPatientOverview = document.createElement('a');
        toPatientOverview.href = `manage-patient/${messages[patientName][0]}`;
        btn.innerText = "See Patient Overview";
        btn.classList.add("patient-overview-btn");
        toPatientOverview.appendChild(btn);
        mainBody.prepend(toPatientOverview);

        // add message
        currentMsgContainer.innerText = `To ${patientName}`;
        messageBubble.appendChild(currMsg);
    }

    function toggleActivePatient(currPatient) {
        patientDivs.forEach(patient => {
            if (currPatient !== patient.innerText) {
                patient.classList.remove("active-message-patient");
            }
            else {
                patient.classList.add("active-message-patient");
            }
        })
    }

});