export interface ILogsActions {
  label: string
  value: string
}

export interface ILogsAdmins {
  id: string | number
  name: string
}

interface ILogsDesc {
  publication_id: number
  text: string
  user_id: number
}

export interface ILogsData {
  action: string
  action_text: string
  datetime: string
  description_text: string
  id: number
  ip: string
  admin: ILogsAdmins
  description?: ILogsDesc
}
