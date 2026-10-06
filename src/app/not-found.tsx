import Link from "next/link";
export default function NotFound(){ return <main className="page-shell"><section className="page-hero"><div className="eyebrow">404</div><h1>That page is not on the plan.</h1><p>Return to the project index and continue exploring.</p><Link href="/" className="button button-solid">Return home ↗</Link></section></main>; }
