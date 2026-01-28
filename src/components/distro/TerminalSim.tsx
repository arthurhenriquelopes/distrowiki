import { useState, useRef, useEffect } from 'react';
import { Distro } from '@/types';
import { useTranslation } from 'react-i18next';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalSimProps {
  distro: Distro;
}

const TerminalSim = ({ distro }: TerminalSimProps) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    `Welcome to ${distro.name} shell. Type 'help' for commands.`
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    let response = '';
    
    switch (cmd) {
      case 'help':
        response = t('features.terminal.help');
        break;
      case 'whoami':
        response = 'user@distrowiki';
        break;
      case 'neofetch':
        response = `
        .-/+oossssoo+/-.               ${distro.name}
    :"+ssssssssssssso/"           ----------------
  .s::+sssssssssssssssss+.         OS: ${distro.name} Linux
  ++::+ssssssssssssssssssss+       Kernel: 6.8.0-generic
 .s::+ssssssssssssssssssssss       Uptime: 10 mins
 :s::+ssssssssssssssssssssss       Packages: 1200 (dpkg)
 :s::+ssssssssssssssssssssss       Shell: bash 5.2.15
 :s::+ssssssssssssssssssssss       DE: ${distro.desktopEnvironments?.[0] || 'Unknown'}
  ++::+ssssssssssssssssssss+       CPU: Generic Virtual CPU
  .s::+sssssssssssssssssssss       Memory: 4096MiB / 16384MiB
   :"+ssssssssssssssssss+"
    .-/+oossssoo+/-.
        `;
        break;
      case 'cat /etc/os-release':
        response = `PRETTY_NAME="${distro.name}"
ID=${distro.id}
VERSION_ID="2024"`;
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        response = `bash: ${cmd}: command not found`;
    }

    setHistory([...history, `> ${input}`, response]);
    setInput('');
  };

  return (
    <div className="bg-black/90 text-green-400 font-mono p-4 rounded-lg border border-gray-800 shadow-xl w-full max-w-3xl mx-auto my-8">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2 text-gray-500">
            <TerminalIcon className="w-4 h-4" />
            <span className="text-xs">bash — 80x24</span>
        </div>
      <div className="h-64 overflow-y-auto mb-4 space-y-1 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-700">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-blue-400 font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-green-400 placeholder-gray-700"
          placeholder={t('features.terminal.placeholder')}
          autoFocus
        />
      </form>
    </div>
  );
};

export default TerminalSim;
