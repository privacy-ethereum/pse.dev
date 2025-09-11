"use client"

import { Slider } from "../slider"
import { LABELS } from "@/app/labels"
import { useProjects } from "@/app/providers/ProjectsProvider"
import { ProjectInterface } from "@/lib/types"
import Link from "next/link"

export const ProjectGraduated = () => {
  const { graduatedProjects } = useProjects()

  return (
    <div className="flex flex-col gap-10 justify-center dark:bg-anakiwa-975 py-16 lg:py-20 overflow-hidden bg-cover-gradient dark:bg-none">
      <span className="dark:text-tuatara-100 text-tuatara-950 text-xl lg:text-3xl lg:leading-[45px] font-normal font-sans text-center lg:px-0 px-4">
        {LABELS.PROJECTS_PAGE.GRADUATED_PROJECTS}
      </span>
      <div className="lg:px-4 px-4">
        <Slider slidesToShow={4.2} gap="24px">
          {graduatedProjects.map((project: ProjectInterface) => {
            const website = project.links?.website
              ?.split("//")[1]
              ?.replace("/", "")
              .replace("www.", "")

            return (
              <Link
                href={project?.links?.website ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-4 w-full lg:max-w-[400px] p-8 rounded-[10px] bg-white border border-anakiwa-300 dark:border-anakiwa-400  dark:bg-anakiwa-975 hover:bg-anakiwa-100 dark:hover:bg-anakiwa-950 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col gap-4 h-[140px]">
                  <span className="font-sans text-2xl font-bold text-tuatara-950 dark:text-anakiwa-400">
                    {project.name}
                  </span>
                  <span className="font-sans text-base font-normal text-tuatara-500 dark:text-tuatara-100 line-clamp-2 lg:line-clamp-3">
                    {project.tldr}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between mt-auto w-full">
                  <span className="font-sans text-base font-normal text-tuatara-500 dark:text-tuatara-200 underline">
                    {website}
                  </span>
                  <div className="text-xs dark:text-black dark:bg-anakiwa-300 text-black bg-anakiwa-300 rounded-[3px] px-[6px] py-[2px]">
                    Graduated
                  </div>
                </div>
              </Link>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}
