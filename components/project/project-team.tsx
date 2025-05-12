import Image from "next/image"
import Link from "next/link"
import { ProjectTeamMember, ProjectLinkWebsite } from "@/lib/types"
import { Icons } from "../icons"
import { useTranslation } from "@/app/i18n/client"
import { LocaleTypes } from "@/app/i18n/settings"
import { ProjectLinkIconMap } from "../mappings/project-links"

interface ProjectTeamMembersProps {
  team: ProjectTeamMember[]
  lang: LocaleTypes
}

export const ProjectTeamMembers = ({ team, lang }: ProjectTeamMembersProps) => {
  const { t } = useTranslation(lang, "common")

  if (!team || team.length === 0) {
    return null
  }

  return (
    <div className="w-full" id="team" data-section-id="team">
      <h2 className="text-[22px] font-bold text-tuatara-700 mb-6">
        {t("projectTeam") || "Project Team"}
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div
            key={`${member.name}-${index}`}
            className="flex flex-col gap-2 p-4 border border-black/10 rounded-md bg-white"
          >
            <div className="flex items-center gap-4">
              {member.image ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-200 flex-shrink-0"></div>
              )}
              <div className="flex flex-col">
                <h3 className="font-sans text-base font-medium text-tuatara-900">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="font-sans text-sm text-tuatara-600">
                    {member.role}
                  </p>
                )}
              </div>
            </div>

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="font-sans text-sm text-tuatara-600 hover:text-orange transition-colors mt-1 flex items-center gap-1.5"
              >
                <Icons.email className="h-4 w-4" />
                <span>{member.email}</span>
              </a>
            )}

            {member.links && Object.keys(member.links).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(member.links).map(([key, value]) => (
                  <Link
                    key={key}
                    href={value ?? ""}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-1.5 text-sm text-tuatara-600 hover:text-orange transition-colors"
                  >
                    {ProjectLinkIconMap?.[key as ProjectLinkWebsite]}
                    <span className="capitalize">{key}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
