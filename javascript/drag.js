// TODO Remember to set draggable to true on the element

var draggedElement;
var startY;

// Use me on drop container
function allowDrop(ev) {
    ev.preventDefault();
}
  
function dragStart(ev) {
    draggedElement = ev.target;

    draggedElement.style.transition = "0s";
    draggedElement.style.zIndex = 999;

    startY = ev.clientY;

    // To prevent ghosting use an empty div
    ev.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
}

function drag(ev) {
    draggedElement.style.transform = `translateY(${ev.clientY - startY + draggedElement.parentElement.scrollTop}px)`;
}

function dragEnd() {
    draggedElement.style.transform = "";

    // We want it back in it's place before we set everything else
    // back to whatever they were
    setTimeout(() => {
        draggedElement.style.transition = "";
        draggedElement.style.zIndex = "";
    }, 1);
}
  
function drop(ev) {
    ev.preventDefault();
}