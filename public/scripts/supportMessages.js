window.addEventListener('DOMContentLoaded', (event) => {
    const messages = JSON.parse(document.getElementById("sp-hidden").value);
    const patients = Object.keys(messages);
    const receiverInput = document.getElementById('support-msg-receiver');
    const receiverIdInput = document.getElementById('hidden-support-msg-receiver');
    const patientDivs = document.querySelectorAll(".message-patient-contact");
    const messageBubble = document.querySelector('.msg-bubble')
    const currentMsgContainer = document.getElementById('msg-recipient')
    
    patientDivs.forEach(patient => {
        patient.addEventListener('click', switchPatient);
    });

    function switchPatient() {
        messageBubble.removeChild(messageBubble.lastChild);
        var patientName = this.innerText
        toggleActivePatient(patientName);

        receiverInput.value = patientName;
        receiverIdInput.value = messages[patientName][0];
        
        var currMsg = document.createElement('p');
        currMsg.innerText = messages[patientName][1];

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