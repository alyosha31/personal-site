type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  href: string;
};

type Command = {
  description: string;
  usage?: string;
  run: (args: string[]) => void;
};

const output = document.querySelector<HTMLElement>('#terminal-output');
const form = document.querySelector<HTMLFormElement>('#terminal-form');
const input = document.querySelector<HTMLInputElement>('#terminal-input');
const suggestions = document.querySelector<HTMLElement>('#suggestions');
const clock = document.querySelector<HTMLElement>('#clock');
const postsData = document.querySelector<HTMLScriptElement>('#posts-data');
const promptPath = document.querySelector<HTMLElement>('.prompt-path');

if (!output || !form || !input || !suggestions || !postsData || !promptPath) {
  throw new Error('Terminal failed to initialize.');
}

const posts: Post[] = JSON.parse(postsData.textContent || '[]');
const history: string[] = [];
let historyIndex = 0;
let currentDirectory: '~' | '~/writing' | '~/projects' = '~';
const themes = ['green', 'amber', 'blue'] as const;

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function append(node: Node) {
  output.append(node);
  output.scrollTop = output.scrollHeight;
}

function print(text = '', className = '') {
  const block = element('div', `output-block ${className}`.trim());
  text.split('\n').forEach((line) => block.append(element('div', '', line || '\u00a0')));
  append(block);
}

function printCommand(command: string) {
  const row = element('div', 'executed-command');
  const prompt = element('span', 'executed-prompt', `alyosha@personal-site:${currentDirectory}$`);
  row.append(prompt, document.createTextNode(` ${command}`));
  append(row);
}

function updatePrompt() {
  promptPath.textContent = currentDirectory;
}

function printLinks(items: Array<{ label: string; detail?: string; href: string }>) {
  const list = element('div', 'terminal-list');
  items.forEach((item) => {
    const link = element('a', 'terminal-list-item');
    link.href = item.href;
    const label = element('span', 'list-label', item.label);
    const detail = element('span', 'list-detail', item.detail || '');
    const arrow = element('span', 'list-arrow', '↗');
    link.append(label, detail, arrow);
    list.append(link);
  });
  append(list);
}

function showHelp() {
  const grid = element('div', 'help-grid');
  Object.entries(commands).forEach(([name, command]) => {
    grid.append(
      element('span', 'help-command', command.usage || name),
      element('span', 'help-description', command.description),
    );
  });
  append(grid);
  print('Tip: use ↑/↓ for history and Tab to autocomplete.', 'dim');
}

function showWriting() {
  print(`total ${posts.length}\n`);
  printLinks(posts.map((post) => ({
    label: `${post.date}  ${post.slug}.md`,
    detail: post.description,
    href: post.href,
  })));
}

function showProjects() {
  print('drwxr-xr-x  alyosha  experiments/\n-rw-r--r--  alyosha  coming-soon.md', 'file-listing');
  print('\nProjects are being moved in. Check back soon.', 'dim');
}

function cycleTheme(requested?: string) {
  const current = document.body.dataset.theme || 'green';
  const next = requested && themes.includes(requested as typeof themes[number])
    ? requested
    : themes[(themes.indexOf(current as typeof themes[number]) + 1) % themes.length];
  document.body.dataset.theme = next;
  localStorage.setItem('terminal-theme', next);
  print(`theme set to ${next}`);
}

