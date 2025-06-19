
const PASSWORD = "bouldering";

function openLetter(letterId) {
    const userInput = prompt("Enter our special code to open this letter:");

    if(userInput === PASSWORD) {
        document.getElementById(letterId).style.display = "flex";
    } else {
        alert("Try again, my love ❤️");
    }
}

function closeModal(letterId) {
    document.getElementById(letterId).style.display = "none";
}

// Close modal when clicking outside content
window.onclick = function(event) {
    document.querySelectorAll('.letter-modal').forEach(modal => {
        if(event.target == modal) {
            modal.style.display = "none";
        }
    });
}