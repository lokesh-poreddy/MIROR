import Link from "next/link";
const locations=[
 {code:"AP-01",region:"Andhra Pradesh",role:"Corporate base",detail:"Ongole / Prakasam region"},
 {code:"TS-01",region:"Telangana",role:"Documented project footprint",detail:"Hyderabad region"},
];
export function LocationsLedger(){return <section className="v12-section v12-section--compact" aria-labelledby="v12-location-title"><div className="v12-container"><div className="v12-location">
 <div><span className="v12-kicker">Where we work</span><h2 id="v12-location-title" className="v12-location__title">Andhra Pradesh ↔ Telangana</h2><p className="v12-location__copy">A deliberately modest geographic story: the corporate base in Ongole and the documented project footprint extending into Telangana.</p><Link className="v12-button" href="/locations">Open location profile ↗</Link></div>
 <div className="v12-location__rail">{locations.map((item)=><div className="v12-location__stop" key={item.code}><span className="v12-location__dot"/><small>{item.code}</small><strong>{item.region}</strong><span>{item.role} · {item.detail}</span></div>)}</div>
 </div></div></section>}
