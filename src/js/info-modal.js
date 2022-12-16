const modal = document.getElementById('id01');
window.onclick = function(close) {
    if (close.target == modal) {
        modal.style.display = "none";
    }
}