function controlVirtualScrollbar(scrollbar) {
    var container = scrollbar.parentElement;
    var height = container.getBoundingClientRect().height;

    scrollbar.appendChild(document.createElement("div"));

    scrollbar.style.height = 
        height * (height / container.scrollHeight);

    scrollbar.parentElement.addEventListener("mouseenter", function(e) {
        scrollbar.firstElementChild.style.display = "block";
        e.target.addEventListener("mouseleave", function() {
            scrollbar.firstElementChild.style.display = "none";
        });
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

        scrollbar.firstElementChild.classList.add("scrollbar-drag");

        var y = e.screenY,
            oldScrollTop = container.scrollTop,
            oldScrollOffset = scrollbar.offsetTop;
        
        function updateScroll(e) {

            scrollbar.firstElementChild.style.display = "block";

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