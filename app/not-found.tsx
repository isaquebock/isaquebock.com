import Link from "next/link";
import { HLine, Row } from "@/components/frame";

export default function NotFound() {
  return (
    <>
      <Row className="p-3">
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">404</h1>
          <p className="text-sm text-mutedForeground">Page not found.</p>
          <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Back to home
          </Link>
        </div>
      </Row>
      <HLine />
    </>
  );
}
