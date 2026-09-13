import {
  requirePlatformSuperAdmin,
} from "@/lib/auth/platformAdmin";

import ContactMessagesClient from
  "@/components/contact-messages/ContactMessagesClient";

export default async function ContactMessagesPage() {
  await requirePlatformSuperAdmin();

  return <ContactMessagesClient />;
}