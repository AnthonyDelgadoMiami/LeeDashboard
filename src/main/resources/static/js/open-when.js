
const PASSWORD = "bouldering";
const PASSWORD1 = "climbing";

function openLetter(letterId) {
    const userInput = prompt("What is your favorite activity:");

    if(userInput === PASSWORD || userInput === PASSWORD1) {
        document.getElementById(letterId).style.display = "flex";
    } else {
        alert("Try again, mi vida ❤️");
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