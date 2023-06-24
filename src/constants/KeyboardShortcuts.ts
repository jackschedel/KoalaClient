export class KeyboardShortcut {
    constructor(
        public modifiers: number,
        public key: string,
        public description: string,
        public actionBlock: () => void = () => { } // default empty function
    ) { }
}



export const KeyboardModifiers = {
    NONE: 0,
    SHIFT: 1,
    CTRL: 2,
    CTRL_SHIFT: 3,
};



export const keyboardShortcuts = {
    newChat: new KeyboardShortcut(
        KeyboardModifiers.CTRL + KeyboardModifiers.SHIFT,
        'n',
        'New chat',
        () => {
            console.log("New chat");
        }
    ),
    selectAll: new KeyboardShortcut(
        KeyboardModifiers.CTRL,
        'c',
        'Stop generating',
        () => {
            console.log("Stop generating");
        }
    ),
    search: new KeyboardShortcut(
        KeyboardModifiers.NONE,
        '/',
        'Focus on message input',
        () => {
            console.log("Focus on message");
        }
    ),
};
