const styles: Record<string, string> = {
    style1: 'dist/page1.css',
    style2: 'dist/page2.css',
    style3: 'dist/page3.css',
};

let currentStyle = 'style1';
const setStyle = (styleKey: string): void => {
    currentStyle = styleKey;

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = styles[currentStyle];
    linkElement.id = 'styleSheet';

    const existingLink = document.getElementById('styleSheet');
    if (existingLink) {
        existingLink.remove();
    }

    document.head.appendChild(linkElement);
    console.log(`Styl zmieniony na: ${styles[currentStyle]}`);
};

const createStyleButtons = (): void => {
    const buttonContainer = document.getElementById('styleButtons')!;

    buttonContainer.innerHTML = '';

    for (const [styleKey, stylePath] of Object.entries(styles)) {
        const button = document.createElement('button');
        button.textContent = `Użyj ${styleKey}`;
        button.classList.add('style-button');
        button.onclick = () => setStyle(styleKey);
        buttonContainer.appendChild(button);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    createStyleButtons();
});
