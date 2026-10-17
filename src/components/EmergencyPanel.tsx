import { ArrowUpRight, HeartPulse, PhoneCall, ShieldAlert } from 'lucide-react';

const CDC_STIMULANT_GUIDE = 'https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf';
const SAMHSA = 'https://www.samhsa.gov/find-help/national-helpline';

export function EmergencyPanel() {
  return (
    <section className="emergency-panel" id="emergency" aria-labelledby="emergency-title">
      <div className="emergency-main">
        <div className="emergency-icon"><HeartPulse size={21} aria-hidden="true" /></div>
        <div className="emergency-copy">
          <div className="section-kicker emergency-kicker">Immediate help</div>
          <h2 id="emergency-title">If someone may be in medical danger</h2>
          <p>Call your local emergency number now if someone is unresponsive, breathing slowly or irregularly, having a seizure, overheating, experiencing chest pain, or showing signs of stroke or severe confusion.</p>
          <p>If opioid exposure could be involved, give naloxone if available, stay with the person, and follow the emergency dispatcher’s instructions.</p>
          <a className="emergency-source" href={CDC_STIMULANT_GUIDE} target="_blank" rel="noreferrer">CDC: stimulant emergency guidance <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
      <aside className="support-card" id="support">
        <div className="support-icon"><PhoneCall size={18} aria-hidden="true" /></div>
        <div>
          <div className="section-kicker">Treatment & support · United States</div>
          <h3>SAMHSA National Helpline</h3>
          <p>Free, confidential treatment-referral information, 24/7 in English and Spanish. Not an emergency line.</p>
          <a className="helpline-link" href="tel:18006624357">1-800-662-HELP <span>(4357)</span></a>
          <a className="source-link support-source" href={SAMHSA} target="_blank" rel="noreferrer">Service details <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </aside>
      <div className="emergency-footnote"><ShieldAlert size={15} aria-hidden="true" /> <span>If you are outside the U.S., contact local health or crisis services. This page is information—not a diagnosis or treatment plan.</span></div>
    </section>
  );
}
