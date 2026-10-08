import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { buildExplainPreview, explain, inputSchema } from '../../../lib/claude';
import { lessons } from '../../../lib/lessons';
import { pilotAPI } from '../../../lib/pilot-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return pilotAPI(
    request,
    env,
    getChatGPTUser,
    inputSchema,
    (input, config) => {
      const lesson = lessons[input.language].find((l) => l.id === input.topic)!;
      const reference = [lesson.title, lesson.rule, lesson.example, ...lesson.steps].join('. ');
      return explain(input, reference, config);
    },
    (input) => {
      const lesson = lessons[input.language].find((l) => l.id === input.topic)!;
      return buildExplainPreview(input, lesson);
    }
  );
}
