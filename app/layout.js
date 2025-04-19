// import  Navbar  from "@/components/Navbar";
import "./globals.css";
// import Footer from "@/components/Footer";

export const metadata = {
  title: "Restech",
  description: "Sotware Company",
  icons: {
    icon: "/r_logo.jpg", // Path to your custom favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      
      <main className="relative overflow-hidden">
        {children}
      </main>
    
      </body>
    </html>
  );
}
