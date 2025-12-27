import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "OpenCatalog",
  description: "Discover & Explore Open Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-black text-black dark:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
