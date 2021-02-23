function buildScrollbars() {
    [...document.querySelectorAll(".scrollbar")].forEach(sb => {
        controlVirtualScrollbar(sb);
    });
}

function controlVirtualScrollbar(scrollbar) {
    var container = scrollbar.parentElement;
    var height = container.getBoundingClientRect().height;

    scrollbar.innerHTML = "";
    scrollbar.style.height = 0;

    if(container.scrollHeight <= height + 70) {
        return;
    }

    scrollbar.appendChild(document.createElement("div"));

    scrollbar.style.height = 
        height * (height / container.scrollHeight);

    container.addEventListener("mouseenter", function(e) {

        if(scrollbar.firstElementChild == null) {
            return;
        }

        e.target.addEventListener("mouseleave", function() {

            if(scrollbar.firstElementChild == null) {
                return;
            }

            if(!scrollbar.firstElementChild.classList.contains("scrollbar-drag")) {
                scrollbar.firstElementChild.style.display = "none";
            }

        });
    });

    container.addEventListener("mousemove", function() {
        scrollbar.firstElementChild.style.display = "block";
    });

    container.addEventListener("scroll", function() {
        var adjustedHeight = container.scrollHeight - height;
        var adjustedScrollHeight = height - scrollbar.getBoundingClientRect().height;

        var scrollPercent = container.scrollTop / adjustedHeight;
        scrollPercent = scrollPercent > 1? 1: scrollPercent;

        var newOffset = container.scrollTop + scrollPercent * adjustedScrollHeight;
        if(newOffset > container.scrollHeight - scrollbar.getBoundingClientRect().height) {
            scrollbar.style.top = container.scrollHeight - scrollbar.getBoundingClientRect().height;
        } else {
            scrollbar.style.top = container.scrollTop + scrollPercent * adjustedScrollHeight;
        }
    });

    scrollbar.addEventListener("mousedown", function(e) {

        if(scrollbar.firstElementChild == null) {
            return;
        }

        scrollbar.firstElementChild.classList.add("scrollbar-drag");

        var y = e.screenY,
            oldScrollTop = container.scrollTop,
            oldScrollOffset = scrollbar.offsetTop;
        
        function updateScroll(e) {

            if(scrollbar.firstElementChild == null) {
                return;
            }

            var deltaY = e.screenY - y,
                scrollRatio = deltaY * container.scrollHeight / height,
                newScrollTop = oldScrollTop + scrollRatio,
                newScrollOffset = oldScrollOffset + deltaY + scrollRatio;

            if(newScrollOffset < 0) {
                container.scrollTop = 0;
                scrollbar.style.top = 0;
            } else if(newScrollOffset > container.scrollHeight - scrollbar.getBoundingClientRect().height) {
                container.scrollTop = container.scrollHeight - scrollbar.getBoundingClientRect().height;
                scrollbar.style.top = container.scrollHeight - scrollbar.getBoundingClientRect().height;  
            } else {
                container.scrollTop = newScrollTop;
                scrollbar.style.top = newScrollOffset;
            }

        }

        document.addEventListener("mousemove", updateScroll);

        document.addEventListener("mouseup", function(e) {

            if(scrollbar.firstElementChild == null) {
                return;
            }

            scrollbar.firstElementChild.classList.remove("scrollbar-drag");
            if(e.path.includes(container)) {
                scrollbar.firstElementChild.style.display = "block";
            } else {
                scrollbar.firstElementChild.style.display = "none";
            }

            document.removeEventListener("mousemove", updateScroll);
        });

        e.preventDefault();
        
    });
}