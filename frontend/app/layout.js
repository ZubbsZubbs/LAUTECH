import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "LAUTECH Teaching Hospital",
  description: "Leading Teaching Hospital providing comprehensive healthcare services, medical education, and research excellence",
  icons: {
    // icon: "/r_logo.jpg", // Path to your custom favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="relative overflow-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
