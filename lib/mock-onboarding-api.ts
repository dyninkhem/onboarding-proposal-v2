import { STEPS, type OnboardingProgress } from "./onboarding-steps"

const STORAGE_KEY = "onboarding-progress"

function delay(): Promise<void> {
  const ms = Math.floor(Math.random() * 300) + 200
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getDefaultProgress(): OnboardingProgress {
  const progress: OnboardingProgress = {}
  for (const step of STEPS) {
    progress[step.id] = false
  }
  return progress
}

function readProgress(): OnboardingProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress()
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return getDefaultProgress()
  }
  try {
    return JSON.parse(raw) as OnboardingProgress
  } catch {
    return getDefaultProgress()
  }
}

export async function fetchOnboardingProgress(): Promise<OnboardingProgress> {
  await delay()
  return readProgress()
}

export async function updateStepStatus(
  stepId: string,
  completed: boolean
): Promise<OnboardingProgress> {
  await delay()
  const progress = readProgress()
  progress[stepId] = completed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  return progress
}
