import { OverviewHeader } from "./_components/overview-header";
import { ProjectsSection } from "./_components/projects-section";
import { StatisticsSection } from "./_components/statistics-section";
import { UsageOverview } from "./_components/usage-overview";

type WorkspacePageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceSlug } = await params;

  // TODO: Fetch workspace data from API
  const workspaceName = workspaceSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col gap-5">
      <OverviewHeader workspaceName={workspaceName} />
      <StatisticsSection />
      <UsageOverview />
      <ProjectsSection />
    </div>
  );
}
