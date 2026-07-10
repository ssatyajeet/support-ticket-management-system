import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-10 py-12 shadow-sm backdrop-blur-sm">
        <p className="text-6xl font-bold tracking-tight text-slate-200">404</p>
        <PageHeader
          title="Page not found"
          description="The page you requested does not exist or may have been moved."
        />
        <div className="mt-8">
          <Button to="/">Back to tickets</Button>
        </div>
      </div>
    </section>
  );
}
