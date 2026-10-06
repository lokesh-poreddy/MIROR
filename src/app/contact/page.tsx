"use client";

import { FormEvent, useState } from "react";
import { company } from "@/data/company";

export default function ContactPage(){
  const [state,setState]=useState<string>("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setState("Sending…");
    const form=new FormData(e.currentTarget);
    const response=await fetch("/api/enquiries",{method:"POST",body:form});
    const data=await response.json();
    setState(data.ok ? "Thanks — your enquiry was received by the demo API." : data.error ?? "Unable to submit.");
    if(data.ok) e.currentTarget.reset();
  }
  return <main className="page-shell"><section className="page-hero"><div className="eyebrow">Contact</div><h1>Bring the next project into focus.</h1><p>Use this form for business enquiries, project discussions and approved partnership conversations.</p></section><section className="section"><div className="section-grid"><div><div className="section-kicker">Registered office</div><p className="section-copy">{company.registeredOffice}</p></div><form className="form" onSubmit={submit}><div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div><div className="field"><label htmlFor="message">Project / enquiry</label><textarea id="message" name="message" required /></div><button className="button button-solid" type="submit">Send enquiry ↗</button><p className="section-copy" aria-live="polite">{state}</p></form></div></section></main>;
}
