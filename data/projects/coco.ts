import {
  ProjectCategory,
  ProjectContent,
  ProjectInterface,
  ProjectStatus,
} from '@/lib/types'

const content: ProjectContent = {
  en: {
    tldr: "Integrating Nova into the EVM involves wrapping Liam Eagen's theoretical ECIP argument in Halo 2",
    description:
      "With Coco, groups can collaborate to curate feeds of any topic they're interested in. As you scroll through your Coco feed, rather than upvoting or downvoting posts, you'll spend WETH to predict what other group members and the group's moderators will want to see. When you're right, you'll get back your original WETH and more — but if you're wrong, you'll lose what you put in. Through this process, you help Coco filter value from noise to make sure group feeds only consist of posts that the group cares about.With Coco, groups can collaborate to curate feeds of any topic they're interested in. As you scroll through your Coco feed, rather than upvoting or downvoting posts, you'll spend WETH to predict what other group members and the group's moderators will want to see. When you're right, you'll get back your original WETH and more — but if you're wrong, you'll lose what you put in. Through this process, you help Coco filter value from noise to make sure group feeds only consist of posts that the group cares about.",
  },
}

export const Coco: ProjectInterface = {
  id: 'coco',
  image: 'coco.svg',
  category: ProjectCategory.APPLICATION,
  section: 'archived',
  name: 'COCO',
  projectStatus: ProjectStatus.INACTIVE,
  content,
  tags: {
    keywords: ['prediction market', 'scaling'],
  },
  extraLinks: {
    learn: [
      {
        label: 'Meet COCO!',
        url: 'https://mirror.xyz/privacy-scaling-explorations.eth/tEf7iYa8l7ECZwN2T57yyiws7h9Uchip30CQvx-JBBQ',
      },
    ],
    buildWith: [
      {
        label: 'Smart contracts',
        url: 'https://github.com/Janmajayamall/coco-contracts',
      },
      {
        label: 'Frontend',
        url: 'https://github.com/Janmajayamall/coco-frontend',
      },
      {
        label: 'Frontend (General)',
        url: 'https://github.com/Janmajayamall/coco-frontend-general',
      },
    ],
  },
}
