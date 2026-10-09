import type { Metadata } from "next";
import Study from "@/app/study";

export const metadata: Metadata = {
  title: "Aniq AI — Единая ИИ-экосистема ЕНТ (ҰБТ) · 12 предметов × 10 вариантов",
  description:
    "Все 12 предметов ЕНТ (НЦТ РК): 10 полных вариантов по 40 вопросов (50 баллов) на каждый предмет, построчный Рентген черновика, 1 152 задачи на поиск ошибок, граф знаний и 6 научных методик обучения."
};

export default function WelcomePage() {
  return <Study initialWelcomeOpen={true} />;
}
