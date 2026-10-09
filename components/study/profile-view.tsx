"use client";

import { GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/lessons";
import { kzUniversities, type UserProfile } from "@/lib/user-profile";
import type { StudyCopyLang } from "@/lib/study-copy";

export interface ProfileViewProps {
  lang: Language;
  returnToPath: string;
  userProfile: UserProfile | null;
  masteredTopicsCount: number;
  labRecordsCount: number;
  examAttemptsCount: number;
  t: StudyCopyLang;
  onSelectLanguage: (lang: Language) => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function ProfileView({
  lang,
  returnToPath,
  userProfile,
  masteredTopicsCount,
  labRecordsCount,
  examAttemptsCount,
  t,
  onSelectLanguage,
  onToggleTheme,
  onLogout
}: ProfileViewProps) {
  return (
    <section className="surface section-surface space-y-6" aria-label={t.navProfile}>
      <header className="lesson-head">
        <span className="rule-label">{t.navProfile}</span>
        <h1 className="lesson-title">{t.profTitle}</h1>
        <p className="lesson-intro">{t.profSub}</p>
      </header>

      {/* Card 1: Account & Local Storage Status */}
      <div className="plan-summary-card">
        {userProfile && userProfile.name ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="small text-muted-foreground block">{t.profSignedAs}</span>
                <strong className="text-lg">{userProfile.name}</strong>
                <span className="small block text-muted-foreground">
                  {userProfile.identifier} · {userProfile.grade} · {t.rmTarget}:{" "}
                  {userProfile.targetScore}/50
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  className="btn-ghost-sm"
                  href={`/login?lang=${lang}&returnTo=${encodeURIComponent(returnToPath)}`}
                >
                  {t.profEditBtn}
                </a>
                <Button size="sm" variant="outline" onClick={onLogout}>
                  <LogOut size={14} />
                  <span>{t.logoutBtn}</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="steps-heading m-0">{t.profGuestTitle}</h2>
            <p className="small m-0">{t.profGuestDesc}</p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                className="aniq-primary-link-btn"
                href={`/login?lang=${lang}&returnTo=${encodeURIComponent(returnToPath)}`}
              >
                <User size={15} />
                <span>{t.profLoginBtn}</span>
              </a>
              <a
                className="btn-ghost-sm"
                href={`/register?lang=${lang}&returnTo=${encodeURIComponent(returnToPath)}`}
              >
                <span>{t.profRegisterBtn}</span>
              </a>
            </div>
          </div>
        )}

        <div className="profile-stats-grid mt-5 pt-4 border-t border-border/60">
          <div className="profile-stat-box">
            <span className="small text-muted-foreground">{t.profStatMastered}</span>
            <strong>{masteredTopicsCount} / 16</strong>
          </div>
          <div className="profile-stat-box">
            <span className="small text-muted-foreground">{t.profStatLab}</span>
            <strong>{labRecordsCount}</strong>
          </div>
          <div className="profile-stat-box">
            <span className="small text-muted-foreground">{t.profStatExams}</span>
            <strong>{examAttemptsCount}</strong>
          </div>
        </div>
      </div>

      {/* Card 2: Language & Theme Preferences */}
      <div className="plan-summary-card">
        <h2 className="steps-heading m-0 mb-3">{t.profPrefsTitle}</h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="small font-medium block mb-1.5">{t.profLangLabel}</span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ru", "Русский (РУС)"],
                  ["kk", "Қазақша (ҚАЗ)"],
                  ["uz", "Oʻzbekcha (OʻZB)"]
                ] as [Language, string][]
              ).map(([code, labelText]) => (
                <Button
                  key={code}
                  size="sm"
                  variant={lang === code ? "default" : "outline"}
                  onClick={() => onSelectLanguage(code)}
                >
                  {labelText}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <span className="small font-medium block mb-1.5">{t.profThemeLabel}</span>
            <Button size="sm" variant="outline" onClick={onToggleTheme}>
              {t.profThemeToggle}
            </Button>
          </div>
        </div>
      </div>

      {/* Card 3: Reference Table of KZ Universities */}
      <div className="plan-summary-card">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={17} />
          <h2 className="steps-heading m-0">{t.profUniTitle}</h2>
        </div>
        <p className="small mb-3">{t.profUniSub}</p>

        <div className="profile-uni-grid">
          {kzUniversities.map((uni) => (
            <div key={uni.id} className="profile-uni-card">
              <div className="flex items-center justify-between gap-2">
                <strong>{uni.shortName}</strong>
                <span className="small text-muted-foreground">{uni.gopCode}</span>
              </div>
              <div className="small mt-0.5">{uni.name[lang]}</div>
              <div className="small text-muted-foreground mt-2 pt-2 border-t border-border/50 flex justify-between gap-2">
                <span>{t.profUniTargetCol}:</span>
                <strong>
                  {uni.minMathScore}–{uni.safeMathScore} / 50
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
