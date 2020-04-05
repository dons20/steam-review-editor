import { useEffect, useState } from "react";

function useTouchScreenDetection() {
    const [hasTouchScreen, setHasTouchScreen] = useState(false);

    useEffect(() => {
        if ("maxTouchPoints" in navigator) {
            setHasTouchScreen(navigator.maxTouchPoints > 0);
        } else if ("msMaxTouchPoints" in navigator) {
            setHasTouchScreen(navigator.msMaxTouchPoints > 0);
        } else {
            let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
            if (mQ && mQ.media === "(pointer:coarse)") {
                setHasTouchScreen(!!mQ.matches);
            } else if ("orientation" in window) {
                setHasTouchScreen(true); // deprecated, but good fallback
            } else {
                // Only as a last resort, fall back to user agent sniffing
                let UA = navigator.userAgent;
                setHasTouchScreen(
                    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
                );
            }
        }
    }, []);

    return hasTouchScreen;
}

export default useTouchScreenDetection;
