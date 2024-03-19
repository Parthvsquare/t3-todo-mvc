import "@/styles/globals.css";
import "@/styles/colors.css";
import "react-toastify/dist/ReactToastify.min.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "./_components/ThemeProvider";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Plastic for change",
  description: "Plastic for change assignment",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <ToastContainer
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            position="top-right"
          />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
