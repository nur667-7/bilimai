import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { buildRoadmapPreview, generateRoadmap, roadmapInputSchema } from '../../../lib/claude';
import { lessons, type TopicId } from '../../../lib/lessons';
import { pilotAPI } from '../../../lib/pilot-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return pilotAPI(
    request,
    env,
    getChatGPTUser,
    roadmapInputSchema,
    (input, config) => {
      const reference = lessons[input.language]
        .map((l) => l.id + ': ' + l.title + ' — ' + l.rule)
        .join(' | ');
      return generateRoadmap(input, reference, config);
    },
    (input) => {
      const titles = Object.fromEntries(
        lessons[input.language].map((l) => [l.id, l.title])
      ) as Record<TopicId, string>;
      return buildRoadmapPreview(input, titles);
    }
  );
}
