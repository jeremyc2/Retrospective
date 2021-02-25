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

    container.addEventListener("scroll", function() {
        const adjustedHeight = container.scrollHeight - height,
              adjustedScrollHeight = height - scrollbar.getBoundingClientRect().height;

        var scrollPercent = container.scrollTop / adjustedHeight;
        scrollPercent = scrollPercent > 1? 1: scrollPercent;

        var newOffset = container.scrollTop + scrollPercent * adjustedScrollHeight,
            maxOffset = container.scrollHeight - scrollbar.getBoundingClientRect().height;
        if(newOffset > maxOffset) {
            scrollbar.style.top = maxOffset;
        } else {
            scrollbar.style.top = newOffset;
        }
    });

    scrollbar.addEventListener("mousedown", function(e) {

        scrollbar.classList.add("scrollbar-drag");

        var y = e.screenY,
            oldScrollTop = container.scrollTop,
            oldScrollOffset = scrollbar.offsetTop;
        
        function updateScroll(e) {

            var deltaY = e.screenY - y,
                scrollRatio = deltaY * container.scrollHeight / height,
                newScrollTop = oldScrollTop + scrollRatio,
                newScrollOffset = oldScrollOffset + deltaY + scrollRatio,
                maxOffset = container.scrollHeight - scrollbar.getBoundingClientRect().height;

            if(newScrollOffset < 0) {
                container.scrollTop = 0;
            } else if(newScrollOffset > maxOffset) {
                container.scrollTop = maxOffset;
            } else {
                container.scrollTop = newScrollTop;
            }

        }

        document.addEventListener("mousemove", updateScroll);

        document.addEventListener("mouseup", function() {

            scrollbar.classList.remove("scrollbar-drag");

            document.removeEventListener("mousemove", updateScroll);
        });

        e.preventDefault();
        
    });
}