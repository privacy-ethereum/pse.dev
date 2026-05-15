import { ProjectContent } from "../sections/ProjectContent"
import { getProjects, Project } from "@/lib/content"
import { ProjectInterface } from "@/lib/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface ProjectProps {
  project: ProjectInterface
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const projects = await getProjects()
  const project = projects.find(
    (p: Project) =>
      String(p.id?.toLowerCase()) === params.id.toString().toLowerCase()
  )

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found",
    }
  }

  const content = project?.content
  const imageUrl =
    (project?.image ?? "")?.length > 0 ? project.image : "/share-image.png"

  return {
    title: project?.name,
    description: content?.tldr,
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  const projects = await getProjects()

  return projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectDetailPage(props: PageProps) {
  const params = await props.params;
  const projects = await getProjects()
  const project = projects.find(
    (p: Project) =>
      String(p.id?.toLowerCase()) === params.id.toString().toLowerCase()
  )

  if (!project) {
    notFound()
  }

  return <ProjectContent project={project as unknown as ProjectInterface} />
}
