import type { Dispatch, SetStateAction } from 'react'
import type { ScenarioInputs } from '@/calculator/types'

export type PatchInput = <K extends keyof ScenarioInputs>(
  key: K,
  value: ScenarioInputs[K],
) => void

export type SetInputs = Dispatch<SetStateAction<ScenarioInputs>>
