import type { Rundown } from './Rundown'
import type { RundownCue } from './Cue'
import type { Mention } from './Mention'

export interface ApiV0Rundown {
  id: Rundown['id']
  name: Rundown['name']
  startTime: Rundown['startTime']
  endTime: Rundown['endTime']
  status: Rundown['status']
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
  locked: RundownCue['locked']
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
