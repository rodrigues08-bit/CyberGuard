import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  X, 
  ArrowRight, 
  Tag, 
  Lightbulb,
  Shield,
  Info
} from 'lucide-react';

/* =========================================================
   REUSABLE LOCAL COMPONENTS
========================================================= */

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 md:p-6 text-[#F2F0F5] ${onClick ? 'cursor-pointer hover:bg-[#1A1A22] transition-colors' : ''} ${className}`}
  >
    {children}
  </div>
);

const MascotImage = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      onError={() => setHasError(true)}
    />
  );
};

/* =========================================================
   GLOSSARY DATA
========================================================= */

const CATEGORIES = [
  'All', 
  'Favorites', 
  'Networking', 
  'Cryptography', 
  'Web Security', 
  'Authentication', 
  'Malware', 
  'Privacy', 
  'General'
];

const GLOSSARY_TERMS = [
  // --- NETWORKING ---
  {
    id: 'ip-address', term: 'IP Address', category: 'Networking',
    shortDefinition: 'A unique numerical label assigned to every device connected to a network.',
    explanation: 'An Internet Protocol (IP) address is how computers identify each other. Just like a house needs a mailing address to receive mail, a computer needs an IP address to receive data over the internet or a local network.',
    example: 'When you request a website, your computer sends its IP address so the website knows where to send the page back to (e.g., 192.168.1.5).',
    whyItMatters: 'IP addresses can be tracked to determine your general physical location or block your access to certain services.',
    relatedTerms: ['dns', 'router', 'vpn'], keywords: ['internet', 'protocol', 'number']
  },
  {
    id: 'dns', term: 'DNS', category: 'Networking',
    shortDefinition: 'The Domain Name System translates human-readable domain names into IP addresses.',
    explanation: 'Computers talk using numbers (IP addresses), but humans prefer words (like example.com). DNS bridges this gap by acting like the phonebook of the internet, looking up the name and finding the correct number.',
    example: 'When you type google.com, DNS translates it behind the scenes into an IP address like 142.250.190.46 so your browser can connect to it.',
    whyItMatters: 'Attackers can abuse DNS through techniques like "DNS spoofing" to secretly redirect you from a real website to a malicious fake one.',
    relatedTerms: ['ip-address'], keywords: ['domain', 'name', 'system', 'website']
  },
  {
    id: 'dhcp', term: 'DHCP', category: 'Networking',
    shortDefinition: 'A protocol that automatically assigns IP addresses to devices on a network.',
    explanation: 'Dynamic Host Configuration Protocol (DHCP) is a server or router feature that hands out IP addresses to devices as they join a network, so you don\'t have to manually configure them.',
    example: 'When you connect your phone to a coffee shop Wi-Fi, their DHCP server instantly assigns your phone an IP address so it can use the internet.',
    whyItMatters: 'Without DHCP, networking would be a manual, tedious nightmare. However, attackers can set up rogue DHCP servers to hijack traffic.',
    relatedTerms: ['ip-address', 'router'], keywords: ['dynamic', 'host', 'configuration']
  },
  {
    id: 'router', term: 'Router', category: 'Networking',
    shortDefinition: 'A device that forwards data packets between computer networks.',
    explanation: 'A router acts as a traffic director. It connects your local devices (like phones and laptops) to each other, and connects your entire local network to the broader internet.',
    example: 'Your home Wi-Fi router takes the internet connection from your wall and securely splits it so your TV, laptop, and phone can all use it simultaneously.',
    whyItMatters: 'Your router is the front door to your home network. If a router has a weak admin password, hackers can take over your entire internet connection.',
    relatedTerms: ['firewall', 'ip-address', 'mac-address'], keywords: ['wifi', 'network', 'modem']
  },
  {
    id: 'firewall', term: 'Firewall', category: 'Networking',
    shortDefinition: 'A security system that monitors and controls incoming and outgoing network traffic.',
    explanation: 'A firewall establishes a barrier between a trusted internal network and an untrusted external network (like the internet). It uses a set of rules to determine what traffic is allowed through and what gets blocked.',
    example: 'A company firewall might be configured to allow employees to visit standard websites, but completely block outside traffic trying to access the company\'s internal servers.',
    whyItMatters: 'It is the most fundamental network defense, preventing automated internet scans from directly accessing your personal devices.',
    relatedTerms: ['router', 'port'], keywords: ['block', 'traffic', 'defense']
  },
  {
    id: 'vpn', term: 'VPN', category: 'Networking',
    shortDefinition: 'A Virtual Private Network creates a secure, encrypted connection over the internet.',
    explanation: 'A VPN creates a private tunnel for your data. It encrypts your internet traffic and routes it through a server in another location, hiding your true IP address and protecting your data from local eavesdroppers.',
    example: 'If you use a coffee shop\'s open Wi-Fi, using a VPN ensures the person at the next table cannot intercept your browsing traffic.',
    whyItMatters: 'VPNs protect your privacy on untrusted networks, but they do not make you immune to malware or phishing.',
    relatedTerms: ['encryption', 'ip-address'], keywords: ['tunnel', 'private', 'virtual', 'proxy']
  },
  {
    id: 'port', term: 'Port', category: 'Networking',
    shortDefinition: 'A virtual point where network connections start and end.',
    explanation: 'If an IP address is a building, a port is a specific apartment number. Ports allow a single computer to host multiple different services simultaneously (like a web server, an email server, and a game server).',
    example: 'Web traffic usually travels on Port 80 (HTTP) or Port 443 (HTTPS), while email uses different ports like 25 or 587.',
    whyItMatters: 'Leaving unnecessary ports "open" on a server is like leaving windows open; it gives hackers more avenues to attempt a break-in.',
    relatedTerms: ['ip-address', 'firewall'], keywords: ['connection', 'number']
  },
  {
    id: 'mac-address', term: 'MAC Address', category: 'Networking',
    shortDefinition: 'A unique physical identifier permanently assigned to a network interface.',
    explanation: 'A Media Access Control (MAC) address is a hardware identification number built into your Wi-Fi or Ethernet card at the factory. Unlike an IP address, which changes based on where you are, your MAC address usually stays the same.',
    example: 'Your home router might use MAC Address filtering to only allow your specific phone and laptop to connect to the Wi-Fi.',
    whyItMatters: 'Because it rarely changes, public networks can track your device\'s physical movements using its MAC address, which is why modern phones now randomize them.',
    relatedTerms: ['ip-address', 'router'], keywords: ['hardware', 'physical', 'media', 'access']
  },

  // --- CRYPTOGRAPHY ---
  {
    id: 'hash', term: 'Hash', category: 'Cryptography',
    shortDefinition: 'A one-way mathematical function that scrambles data into a unique, fixed-size signature.',
    explanation: 'Think of a hash as a digital fingerprint. It crushes any amount of data (a word, a photo, an entire operating system) into a unique string of characters. It is designed to be impossible to reverse-engineer back into the original data.',
    example: 'When you create an account, the website doesn\'t save your password. It saves the "hash" of your password. When you log in, it hashes what you typed and compares the two fingerprints.',
    whyItMatters: 'Hashing is what allows websites to verify your password without actually knowing what your password is.',
    relatedTerms: ['sha-256', 'encryption'], keywords: ['fingerprint', 'one-way', 'scramble']
  },
  {
    id: 'encryption', term: 'Encryption', category: 'Cryptography',
    shortDefinition: 'The process of encoding information so only authorized parties can read it.',
    explanation: 'Encryption turns readable data (plaintext) into an unreadable secret format (ciphertext). Unlike hashing, encryption is a two-way street—it is designed to be reversed (decrypted) as long as you have the correct key.',
    example: 'When you send a message on WhatsApp, it is encrypted on your phone, travels across the internet as gibberish, and is only decrypted when it reaches your friend\'s phone.',
    whyItMatters: 'Encryption ensures that even if hackers steal your files or intercept your internet traffic, they cannot read the actual contents.',
    relatedTerms: ['decryption', 'public-key', 'private-key'], keywords: ['cipher', 'encode', 'lock']
  },
  {
    id: 'decryption', term: 'Decryption', category: 'Cryptography',
    shortDefinition: 'The process of converting encrypted, unreadable data back into its original readable form.',
    explanation: 'Decryption is the reverse of encryption. It requires the correct cryptographic key or password to unlock the data.',
    example: 'When you type your password to unlock your laptop\'s hard drive, the system uses that password to decrypt your files so you can use them.',
    whyItMatters: 'Without decryption, encrypted data is effectively destroyed or useless.',
    relatedTerms: ['encryption', 'private-key'], keywords: ['unlock', 'decode', 'plaintext']
  },
  {
    id: 'public-key', term: 'Public Key', category: 'Cryptography',
    shortDefinition: 'A cryptographic key that can be freely shared to allow others to encrypt messages for you.',
    explanation: 'Think of it like an open padlock you can give to everyone. Anyone can put a message in a box and snap your padlock shut (encrypt it), but once it is locked, even they cannot open it again.',
    example: 'When you visit a secure website, the website sends your browser its public key. Your browser uses it to encrypt your credit card data before sending it.',
    whyItMatters: 'It allows two parties who have never met to securely communicate without having to share a secret password beforehand.',
    relatedTerms: ['private-key', 'encryption', 'digital-signature'], keywords: ['asymmetric', 'padlock']
  },
  {
    id: 'private-key', term: 'Private Key', category: 'Cryptography',
    shortDefinition: 'A secret cryptographic key used to decrypt messages or create digital signatures.',
    explanation: 'Think of it like the secret physical key that only you possess. It is the only thing in the universe that can unlock the padlock (Public Key) you gave to others.',
    example: 'When the website receives your encrypted credit card data, it uses its closely guarded private key to unlock and read the data.',
    whyItMatters: 'If a hacker steals a server\'s private key, they can decrypt all secure communications meant for that server.',
    relatedTerms: ['public-key', 'decryption'], keywords: ['secret', 'asymmetric', 'unlock']
  },
  {
    id: 'digital-signature', term: 'Digital Signature', category: 'Cryptography',
    shortDefinition: 'A mathematical scheme used to verify the authenticity and integrity of a digital message or document.',
    explanation: 'A digital signature proves that a message actually came from the sender, and that the message wasn\'t altered in transit. It relies on the sender\'s private key.',
    example: 'When Apple sends a software update to your iPhone, they sign it digitally. Your phone checks the signature; if it matches Apple, it installs the update. If a hacker modified the file, the signature breaks.',
    whyItMatters: 'It prevents attackers from impersonating trusted entities or tampering with software downloads.',
    relatedTerms: ['public-key', 'private-key', 'hash'], keywords: ['verify', 'authentic', 'sign']
  },
  {
    id: 'sha-256', term: 'SHA-256', category: 'Cryptography',
    shortDefinition: 'A highly secure, widely used hashing algorithm.',
    explanation: 'Secure Hash Algorithm 256-bit takes any input and produces a unique, 64-character (256-bit) hexadecimal string. Even changing one single letter in a 1,000-page document will result in a completely different SHA-256 hash.',
    example: 'If you hash the word "apple", you get a specific 64-character string. If you hash "Apple" (capital A), you get a totally different string.',
    whyItMatters: 'It is the backbone of modern password storage, digital signatures, and blockchain technologies.',
    relatedTerms: ['hash', 'encryption'], keywords: ['algorithm', 'secure']
  },

  // --- WEB SECURITY ---
  {
    id: 'http', term: 'HTTP', category: 'Web Security',
    shortDefinition: 'The foundation of data communication for the World Wide Web.',
    explanation: 'Hypertext Transfer Protocol determines how web pages are transmitted across the internet. However, standard HTTP is entirely unencrypted plain-text.',
    example: 'If you log into an old HTTP website, your password travels through the cables of the internet in plain text, visible to anyone watching the traffic.',
    whyItMatters: 'HTTP is considered insecure today and has largely been replaced by HTTPS to protect user privacy.',
    relatedTerms: ['https'], keywords: ['hypertext', 'web', 'browser']
  },
  {
    id: 'https', term: 'HTTPS', category: 'Web Security',
    shortDefinition: 'The secure, encrypted version of HTTP.',
    explanation: 'HTTPS uses cryptographic protocols (like TLS) to encrypt all traffic between your browser and the website. This prevents internet service providers, hackers on public Wi-Fi, and governments from seeing exactly what you are doing on a site.',
    example: 'When you see a little padlock icon next to your URL bar, you are using HTTPS. An attacker might see you are visiting bank.com, but they cannot see your account balance or password.',
    whyItMatters: 'It is the absolute minimum requirement for web security today. Never enter passwords or credit cards on a non-HTTPS site.',
    relatedTerms: ['http', 'encryption'], keywords: ['secure', 'tls', 'ssl', 'padlock']
  },
  {
    id: 'cookie', term: 'Cookie', category: 'Web Security',
    shortDefinition: 'A small piece of data a website stores on your computer.',
    explanation: 'Cookies act as a web browser\'s short-term memory. Since the internet is stateless (it forgets you after every click), cookies are used to remember who you are and what your preferences are.',
    example: 'When you add items to an online shopping cart, a cookie remembers those items so they don\'t disappear when you navigate to the checkout page.',
    whyItMatters: 'While essential for logging in, tracking cookies can also be used by advertising companies to follow your behavior across the internet.',
    relatedTerms: ['session', 'privacy'], keywords: ['tracker', 'browser', 'data']
  },
  {
    id: 'session', term: 'Session', category: 'Web Security',
    shortDefinition: 'A temporary period of authorized access for a user on a website.',
    explanation: 'Think of it as a temporary VIP pass. After you log in successfully, the server creates a "session" and gives your browser a special token (usually stored in a cookie). For the next few hours, you don\'t have to re-enter your password.',
    example: 'When you close Netflix and open it again an hour later, you are still logged in because your session is still active.',
    whyItMatters: 'If an attacker steals your active session cookie (a technique called Session Hijacking), they can browse as you without needing your password or 2FA code.',
    relatedTerms: ['cookie', 'authentication', 'xss'], keywords: ['login', 'token', 'hijack']
  },
  {
    id: 'api', term: 'API', category: 'Web Security',
    shortDefinition: 'A software bridge that allows two different applications to talk to each other.',
    explanation: 'An Application Programming Interface (API) is like a waiter in a restaurant. You (the user app) give the waiter an order, the waiter takes it to the kitchen (the server), and then brings your food (the data) back to you.',
    example: 'When a weather app on your phone shows you the forecast, it is using an API to silently ask a massive meteorological server for the data.',
    whyItMatters: 'Poorly secured APIs are a major source of modern data breaches, allowing hackers to pull millions of records directly from a company\'s database.',
    relatedTerms: ['vulnerability'], keywords: ['interface', 'application', 'data']
  },
  {
    id: 'sql-injection', term: 'SQL Injection', category: 'Web Security',
    shortDefinition: 'A web attack where a hacker inputs malicious database commands into a standard form field.',
    explanation: 'If a website does not properly clean the text a user types into a form, a hacker can type database commands instead of a normal username. The website\'s database gets confused and executes the hacker\'s commands.',
    example: 'Instead of typing "John" into a search box, a hacker types "DROP TABLE users". If the site is vulnerable, it accidentally deletes the entire user database.',
    whyItMatters: 'It is one of the oldest and most dangerous web vulnerabilities, capable of stealing, modifying, or deleting entire databases.',
    relatedTerms: ['vulnerability', 'exploit'], keywords: ['sqli', 'database', 'hack']
  },
  {
    id: 'xss', term: 'XSS', category: 'Web Security',
    shortDefinition: 'Cross-Site Scripting is an attack where malicious code is injected into a trusted website.',
    explanation: 'Instead of attacking the server (like SQL Injection), XSS attacks the other users of the website. The hacker places a malicious script on a web page, and when innocent users visit that page, their browser runs the script.',
    example: 'A hacker leaves a comment on a blog, but the comment contains a hidden script. When you read the comment, the script silently steals your session cookie and sends it to the hacker.',
    whyItMatters: 'XSS allows attackers to steal accounts, bypass 2FA (by stealing active sessions), and deface websites.',
    relatedTerms: ['session', 'cookie', 'csrf'], keywords: ['script', 'cross-site']
  },
  {
    id: 'csrf', term: 'CSRF', category: 'Web Security',
    shortDefinition: 'An attack that tricks an authenticated user into executing unwanted actions.',
    explanation: 'Cross-Site Request Forgery (CSRF) abuses the fact that your browser automatically sends cookies. If you are logged into your bank, a hacker can trick you into clicking a link on a different site that silently tells your bank to transfer money.',
    example: 'You log into Bank.com. While it is still open, you visit Hacker.com. Hacker.com contains a hidden image tag that actually points to `Bank.com/transfer?amount=1000`. Your browser sends the request along with your bank cookie, and the transfer succeeds.',
    whyItMatters: 'It forces users to execute actions they did not intend to perform. Modern websites use "anti-CSRF tokens" to prevent this.',
    relatedTerms: ['session', 'xss'], keywords: ['forgery', 'cross-site']
  },

  // --- AUTHENTICATION ---
  {
    id: 'authentication', term: 'Authentication', category: 'Authentication',
    shortDefinition: 'The process of verifying who a user is.',
    explanation: 'Authentication is the step where you prove your identity to a system. It answers the question: "Are you really who you claim to be?"',
    example: 'Typing your username and password, or scanning your fingerprint to unlock your phone, are forms of authentication.',
    whyItMatters: 'Without strong authentication, anyone can claim to be you and access your digital life.',
    relatedTerms: ['authorization', 'mfa', 'password-manager'], keywords: ['login', 'identity', 'verify']
  },
  {
    id: 'authorization', term: 'Authorization', category: 'Authentication',
    shortDefinition: 'The process of verifying what an authenticated user is allowed to do.',
    explanation: 'Once the system knows who you are (Authentication), Authorization determines your permissions. It answers the question: "Are you allowed to access this specific file or feature?"',
    example: 'You log into your company\'s network (Authentication). You can read your own emails, but you are denied access to the HR payroll folder (Authorization).',
    whyItMatters: 'Broken authorization is a massive security flaw. A user might be logged in properly, but a glitch allows them to view another user\'s private data.',
    relatedTerms: ['authentication'], keywords: ['permissions', 'access', 'rights']
  },
  {
    id: '2fa', term: '2FA', category: 'Authentication',
    shortDefinition: 'Two-Factor Authentication requires two different types of evidence to log in.',
    explanation: '2FA drastically increases security by requiring something you know (a password) AND something you have (your phone or a security key). If a hacker steals your password, it is useless without the second factor.',
    example: 'You enter your password, but the bank won\'t let you in until you also enter the 6-digit code from the authenticator app on your phone.',
    whyItMatters: 'It is the single most effective defense against stolen passwords and automated account hacking.',
    relatedTerms: ['mfa', 'otp', 'authentication'], keywords: ['two-factor', 'security']
  },
  {
    id: 'mfa', term: 'MFA', category: 'Authentication',
    shortDefinition: 'Multi-Factor Authentication requires two or more pieces of evidence to log in.',
    explanation: 'MFA is the broader umbrella term for 2FA. It means using multiple independent categories of evidence: Something you know (password), something you have (phone/token), or something you are (biometrics).',
    example: 'A high-security government building might require an ID badge (have), a PIN code (know), and a retina scan (are).',
    whyItMatters: 'MFA prevents over 99% of bulk automated hacking attempts.',
    relatedTerms: ['2fa', 'authentication'], keywords: ['multi-factor', 'defense']
  },
  {
    id: 'otp', term: 'OTP', category: 'Authentication',
    shortDefinition: 'A One-Time Password valid for only one login session or transaction.',
    explanation: 'An OTP is a temporary security code that usually expires after 30 to 60 seconds. They are dynamically generated by apps like Google Authenticator or sent via SMS.',
    example: 'When you try to log into a new computer, your email provider texts you a 6-digit OTP to prove it is actually you.',
    whyItMatters: 'Because they expire quickly, even if a hacker sees your OTP, they cannot use it the next day. However, phishing sites try to steal them in real-time.',
    relatedTerms: ['2fa', 'phishing'], keywords: ['code', 'token', 'one-time']
  },
  {
    id: 'password-manager', term: 'Password Manager', category: 'Authentication',
    shortDefinition: 'An encrypted software vault that stores and generates complex passwords.',
    explanation: 'Humans are terrible at remembering unique, 16-character passwords for 100 different websites. A password manager does it for you. You only have to remember one strong "Master Password" to unlock the vault.',
    example: 'Bitwarden, 1Password, and Apple Keychain are password managers. When you visit a site, they automatically fill in the complex password for you.',
    whyItMatters: 'They solve the problem of password reuse, which is one of the leading causes of compromised accounts.',
    relatedTerms: ['authentication', 'encryption'], keywords: ['vault', 'passwords', 'storage']
  },

  // --- MALWARE ---
  {
    id: 'malware', term: 'Malware', category: 'Malware',
    shortDefinition: 'Malicious Software designed to harm, exploit, or spy on a computer system.',
    explanation: 'Malware is the overarching category for any software written with malicious intent. Viruses, worms, trojans, and ransomware are all sub-categories of malware.',
    example: 'An attacker tricks you into downloading a fake PDF reader, but it is actually malware that secretly deletes your files.',
    whyItMatters: 'Malware is the primary weapon used by cybercriminals to attack individual devices.',
    relatedTerms: ['virus', 'trojan', 'ransomware'], keywords: ['malicious', 'software']
  },
  {
    id: 'virus', term: 'Virus', category: 'Malware',
    shortDefinition: 'A type of malware that attaches itself to clean files and spreads by infecting other files.',
    explanation: 'Like a biological virus, a computer virus requires a host (a normal program) and user action (running that program) to spread. It modifies other computer programs, inserting its own code.',
    example: 'You download an infected Word document. When you open it, the virus activates and infects every other Word document on your computer.',
    whyItMatters: 'Though less common today than other malware, viruses can destroy data and corrupt operating systems.',
    relatedTerms: ['malware', 'worm'], keywords: ['infect', 'spread']
  },
  {
    id: 'worm', term: 'Worm', category: 'Malware',
    shortDefinition: 'A standalone type of malware that rapidly self-replicates across a network.',
    explanation: 'Unlike a virus, a worm does not need a host file, and it does not need a user to click anything to spread. It exploits network vulnerabilities to automatically jump from computer to computer.',
    example: 'One infected computer is plugged into an office network. Within 10 minutes, the worm detects and infects 50 other computers on the same network without anyone clicking anything.',
    whyItMatters: 'Worms can take down massive enterprise networks and global internet infrastructure in hours.',
    relatedTerms: ['malware', 'virus', 'vulnerability'], keywords: ['replicate', 'network', 'spread']
  },
  {
    id: 'trojan', term: 'Trojan', category: 'Malware',
    shortDefinition: 'Malware disguised as legitimate, harmless software.',
    explanation: 'Named after the wooden Trojan Horse of Greek mythology, this malware relies on deception. The user voluntarily downloads and installs it, believing it to be a useful tool.',
    example: 'You download a free "game cheat" software. The game cheat works, but hidden inside it is a Trojan that silently steals your banking passwords and sends them to a hacker.',
    whyItMatters: 'Trojans bypass firewalls and antivirus because the user intentionally grants the software permission to run.',
    relatedTerms: ['malware', 'social-engineering'], keywords: ['disguise', 'horse', 'trick']
  },
  {
    id: 'ransomware', term: 'Ransomware', category: 'Malware',
    shortDefinition: 'Malware that encrypts your files and demands payment to unlock them.',
    explanation: 'Ransomware maliciously uses encryption against you. It rapidly encrypts all your photos, documents, and databases, rendering them inaccessible. The attacker demands cryptocurrency for the decryption key.',
    example: 'A hospital staff member clicks a bad link. Ransomware locks the hospital\'s patient database, displaying a screen demanding $500,000 in Bitcoin to restore access.',
    whyItMatters: 'It is arguably the most destructive cyber threat to modern businesses and local governments.',
    relatedTerms: ['malware', 'encryption'], keywords: ['ransom', 'lock', 'extortion']
  },
  {
    id: 'spyware', term: 'Spyware', category: 'Malware',
    shortDefinition: 'Malware designed to secretly observe and record your activities.',
    explanation: 'Spyware hides quietly in the background, collecting your personal information, browsing habits, camera feeds, or passwords, and transmits them to a third party.',
    example: 'A stalker installs "stalkerware" on a victim\'s phone, allowing them to secretly read text messages and track the phone\'s GPS location.',
    whyItMatters: 'Spyware is a massive threat to personal privacy and corporate espionage.',
    relatedTerms: ['malware', 'keylogger', 'privacy'], keywords: ['spy', 'monitor', 'track']
  },
  {
    id: 'keylogger', term: 'Keylogger', category: 'Malware',
    shortDefinition: 'A specific type of spyware that records every keystroke you type.',
    explanation: 'A keylogger silently captures every button pressed on the keyboard. Attackers review the logs to extract passwords, credit card numbers, and private messages.',
    example: 'You log into your bank. You don\'t notice anything wrong, but the keylogger recorded your username and password as you typed them and emailed them to a hacker.',
    whyItMatters: 'Keyloggers make complex passwords useless, which is why 2FA is so critical.',
    relatedTerms: ['spyware', 'malware', '2fa'], keywords: ['keyboard', 'type', 'record']
  },

  // --- PRIVACY ---
  {
    id: 'phishing', term: 'Phishing', category: 'Privacy',
    shortDefinition: 'A fraudulent attempt to trick you into revealing sensitive information.',
    explanation: 'Attackers masquerade as a trusted entity (like a bank, a boss, or Netflix) in an email, text message, or phone call, urging you to click a link and log in or send money.',
    example: 'You receive an urgent text: "Your PayPal account has been locked due to suspicious activity. Click here to verify your identity." The link leads to a fake website that steals your password.',
    whyItMatters: 'Phishing is responsible for the vast majority of all data breaches and cyber incidents globally.',
    relatedTerms: ['social-engineering', '2fa'], keywords: ['email', 'scam', 'trick', 'fake']
  },
  {
    id: 'social-engineering', term: 'Social Engineering', category: 'Privacy',
    shortDefinition: 'Psychological manipulation used to trick people into making security mistakes.',
    explanation: 'Rather than exploiting a software flaw, social engineering exploits human nature—our tendency to trust, our desire to be helpful, or our reaction to fear and urgency.',
    example: 'An attacker calls the front desk pretending to be an angry executive who forgot their password, demanding the receptionist reset it for them immediately.',
    whyItMatters: 'No amount of technology or firewalls can stop an attack if a legitimate user is tricked into handing the hacker the keys.',
    relatedTerms: ['phishing', 'threat'], keywords: ['manipulation', 'human', 'psychology']
  },
  {
    id: 'data-breach', term: 'Data Breach', category: 'Privacy',
    shortDefinition: 'An incident where secure or private information is accessed without authorization.',
    explanation: 'A data breach occurs when cybercriminals successfully infiltrate a corporate or government database and steal bulk information (like emails, passwords, or credit card numbers).',
    example: 'Hackers break into a major hotel chain\'s servers and steal the passport numbers and credit card details of 500 million guests.',
    whyItMatters: 'When your data is involved in a breach, it is often sold on the dark web, leading to identity theft and targeted phishing attacks against you.',
    relatedTerms: ['vulnerability', 'password-manager'], keywords: ['leak', 'hack', 'stolen']
  },
  {
    id: 'metadata', term: 'Metadata', category: 'Privacy',
    shortDefinition: 'Data that provides information about other data.',
    explanation: 'Metadata is "data about data". If a photo is the data, the metadata is the hidden information attached to it: when it was taken, what camera was used, and the exact GPS coordinates where you were standing.',
    example: 'You upload a photo of your new dog to a public forum. You didn\'t share your address, but a stalker downloads the photo and extracts the GPS metadata to find exactly where you live.',
    whyItMatters: 'People frequently leak highly sensitive information accidentally through metadata without realizing it exists.',
    relatedTerms: ['privacy'], keywords: ['exif', 'hidden', 'tracking']
  },
  {
    id: 'privacy', term: 'Privacy', category: 'Privacy',
    shortDefinition: 'The right and ability to control how your personal information is collected and used.',
    explanation: 'In the digital world, privacy isn\'t just about hiding secrets; it is about autonomy. It is the ability to use the internet without being constantly tracked, profiled, and sold by corporations or monitored by governments.',
    example: 'Using a search engine that doesn\'t track your queries, or declining unnecessary cookies on a website, are acts of preserving digital privacy.',
    whyItMatters: 'Without privacy, individuals are susceptible to manipulation, discrimination, and a loss of personal freedom.',
    relatedTerms: ['metadata', 'cookie', 'vpn'], keywords: ['tracking', 'rights', 'data']
  },

  // --- GENERAL ---
  {
    id: 'vulnerability', term: 'Vulnerability', category: 'General',
    shortDefinition: 'A flaw or weakness in a system that can be exploited by a threat.',
    explanation: 'A vulnerability is a mistake in software code, a misconfigured setting, or a flaw in human procedures. It is the "open window" that a burglar uses to get inside.',
    example: 'A popular web browser has a coding error that allows a malicious website to silently download files to your computer. That coding error is the vulnerability.',
    whyItMatters: 'Finding and fixing vulnerabilities before attackers can find them is the core focus of defensive cybersecurity.',
    relatedTerms: ['exploit', 'patch', 'zero-day'], keywords: ['weakness', 'flaw', 'bug']
  },
  {
    id: 'threat', term: 'Threat', category: 'General',
    shortDefinition: 'Any potential danger that could exploit a vulnerability to breach security.',
    explanation: 'A threat is the external actor or force. It can be malicious (a hacker, a ransomware gang) or accidental (a natural disaster, a careless employee).',
    example: 'If a vulnerability is an unlocked car door, the threat is a thief walking through the parking lot trying door handles.',
    whyItMatters: 'Understanding threats helps you prioritize which vulnerabilities need to be fixed first.',
    relatedTerms: ['vulnerability', 'risk'], keywords: ['actor', 'hacker', 'danger']
  },
  {
    id: 'risk', term: 'Risk', category: 'General',
    shortDefinition: 'The potential for loss or damage when a threat exploits a vulnerability.',
    explanation: 'Risk is a calculation: (Probability of a threat acting) x (Impact of the vulnerability being exploited). Cybersecurity is ultimately about managing and reducing risk to an acceptable level.',
    example: 'If your laptop has no password (vulnerability), the risk is low if it stays locked in a safe, but the risk is very high if you leave it on a table in a busy coffee shop (threat).',
    whyItMatters: 'Organizations cannot fix every vulnerability or eliminate every threat, so they focus resources on mitigating the highest risks.',
    relatedTerms: ['threat', 'vulnerability'], keywords: ['impact', 'probability']
  },
  {
    id: 'exploit', term: 'Exploit', category: 'General',
    shortDefinition: 'A piece of software or technique used to take advantage of a vulnerability.',
    explanation: 'An exploit is the specific tool or method an attacker creates to squeeze through the "open window" (the vulnerability) to deliver malware or steal data.',
    example: 'A hacker writes a specialized script (the exploit) that perfectly triggers a memory glitch (the vulnerability) in a web server, allowing them to take control of it.',
    whyItMatters: 'When an exploit is published on the internet, even unskilled attackers ("script kiddies") can use it to attack systems.',
    relatedTerms: ['vulnerability', 'zero-day', 'malware'], keywords: ['weapon', 'attack', 'script']
  },
  {
    id: 'zero-day', term: 'Zero-Day', category: 'General',
    shortDefinition: 'A vulnerability that is unknown to the software creator, meaning there are "zero days" to fix it before it is exploited.',
    explanation: 'A zero-day is the most dangerous type of vulnerability. Attackers discover the flaw and keep it secret, using it to attack systems while the software developers are completely unaware that the flaw even exists.',
    example: 'A hacker group discovers a flaw in iOS and uses it to spy on journalists. Apple has zero days of warning to create a patch because the attack is already happening.',
    whyItMatters: 'Because there is no patch available, even people who update their software perfectly are vulnerable to zero-day attacks.',
    relatedTerms: ['vulnerability', 'exploit', 'patch'], keywords: ['unknown', '0day', 'attack']
  },
  {
    id: 'patch', term: 'Patch', category: 'General',
    shortDefinition: 'A software update designed to fix a vulnerability or bug.',
    explanation: 'When a software creator discovers a vulnerability in their code, they write a fix for it and push it out to users. Applying this fix is called "patching".',
    example: 'Microsoft releases "Patch Tuesday" updates every month to fix newly discovered security holes in the Windows operating system.',
    whyItMatters: 'Failing to install patches promptly is the primary reason individuals and companies get hacked by known exploits.',
    relatedTerms: ['vulnerability', 'zero-day'], keywords: ['update', 'fix', 'repair']
  }
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CyberGlossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedTermIds, setBookmarkedTermIds] = useState([]);
  
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [termOfTheDayId, setTermOfTheDayId] = useState(null);

  // Pick a random term of the day exactly once when the component mounts
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * GLOSSARY_TERMS.length);
    setTermOfTheDayId(GLOSSARY_TERMS[randomIdx].id);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedTermId) {
        setSelectedTermId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTermId]);

  // Derived state for filtering terms
  const filteredTerms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return GLOSSARY_TERMS.filter(term => {
      // Filter by category
      if (selectedCategory === 'Favorites') {
        if (!bookmarkedTermIds.includes(term.id)) return false;
      } else if (selectedCategory !== 'All' && term.category !== selectedCategory) {
        return false;
      }

      // Filter by search query
      if (query) {
        const matchesSearch = 
          term.term.toLowerCase().includes(query) ||
          term.shortDefinition.toLowerCase().includes(query) ||
          term.category.toLowerCase().includes(query) ||
          term.keywords.some(k => k.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, bookmarkedTermIds]);

  const termOfTheDay = GLOSSARY_TERMS.find(t => t.id === termOfTheDayId);
  const activeModalTerm = GLOSSARY_TERMS.find(t => t.id === selectedTermId);

  const toggleBookmark = (e, termId) => {
    e.stopPropagation(); // prevent opening the modal if clicking the bookmark
    setBookmarkedTermIds(prev => {
      if (prev.includes(termId)) {
        return prev.filter(id => id !== termId);
      }
      return [...prev, termId];
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={28} className="text-[#9B8AFB]" />
            <h1 className="text-3xl font-bold text-[#F2F0F5]">Cyber Glossary</h1>
          </div>
          <p className="text-[#9693A1] text-base max-w-xl">
            Cybersecurity terms explained without the confusing jargon.
          </p>
        </div>
        
        {/* Subtle Vexel presence */}
        <div className="flex items-center gap-4 bg-[#0B0B0F] p-4 rounded-xl border border-[#292934]">
          <MascotImage 
            src="/assets/mascots/cyberguard-mascot-learning.png" 
            alt="Vexel Glossary Mascot" 
            className="w-16 h-16 shrink-0" 
          />
          <div>
            <p className="text-sm font-semibold text-[#9B8AFB] mb-0.5">Confused by a term?</p>
            <p className="text-xs text-[#9693A1] max-w-[180px]">Ask Vexel... well, technically, search for it down below. 😭</p>
          </div>
        </div>
      </div>

      {/* TERM OF THE DAY */}
      {termOfTheDay && (
        <div className="bg-gradient-to-r from-[#9B8AFB]/10 to-transparent border border-[#9B8AFB]/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-xs font-semibold text-[#9B8AFB] uppercase tracking-wider flex items-center gap-2 mb-2">
                <Lightbulb size={14} /> Term of the Day
              </span>
              <h2 className="text-2xl font-bold text-[#F2F0F5] mb-1">{termOfTheDay.term}</h2>
              <p className="text-[#C4C0CC] text-sm max-w-2xl">{termOfTheDay.shortDefinition}</p>
            </div>
            <button 
              onClick={() => setSelectedTermId(termOfTheDay.id)}
              className="bg-[#1A1A22] text-[#9B8AFB] hover:bg-[#292934] border border-[#292934] px-5 py-2.5 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 shrink-0 w-fit"
            >
              Explore term <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="space-y-4 pt-2">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-[#9693A1]" />
          </div>
          <input
            type="text"
            aria-label="Search cybersecurity terms"
            placeholder="Search cybersecurity terms (e.g., DNS, phishing, encryption...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14141A] border border-[#292934] rounded-xl pl-12 pr-4 py-4 text-[#F2F0F5] focus:outline-none focus:border-[#9B8AFB] transition-colors placeholder:text-[#9693A1]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === category 
                  ? 'bg-[#9B8AFB] text-[#0B0B0F] border-[#9B8AFB]' 
                  : 'bg-[#14141A] text-[#9693A1] border-[#292934] hover:border-[#3A3A4A] hover:text-[#C4C0CC]'
              } ${category === 'Favorites' && selectedCategory !== 'Favorites' ? 'border-[#E6B566]/30 text-[#E6B566]/80' : ''}`}
            >
              {category === 'Favorites' && <Bookmark size={14} className="inline mr-1.5 -mt-0.5" />}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* GLOSSARY LIST (Updated to compact vertical layout) */}
      {filteredTerms.length === 0 ? (
        <div className="py-12 text-center bg-[#14141A] border border-[#292934] rounded-xl">
          <Search size={32} className="mx-auto text-[#292934] mb-3" />
          <h3 className="text-[#F2F0F5] font-medium mb-1">No terms found</h3>
          <p className="text-[#9693A1] text-sm">
            Try searching for something like DNS, phishing, encryption, or firewall.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTerms.map(term => {
            const isBookmarked = bookmarkedTermIds.includes(term.id);
            return (
              <div 
                key={term.id} 
                className="relative flex items-center group cursor-pointer w-full"
                onClick={() => setSelectedTermId(term.id)}
              >
                {/* Overlapping Index Block[cite: 3] */}
                <div className="absolute left-0 z-10 w-12 h-12 rounded-xl bg-[#1A1A22] border border-[#292934] flex items-center justify-center text-[#9B8AFB] font-bold text-xl shadow-lg group-hover:border-[#9B8AFB]/50 group-hover:text-[#AA9BFF] transition-colors">
                  {term.term.charAt(0).toUpperCase()}
                </div>

                {/* Main Content Bar[cite: 3] */}
                <div className="flex-1 ml-6 pl-10 pr-4 py-4 bg-[#14141A] border border-[#292934] rounded-xl flex items-center justify-between group-hover:bg-[#1A1A22] transition-colors min-w-0">
                  
                  {/* Text Content */}
                  <div className="flex flex-col min-w-0 pr-4 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-[#F2F0F5] truncate">{term.term}</h3>
                      <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-[#9B8AFB] bg-[#9B8AFB]/10 px-2 py-0.5 rounded shrink-0">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-sm text-[#9693A1] truncate">
                      {term.shortDefinition}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button 
                      onClick={(e) => toggleBookmark(e, term.id)}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        isBookmarked 
                          ? 'text-[#E6B566] bg-[#E6B566]/10' 
                          : 'text-[#292934] hover:text-[#9693A1] hover:bg-[#292934]'
                      }`}
                      aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                    <ArrowRight size={18} className="hidden sm:block text-[#292934] group-hover:text-[#9B8AFB] transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL / TERM DETAILS */}
      {activeModalTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#080C12]/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedTermId(null)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#14141A] border border-[#292934] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-[#292934]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9B8AFB] bg-[#9B8AFB]/10 px-2 py-1 rounded mb-3 inline-block">
                  {activeModalTerm.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F0F5]">{activeModalTerm.term}</h2>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button 
                  onClick={(e) => toggleBookmark(e, activeModalTerm.id)}
                  className={`p-2 rounded-lg transition-colors border ${
                    bookmarkedTermIds.includes(activeModalTerm.id) 
                      ? 'border-[#E6B566]/30 text-[#E6B566] bg-[#E6B566]/10' 
                      : 'border-[#292934] text-[#9693A1] hover:bg-[#1A1A22]'
                  }`}
                  aria-label="Toggle favorite"
                >
                  {bookmarkedTermIds.includes(activeModalTerm.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
                <button 
                  onClick={() => setSelectedTermId(null)}
                  className="p-2 rounded-lg border border-[#292934] text-[#9693A1] hover:text-[#F2F0F5] hover:bg-[#1A1A22] transition-colors"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Definition */}
              <div>
                <p className="text-[#F2F0F5] text-lg font-medium leading-relaxed border-l-4 border-[#9B8AFB] pl-4 py-1">
                  {activeModalTerm.shortDefinition}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#9B8AFB] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <BookOpen size={16} /> How it works
                  </h3>
                  <p className="text-[#C4C0CC] text-sm leading-relaxed bg-[#0B0B0F] p-4 rounded-lg border border-[#292934]">
                    {activeModalTerm.explanation}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#6FCF97] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Info size={16} /> Example
                  </h3>
                  <p className="text-[#C4C0CC] text-sm leading-relaxed bg-[#6FCF97]/5 p-4 rounded-lg border border-[#6FCF97]/20">
                    {activeModalTerm.example}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#E6B566] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Shield size={16} /> Why it matters
                  </h3>
                  <p className="text-[#C4C0CC] text-sm leading-relaxed bg-[#E6B566]/5 p-4 rounded-lg border border-[#E6B566]/20">
                    {activeModalTerm.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Related Terms */}
              {activeModalTerm.relatedTerms && activeModalTerm.relatedTerms.length > 0 && (
                <div className="pt-6 border-t border-[#292934]">
                  <h3 className="text-xs font-bold text-[#9693A1] uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Tag size={14} /> Related Terms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeModalTerm.relatedTerms.map(relatedId => {
                      const relatedTermData = GLOSSARY_TERMS.find(t => t.id === relatedId);
                      if (!relatedTermData) return null;
                      return (
                        <button
                          key={relatedId}
                          onClick={() => setSelectedTermId(relatedId)}
                          className="px-3 py-1.5 bg-[#1A1A22] border border-[#292934] hover:border-[#9B8AFB]/50 hover:bg-[#9B8AFB]/10 rounded-md text-sm text-[#C4C0CC] transition-colors"
                        >
                          {relatedTermData.term}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}