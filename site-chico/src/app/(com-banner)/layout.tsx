import { LogoBanner } from "@/components/Common";

export default function ComBannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LogoBanner />
      {children}
    </>
  );
}
