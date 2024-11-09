export class Device {
    static isMobile() {
        return navigator.userAgent.includes('Mobile') || window.innerWidth < 500;
    }
}

