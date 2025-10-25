import "./globals.css";
import { headers } from "next/headers";
import ClientLayout from "./ClientLayout";

export const dynamic = "force-static";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
