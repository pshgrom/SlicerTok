export interface BreadcrumbItem {
  text: string
  href?: string
  disabled?: boolean
  icon?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  divider?: string
}
