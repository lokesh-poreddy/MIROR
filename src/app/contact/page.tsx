"use client";
import { FormEvent, useState } from "react";
import { company } from "@/data/company";
const types=["General enquiry","Project enquiry","Partnership enquiry","Career enquiry","Document request"] as const;
export default function ContactPage(){
  const [busy, setBusy] = useState(false);
  
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy) return;
    setBusy(true);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const companyName = formData.get("company") || "";
    const phone = formData.get("phone") || "";
    const enquiryType = formData.get("enquiryType") || "General enquiry";
    const message = formData.get("message") || "";
    
    const body = `Name: ${name}\nEmail: ${email}\nCompany: ${companyName}\nPhone: ${phone}\nEnquiry Type: ${enquiryType}\n\nMessage:\n${message}`;
    const subject = `[MIROR] ${enquiryType} from ${name}`;
    
    window.location.href = `mailto:p.lokeshreddy2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setBusy(false);
  }

  return (
    <main className="v12-shell v12-page">
      <section className="v12-page-hero">
        <div className="v12-container v12-page-hero__grid">
          <div><span className="v12-kicker">Contact / 01</span></div>
          <div>
            <h1 className="v12-display">Have a project worth building?</h1>
            <p>Share the context first. All enquiries are sent directly to our team via email for immediate review.</p>
          </div>
        </div>
      </section>
      <section className="v12-section">
        <div className="v12-container v12-contact-grid">
          <div>
            <span className="v12-kicker">Registered office</span>
            <p className="v12-body" style={{maxWidth: 420}}>{company.registeredOffice}</p>
            <a className="v12-button" href="mailto:p.lokeshreddy2005@gmail.com">Email directly ↗</a>
          </div>
          <form className="v12-form" onSubmit={submit} noValidate>
            <input className="v12-hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
            <div className="v12-form__row">
              <label>Name<input name="name" required maxLength={120} autoComplete="name"/></label>
              <label>Email<input name="email" type="email" required maxLength={180} autoComplete="email"/></label>
            </div>
            <div className="v12-form__row">
              <label>Company<input name="company" maxLength={160} autoComplete="organization"/></label>
              <label>Phone<input name="phone" inputMode="tel" maxLength={22} autoComplete="tel"/></label>
            </div>
            <label>Enquiry type
              <select name="enquiryType" defaultValue={types[0]}>
                {types.map(type => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label>Project / enquiry
              <textarea name="message" required minLength={10} maxLength={5000}/>
            </label>
            <button type="submit" className="v12-button v12-button--solid" disabled={busy}>
              {busy ? "Opening Email Client…" : "Send enquiry via Email ↗"}
            </button>
            <p aria-live="polite" className="v12-body" style={{minHeight:20, fontSize:12, marginTop: "10px"}}>
              Clicking send will open your default email client.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
