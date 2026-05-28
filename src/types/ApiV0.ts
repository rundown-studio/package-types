import type { Rundown, TextVariables } from './Rundown'
import type { RundownCue } from './Cue'
import type { Mention } from './Mention'

export interface ApiV0Rundown {
  id: Rundown['id']
  name: Rundown['name']
  startTime: Rundown['startTime']
  endTime: Rundown['endTime']
  status: Rundown['status']
  textVariables: TextVariables
  createdAt: Rundown['createdAt']
  updatedAt: Rundown['updatedAt']
}

export interface ApiV0Cue {
  id: RundownCue['id']
  type: RundownCue['type']
  title: RundownCue['title']
  subtitle: RundownCue['subtitle']
  duration: RundownCue['duration']
  backgroundColor: RundownCue['backgroundColor']
  /**
   * Legacy v0 wire field. Replaced by `settings.preventEdits` on the canonical
   * Cue type (RSH-260). Kept here as `boolean` because v0 sockets still
   * serialize it via `APIV0_CUE_KEYS` and external v0 consumers may read it.
   */
  locked: boolean
  createdAt: RundownCue['createdAt']
  updatedAt: RundownCue['updatedAt']
}

/**
 * External API representation of a Mention
 * Uses 'key' instead of 'id' and excludes timestamps
 */
export interface ApiV0Mention {
  key: Mention['key']
  name: Mention['name']
  color: Mention['color']
  description: Mention['description']
}

/**
 * External API representation of a Text Variable
 * Simple key-value pair without timestamps
 */
export interface ApiV0TextVariable {
  key: string
  value: string
}
