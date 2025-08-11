// ==========================================================
// =========== HACKER TERMINAL LAUNCHER SCRIPT ============
// ==========================================================

const terminalBtn = document.getElementById('terminal-btn');

terminalBtn.addEventListener('click', () => {
    // Check if a terminal already exists
    if (document.querySelector('.hacker-terminal')) {
        return;
    }
    createTerminal();
});

function getFiles() {
    const homeDir = [
        "passwords_backup_FINAL.txt"
    ];

    return homeDir;
}

// --- Helper function to make the terminal draggable (improved version) ---
function makeDraggable(terminal) {
    const header = terminal.querySelector('.terminal-header');

    header.addEventListener('mousedown', (e) => {
        let offsetX = e.clientX - terminal.getBoundingClientRect().left;
        let offsetY = e.clientY - terminal.getBoundingClientRect().top;

        header.style.cursor = 'grabbing';
        terminal.style.userSelect = 'none';
        terminal.style.transform = 'none'; // Override initial centering

        // Function to run on mouse move
        function handleMouseMove(e) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            terminal.style.left = `${newX}px`;
            terminal.style.top = `${newY}px`;
        }

        // Function to run on mouse up
        function handleMouseUp() {
            header.style.cursor = 'grab';
            terminal.style.userSelect = 'auto';

            // Clean up the listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        // Add listeners now that dragging has started
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });
}

