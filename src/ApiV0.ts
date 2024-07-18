import { Rundown } from './Rundown'
import { RundownCue } from './Cue'

export type ApiV0Rundown = {
  id: Rundown['id']
  name: Rundown['name']
  startTime: Rundown['startTime']
  endTime: Rundown['endTime']
  status: Rundown['status']
  createdAt: Rundown['createdAt']
  updatedAt: Rundown['updatedAt']
}

export type ApiV0Cue = {
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
