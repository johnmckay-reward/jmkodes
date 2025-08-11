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

function createTerminal() {
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

    const output = terminal.querySelector('.terminal-output');
    const closeBtn = terminal.querySelector('.terminal-close-btn');

    let isTyping = false;

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

    async function handleCommand(cmd) {

        let isSudo = false;

        if (cmd.startsWith("sudo ")) {
            cmd = cmd.slice(5);
            isSudo = true;
        }

        const parts = cmd.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                await typeEffect(
                    `Available commands:
  help          - Shows this message
  clear         - Clears the terminal screen
  date          - Displays the current system date
  matrix        - Toggles the background matrix effect
  hire          - Displays contact information
  neofetch      - Displays system information
  make-sandwich - Makes a sandwich
  hack [target] - Hacks the target`
                );
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'date':
                await typeEffect(new Date().toLocaleString());
                break;
            case 'matrix':
                const canvas = document.getElementById('matrix-canvas');
                if (canvas.style.display === 'none') {
                    canvas.style.display = 'block';
                    await typeEffect('Matrix background: [ENABLED]');
                } else {
                    canvas.style.display = 'none';
                    await typeEffect('Matrix background: [DISABLED]');
                }
                break;
            case 'hire':
                await typeEffect(`Establishing secure connection... DONE.\nContact Agent JMKod.es for freelance projects:\nEmail: john@codebelfast.com\nLinkedIn: /in/john-mckay-2234a160/`);
                break;
            case 'neofetch':
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
                break;
            case 'hack':
                const target = args[0] || 'the Gibson';
                await typeEffect(`Initializing connection to ${target}...`, 50);
                await typeEffect(`Bypassing firewall... [SUCCESS]`, 50);
                await typeEffect(`Encrypting traffic...`, 50);
                let progress = 0;
                const progressBar = () => {
                    return new Promise(resolve => {
                        const interval = setInterval(async () => {
                            progress += 20;
                            await typeEffect(`Accessing root... [${'▓'.repeat(progress / 10)}${' '.repeat(20 - progress / 5)}] ${progress}%`, 1);
                            if (progress >= 100) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 200);
                    });
                };
                await progressBar();
                await typeEffect(`ACCESS GRANTED.`, 100);
                await typeEffect(`...Just kidding! All files on ${target} are safe. :)`);
                break;
            case 'make-sandwich':
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
                break;
            default:
                await typeEffect(`Error: Command not found: ${command}`);
                break;
        }
    }

    closeBtn.addEventListener('click', () => terminal.remove());

    typeEffect(`SYSTEM BOOT COMPLETE. Welcome, user.\nType 'help' for a list of commands.`);

    setTimeout(() => {
        const input = terminal.querySelector('.terminal-input');
        if (input) {
            input.focus();

            input.addEventListener('keydown', async function (e) {
                e.stopPropagation(); // Stop the event from bubbling up to the document!
                if (isTyping) return; // Prevent input while typing

                if (e.key === 'Enter') {
                    const command = input.value.trim().toLowerCase();
                    if (command) {
                        output.innerHTML += `> ${command}<br>`;
                        await handleCommand(command);
                    }
                    input.value = '';
                    output.scrollTop = output.scrollHeight; // Auto-scroll
                }
            });

            // Also try adding an input event as backup
            input.addEventListener('input', function (e) {
                console.log('Input event, current value:', input.value);
            });
        } else {
            console.error('Could not find terminal input!');
        }
    }, 0);
}