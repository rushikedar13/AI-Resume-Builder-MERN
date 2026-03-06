import React from "react";
import logo from "../../assets/logo.svg";
import { Linkedin, Twitter, Youtube, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f5f5dc] border-t-[3px] border-stone-900 pt-20 pb-10 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Logo & Vision */}
          <div className="space-y-6">
            <a
              href="#"
              className="inline-block p-2 bg-white border-2 border-stone-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
            >
              <img src={logo} alt="logo" className="h-8 w-auto" />
            </a>
            <p className="text-stone-600 font-bold text-sm leading-relaxed max-w-xs">
              Engineering the future of professional narratives with advanced AI
              logic and sophisticated design.
            </p>
          </div>

          {/* Navigation Groups */}
          <FooterGroup title="Product">
            <FooterLink href="/">Technical Suite</FooterLink>
            <FooterLink href="/">Support Core</FooterLink>
            <FooterLink href="/">Architecture</FooterLink>
            <FooterLink href="/">Partnerships</FooterLink>
          </FooterGroup>

          <FooterGroup title="Resources">
            <FooterLink href="/">Knowledge Base</FooterLink>
            <FooterLink href="/">Internal Blog</FooterLink>
            <FooterLink href="/">
              Career Portal
              <span className="ml-2 text-[8px] font-black bg-emerald-700 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">
                Hiring
              </span>
            </FooterLink>
            <FooterLink href="/">About Studio</FooterLink>
          </FooterGroup>

          {/* Connect & Legal */}
          <div className="flex flex-col gap-8">
            <FooterGroup title="Connect">
              <div className="flex gap-4">
                <SocialIcon
                  href="https://linkedin.com"
                  icon={<Linkedin size={18} />}
                />
                <SocialIcon href="https://x.com" icon={<Twitter size={18} />} />
                <SocialIcon
                  href="https://youtube.com"
                  icon={<Youtube size={18} />}
                />
              </div>
            </FooterGroup>

            <FooterGroup title="Legal">
              <FooterLink href="/">Privacy Protocol</FooterLink>
              <FooterLink href="/">Service Terms</FooterLink>
            </FooterGroup>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-stone-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
            © 2026 AI Resume Builder // System Version 1.5
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Footer Sub-Components ---

const FooterGroup = ({ title, children }) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-900 border-b border-stone-900/10 pb-2">
      {title}
    </h3>
    <ul className="flex flex-col gap-2">{children}</ul>
  </div>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-stone-500 font-bold text-[13px] hover:text-emerald-700 hover:translate-x-1 transition-all flex items-center gap-1 group"
    >
      {children}
      <ExternalLink
        size={10}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </a>
  </li>
);

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-2.5 bg-white border-2 border-stone-900 rounded-lg text-stone-900 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
  >
    {icon}
  </a>
);

export default Footer;
