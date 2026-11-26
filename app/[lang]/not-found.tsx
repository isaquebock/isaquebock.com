import Link from "next/link";
import { HLine, Row } from "@/components/frame";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

export default async function NotFound() {
  const { locale, dict } = await getI18n();
  return (
    <>
      <Row className="p-3">
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">404</h1>
          <p className="text-sm text-mutedForeground">{dict.notFound.title}</p>
          <Link href={localePath(locale)} className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            {dict.notFound.back}
          </Link>
        </div>
      </Row>
      <HLine />
    </>
  );
}
