type Input = {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string;
  enquiryType: string;
  message: string;
};

function esc(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function isEmailNotificationConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.MIROR_NOTIFICATION_EMAIL);
}

export async function sendEnquiryNotification(input: Input) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.MIROR_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !from || !to) return { status: "not_configured" as const, id: null };

  const html = [
    `<h2>New Miror website enquiry</h2>`,
    `<p><strong>Enquiry ID:</strong> ${esc(input.id)}</p>`,
    `<p><strong>Type:</strong> ${esc(input.enquiryType)}</p>`,
    `<p><strong>Name:</strong> ${esc(input.name)}</p>`,
    `<p><strong>Email:</strong> ${esc(input.email)}</p>`,
    `<p><strong>Company:</strong> ${esc(input.companyName || "Not provided")}</p>`,
    `<p><strong>Phone:</strong> ${esc(input.phone || "Not provided")}</p>`,
    `<p><strong>Message:</strong></p><p>${esc(input.message).replaceAll("\n", "<br />")}</p>`,
  ].join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: [input.email], subject: `[MIROR] ${input.enquiryType} — ${input.name}`, html }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Resend rejected notification: ${(await response.text()).slice(0, 300)}`);
  const data = (await response.json()) as { id?: string };
  return { status: "sent" as const, id: data.id ?? null };
}
