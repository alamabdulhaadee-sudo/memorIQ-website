import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {/*
        pt-[60px] on mobile / pt-[68px] on sm+ matches the nav height
        so page content is never hidden behind the sticky header.
        Hero sections that want to bleed behind the nav should apply
        negative margin-top instead of relying on this padding.
      */}
      <div className="flex flex-col flex-1 pt-[60px] sm:pt-[68px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
