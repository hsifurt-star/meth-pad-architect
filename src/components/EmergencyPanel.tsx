import { ArrowUpRight } from 'lucide-react';

const CDC_STIMULANT_GUIDE = 'https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf';
const SAMHSA = 'https://www.samhsa.gov/find-help/national-helpline';

export function EmergencyPanel() {
  return (
    <section className="emergency-panel" id="emergency" aria-labelledby="emergency-title">
      <div className="emergency-main">
        <div className="emergency-marker" aria-hidden="true">!</div>
        <div className="emergency-copy">
          <h2 id="emergency-title">Medical emergency?</h2>
          <p>Call your local emergency number for unresponsiveness, slow or irregular breathing, seizure, overheating, chest pain, stroke signs, or severe confusion.</p>
        </div>
      </div>
      <div className="emergency-next">
        <p>If opioid exposure may be involved, give naloxone if available, stay with the person, and follow the dispatcher’s instructions.</p>
        <a href={CDC_STIMULANT_GUIDE} target="_blank" rel="noreferrer">CDC emergency guidance <ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
      <details className="support-details" id="support">
        <summary>U.S. treatment referral</summary>
        <div>
          <a href="tel:18006624357">1-800-662-HELP (4357)</a>
          <span>SAMHSA National Helpline · free, confidential, 24/7 · not an emergency line.</span>
          <a href={SAMHSA} target="_blank" rel="noreferrer">Service details <ArrowUpRight size={12} aria-hidden="true" /></a>
        </div>
      </details>
    </section>
  );
}
