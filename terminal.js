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

// --- Helper function to make the terminal draggable ---
function makeDraggable(terminal) {
    const header = terminal.querySelector('.terminal-header');

    header.addEventListener('mousedown', (e) => {
        let offsetX = e.clientX - terminal.getBoundingClientRect().left;
        let offsetY = e.clientY - terminal.getBoundingClientRect().top;

        header.style.cursor = 'grabbing';
        terminal.style.userSelect = 'none';
        terminal.style.transform = 'none'; // Override initial centering

        function handleMouseMove(e) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            terminal.style.left = `${newX}px`;
            terminal.style.top = `${newY}px`;
        }

        function handleMouseUp() {
            header.style.cursor = 'grab';
            terminal.style.userSelect = 'auto';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

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
    const promptEl = terminal.querySelector('.terminal-prompt');

    const commandHistory = [];
    let historyIndex = -1;
    let isTyping = false;

    // --- State for the terminal puzzles and user status ---
    let terminalState = {
        isPasswordFileReadable: false,
        currentUser: 'guest',
        loggedIn: false
    };

    // --- Dynamic file system based on user state ---
    function getFiles() {
        const homeDir = [
            "passwords_backup_FINAL.txt"
        ];
        if (terminalState.loggedIn) {
            homeDir.push('secret_project_brief.txt');
        }
        return homeDir;
    }

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
  whoami        - Displays your current user identity
  matrix        - Toggles the background matrix effect
  hire          - Displays contact information
  change-song   - Changes the currently playing song
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
            for (let progress = 0; progress <= 100; progress += 10) {
                await typeEffect(`Accessing root... [${'▓'.repeat(progress / 10)}${'░'.repeat(10 - progress / 10)}] ${progress}%`, 1);
                await new Promise(res => setTimeout(res, 150));
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
                await typeEffect("Here's your sandwich, big lad.");
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
                if (terminalState.isPasswordFileReadable || isSudo) {
                    const funnyContent = `
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you

~
~ HINT: The password is in the song title...
~ "passwords_backup_FINAL.txt" 5L, 134B
`;
                    await typeEffect("Opening file...", 50);
                    await typeEffect(funnyContent, 10);
                } else {
                    await typeEffect(`"passwords_backup_FINAL.txt" E212: Can't open file for writing`);
                }
            } else if (fileToOpen === 'secret_project_brief.txt') {
                if (terminalState.loggedIn) {
                    const secretContent = `
TOP SECRET - EYES ONLY

Project: Portfolio Overhaul v3
Objective: Make it so cool that visitors can't help but get in touch.
Status: [CLASSIFIED]

Key Directives:
- Must include a sick, over-the-top terminal easter egg.
- Must demonstrate JavaScript proficiency in a fun way.
- Add at least one ASCII art cow.

End of file. This message will self-destruct. (Not really).
`;
                    await typeEffect(secretContent, 10);
                } else {
                    await typeEffect(`vim: "${fileToOpen}" is not readable.`);
                }
            } else {
                await typeEffect(`No chance. Last time you used Vim it took 3 hours to exit.`);
            }
        },
        'vi': (args, isSudo) => commandMap.vim(args, isSudo),
        'neovim': (args, isSudo) => commandMap.vim(args, isSudo),
        'emacs': (args, isSudo) => commandMap.vim(args, isSudo),
        'chmod': async (args, isSudo) => {
            const targetFile = args.find(arg => arg.includes('passwords'));
            if (isSudo) {
                if (targetFile === 'passwords_backup_final.txt') {
                    terminalState.isPasswordFileReadable = true;
                    await typeEffect(`Permissions updated for ${targetFile}.`);
                } else {
                    await typeEffect(`Changing permissions... [SUCCESS]`);
                }
            } else {
                await typeEffect(`chmod: changing permissions of '${targetFile || 'file'}': Operation not permitted`);
            }
        },
        'cd': async (args) => {
            await typeEffect(`cd: ${args[0]}: No such file or directory`);
        },
        // --- NEW COMMANDS ---
        'whoami': async () => {
            if (terminalState.loggedIn) {
                await typeEffect('admin');
            } else {
                await typeEffect('A curious visitor... and perhaps my next client? ;)');
            }
        },
        'cowsay': async (args) => {
            const message = args.join(' ') || 'Mooooo!';
            const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;
            await typeEffect(` < ${message} >`, 5);
            await typeEffect(cow, 5);
        },
        'login': async () => {
            if (terminalState.loggedIn) {
                await typeEffect('Already logged in as admin.');
                return;
            }
            isTyping = true; // Prevent command execution while typing password
            output.innerHTML += 'password: ';
            input.type = 'password';

            return new Promise(resolve => {
                const passwordHandler = async (e) => {
                    if (e.key === 'Enter') {
                        input.removeEventListener('keydown', passwordHandler);
                        const password = input.value.trim().toLowerCase();
                        input.value = '';
                        input.type = 'text';

                        // Obscure password in output
                        output.lastChild.textContent += '********';
                        output.innerHTML += '<br>';

                        if (password === 'nevergonnagiveyouup') {
                            terminalState.currentUser = 'admin';
                            terminalState.loggedIn = true;
                            await typeEffect('Login successful. Welcome, Admin.');
                            promptEl.textContent = 'admin@jmkod.es:~$';
                        } else {
                            await typeEffect('login: incorrect password');
                        }
                        isTyping = false;
                        resolve();
                    }
                };
                input.addEventListener('keydown', passwordHandler);
            });
        },
        'rm': async (args) => {
            if (args.join(' ').toLowerCase() === '-rf /') {
                // 1. The initial "deletion" sequence
                await typeEffect('WARNING: This operation is irreversible.', 50);
                await new Promise(res => setTimeout(res, 1000));
                await typeEffect('Initiating system wipe...', 20);

                const files = ['/bin', '/etc/config', '/home/users', '/var/log', '/boot', '/lib'];
                for (const file of files) {
                    await typeEffect(`   DELETING ${file}... [OK]`, 10);
                    await new Promise(res => setTimeout(res, 50));
                }
                await typeEffect('\nSYSTEM WIPE COMPLETE.', 100);
                await new Promise(res => setTimeout(res, 250));

                // 2. Hide the terminal and trigger the BSOD
                const bsodScreen = document.getElementById('bsod');
                const terminalWindow = document.querySelector('.hacker-terminal');

                terminalWindow.style.display = 'none'; // Hide the terminal first
                bsodScreen.style.display = 'block'; // Show the BSOD!

                commandMap.clear();

                // 3. Wait for a few seconds for the panic to set in
                await new Promise(res => setTimeout(res, 7500));

                // 4. Hide the BSOD and bring back the terminal
                bsodScreen.style.display = 'none';
                terminalWindow.style.display = 'block';

                // 5. Reveal the joke
                await new Promise(res => setTimeout(res, 1000));

                await typeEffect('Just kidding. But my heart skipped a beat. Did yours?');

            } else {
                await typeEffect(`rm: cannot remove '${args.join(' ')}': Permission denied.`);
            }
        },
        'change-song': async () => {
            if (typeof changeToRandomTrack === 'function') {
                changeToRandomTrack();
                await typeEffect('Enjoy the music! 🎶');
            } else {
                await typeEffect('No music player available.');
            }
        }
    };

    // --- Main Command Handler ---
    async function handleCommand(cmdStr) {
        let isSudo = false;
        if (cmdStr.startsWith("sudo ")) {
            cmdStr = cmdStr.slice(5);
            isSudo = true;
        }

        const parts = cmdStr.split(' ').filter(part => part !== "");
        const command = parts[0];
        const args = parts.slice(1);

        if (commandMap[command]) {
            // Special handling for rm -rf /
            if (command === 'rm' && cmdStr.includes('-rf /')) {
                await commandMap['rm'](['-rf', '/'], isSudo);
            } else {
                await commandMap[command](args, isSudo);
            }
        } else {
            await typeEffect(`Error: Command not found: ${command}`);
        }
    }

    closeBtn.addEventListener('click', () => terminal.remove());

    await typeEffect(`Initializing JMKod.es System Shell...`);

    setTimeout(async () => {
        await typeEffect(`Welcome, visitor.\nType 'help' for a list of commands.`);

        input.focus();
        input.addEventListener('keydown', async function (e) {
            e.stopPropagation();
            if (isTyping) return;

            // --- TAB AUTO-COMPLETION ---
            if (e.key === 'Tab') {
                e.preventDefault();
                const currentInput = input.value.trim().toLowerCase();
                if (!currentInput) return;

                const availableCommands = Object.keys(commandMap);
                const potentialMatch = availableCommands.find(cmd => cmd.startsWith(currentInput));

                if (potentialMatch) {
                    input.value = potentialMatch + ' ';
                }
            }

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
                const command = input.value.trim(); // Keep case for passwords
                if (command) {
                    output.innerHTML += `${promptEl.textContent} ${command}<br>`;
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    input.value = '';
                    await handleCommand(command.toLowerCase());
                } else {
                    output.innerHTML += `${promptEl.textContent}<br>`;
                }
                output.scrollTop = output.scrollHeight;
            }
        });
    }, 400);
}