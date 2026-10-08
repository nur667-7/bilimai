import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { buildLabDiagnosePreview, diagnoseLabError, labDiagnoseInputSchema } from '../../../lib/claude';
import { makeChallenge } from '../../../lib/error-lab';
import { lessons } from '../../../lib/lessons';
import { pilotAPI } from '../../../lib/pilot-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return pilotAPI(
    request,
    env,
    getChatGPTUser,
    labDiagnoseInputSchema,
    (input, config) => {
      const lesson = lessons[input.language].find((l) => l.id === input.topic)!;
      const reference = `${lesson.title}: ${lesson.rule} (${lesson.example})`;
      return diagnoseLabError(input, reference, config);
    },
    (input) => {
      const sample = makeChallenge(input.topic, input.wrongStep, input.language);
      return buildLabDiagnosePreview(input, sample.explanation, sample.repair, sample.hints[0]);
    }
  );
}
