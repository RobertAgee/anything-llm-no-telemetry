import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import showToast from "@/utils/toast";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import {
  EMBEDDING_ENGINE_PRIVACY,
  LLM_SELECTION_PRIVACY,
  VECTOR_DB_PRIVACY,
  FALLBACKS,
} from "@/pages/OnboardingFlow/Steps/DataHandling";
import { useTranslation } from "react-i18next";

export default function PrivacyAndDataHandling() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const settings = await System.keys();
      setSettings(settings);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] light:border light:border-theme-sidebar-border bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                {t("privacy.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              {t("privacy.description")}
            </p>
          </div>
          {loading ? (
            <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
              <div className="w-full h-full flex justify-center items-center">
                <PreLoader />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ThirdParty settings={settings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThirdParty({ settings }) {
  const llmChoice = settings?.LLMProvider || "openai";
  const embeddingEngine = settings?.EmbeddingEngine || "openai";
  const vectorDb = settings?.VectorDB || "lancedb";
  const { t } = useTranslation();

  const LLMSelection =
    LLM_SELECTION_PRIVACY?.[llmChoice] || FALLBACKS.LLM(llmChoice);
  const EmbeddingEngine =
    EMBEDDING_ENGINE_PRIVACY?.[embeddingEngine] ||
    FALLBACKS.EMBEDDING(embeddingEngine);
  const VectorDb = VECTOR_DB_PRIVACY?.[vectorDb] || FALLBACKS.VECTOR(vectorDb);

  return (
    <div className="py-8 w-full flex items-start justify-center flex-col gap-y-6 border-b-2 border-theme-sidebar-border">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            {t("privacy.llm")}
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLMSelection.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {LLMSelection.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {LLMSelection.description.map((desc) => (
              <li className="text-theme-text-secondary text-sm">{desc}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            {t("privacy.embedding")}
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={EmbeddingEngine.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {EmbeddingEngine.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {EmbeddingEngine.description.map((desc) => (
              <li className="text-theme-text-secondary text-sm">{desc}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4">
          <div className="text-theme-text-primary text-base font-bold">
            {t("privacy.vector")}
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={VectorDb.logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-theme-text-primary text-sm font-bold">
              {VectorDb.name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {VectorDb.description.map((desc) => (
              <li className="text-theme-text-secondary text-sm">{desc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};