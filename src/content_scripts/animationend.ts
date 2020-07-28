export function animationend(node: HTMLElement) {
    function handleAnimationEnd(_event) {
        node.dispatchEvent(new CustomEvent('animationEnd', {}));
    }

    node.addEventListener('animationend', handleAnimationEnd);

    return {
        destroy() {
            node.removeEventListener('animationend', handleAnimationEnd);
        }
    };
}