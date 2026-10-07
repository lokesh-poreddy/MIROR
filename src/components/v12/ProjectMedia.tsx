import { getApprovedProjectMedia } from "@/data/project-media";

export function ProjectMedia({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const media = getApprovedProjectMedia(slug);
  if (media.length === 0) return <div className={compact ? "v14-project-media v14-project-media--compact" : "v14-project-media"}><div className="v14-project-media__grid" aria-hidden="true" /><div className="v14-project-media__content"><span className="v12-kicker v12-kicker-light">PROJECT MEDIA / PENDING</span><strong>Approved construction photography or video will replace this frame.</strong><small>No stock image is shown while project media approval is pending.</small></div></div>;
  return <div className={compact ? "v14-project-media v14-project-media--compact" : "v14-project-media"}>{media.map((asset, index) => asset.type === "image" ? <figure key={asset.src} className="v14-project-media__asset"><img src={asset.src} alt={asset.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />{asset.credit ? <figcaption>{asset.credit}</figcaption> : null}</figure> : <figure key={asset.src} className="v14-project-media__asset"><video controls preload="metadata" poster={asset.poster}><source src={asset.src} /></video><figcaption>{asset.title}</figcaption></figure>)}</div>;
}