async function createTerminal() {
    const terminal = document.createElement('div');
    terminal.className = 'hacker-terminal';

    terminal.innerHTML = `
        <div class="terminal-header">
            <span>JMKod.es System Shell</span>
            <button class="terminal-close-btn">X</button>
        </div>
        <div class="terminal-output"></div>
        <div class="terminal-input-line">
            <span class="terminal-prompt">&gt;</span>
            <input type="text" class="terminal-input" autofocus />
        </div>
    `;

    document.body.appendChild(terminal);
    makeDraggable(terminal);

    const output = terminal.querySelector('.terminal-output');
    const closeBtn = terminal.querySelector('.terminal-close-btn');
    const input = terminal.querySelector('.terminal-input');

    const commandHistory = [];
    let historyIndex = -1;
    let isTyping = false;

    // --- State variable for the password file puzzle ---
    let isPasswordFileReadable = false;

    // --- Helper function for typewriter effect ---
    function typeEffect(text, speed = 20) {
        return new Promise(resolve => {
            isTyping = true;
            let i = 0;
            const interval = setInterval(() => {
                if (text[i] === '\n') {
                    output.innerHTML += '<br>';
                } else {
                    output.innerHTML += text[i];
                }
                output.scrollTop = output.scrollHeight;
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    output.innerHTML += '<br>';
                    isTyping = false;
                    resolve();
                }
            }, speed);
        });
    }

    // --- Command Map for handling all terminal commands ---
    const commandMap = {
        'help': async () => {
            await typeEffect(
`Available commands:
  help          - Shows this message
  clear         - Clears the terminal screen
  matrix        - Toggles the background matrix effect
  hire          - Displays contact information
  drink-beer    - Try it and see 🍺
  make-sandwich - Makes a sandwich
  hack [target] - Hacks the target`
            );
        },
        'clear': () => {
            output.innerHTML = '';
        },
        'date': async () => {
            await typeEffect(new Date().toLocaleString());
        },
        'matrix': async () => {
            const canvas = document.getElementById('matrix-canvas');
            if (canvas.style.display === 'none') {
                canvas.style.display = 'block';
                await typeEffect('Matrix background: [ENABLED]');
            } else {
                canvas.style.display = 'none';
                await typeEffect('Matrix background: [DISABLED]');
            }
        },
        'hire': async () => {
            await typeEffect(`Establishing secure connection... DONE.\nContact Agent JMKod.es for freelance projects:\nEmail: john@codebelfast.com\nLinkedIn: /in/john-mckay-2234a160/`);
        },
        'neofetch': async () => {
            const neofetchArt = `
        .--.      |    OS: JMKod.es v2.1
       |o_o |     |    Host: John McKay
       |:_/ |     |    Kernel: 5.4.0-caffeinated
      //   \\ \\    |    Uptime: 10+ years
     (|     | )   |    Shell: zsh (zany shell)
    /'\\_   _/ \`\\   |    CPU: Human Brain @ 1.21 Giga-thoughts
    \\___)=(___/   |    RAM: 2GB (short-term memory)
`;
            await typeEffect(neofetchArt, 5);
        },
        'hack': async (args) => {
            const target = args[0] || 'the Gibson';
            await typeEffect(`Initializing connection to ${target}...`, 50);
            await typeEffect(`Bypassing firewall... [SUCCESS]`, 50);
            for (let progress = 0; progress <= 100; progress += 20) {
                 await typeEffect(`Accessing root... [${'▓'.repeat(progress / 10)}${' '.repeat(10 - progress / 10)}] ${progress}%`, 1);
                 await new Promise(res => setTimeout(res, 200));
            }
            await typeEffect(`ACCESS GRANTED.`, 100);
            await typeEffect(`...Just kidding! All files on ${target} are safe. :)`);
        },
        'make-sandwich': async (args, isSudo) => {
            if (isSudo) {
                const sandwichAsciiArt = `
 ________________
[________________]
[################]  ← meat
[________________]  ← cheese
[................]  ← lettuce
[################]  ← meat
[________________]
                `;
                await typeEffect(sandwichAsciiArt, 5);
                await typeEffect("Here's your sandwich, champ.");
            } else {
                await typeEffect("What? Make it yourself.");
            }
        },
        'drink-beer': async () => {
            const beerArt = `
.~~~~.
i====i_
|cccc|_)
|cccc|   hjw
'-==-'
    `;
            await typeEffect(beerArt, 5);
            await typeEffect("Cheers! Things are getting a bit fuzzy...");

            terminal.classList.add('fuzzy');
            setTimeout(() => {
                terminal.classList.remove('fuzzy');
            }, 2000);
        },
        'ls': async () => {
            const files = getFiles();
            await typeEffect(files.join('\n'));
        },
        'pwd': async () => {
            await typeEffect(`https://jmkod.es`);
        },
        'vim': async (args, isSudo) => {
            const fileToOpen = args[0];
            if (fileToOpen === 'passwords_backup_final.txt') {
                if (isPasswordFileReadable || isSudo) {
                    const funnyContent = `

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
~
~ "passwords_backup_FINAL.txt" 3L, 95B
`;
                    await typeEffect("Opening file...", 50);
                    await typeEffect(funnyContent, 10);
                } else {
                    await typeEffect(`"passwords_backup_FINAL.txt" E212: Can't open file for writing`);
                }
            } else {
                await typeEffect(`No chance, the last time you tried using Vim, it took you 3 hours to exit.`);
            }
        },
        'vi': (args, isSudo) => commandMap.vim(args, isSudo),
        'neovim': (args, isSudo) => commandMap.vim(args, isSudo),
        'emacs': (args, isSudo) => commandMap.vim(args, isSudo),
        'chmod': async (args, isSudo) => {
             const targetFile = args.find(arg => arg.includes('passwords'));
             if (isSudo) {
                 if (targetFile === 'passwords_backup_final.txt') {
                     isPasswordFileReadable = true;
                     await typeEffect(`Permissions updated for ${targetFile}.`);
                 } else {
                     await typeEffect(`Changing permissions... [SUCCESS]`);
                 }
             } else {
                 await typeEffect(`chmod: changing permissions of '${targetFile || 'file'}': Operation not permitted`);
             }
        },
        'cd': async (args) => {
            // directory does not exist
            await typeEffect(`cd: ${args[0]}: No such file or directory`);
        }
    };

    // --- Main Command Handler ---
    async function handleCommand(cmdStr) {
        let isSudo = false;
        if (cmdStr.startsWith("sudo ")) {
            cmdStr = cmdStr.slice(5);
            isSudo = true;
        }

        const parts = cmdStr.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        if (commandMap[command]) {
            await commandMap[command](args, isSudo);
        } else {
            await typeEffect(`Error: Command not found: ${command}`);
        }
    }

    closeBtn.addEventListener('click', () => terminal.remove());

    await typeEffect(`Initializing JMKod.es System Shell...`);

    setTimeout(async () => {
        await typeEffect(`Welcome, John.\nType 'help' for a list of commands.`);

        input.focus();
        input.addEventListener('keydown', async function (e) {
            e.stopPropagation();
            if (isTyping) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) historyIndex--;
                input.value = commandHistory[historyIndex] || '';
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                }
                return;
            }

            if (e.key === 'Enter') {
                const command = input.value.trim().toLowerCase();
                if (command) {
                    output.innerHTML += `> ${command}<br>`;
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    input.value = '';
                    await handleCommand(command);
                }
                output.scrollTop = output.scrollHeight;
            }
        });
    }, 400);
}