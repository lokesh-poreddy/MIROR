"use client";

import { FormEvent, useState } from "react";
import { company } from "@/data/company";

const enquiryTypes = [
  "General enquiry",
  "Project enquiry",
  "Partnership enquiry",
  "Career enquiry",
  "Document request",
] as const;

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus("Submitting enquiry…");

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/enquiries", {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setStatus(data.error ?? "The enquiry could not be submitted.");
        return;
      }
      event.currentTarget.reset();
      setStatus(data.message ?? "Your enquiry has been accepted for processing.");
    } catch {
      setStatus("The enquiry could not be submitted right now. Please email p.lokeshreddy2005@gmail.com directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">CONTACT / 01</div>
        <div>
          <span className="miror-upgrade-kicker">Start a conversation</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            Have a project worth building?
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>
            Share the context first. The enquiry flow can grow into a database-backed project qualification workflow once the production data service is connected.
          </p>
        </div>
      </section>

      <section className="miror-upgrade-statement" style={{ paddingTop: "3vh" }}>
        <div>
          <span className="miror-upgrade-kicker">Registered office</span>
          <p style={{ maxWidth: 360, color: "#6f6b64", lineHeight: 1.7 }}>{company.registeredOffice}</p>
          <a className="miror-upgrade-button" href="mailto:p.lokeshreddy2005@gmail.com">Email directly ↗</a>
        </div>
        <form className="miror-production-form" onSubmit={submit} noValidate>
          <input className="miror-production-form__honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="miror-production-form__row">
            <label>Name<input name="name" required maxLength={120} autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required maxLength={180} autoComplete="email" /></label>
          </div>
          <div className="miror-production-form__row">
            <label>Company<input name="company" maxLength={160} autoComplete="organization" /></label>
            <label>Phone<input name="phone" inputMode="tel" maxLength={22} autoComplete="tel" /></label>
          </div>
          <label>Enquiry type<select name="enquiryType" defaultValue={enquiryTypes[0]}>{enquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label>Project / enquiry<textarea name="message" required minLength={10} maxLength={5000} /></label>
          <button className="miror-upgrade-button miror-upgrade-button--dark" type="submit" disabled={busy}>{busy ? "Submitting…" : "Send enquiry ↗"}</button>
          <p className="miror-production-form__status" aria-live="polite">{status}</p>
        </form>
      </section>
    </main>
  );
}