const commands: Record<string, Command> = {
  help: { description: 'show this command list', run: showHelp },
  about: {
    description: 'who is behind this terminal?',
    run: () => print(
      "I'm Alyosha — a builder and curious person writing about technology,\ncreative work, and the small choices that shape a good life.",
    ),
  },
  writing: { description: 'list published posts', run: showWriting },
  projects: { description: 'list things I am building', run: showProjects },
  contact: {
    description: 'show ways to reach me',
    run: () => printLinks([
      { label: 'github', detail: '@alyosha31', href: 'https://github.com/alyosha31' },
      { label: 'source', detail: 'personal-site', href: 'https://github.com/alyosha31/personal-site' },
    ]),
  },
  cd: {
    usage: 'cd <directory>',
    description: 'change working directory',
    run: (args) => {
      const target = (args[0] || '~').replace(/\/+$/, '');
      if (target === '~' || target === '/' || target === '/home/alyosha/personal-site') {
        currentDirectory = '~';
      } else if (target === '..') {
        currentDirectory = '~';
      } else if (
        target === 'writing' ||
        target === './writing' ||
        target === '~/writing' ||
        target === '../writing'
      ) {
        currentDirectory = '~/writing';
      } else if (
        target === 'projects' ||
        target === './projects' ||
        target === '~/projects' ||
        target === '../projects'
      ) {
        currentDirectory = '~/projects';
      } else {
        print(`cd: ${args[0]}: No such file or directory`, 'error');
        return;
      }
      updatePrompt();
    },
  },
  ls: {
    usage: 'ls [writing|projects]',
    description: 'list files and directories',
    run: (args) => {
      if (args[0] === 'writing') return showWriting();
      if (args[0] === 'projects') return showProjects();
      if (currentDirectory === '~/writing') return showWriting();
      if (currentDirectory === '~/projects') return showProjects();
      print('README.md   about.txt   writing/   projects/   contact.link');
    },
  },
  cat: {
    usage: 'cat <file>',
    description: 'read a file or post',
    run: (args) => {
      const target = (args[0] || '').replace(/^writing\//, '').replace(/\.md$/, '');
      if (target === 'about' || target === 'about.txt') return commands.about.run([]);
      if (target === 'readme' || target === 'README') {
        print('A personal site for writing, projects, and notes from the messy middle.');
        return;
      }
      const post = posts.find((item) => item.slug === target);
      if (post) window.location.href = post.href;
      else print(`cat: ${args[0] || 'missing operand'}: No such file`, 'error');
    },
  },
  open: {
    usage: 'open <target>',
    description: 'open writing, GitHub, or a post',
    run: (args) => {
      const target = args[0];
      if (target === 'writing') window.location.href = '/writing/';
      else if (target === 'github') window.open('https://github.com/alyosha31', '_blank', 'noopener');
      else {
        const post = posts.find((item) => item.slug === target);
        if (post) window.location.href = post.href;
        else print(`open: unknown target '${target || ''}'`, 'error');
      }
    },
  },
  whoami: { description: 'print the current user', run: () => print('guest — welcome, make yourself at home.') },
  pwd: {
    description: 'print working directory',
    run: () => print(`/home/alyosha/personal-site${currentDirectory === '~' ? '' : currentDirectory.slice(1)}`),
  },
  date: { description: 'print the current date', run: () => print(new Date().toString()) },
  history: { description: 'show command history', run: () => print(history.map((item, index) => `${index + 1}  ${item}`).join('\n')) },
  theme: {
    usage: 'theme [green|amber|blue]',
    description: 'change terminal colors',
    run: (args) => cycleTheme(args[0]),
  },
  repo: {
    description: 'open this site on GitHub',
    run: () => window.open('https://github.com/alyosha31/personal-site', '_blank', 'noopener'),
  },
  clear: {
    description: 'clear terminal output',
    run: () => { output.replaceChildren(); },
  },
};

function parseCommand(value: string) {
  return value.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((part) => part.replace(/^"|"$/g, '')) || [];
}

function run(value: string) {
  const clean = value.trim();
  if (!clean) return;
  printCommand(clean);
  history.push(clean);
  historyIndex = history.length;
  const [name, ...args] = parseCommand(clean);
  const command = commands[name.toLowerCase()];
  if (command) command.run(args);
  else print(`${name}: command not found. Type 'help' for available commands.`, 'error');
  input.value = '';
  updateSuggestions();
}

function updateSuggestions() {
  const value = input.value.toLowerCase();
  const parts = value.split(/\s+/);
  const commandName = parts[0];
  const fragment = parts.at(-1) || '';
  const argumentOptions: Record<string, string[]> = {
    cd: ['~', '..', 'writing/', 'projects/'],
    ls: ['writing', 'projects'],
    cat: currentDirectory === '~/writing'
      ? posts.map((post) => `${post.slug}.md`)
      : ['README.md', 'about.txt', ...posts.map((post) => `writing/${post.slug}.md`)],
    open: ['writing', 'github', ...posts.map((post) => post.slug)],
    theme: [...themes],
  };
  const isArgument = value.includes(' ');
  const source = isArgument ? (argumentOptions[commandName] || []) : Object.keys(commands);
  const matches = source.filter((name) => name.toLowerCase().startsWith(fragment)).slice(0, 6);
  if (!value.trim() || matches.length === 0) {
    suggestions.hidden = true;
    suggestions.replaceChildren();
    return;
  }
  suggestions.replaceChildren();
  matches.forEach((match) => {
    const button = element('button', '', match);
    button.type = 'button';
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
      input.value = isArgument
        ? `${parts.slice(0, -1).join(' ')} ${match}`
        : match;
      input.focus();
      updateSuggestions();
    });
    suggestions.append(button);
  });
  suggestions.hidden = matches.length === 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  run(input.value);
});

input.addEventListener('input', updateSuggestions);
input.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = history[historyIndex] || '';
    updateSuggestions();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    input.value = history[historyIndex] || '';
    updateSuggestions();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    const firstSuggestion = suggestions.querySelector<HTMLButtonElement>('button');
    if (firstSuggestion) {
      const value = input.value;
      input.value = value.includes(' ')
        ? `${value.slice(0, value.lastIndexOf(' ') + 1)}${firstSuggestion.textContent}`
        : firstSuggestion.textContent || value;
    }
    updateSuggestions();
  } else if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
    event.preventDefault();
    commands.clear.run([]);
  } else if (event.key === 'Escape') {
    suggestions.hidden = true;
  }
});

document.querySelectorAll<HTMLElement>('[data-command]').forEach((button) => {
  button.addEventListener('click', () => {
    const command = button.dataset.command || '';
    if (command === 'theme') cycleTheme();
    else run(command);
    input.focus();
  });
});

document.querySelector('.terminal-screen')?.addEventListener('click', (event) => {
  if (event.target === event.currentTarget || event.target === output) input.focus();
});

const savedTheme = localStorage.getItem('terminal-theme');
if (savedTheme && themes.includes(savedTheme as typeof themes[number])) document.body.dataset.theme = savedTheme;

function updateClock() {
  if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour12: false });
}
updateClock();
window.setInterval(updateClock, 1000);
